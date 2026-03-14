import { Injectable, Logger, Inject } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import type { Redis } from 'ioredis';
import { PrismaService } from '../../prisma/prisma.service';
import { REDIS_CLIENT } from '../../redis/redis.module';

export const CLICK_KEY_PREFIX = 'click:pending:';
const INDEX_KEY = 'click:pending:index';
const ONE_HOUR_SEC = 3600;

@Injectable()
export class UrlClickFlushService {
  private readonly logger = new Logger(UrlClickFlushService.name);

  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cache: Cache,
    @Inject(REDIS_CLIENT) private redis: Redis,
  ) {}

  // Truly fire-and-forget — pipeline, no await
  bufferClick(shortCode: string): void {
    const key = `${CLICK_KEY_PREFIX}${shortCode}`;

    this.redis
      .pipeline()
      .incr(key)
      .expire(key, ONE_HOUR_SEC)
      .sadd(INDEX_KEY, shortCode)
      .expire(INDEX_KEY, ONE_HOUR_SEC)
      .exec()
      .catch((err) => this.logger.error(`bufferClick failed: ${err.message}`));
  }

  async getPendingClicksForUser(shortCodes: string[]): Promise<{
    total: number;
    byShortCode: Record<string, number>;
  }> {
    if (shortCodes.length === 0) return { total: 0, byShortCode: {} };

    const byShortCode: Record<string, number> = {};
    let total = 0;

    const pipeline = this.redis.pipeline();
    shortCodes.forEach((shortCode) => {
      pipeline.get(`${CLICK_KEY_PREFIX}${shortCode}`);
    });
    const results = await pipeline.exec();

    results?.forEach(([err, val], i) => {
      if (!err && val) {
        const count = parseInt(val as string, 10);
        if (count > 0) {
          byShortCode[shortCodes[i]] = count;
          total += count;
        }
      }
    });

    return { total, byShortCode };
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async flushClickCounts(): Promise<void> {
    const members = await this.redis.smembers(INDEX_KEY);
    if (members.length === 0) return;

    this.logger.log(`Flushing ${members.length} URLs to Postgres...`);

    await this.redis.del(INDEX_KEY);

    const pipeline = this.redis.pipeline();
    members.forEach((shortCode) => {
      pipeline.getdel(`${CLICK_KEY_PREFIX}${shortCode}`);
    });
    const results = await pipeline.exec();

    const updates: { shortCode: string; count: number }[] = [];
    results?.forEach(([err, val], i) => {
      if (!err && val) {
        const count = parseInt(val as string, 10);
        if (count > 0) updates.push({ shortCode: members[i], count });
      }
    });

    if (updates.length === 0) return;

    await this.prisma.$transaction(
      updates.map(({ shortCode, count }) =>
        this.prisma.url.update({
          where: { shortCode },
          data: { clickCount: { increment: count } },
        }),
      ),
    );

    this.logger.log(
      `Flushed: ${updates.map((u) => `${u.shortCode}(+${u.count})`).join(', ')}`,
    );
  }
}