import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DocumentStatus } from '@prisma/client';
import { AdminService } from './admin.service.js';
import { AdminDoctorQueryDto } from './dto/admin-doctor-query.dto.js';
import { RejectDoctorDto } from './dto/reject-doctor.dto.js';
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

  @Get('patients')
  @ResponseMessage('Patients list fetched successfully')
  listPatients(
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.listPatients({ search, page: Number(page) || 1, limit: Number(limit) || 10 });
  }

  @Get('patients/:id')
  @ResponseMessage('Patient details fetched successfully')
  getPatientDetails(@Param('id') id: string) {
    return this.adminService.getPatientDetails(id);
  }

  @Get('appointments')
  @ResponseMessage('All appointments fetched successfully')
  listAppointments(
    @Query('status') status?: any,
    @Query('doctorId') doctorId?: string,
    @Query('patientId') patientId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.listAppointments({
      status,
      doctorId,
      patientId,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });
  }

  @Get('reviews')
  @ResponseMessage('All reviews fetched successfully')
  listReviews(
    @Query('doctorId') doctorId?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.listReviews({
      doctorId,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });
  }
}
