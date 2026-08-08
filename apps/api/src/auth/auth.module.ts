import { Module } from '@nestjs/common';
import { SessionService } from './session.service.js';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { AuthGuard } from '../guards/auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';

@Module({
  controllers: [AuthController],
  providers: [SessionService, AuthService, AuthGuard, RolesGuard],
  exports: [SessionService, AuthService, AuthGuard, RolesGuard],
})
export class AuthModule {}
