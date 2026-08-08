import { Module } from '@nestjs/common';
import { SessionService } from './session.service.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';

@Module({
  controllers: [AuthController],
  providers: [SessionService, AuthService],
  exports: [SessionService, AuthService],
})
export class AuthModule {}
