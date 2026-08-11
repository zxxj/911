import { Module } from '@nestjs/common';
import { ArticleService } from './article.service.js';
import { AuthModule } from '../auth/auth.module.js';
import { ArticleController } from './article.controller.js';
import { PublicArticleController } from './public-article.controller.js';

@Module({
  imports: [AuthModule],
  controllers: [ArticleController, PublicArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
