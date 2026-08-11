import { Controller, Get, Param, Query } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ArticleService } from './article.service.js';
import { PublicListArticleDto } from './dto/public.dto.js';

@ApiTags('articles')
@Controller('articles')
export class PublicArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get()
  @ApiOperation({ summary: '获取已发布文章列表' })
  @ApiOkResponse({ description: '获取成功!' })
  list(@Query() dto: PublicListArticleDto) {
    return this.articleService.publicListArticles(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: '获取已发布文章详情' })
  @ApiOkResponse({ description: '获取成功!' })
  @ApiNotFoundResponse({ description: '文章不存在!' })
  detail(@Param('id') id: string) {
    return this.articleService.publicArticleDetail(id);
  }
}
