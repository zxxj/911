import { ApiPropertyOptional } from '@nestjs/swagger';
import { PostStatus } from '../../generated/prisma/enums.js';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ListArticleDto {
  @ApiPropertyOptional({
    enum: PostStatus,
    example: PostStatus.DRAFT,
    description: '文章状态',
  })
  @IsOptional()
  @IsEnum(PostStatus)
  status?: PostStatus;

  @ApiPropertyOptional({
    description: '页码',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pageNumber?: number;

  @ApiPropertyOptional({
    default: 10,
    minimum: 1,
    maximum: 100,
    description: '每页数量',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number;
}
