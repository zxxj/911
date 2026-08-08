import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService
  extends Redis
  implements OnModuleInit, OnModuleDestroy
{
  constructor(configService: ConfigService) {
    super(configService.getOrThrow<string>('REDIS_URL'), {
      lazyConnect: true,
    });
  }

  async onModuleInit() {
    await this.connect();
    await this.ping();
  }

  async onModuleDestroy() {
    await this.quit();
  }
}
