import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto.js';

export class UpdateProfileDto extends PartialType(
  PickType(CreateUserDto, [
    'name',
    'firstName',
    'lastName',
    'dateOfBirth',
    'phone',
  ] as const),
) {}
