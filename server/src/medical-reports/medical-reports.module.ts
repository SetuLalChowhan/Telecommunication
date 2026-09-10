import { Module } from '@nestjs/common';
import { MedicalReportsController } from './medical-reports.controller.js';
import { MedicalReportsService } from './medical-reports.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [MedicalReportsController],
  providers: [MedicalReportsService],
  exports: [MedicalReportsService],
})
export class MedicalReportsModule {}
