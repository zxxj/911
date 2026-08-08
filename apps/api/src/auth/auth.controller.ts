import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto.js';
import { AuthService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { SessionService } from './session.service.js';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '用户名注册' })
  @ApiCreatedResponse({ description: '注册成功!' })
  @ApiConflictResponse({ description: '用户名已被使用!' })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户名登录' })
  @ApiOkResponse({ description: '登陆成功!' })
  @ApiUnauthorizedResponse({ description: '用户名或密码错误!' })
  async login(
    @Body() dto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { sessionId, user } = await this.authService.login(dto);

    response.cookie(this.sessionService.cookieName, sessionId, {
      httpOnly: true,
      signed: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      maxAge: this.sessionService.ttlSeconds * 1000,
      path: '/',
    });
    return user;
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '退出登录' })
  @ApiNoContentResponse({ description: '退出登录成功!' })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const sessionId = request.signedCookies[this.sessionService.cookieName] as
      string | null;

    if (typeof sessionId === 'string')
      await this.sessionService.destroy(sessionId);

    response.clearCookie(this.sessionService.cookieName, {
      httpOnly: true,
      signed: true,
      secure: this.configService.get<string>('NODE_ENV') === 'production',
      sameSite: 'lax',
      path: '/',
    });
  }
}
