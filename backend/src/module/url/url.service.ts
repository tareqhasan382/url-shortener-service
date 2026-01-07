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

  async findAll(userId: string) {
    return this.prisma.url.findMany({where: { userId }});
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
