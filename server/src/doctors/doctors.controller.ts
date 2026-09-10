import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentType } from '@prisma/client';
import { DoctorService } from './doctors.service.js';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto.js';
import { CreateAvailabilityDto } from './dto/create-availability.dto.js';
import { UpdateAvailabilityDto } from './dto/update-availability.dto.js';
import { DoctorQueryDto } from './dto/doctor-query.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CurrentUser } from '../common/decorator/current-user.decorator.js';
import { ResponseMessage } from '../common/decorator/response-message.decorator.js';
import { doctorDocumentUploadOptions } from '../common/utils/file-upload.util.js';

@Controller('doctors')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get('me')
  @Roles('DOCTOR')
  @UseGuards(RolesGuard)
  @ResponseMessage('Doctor profile fetched successfully')
  getMyProfile(@CurrentUser('id') userId: string) {
    return this.doctorService.getMyProfile(userId);
  }

  @Patch('me')
  @Roles('DOCTOR')
  @UseGuards(RolesGuard)
  @ResponseMessage('Doctor profile updated successfully')
  updateMyProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateDoctorProfileDto,
  ) {
    return this.doctorService.updateMyProfile(userId, dto);
  }

  @Get('me/availability')
  @Roles('DOCTOR')
  @UseGuards(RolesGuard)
  @ResponseMessage('Availability fetched successfully')
  listMyAvailability(@CurrentUser('id') userId: string) {
    return this.doctorService.listMyAvailability(userId);
  }

  @Post('me/availability')
  @Roles('DOCTOR')
  @UseGuards(RolesGuard)
  @ResponseMessage('Availability slot created successfully')
  createAvailability(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateAvailabilityDto,
  ) {
    return this.doctorService.createAvailability(userId, dto);
  }

  @Patch('me/availability/:id')
  @Roles('DOCTOR')
  @UseGuards(RolesGuard)
  @ResponseMessage('Availability slot updated successfully')
  updateAvailability(
    @CurrentUser('id') userId: string,
    @Param('id') availabilityId: string,
    @Body() dto: UpdateAvailabilityDto,
  ) {
    return this.doctorService.updateAvailability(userId, availabilityId, dto);
  }

  @Delete('me/availability/:id')
  @Roles('DOCTOR')
  @UseGuards(RolesGuard)
  @ResponseMessage('Availability slot deleted successfully')
  deleteAvailability(
    @CurrentUser('id') userId: string,
    @Param('id') availabilityId: string,
  ) {
    return this.doctorService.deleteAvailability(userId, availabilityId);
  }

  @Post('me/documents')
  @Roles('DOCTOR')
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file', doctorDocumentUploadOptions))
  @ResponseMessage('Verification document uploaded successfully')
  uploadDocument(
    @CurrentUser('id') userId: string,
    @Body('docType') docType: DocumentType,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.doctorService.uploadDocument(userId, docType, file);
  }

  @Get()
  @ResponseMessage('Doctors fetched successfully')
  listPublicDoctors(@Query() query: DoctorQueryDto) {
    return this.doctorService.listPublicDoctors(query);
  }

  @Get(':id')
  @ResponseMessage('Doctor profile fetched successfully')
  getPublicDoctorById(@Param('id') id: string) {
    return this.doctorService.getPublicDoctorById(id);
  }
}