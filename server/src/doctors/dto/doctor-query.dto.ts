import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class DoctorQueryDto {
    @IsOptional()
    @IsString()
    specialtySlug?: string;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    minFee?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    maxFee?: number;

    @IsOptional()
    @IsIn(['rating', 'fee', 'experience'])
    sortBy?: 'rating' | 'fee' | 'experience';

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;
}