import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MedicalReportsService } from './medical-reports.service.js';
import { UploadReportDto } from './dto/upload-report.dto.js';
import { reportUploadOptions } from '../common/utils/file-upload.util.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CurrentUser } from '../common/decorator/current-user.decorator.js';
import { ResponseMessage } from '../common/decorator/response-message.decorator.js';
import { PaginationDto } from '../common/pagination/pagination.dto.js';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('medical-reports')
export class MedicalReportsController {
  constructor(
    private readonly medicalReportsService: MedicalReportsService,
  ) {}

  @Post()
  @Roles('PATIENT', 'DOCTOR')
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file', reportUploadOptions))
  @ResponseMessage('Medical report uploaded successfully')
  uploadReport(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
    @Body() dto: UploadReportDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.medicalReportsService.uploadReport(userId, role, dto, file);
  }

  @Get('my-reports')
  @Roles('PATIENT')
  @UseGuards(RolesGuard)
  @ResponseMessage('Medical reports fetched successfully')
  getMyReports(
    @CurrentUser('id') userId: string,
    @Query() query: PaginationDto,
  ) {
    return this.medicalReportsService.getMyReports(userId, query);
  }

  @Get('booking/:bookingId')
  @UseGuards(RolesGuard)
  @ResponseMessage('Booking reports fetched successfully')
  getReportsByBooking(
    @Param('bookingId') bookingId: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.medicalReportsService.getReportsByBooking(
      bookingId,
      userId,
      role,
    );
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @ResponseMessage('Medical report deleted successfully')
  deleteReport(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: string,
  ) {
    return this.medicalReportsService.deleteReport(id, userId, role);
  }

  @Get(':id/file')
  @AllowAnonymous()
  getReportFile(
    @Param('id') id: string,
    @Query('action') action: 'view' | 'download',
    @Res() res: any,
  ) {
    return this.medicalReportsService.streamReportFile(id, action || 'view', res);
  }
}
