import { IsDateString, IsNotEmpty, IsString } from 'class-validator';

export class SlotQueryDto {
  @IsNotEmpty()
  @IsString()
  doctorId: string;

  @IsNotEmpty()
  @IsDateString({}, { message: 'date must be in YYYY-MM-DD format' })
  date: string;
}
