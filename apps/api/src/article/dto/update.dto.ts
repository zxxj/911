import { PartialType } from '@nestjs/swagger';
import { CreateArticleDto } from './create.dto.js';

export class UpdateArticleDto extends PartialType(CreateArticleDto) {}
