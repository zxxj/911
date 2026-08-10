import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service.js';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CreateArticleDto } from './dto/create.dto.js';
import { Request } from 'express';
import { SessionData } from '../auth/session.service.js';
import { roles } from '../decorators/roles.decorators.js';
import { Role } from '../generated/prisma/enums.js';
import { AuthGuard } from '../guards/auth.guard.js';
import { RolesGuard } from '../guards/roles.guard.js';

@UseGuards(AuthGuard, RolesGuard)
@Controller('admin/articles')
@roles(Role.ADMIN)
@ApiTags('admin/articles')
@ApiCookieAuth('session')
@ApiUnauthorizedResponse({ description: '未登录或登录状态已失效!' })
@ApiForbiddenResponse({ description: '仅管理员可访问此资源!' })
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ description: '创建文章草稿' })
  @ApiCreatedResponse({ description: '草稿创建成功!' })
  create(
    @Body() dto: CreateArticleDto,
    @Req() request: Request & { user: SessionData },
  ) {
    return this.articleService.create(request.user.userId, dto);
  }
}
