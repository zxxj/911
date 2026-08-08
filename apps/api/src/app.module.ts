import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { resolve } from 'node:path';
import { PrismaModule } from './prisma/prisma.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { RedisModule } from './redis/redis.module.js';
import { AuthModule } from './auth/auth.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: resolve(process.cwd(), '../../.env'),
    }),
    PrismaModule,
    RedisModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
