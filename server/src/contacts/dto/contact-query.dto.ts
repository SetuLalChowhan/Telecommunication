import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationDto } from '../../common/pagination/pagination.dto.js';
import { CONTACT_MESSAGE_STATUSES } from './create-contact-message.dto.js';

export class ContactQueryDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(CONTACT_MESSAGE_STATUSES)
  status?: (typeof CONTACT_MESSAGE_STATUSES)[number];
}
