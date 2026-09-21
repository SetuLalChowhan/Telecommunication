import { Module } from '@nestjs/common';
import { SpecialtiesController } from './specialties.controller.js';
import { SpecialtiesService } from './specialties.service.js';
import { SpecialtiesRepository } from './specialties.repository.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [SpecialtiesController],
  providers: [SpecialtiesService, SpecialtiesRepository],
  exports: [SpecialtiesService],
})
export class SpecialtiesModule {}
