import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateArticleDto } from './dto/create.dto.js';
import { ListArticleDto } from './dto/list.dto.js';
import { UpdateArticleDto } from './dto/update.dto.js';
import { PostStatus, Prisma } from '../generated/prisma/client.js';
import { UpdateArticleStatusDto } from './dto/status.dto.js';
import { PublicListArticleDto } from './dto/public.dto.js';

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
    const pageNumber = dto.pageNumber ?? 1;
    const pageSize = dto.pageSize ?? 10;
    const skip = (pageNumber - 1) * pageSize;
    // 过滤草稿.
    const where =
      dto.status === PostStatus.PUBLISHED
        ? { status: PostStatus.PUBLISHED, publishedAt: { not: null } }
        : dto.status
          ? { status: dto.status }
          : undefined;

    const [items, total] = await Promise.all([
      this.prismaService.article.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ updatedAt: 'desc' }, { id: 'desc' }],
        select: {
          id: true,
          title: true,
          excerpt: true,
          coverImage: true,
          createdAt: true,
          updatedAt: true,
          publishedAt: true,
          status: true,
          author: {
            select: {
              id: true,
              username: true,
            },
          },
        },
      }),
      this.prismaService.article.count({ where }),
    ]);
    return {
      items,
      pageNumber,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async detail(id: string) {
    const article = await this.prismaService.article.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
        coverImage: true,
        status: true,
        publishedAt: true,
        authorId: true,
        author: {
          select: {
            id: true,
            username: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!article) {
      throw new NotFoundException('文章不存在!');
    }

    return article;
  }

  async update(id: string, dto: UpdateArticleDto) {
    try {
      return await this.prismaService.article.update({
        where: { id },
        data: dto,
        select: {
          id: true,
          title: true,
          excerpt: true,
          content: true,
          coverImage: true,
          status: true,
          publishedAt: true,
          author: {
            select: {
              id: true,
              username: true,
            },
          },
          createdAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('文章不存在!');
      }

      throw error;
    }
  }

  async updateStatus(id: string, dto: UpdateArticleStatusDto) {
    try {
      return await this.prismaService.article.update({
        where: { id },
        data: {
          status: dto.status,
          publishedAt: dto.status === PostStatus.PUBLISHED ? new Date() : null,
        },
        select: {
          id: true,
          status: true,
          publishedAt: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('文章不存在!');
      }

      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prismaService.article.delete({
        where: { id },
        select: { id: true },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException('文章不存在!');
      }

      throw error;
    }
  }

  publicListArticles(dto: PublicListArticleDto) {
    return this.list({ ...dto, status: PostStatus.PUBLISHED });
  }

  async publicArticleDetail(id: string) {
    const article = await this.detail(id);

    if (
      article.status !== PostStatus.PUBLISHED ||
      article.publishedAt === null
    ) {
      throw new NotFoundException('文章不存在!');
    }

    return article;
  }
}
