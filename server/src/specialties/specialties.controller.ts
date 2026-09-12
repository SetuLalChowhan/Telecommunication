import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { SpecialtiesService } from './specialties.service.js';
import { CreateSpecialtyDto } from './dto/create-specialty.dto.js';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto.js';
import { SpecialtyQueryDto } from './dto/specialty-query.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { ResponseMessage } from '../common/decorator/response-message.decorator.js';

@Controller('specialties')
export class SpecialtiesController {
  constructor(private readonly specialtiesService: SpecialtiesService) {}

  @Get()
  @AllowAnonymous()
  @ResponseMessage('Specialties fetched successfully')
  findAll(@Query() query: SpecialtyQueryDto) {
    return this.specialtiesService.findAll(query);
  }

  @Get(':slug')
  @AllowAnonymous()
  @ResponseMessage('Specialty details fetched successfully')
  findBySlug(@Param('slug') slug: string) {
    return this.specialtiesService.findBySlug(slug);
  }

  @Post()
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ResponseMessage('Specialty created successfully')
  create(@Body() dto: CreateSpecialtyDto) {
    return this.specialtiesService.create(dto);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ResponseMessage('Specialty updated successfully')
  update(@Param('id') id: string, @Body() dto: UpdateSpecialtyDto) {
    return this.specialtiesService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ResponseMessage('Specialty deleted successfully')
  remove(@Param('id') id: string) {
    return this.specialtiesService.remove(id);
  }
}
