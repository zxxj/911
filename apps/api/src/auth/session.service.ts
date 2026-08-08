import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomBytes } from 'node:crypto';
import type { Role } from '../generated/prisma/enums.js';
import { RedisService } from '../redis/redis.service.js';

export type SessionData = {
  userId: string;
  role: Role;
};

@Injectable()
export class SessionService {
  readonly cookieName: string;
  readonly ttlSeconds: number;

  constructor(
    configService: ConfigService,
    private readonly redisService: RedisService,
  ) {
    this.cookieName = configService.getOrThrow<string>('SESSION_COOKIE_NAME');
    this.ttlSeconds = Number(
      configService.getOrThrow<string>('SESSION_TTL_SECONDS'),
    );

    if (!this.ttlSeconds || this.ttlSeconds <= 0) {
      throw new Error('SESSION_TTL_SECONDS必须是一个整数!');
    }
  }

  // 生成key
  private key(sessionId: string): string {
    return `session:${sessionId}`;
  }

  // 从redis中删除key
  async destroy(sessionId: string): Promise<void> {
    await this.redisService.del(this.key(sessionId));
  }

  async create(userId: string, role: Role): Promise<string> {
    const sessionId = randomBytes(32).toString('base64url');

    await this.redisService.set(
      this.key(sessionId),
      JSON.stringify({ userId, role }),
      'EX',
      this.ttlSeconds,
    );

    return sessionId;
  }

  async get(sessionId: string): Promise<SessionData | null> {
    const value = await this.redisService.get(this.key(sessionId));
    if (!value) return null;

    try {
      return JSON.parse(value) as SessionData;
    } catch (error) {
      console.log(error);
      await this.destroy(sessionId);
      return null;
    }
  }
}
