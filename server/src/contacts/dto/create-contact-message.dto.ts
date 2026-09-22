import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateContactMessageDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2, { message: 'Name must be at least 2 characters' })
  @MaxLength(120)
  fullName: string;

  @IsEmail({}, { message: 'Please provide a valid email address' })
  @MaxLength(180)
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7, { message: 'Please provide a valid phone number' })
  @MaxLength(30)
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3, { message: 'Subject must be at least 3 characters' })
  @MaxLength(160)
  subject: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(10, { message: 'Message must be at least 10 characters' })
  @MaxLength(5000)
  message: string;

  /** Optional page/section the inquiry was sent from. */
  @IsOptional()
  @IsString()
  @MaxLength(80)
  source?: string;
}

export const CONTACT_MESSAGE_STATUSES = [
  'NEW',
  'IN_PROGRESS',
  'RESOLVED',
  'SPAM',
] as const;

export class UpdateContactMessageStatusDto {
  @IsIn(CONTACT_MESSAGE_STATUSES)
  status: (typeof CONTACT_MESSAGE_STATUSES)[number];
}
