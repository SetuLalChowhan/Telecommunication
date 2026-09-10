import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDayOffDto {
  @IsDateString({}, { message: 'date must be a valid ISO-8601 date string (e.g. YYYY-MM-DD)' })
  date: string;

  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'reason must be under 255 characters' })
  reason?: string;
}
