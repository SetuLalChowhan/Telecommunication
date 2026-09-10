import { IsDateString, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  doctorId: string;

  @IsNotEmpty()
  @IsDateString({}, { message: 'slotStart must be a valid ISO-8601 date string' })
  slotStart: string;

  @IsNotEmpty()
  @IsDateString({}, { message: 'slotEnd must be a valid ISO-8601 date string' })
  slotEnd: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Notes must be under 500 characters' })
  notes?: string;
}
