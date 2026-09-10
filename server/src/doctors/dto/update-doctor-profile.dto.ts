import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateDoctorProfileDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  experienceYears?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fee?: number;

  @IsOptional()
  @IsString()
  slug?: string;

  /**
   * Full replacement list of specialty IDs for this doctor.
   * Pass an empty array to clear all specialties.
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialtyIds?: string[];
}