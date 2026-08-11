import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ArticleService } from './article.service.js';
import {
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
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
import { ListArticleDto } from './dto/list.dto.js';
import { UpdateArticleDto } from './dto/update.dto.js';
import { UpdateArticleStatusDto } from './dto/status.dto.js';

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
  @ApiOperation({ summary: '创建文章草稿' })
  @ApiCreatedResponse({ description: '草稿创建成功!' })
  create(
    @Body() dto: CreateArticleDto,
    @Req() request: Request & { user: SessionData },
  ) {
    return this.articleService.create(request.user.userId, dto);
  }

  @Get()
  @ApiOperation({ summary: '获取后台文章列表' })
  @ApiOkResponse({ description: '获取成功!' })
  list(@Query() dto: ListArticleDto) {
    return this.articleService.list(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取文章详情' })
  @ApiOkResponse({ description: '获取文章详情成功!' })
  @ApiNotFoundResponse({ description: '文章不存在!' })
  detail(@Param('id') id: string) {
    return this.articleService.detail(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: '编辑文章' })
  @ApiOkResponse({ description: '文章更新成功!' })
  @ApiNotFoundResponse({ description: '文章不存在!' })
  update(@Param('id') id: string, @Body() dto: UpdateArticleDto) {
    return this.articleService.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: '发布或撤回文章' })
  @ApiOkResponse({ description: '文章状态更新成功!' })
  @ApiNotFoundResponse({ description: '文章不存在!' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateArticleStatusDto) {
    return this.articleService.updateStatus(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: '删除文章' })
  @ApiNoContentResponse({ description: '文章删除成功!' })
  @ApiNotFoundResponse({ description: '文章不存在!' })
  async delete(@Param('id') id: string) {
    await this.articleService.remove(id);
  }
}
