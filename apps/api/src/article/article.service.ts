import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateArticleDto } from './dto/create.dto.js';
import { ListArticleDto } from './dto/list.dto.js';

@Injectable()
export class ArticleService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(authorId: string, dto: CreateArticleDto) {
    return this.prismaService.article.create({
      data: {
        title: dto.title,
        excerpt: dto.excerpt,
        content: dto.content,
        authorId,
      },
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
        coverImage: true,
        status: true,
        publishedAt: true,
        authorId: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async list(dto: ListArticleDto) {
    const take = dto.limit ?? 10;

    if (dto.cursor) {
      const cursorArticle = await this.prismaService.article.findUnique({
        where: { id: dto.cursor },
        select: { id: true },
      });

      const pagination = { cursor: dto.cursor, skip: 1 };

      if (!cursorArticle) {
        throw new BadRequestException('无效的分页游标!');
      }
    }
  }
}
