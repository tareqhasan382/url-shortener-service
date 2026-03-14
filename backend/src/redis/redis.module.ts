import { CacheModule } from '@nestjs/cache-manager';
import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { redisStore } from 'cache-manager-redis-yet';
import { Redis } from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: await redisStore({
          socket: {
            host: config.get('REDIS_HOST'),
            port: config.get<number>('REDIS_PORT'),
          },
          ttl: 60 * 1000,
        }),
      }),
    }),
  ],
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new Redis({
          host: config.get('REDIS_HOST'),
          port: config.get<number>('REDIS_PORT'),
        }),
    },
  ],
  exports: [REDIS_CLIENT],
})
export class RedisModule {}