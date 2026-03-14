import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Inject,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { customAlphabet } from 'nanoid';
import { UrlClickFlushService } from './url-click-flush.service';

const TTL = {
  REDIRECT:  10 * 60 * 1000, // 10 min
  MY_URLS:   60 * 1000,       // 1 min
  ANALYTICS: 2 * 60 * 1000,  // 2 min
};

const CK = {
  redirect:  (shortCode: string) => `redirect:${shortCode}`,
  myUrls:    (userId: string)    => `my-urls:${userId}`,
  analytics: (userId: string)    => `analytics:${userId}`,
};

@Injectable()
export class UrlService {
  private readonly nanoid = customAlphabet(
    '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz',
    6,
  );

  constructor(
    private prisma: PrismaService,
    private clickFlush: UrlClickFlushService,
    @Inject(CACHE_MANAGER) private cache: Cache,
  ) {}

  // ─── CREATE ──────────────────────────────────────────────────────────────

  async create(userId: string, dto: CreateUrlDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { urlLimit: true },
    });

    if (!user) throw new BadRequestException('User not found');

    const count = await this.prisma.url.count({ where: { userId } });
    if (count >= user.urlLimit) throw new BadRequestException('URL limit reached');

    let shortCode: string;
    while (true) {
      shortCode = this.nanoid();
      const exists = await this.prisma.url.findUnique({ where: { shortCode } });
      if (!exists) break;
    }

    const newUrl = await this.prisma.url.create({
      data: {
        originalUrl: dto.originalUrl,
        shortCode,
        shortUrl: `${process.env.SHORT_URL_BASE}/${shortCode}`,
        title: dto.title,
        description: dto.description,
        userId,
      },
    });

    await this.cache.set(CK.redirect(shortCode), newUrl.originalUrl, TTL.REDIRECT);
    await this.invalidateUserCache(userId);

    return newUrl;
  }

  // ─── FIND ALL ────────────────────────────────────────────────────────────

  async findAll(userId: string, page = 1, limit = 10, search?: string) {
    if (search) return this.fetchUrlsFromDb(userId, page, limit, search);

    const cacheKey = `${CK.myUrls(userId)}:p${page}:l${limit}`;

    // Cache hit or DB — raw data (without pending )
    let rawResult = await this.cache.get<any>(cacheKey);

    if (!rawResult) {
      // Cache miss → DB
      rawResult = await this.fetchUrlsFromDb(userId, page, limit);
      await this.cache.set(cacheKey, rawResult, TTL.MY_URLS);
    }

    // (cache hit/miss both)
    const pending = await this.clickFlush.getPendingClicksForUser(
      rawResult.data.map((u: any) => u.shortCode),
    );

    return {
      ...rawResult,
      data: rawResult.data.map((u: any) => ({
        ...u,
        clickCount: u.clickCount + (pending.byShortCode[u.shortCode] ?? 0),
      })),
    };
  }

  private async fetchUrlsFromDb(
    userId: string,
    page: number,
    limit: number,
    search?: string,
  ) {
    const skip = (page - 1) * limit;
    const where: any = { userId };

    if (search) {
      where.OR = [
        { originalUrl: { contains: search, mode: 'insensitive' } },
        { shortCode:   { contains: search, mode: 'insensitive' } },
      ];
    }

    const [urls, total] = await this.prisma.$transaction([
      this.prisma.url.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.url.count({ where }),
    ]);

    return { data: urls, page, limit, total, totalPages: Math.ceil(total / limit) };
  }

  // ─── ANALYTICS ───────────────────────────────────────────────────────────

  async analyticsOverview(userId: string) {
    // Analytics cache
    return this.computeAnalytics(userId);
  }

  private async computeAnalytics(userId: string) {
    const now = new Date();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfThisWeek = new Date();
    startOfThisWeek.setDate(now.getDate() - 7);

    const startOfLastWeek = new Date();
    startOfLastWeek.setDate(now.getDate() - 14);

    const [
      totalUrls,
      user,
      totalClicksAgg,
      todayClicksAgg,
      thisWeekClicksAgg,
      lastWeekClicksAgg,
      topUrl,
      userUrls,
    ] = await this.prisma.$transaction([
      this.prisma.url.count({ where: { userId } }),
      this.prisma.user.findUnique({
        where: { id: userId },
        select: { urlLimit: true },
      }),
      this.prisma.url.aggregate({
        where: { userId },
        _sum: { clickCount: true },
      }),
      this.prisma.url.aggregate({
        where: { userId, updatedAt: { gte: startOfToday } },
        _sum: { clickCount: true },
      }),
      this.prisma.url.aggregate({
        where: { userId, updatedAt: { gte: startOfThisWeek } },
        _sum: { clickCount: true },
      }),
      this.prisma.url.aggregate({
        where: { userId, updatedAt: { gte: startOfLastWeek, lt: startOfThisWeek } },
        _sum: { clickCount: true },
      }),
      this.prisma.url.findFirst({
        where: { userId, updatedAt: { gte: startOfThisWeek } },
        orderBy: { clickCount: 'desc' },
        select: { shortUrl: true, shortCode: true, clickCount: true },
      }),
      this.prisma.url.findMany({
        where: { userId },
        select: { shortCode: true },
      }),
    ]);

    // Postgres count + Redis buffer = real-time count
    const pending = await this.clickFlush.getPendingClicksForUser(
      userUrls.map((u) => u.shortCode),
    );

    const totalClicks    = (totalClicksAgg._sum.clickCount    || 0) + pending.total;
    const todayClicks    = (todayClicksAgg._sum.clickCount    || 0) + pending.total;
    const thisWeekClicks = (thisWeekClicksAgg._sum.clickCount || 0) + pending.total;
    const lastWeekClicks =  lastWeekClicksAgg._sum.clickCount || 0;

    const weeklyGrowth =
      lastWeekClicks === 0
        ? 100
        : Math.round(((thisWeekClicks - lastWeekClicks) / lastWeekClicks) * 100);

    return {
      totalUrls,
      urlLimit:      user?.urlLimit || 0,
      remainingUrls: (user?.urlLimit || 0) - totalUrls,
      totalClicks,
      weeklyGrowth,
      todayClicks,
      topPerformer: topUrl
        ? {
            shortUrl: topUrl.shortUrl,
            clicksThisWeek:
              topUrl.clickCount + (pending.byShortCode[topUrl.shortCode] ?? 0),
          }
        : null,
    };
  }

  // ─── UPDATE ──────────────────────────────────────────────────────────────

  async update(id: string, userId: string, dto: UpdateUrlDto) {
    const url = await this.prisma.url.findUnique({ where: { id } });
    if (!url) throw new NotFoundException();
    if (url.userId !== userId) throw new ForbiddenException();

    const updated = await this.prisma.url.update({ where: { id }, data: dto });

    await this.cache.set(CK.redirect(url.shortCode), updated.originalUrl, TTL.REDIRECT);
    await this.invalidateUserCache(userId);

    return updated;
  }

  // ─── DELETE ──────────────────────────────────────────────────────────────

  async remove(id: string, userId: string) {
    const url = await this.prisma.url.findUnique({ where: { id } });
    if (!url) throw new NotFoundException();
    if (url.userId !== userId) throw new ForbiddenException();

    await this.prisma.url.delete({ where: { id } });
    await this.cache.del(CK.redirect(url.shortCode));
    await this.invalidateUserCache(userId);

    return { message: 'Deleted' };
  }

  // ─── REDIRECT ─────────────────────────────────────────────────────────────

  async redirect(shortCode: string) {
    const cacheKey = CK.redirect(shortCode);

    const cached = await this.cache.get<string>(cacheKey);
    if (cached) {
       console.log('✅ cache hit:', shortCode);
      this.clickFlush.bufferClick(shortCode); // fire-and-forget
      return cached;
    }
    console.log('❌ cache miss:', shortCode);
    const url = await this.prisma.url.findUnique({ where: { shortCode } });
    if (!url) throw new NotFoundException('Short URL not found');

    await this.cache.set(cacheKey, url.originalUrl, TTL.REDIRECT);
    this.clickFlush.bufferClick(shortCode); // fire-and-forget

    return url.originalUrl;
  }

  // ─── HELPERS ─────────────────────────────────────────────────────────────

  private async invalidateUserCache(userId: string): Promise<void> {
    const deletions: Promise<any>[] = [this.cache.del(CK.analytics(userId))];

    for (let p = 1; p <= 20; p++) {
      deletions.push(
        this.cache.del(`${CK.myUrls(userId)}:p${p}:l10`),
        this.cache.del(`${CK.myUrls(userId)}:p${p}:l20`),
      );
    }

    await Promise.all(deletions);
  }
}
