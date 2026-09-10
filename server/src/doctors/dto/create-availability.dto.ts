import { IsBoolean, IsEnum, IsInt, IsOptional, Matches, Min } from 'class-validator';
import { DayOfWeek } from '@prisma/client';

const TIME_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

export class CreateAvailabilityDto {
    @IsEnum(DayOfWeek)
    dayOfWeek: DayOfWeek;

    @Matches(TIME_PATTERN, { message: 'startTime must be in HH:mm 24-hour format' })
    startTime: string;

    @Matches(TIME_PATTERN, { message: 'endTime must be in HH:mm 24-hour format' })
    endTime: string;

    @IsOptional()
    @IsInt()
    @Min(5)
    consultationDuration?: number;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}