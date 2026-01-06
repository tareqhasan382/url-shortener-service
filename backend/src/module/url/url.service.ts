import { Injectable ,BadRequestException} from '@nestjs/common';
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

  findOne(id: number) {
    return `This action returns a #${id} url`;
  }

  update(id: number, updateUrlDto: UpdateUrlDto) {
    return `This action updates a #${id} url`;
  }

  remove(id: number) {
    return `This action removes a #${id} url`;
  }
}
