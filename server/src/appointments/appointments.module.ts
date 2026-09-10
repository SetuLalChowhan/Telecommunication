import { Module } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller.js';
import { AppointmentsService } from './appointments.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { GoogleModule } from '../google/google.module.js';

@Module({
  imports: [PrismaModule, GoogleModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule { }
