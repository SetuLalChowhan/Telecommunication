import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  excerpt?: string;

  @IsNotEmpty()
  content: any;

  @IsString()
  @IsNotEmpty()
  featuredImage: string;

  @IsOptional()
  @IsString()
  imageCaption?: string;

  @IsOptional()
  @IsString()
  category?: string = 'General Health';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[] = [];

  @IsOptional()
  @IsString()
  readTime?: string = '5 min read';

  @IsOptional()
  @IsBoolean()
  published?: boolean = false;

  @IsOptional()
  @IsBoolean()
  featured?: boolean = false;

  @IsString()
  @IsNotEmpty()
  authorName: string;

  @IsString()
  @IsNotEmpty()
  authorRole: string;

  @IsString()
  @IsNotEmpty()
  authorAvatar: string;

  @IsOptional()
  @IsString()
  authorBio?: string;

  @IsOptional()
  @IsString()
  reviewerName?: string;

  @IsOptional()
  @IsString()
  reviewerTitle?: string;

  @IsOptional()
  @IsString()
  reviewerAvatar?: string;

  @IsOptional()
  @IsString()
  reviewerDate?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keyTakeaways?: string[] = [];

  @IsOptional()
  faqs?: any;
}
