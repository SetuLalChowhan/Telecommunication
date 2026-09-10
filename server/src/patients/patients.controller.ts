import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { PatientsService } from './patients.service.js';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { CurrentUser } from '../common/decorator/current-user.decorator.js';
import { ResponseMessage } from '../common/decorator/response-message.decorator.js';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Get('me')
  @Roles('PATIENT')
  @UseGuards(RolesGuard)
  @ResponseMessage('Patient profile fetched successfully')
  getMyProfile(@CurrentUser('id') userId: string) {
    return this.patientsService.getMyProfile(userId);
  }

  @Patch('me')
  @Roles('PATIENT')
  @UseGuards(RolesGuard)
  @ResponseMessage('Patient profile updated successfully')
  updateMyProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdatePatientProfileDto,
  ) {
    return this.patientsService.updateMyProfile(userId, dto);
  }

  @Get(':id')
  @Roles('DOCTOR', 'ADMIN')
  @UseGuards(RolesGuard)
  @ResponseMessage('Patient details fetched successfully')
  getPatientById(@Param('id') id: string) {
    return this.patientsService.getPatientById(id);
  }
}
