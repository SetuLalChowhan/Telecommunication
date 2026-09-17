import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateWebsiteSectionDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  subtitle?: string;

  @IsOptional()
  @IsString()
  badge?: string;

  @IsOptional()
  content?: any; // JSON array of items/cards/steps/stats

  @IsOptional()
  @IsString()
  imageUrl?: string;

  @IsOptional()
  @IsString()
  ctaText?: string;

  @IsOptional()
  @IsString()
  ctaLink?: string;

  @IsOptional()
  metadata?: any;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class CreateWebsiteSectionDto extends UpdateWebsiteSectionDto {
  @IsString()
  @IsNotEmpty()
  key: string;
}
