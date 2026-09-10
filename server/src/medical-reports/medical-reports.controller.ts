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

@Controller('medical-reports')
export class MedicalReportsController {
  constructor(
    private readonly medicalReportsService: MedicalReportsService,
  ) {}

  @Post()
  @Roles('PATIENT')
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file', reportUploadOptions))
  @ResponseMessage('Medical report uploaded successfully')
  uploadReport(
    @CurrentUser('id') userId: string,
    @Body() dto: UploadReportDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.medicalReportsService.uploadReport(userId, dto, file);
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
}
