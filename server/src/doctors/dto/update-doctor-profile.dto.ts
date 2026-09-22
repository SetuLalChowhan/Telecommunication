import { Transform, Type } from 'class-transformer';
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
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  doctorId?: string;

  @IsString()
  degree: string;

  @IsOptional()
  @IsString()
  field?: string;

  @IsString()
  institute: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  })
  @IsInt()
  @Min(1900)
  passingYear?: number;

  @IsOptional()
  @IsString()
  result?: string;

  @IsOptional()
  createdAt?: any;

  @IsOptional()
  updatedAt?: any;
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
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  })
  @IsInt()
  @Min(0)
  experienceYears?: number;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === '' || value === null || value === undefined) return undefined;
    const num = Number(value);
    return isNaN(num) ? undefined : num;
  })
  @IsNumber()
  @Min(0)
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

  @IsOptional()
  @IsString()
  primarySpecialtyId?: string;

  /**
   * Secondary / Other Specialty IDs
   */
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [value];
      }
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  otherSpecialtyIds?: string[];

  /**
   * Full replacement list of specialty IDs for backward compatibility
   */
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [value];
      }
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  specialtyIds?: string[];

  /**
   * List of doctor educational degrees & medical credentials
   */
  @IsOptional()
  @Transform(({ value }) => {
    let list = value;
    if (typeof value === 'string') {
      try {
        list = JSON.parse(value);
      } catch {
        return value;
      }
    }
    if (Array.isArray(list)) {
      return list
        .filter((item: any) => item && typeof item === 'object')
        .map((item: any) => {
          const dto = new DoctorQualificationDto();
          if (item.id) dto.id = String(item.id);
          if (item.doctorId) dto.doctorId = String(item.doctorId);
          dto.degree = typeof item.degree === 'string' ? item.degree.trim() : String(item.degree || '');
          dto.institute = typeof item.institute === 'string' ? item.institute.trim() : String(item.institute || '');
          if (item.field !== undefined && item.field !== null && item.field !== '') {
            dto.field = typeof item.field === 'string' ? item.field.trim() : String(item.field);
          }
          if (item.passingYear !== undefined && item.passingYear !== null && item.passingYear !== '') {
            const num = Number(item.passingYear);
            if (!isNaN(num)) dto.passingYear = num;
          }
          if (item.result !== undefined && item.result !== null && item.result !== '') {
            dto.result = typeof item.result === 'string' ? item.result.trim() : String(item.result);
          }
          return dto;
        });
    }
    return value;
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => DoctorQualificationDto)
  qualifications?: DoctorQualificationDto[];
}