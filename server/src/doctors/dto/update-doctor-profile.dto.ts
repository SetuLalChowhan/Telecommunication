import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class DoctorQualificationDto {
  @IsString()
  degree: string;

  @IsOptional()
  @IsString()
  field?: string;

  @IsString()
  institute: string;

  @IsOptional()
  @IsInt()
  @Min(1950)
  @Type(() => Number)
  passingYear?: number;

  @IsOptional()
  @IsString()
  result?: string;
}

export class UpdateDoctorProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  image?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  experienceYears?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  fee?: number;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  bmdcNumber?: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsString()
  hospitalAffiliation?: string;

  @IsOptional()
  @IsString()
  clinicAddress?: string;

  /**
   * Primary / Main Specialty ID
   */
  @IsOptional()
  @IsString()
  mainSpecialtyId?: string;

  /**
   * Secondary / Other Specialty IDs
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  otherSpecialtyIds?: string[];

  /**
   * Full replacement list of specialty IDs for backward compatibility
   */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specialtyIds?: string[];

  /**
   * List of doctor educational degrees & medical credentials
   */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DoctorQualificationDto)
  qualifications?: DoctorQualificationDto[];
}