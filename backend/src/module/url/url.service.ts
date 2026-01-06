import { Injectable ,BadRequestException,NotFoundException,ForbiddenException} from '@nestjs/common';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { customAlphabet } from 'nanoid';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class UrlService {
  private readonly nanoid = customAlphabet(
    '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
    6,
  );

  constructor(private prisma: PrismaService) {}

  async create(userId: string, createUrlDto: CreateUrlDto) {
    // Check user & URL limit
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { urlLimit: true },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const urlCount = await this.prisma.url.count({
      where: { userId },
    });

    if (urlCount >= user.urlLimit) {
      throw new BadRequestException(
        `You have reached your URL limit of ${user.urlLimit}. Please upgrade your plan or delete some URLs.`,
      );
    }

    // Generate unique short code (TS-safe)
    let shortCode: string | null = null;
    const maxAttempts = 10;
    let attempts = 0;

    while (!shortCode && attempts < maxAttempts) {
      const candidate = this.nanoid();

      const exists = await this.prisma.url.findUnique({
        where: { shortCode: candidate },
        select: { id: true },
      });

      if (!exists) {
        shortCode = candidate;
      }

      attempts++;
    }

    if (!shortCode) {
      throw new BadRequestException(
        'Failed to generate a unique short code. Please try again.',
      );
    }

    // Build short URL
    const baseUrl =
      process.env.SHORT_URL_BASE?.replace(/\/$/, '') ||
      'http://localhost:3000';

    const shortUrl = `${baseUrl}/${shortCode}`;

    // Create URL record
    return this.prisma.url.create({
      data: {
        originalUrl: createUrlDto.originalUrl,
        shortCode,
        shortUrl,
        title: createUrlDto.title,
        description: createUrlDto.description,
        userId,
      },
    });
  }

  async findAll(userId: string) {
    return this.prisma.url.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        originalUrl: true,
        shortCode: true,
        shortUrl: true,
        title: true,
        description: true,
        clickCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async findOne(id: string, userId: string) {
    const url = await this.prisma.url.findUnique({
      where: { id },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    if (url.userId !== userId) {
      throw new ForbiddenException('You do not have access to this URL');
    }

    return url;
  }

  async update(id: string, userId: string, updateUrlDto: UpdateUrlDto) {
    // Check if URL exists
    const url = await this.prisma.url.findUnique({
      where: { id },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    const updatedUrl = await this.prisma.url.update({
      where: { id },
      data: {
        title: updateUrlDto.title,
        description: updateUrlDto.description,
      },
    });

    return updatedUrl;
  }

  async remove(id: string, userId: string) {
    // Check if URL exists
    const url = await this.prisma.url.findUnique({
      where: { id },
    });

    if (!url) {
      throw new NotFoundException('URL not found');
    }

    await this.prisma.url.delete({
      where: { id,userId },
    });

    return { message: 'URL deleted successfully' };
  }

  // For redirect functionality
  async redirect(shortCode: string) {
    const url = await this.prisma.url.findUnique({
      where: { shortCode },
    });

    if (!url) {
      throw new NotFoundException('Short URL not found');
    }

    // Increment click count
    await this.prisma.url.update({
      where: { shortCode },
      data: {
        clickCount: { increment: 1 },
      },
    });

    return url.originalUrl;
  }

  // Get user statistics
  async getUserStats(userId: string) {
    const [totalUrls, totalClicks, user] = await Promise.all([
      this.prisma.url.count({ where: { userId } }),
      this.prisma.url.aggregate({
        where: { userId },
        _sum: { clickCount: true },
      }),
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { urlLimit: true },
      }),
    ]);
if (!user){
  throw new NotFoundException('User not found');
}
    return {
      totalUrls,
      totalClicks: totalClicks._sum.clickCount || 0,
      urlLimit: user.urlLimit,
      remaining: user.urlLimit - totalUrls,
    };
  }
}
