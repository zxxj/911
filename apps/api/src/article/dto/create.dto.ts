import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ArrayMinSize,
  IsArray,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Prisma } from '../../generated/prisma/client.js';
import { Transform } from 'class-transformer';

export class CreateArticleDto {
  @ApiProperty({
    example: '文章标题',
    maxLength: 255,
  })
  @Transform(({ value }): string =>
    typeof value === 'string' ? value.trim() : value,
  )
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  title!: string;

  @ApiPropertyOptional({
    example: '文章摘要',
    maxLength: 500,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  excerpt?: string;

  @ApiProperty({
    example: [
      {
        type: 'p',
        children: [{ text: '这是plate编辑器的正文' }],
      },
    ],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsObject({ each: true })
  content!: Prisma.InputJsonValue[];
}
