import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { CmsService } from './cms.service.js';
import {
  CreateWebsiteSectionDto,
  UpdateWebsiteSectionDto,
} from './dto/update-section.dto.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { ResponseMessage } from '../common/decorator/response-message.decorator.js';

@Controller('cms')
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get('sections')
  @AllowAnonymous()
  @ResponseMessage('Website sections fetched successfully')
  getAllSections() {
    return this.cmsService.getAllSections();
  }

  @Get('sections/:key')
  @AllowAnonymous()
  @ResponseMessage('Website section fetched successfully')
  getSectionByKey(@Param('key') key: string) {
    return this.cmsService.getSectionByKey(key);
  }

  @Post('sections')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ResponseMessage('Website section created successfully')
  createSection(@Body() dto: CreateWebsiteSectionDto) {
    return this.cmsService.createSection(dto);
  }

  @Patch('sections/:key')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ResponseMessage('Website section updated successfully')
  upsertSection(
    @Param('key') key: string,
    @Body() dto: UpdateWebsiteSectionDto,
  ) {
    return this.cmsService.upsertSection(key, dto);
  }

  @Delete('sections/:key')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @ResponseMessage('Website section deleted successfully')
  deleteSection(@Param('key') key: string) {
    return this.cmsService.deleteSection(key);
  }
}
