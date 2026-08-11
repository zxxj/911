import { PickType } from '@nestjs/swagger';
import { ListArticleDto } from './list.dto.js';

export class PublicListArticleDto extends PickType(ListArticleDto, [
  'pageNumber',
  'pageSize',
] as const) {}
