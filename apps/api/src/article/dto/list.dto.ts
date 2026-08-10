import { ApiPropertyOptional } from '@nestjs/swagger';
import { PostStatus } from '../../generated/prisma/enums.js';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
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
    description: '上一页最后一篇文章的id',
  })
  @IsOptional()
  @IsString()
  cursor?: string;

  @ApiPropertyOptional({
    default: 10,
    minimum: 1,
    maximum: 100,
    description: '想要查询的条数',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
