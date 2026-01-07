import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { customAlphabet } from 'nanoid';

@Injectable()
export class UrlService {
  private readonly nanoid = customAlphabet(
    '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
    6,
  );

  constructor(private prisma: PrismaService) {}

  async create(userId: string, dto: CreateUrlDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { urlLimit: true },
    });

    if (!user) throw new BadRequestException('User not found');

    const count = await this.prisma.url.count({ where: { userId } });
    if (count >= user.urlLimit) {
      throw new BadRequestException('URL limit reached');
    }

    let shortCode: string;
    while (true) {
      shortCode = this.nanoid();
      const exists = await this.prisma.url.findUnique({
        where: { shortCode },
      });
      if (!exists) break;
    }

    const baseUrl =
      process.env.SHORT_URL_BASE;

    return this.prisma.url.create({
      data: {
        originalUrl: dto.originalUrl,
        shortCode,
        shortUrl: `${baseUrl}/${shortCode}`,
        title: dto.title,
        description: dto.description,
        userId,
      },
    });
  }

  async findAll(userId: string, page = 1, limit = 10, search?: string) {
    const skip = (page - 1) * limit;

    const where: any = { userId };
    if (search) {
      where.OR = [
        { originalUrl: { contains: search, mode: "insensitive" } },
        { shortCode: { contains: search, mode: "insensitive" } },
      ];
    }

    const [urls, total] = await this.prisma.$transaction([
      this.prisma.url.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      this.prisma.url.count({ where }),
    ]);

    return {
      data: urls,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
  async analyticsOverview(userId: string) {
    const now = new Date();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfThisWeek = new Date();
    startOfThisWeek.setDate(now.getDate() - 7);

    const startOfLastWeek = new Date();
    startOfLastWeek.setDate(now.getDate() - 14);

    // Total URLs
    const totalUrls = await this.prisma.url.count({
      where: { userId },
    });

    // User URL limit
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { urlLimit: true },
    });

    // Total clicks
    const totalClicksAgg = await this.prisma.url.aggregate({
      where: { userId },
      _sum: { clickCount: true },
    });

    const totalClicks = totalClicksAgg._sum.clickCount || 0;

    // Today clicks
    const todayClicksAgg = await this.prisma.url.aggregate({
      where: {
        userId,
        updatedAt: { gte: startOfToday },
      },
      _sum: { clickCount: true },
    });

    const todayClicks = todayClicksAgg._sum.clickCount || 0;

    // Weekly clicks (this vs last week)
    const thisWeekClicksAgg = await this.prisma.url.aggregate({
      where: {
        userId,
        updatedAt: { gte: startOfThisWeek },
      },
      _sum: { clickCount: true },
    });

    const lastWeekClicksAgg = await this.prisma.url.aggregate({
      where: {
        userId,
        updatedAt: {
          gte: startOfLastWeek,
          lt: startOfThisWeek,
        },
      },
      _sum: { clickCount: true },
    });

    const thisWeekClicks = thisWeekClicksAgg._sum.clickCount || 0;
    const lastWeekClicks = lastWeekClicksAgg._sum.clickCount || 0;

    const weeklyGrowth =
      lastWeekClicks === 0
        ? 100
        : Math.round(
          ((thisWeekClicks - lastWeekClicks) / lastWeekClicks) * 100,
        );

    // Top performer (this week)
    const topUrl = await this.prisma.url.findFirst({
      where: {
        userId,
        updatedAt: { gte: startOfThisWeek },
      },
      orderBy: { clickCount: 'desc' },
      select: {
        shortUrl: true,
        clickCount: true,
      },
    });

    return {
      totalUrls,
      urlLimit: user?.urlLimit || 0,
      remainingUrls: (user?.urlLimit || 0) - totalUrls,

      totalClicks,
      weeklyGrowth,
      todayClicks,

      topPerformer: topUrl
        ? {
          shortUrl: topUrl.shortUrl,
          clicksThisWeek: topUrl.clickCount,
        }
        : null,
    };
  }

  async update(id: string, userId: string, dto: UpdateUrlDto) {
    const url = await this.prisma.url.findUnique({ where: { id } });
    if (!url) throw new NotFoundException();
    if (url.userId !== userId) throw new ForbiddenException();

    return this.prisma.url.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    const url = await this.prisma.url.findUnique({ where: { id } });
    if (!url) throw new NotFoundException();
    if (url.userId !== userId) throw new ForbiddenException();

    await this.prisma.url.delete({ where: { id } });
    return { message: 'Deleted' };
  }

  async redirect(shortCode: string) {
    const url = await this.prisma.url.findUnique({
      where: { shortCode },
    });

    if (!url) throw new NotFoundException('Short URL not found');

    await this.prisma.url.update({
      where: { shortCode },
      data: { clickCount: { increment: 1 } },
    });

    return url.originalUrl;
  }
}
