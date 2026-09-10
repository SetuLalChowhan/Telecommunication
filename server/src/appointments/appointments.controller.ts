import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { SlotQueryDto } from './dto/slot-query.dto.js';
import { BookingQueryDto } from './dto/booking-query.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CurrentUser } from '../common/decorator/current-user.decorator.js';
import { ResponseMessage } from '../common/decorator/response-message.decorator.js';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Get('slots')
  @ResponseMessage('Available slots calculated successfully')
  getAvailableSlots(@Query() query: SlotQueryDto) {
    return this.appointmentsService.getAvailableSlots(query);
  }

  @Post()
  @Roles('PATIENT')
  @UseGuards(RolesGuard)
  @ResponseMessage('Appointment booked successfully')
  createBooking(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateBookingDto,
  ) {
    return this.appointmentsService.createBooking(userId, dto);
  }

  @Get('my-bookings')
  @UseGuards(RolesGuard)
  @ResponseMessage('Bookings fetched successfully')
  getMyBookings(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
    @Query() query: BookingQueryDto,
  ) {
    return this.appointmentsService.getMyBookings(userId, role, query);
  }

  @Get(':id')
  @UseGuards(RolesGuard)
  @ResponseMessage('Booking details fetched successfully')
  getBookingById(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.appointmentsService.getBookingById(id, userId, role);
  }

  @Patch(':id/cancel')
  @UseGuards(RolesGuard)
  @ResponseMessage('Booking cancelled successfully')
  cancelBooking(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.appointmentsService.cancelBooking(id, userId, role);
  }

  @Patch(':id/complete')
  @Roles('DOCTOR', 'ADMIN')
  @UseGuards(RolesGuard)
  @ResponseMessage('Booking marked as completed')
  completeBooking(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.appointmentsService.completeBooking(id, userId, role);
  }
}
