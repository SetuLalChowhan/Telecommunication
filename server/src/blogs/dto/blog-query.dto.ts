import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/pagination/pagination.dto.js';

export enum BlogSortBy {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  POPULAR = 'popular',
}

export class BlogQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsEnum(BlogSortBy)
  sortBy?: BlogSortBy = BlogSortBy.NEWEST;
}
