import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateSpecialtyDto {
  @IsString()
  @MinLength(2, { message: 'Specialty name must be at least 2 characters long' })
  name: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
