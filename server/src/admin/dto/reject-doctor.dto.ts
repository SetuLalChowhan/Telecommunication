import { IsOptional, IsString, MaxLength } from 'class-validator';

export class RejectDoctorDto {
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Rejection reason must be under 500 characters' })
  reason?: string;
}
