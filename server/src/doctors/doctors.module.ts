import { Module } from '@nestjs/common';
import { DoctorController } from './doctors.controller.js';
import { DoctorService } from './doctors.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [DoctorService],
})
export class DoctorModule {}
export const DoctorsModule = DoctorModule;
export type DoctorsModule = DoctorModule;