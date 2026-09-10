import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UploadReportDto {
  @IsOptional()
  @IsString()
  bookingId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(150, { message: 'fileName must be under 150 characters' })
  fileName?: string;
}
