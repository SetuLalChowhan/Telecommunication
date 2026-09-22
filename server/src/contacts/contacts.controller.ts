import {
  Body,
  Controller,
  Get,
  Headers,
  Ip,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { Throttle } from '@nestjs/throttler';
import { ContactsService } from './contacts.service.js';
import {
  CreateContactMessageDto,
  UpdateContactMessageStatusDto,
} from './dto/create-contact-message.dto.js';
import { ContactQueryDto } from './dto/contact-query.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { ResponseMessage } from '../common/decorator/response-message.decorator.js';

@Controller('contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  // --- Public Endpoint ---

  @Post()
  @AllowAnonymous()
  @Throttle({ default: { ttl: 60_000, limit: 5 } })
  @ResponseMessage('Message received. Our support team will contact you shortly.')
  submit(
    @Body() dto: CreateContactMessageDto,
    @Ip() ipAddress: string,
    @Headers('user-agent') userAgent?: string,
  ) {
    return this.contactsService.submit(dto, { ipAddress, userAgent });
  }

  // --- Admin Endpoints ---

  @Get('admin/all')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ResponseMessage('Contact messages fetched successfully')
  listForAdmin(@Query() query: ContactQueryDto) {
    return this.contactsService.listForAdmin(query);
  }

  @Patch('admin/:id/status')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ResponseMessage('Contact message status updated successfully')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateContactMessageStatusDto,
  ) {
    return this.contactsService.updateStatus(id, dto);
  }
}
