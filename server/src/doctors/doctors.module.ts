import { Module } from '@nestjs/common';
import { DoctorController } from './doctors.controller.js';
import { DoctorService } from './doctors.service.js';
import { DoctorRepository } from './doctors.repository.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { CloudinaryModule } from '../common/cloudinary/cloudinary.module.js';

@Module({
  imports: [PrismaModule, CloudinaryModule],
  controllers: [DoctorController],
  providers: [DoctorService, DoctorRepository],
  exports: [DoctorService],
})
export class DoctorModule {}
export const DoctorsModule = DoctorModule;
export type DoctorsModule = DoctorModule;