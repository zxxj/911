import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PostStatus } from '../../generated/prisma/enums.js';

export class UpdateArticleStatusDto {
  @ApiProperty({
    enum: PostStatus,
    example: PostStatus.PUBLISHED,
  })
  @IsEnum(PostStatus)
  status!: PostStatus;
}
