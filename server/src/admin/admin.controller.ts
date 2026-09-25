import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { DocumentStatus } from '@prisma/client';
import { AdminService } from './admin.service.js';
import { AdminDoctorQueryDto } from './dto/admin-doctor-query.dto.js';
import { AdminQueryDto } from './dto/admin-query.dto.js';
import { RejectDoctorDto } from './dto/reject-doctor.dto.js';
import { UpdatePatientDto } from './dto/update-patient.dto.js';
import { UpdateBookingDto } from './dto/update-booking.dto.js';
import { UpdateDoctorDto } from './dto/update-doctor.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CurrentUser } from '../common/decorator/current-user.decorator.js';
import { ResponseMessage } from '../common/decorator/response-message.decorator.js';

@Controller('admin')
@Roles('ADMIN')
@UseGuards(RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/metrics')
  @ResponseMessage('Dashboard metrics fetched successfully')
  getDashboardMetrics() {
    return this.adminService.getDashboardMetrics();
  }

  @Get('doctors')
  @ResponseMessage('Doctors list fetched successfully')
  listDoctors(@Query() query: AdminDoctorQueryDto) {
    return this.adminService.listDoctors(query);
  }

  @Get('doctors/pending')
  @ResponseMessage('Pending verification doctors fetched successfully')
  listPendingDoctors(@Query() query: AdminDoctorQueryDto) {
    return this.adminService.listPendingDoctors(query);
  }

  @Get('doctors/:id')
  @ResponseMessage('Doctor details fetched successfully')
  getDoctorDetails(@Param('id') id: string) {
    return this.adminService.getDoctorDetails(id);
  }

  @Patch('doctors/:id')
  @ResponseMessage('Doctor updated successfully')
  updateDoctor(@Param('id') id: string, @Body() dto: UpdateDoctorDto) {
    return this.adminService.updateDoctor(id, dto);
  }

  @Delete('doctors/:id')
  @ResponseMessage('Doctor deleted successfully')
  deleteDoctor(@Param('id') id: string) {
    return this.adminService.deleteDoctor(id);
  }

  @Patch('doctors/:id/approve')
  @ResponseMessage('Doctor approved successfully')
  approveDoctor(
    @Param('id') doctorId: string,
    @CurrentUser('id') adminUserId: string,
  ) {
    return this.adminService.approveDoctor(doctorId, adminUserId);
  }

  @Patch('doctors/:id/reject')
  @ResponseMessage('Doctor verification rejected')
  rejectDoctor(
    @Param('id') doctorId: string,
    @CurrentUser('id') adminUserId: string,
    @Body() dto: RejectDoctorDto,
  ) {
    return this.adminService.rejectDoctor(doctorId, adminUserId, dto);
  }

  @Patch('documents/:id/status')
  @ResponseMessage('Document status updated successfully')
  updateDocumentStatus(
    @Param('id') documentId: string,
    @Body('status') status: DocumentStatus,
  ) {
    return this.adminService.updateDocumentStatus(documentId, status);
  }

  @Get('documents/:id/file')
  @ResponseMessage('Document file fetched successfully')
  getDocumentFile(
    @Param('id') documentId: string,
    @Query('action') action: 'view' | 'download',
    @Res() res: Response,
  ) {
    return this.adminService.streamDocumentFile(
      documentId,
      action || 'view',
      res,
    );
  }

  @Get('patients')
  @ResponseMessage('Patients list fetched successfully')
  listPatients(@Query() query: AdminQueryDto) {
    return this.adminService.listPatients(query);
  }

  @Get('patients/:id')
  @ResponseMessage('Patient details fetched successfully')
  getPatientDetails(@Param('id') id: string) {
    return this.adminService.getPatientDetails(id);
  }

  @Patch('patients/:id')
  @ResponseMessage('Patient updated successfully')
  updatePatient(@Param('id') id: string, @Body() dto: UpdatePatientDto) {
    return this.adminService.updatePatient(id, dto);
  }

  @Delete('patients/:id')
  @ResponseMessage('Patient deleted successfully')
  deletePatient(@Param('id') id: string) {
    return this.adminService.deletePatient(id);
  }

  @Get('appointments')
  @ResponseMessage('All appointments fetched successfully')
  listAppointments(@Query() query: AdminQueryDto) {
    return this.adminService.listAppointments(query);
  }

  @Get('appointments/:id')
  @ResponseMessage('Appointment details fetched successfully')
  getAppointmentDetails(@Param('id') id: string) {
    return this.adminService.getAppointmentDetails(id);
  }

  @Patch('appointments/:id')
  @ResponseMessage('Appointment updated successfully')
  updateAppointment(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.adminService.updateAppointment(id, dto);
  }

  @Delete('appointments/:id')
  @ResponseMessage('Appointment deleted successfully')
  deleteAppointment(@Param('id') id: string) {
    return this.adminService.deleteAppointment(id);
  }

  @Get('reviews')
  @ResponseMessage('All reviews fetched successfully')
  listReviews(@Query() query: AdminQueryDto) {
    return this.adminService.listReviews(query);
  }

  @Delete('reviews/:id')
  @ResponseMessage('Review deleted successfully')
  deleteReview(@Param('id') id: string) {
    return this.adminService.deleteReview(id);
  }
}
