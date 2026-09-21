import { Module } from '@nestjs/common';
import { MedicalReportsController } from './medical-reports.controller.js';
import { MedicalReportsService } from './medical-reports.service.js';
import { MedicalReportsRepository } from './medical-reports.repository.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [MedicalReportsController],
  providers: [MedicalReportsService, MedicalReportsRepository],
  exports: [MedicalReportsService, MedicalReportsRepository],
})
export class MedicalReportsModule {}

