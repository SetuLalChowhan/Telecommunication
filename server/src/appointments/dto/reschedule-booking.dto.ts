import { IsDateString, IsNotEmpty } from 'class-validator';

export class RescheduleBookingDto {
  @IsNotEmpty()
  @IsDateString({}, { message: 'newSlotStart must be a valid ISO-8601 date string' })
  newSlotStart: string;

  @IsNotEmpty()
  @IsDateString({}, { message: 'newSlotEnd must be a valid ISO-8601 date string' })
  newSlotEnd: string;
}

