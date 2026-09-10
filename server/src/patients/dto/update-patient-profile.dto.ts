import { IsEnum, IsOptional, IsPhoneNumber, IsString, MaxLength } from 'class-validator';
import { BloodGroup, Gender } from '@prisma/client';

export class UpdatePatientProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  address?: string;

  @IsOptional()
  @IsEnum(Gender, { message: 'Gender must be MALE, FEMALE, or OTHER' })
  gender?: Gender;

  @IsOptional()
  @IsEnum(BloodGroup, { message: 'Invalid blood group provided' })
  bloodGroup?: BloodGroup;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  emergencyContactName?: string;

  @IsOptional()
  @IsPhoneNumber('BD', { message: 'emergencyContactPhone must be a valid phone number' })
  emergencyContactPhone?: string;
}
