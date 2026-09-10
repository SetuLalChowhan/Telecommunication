import { Module } from '@nestjs/common';
import { GoogleService } from './google.service.js';
import { GoogleController } from './google.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [GoogleController],
  providers: [GoogleService],
  exports: [GoogleService],
})
export class GoogleModule {}
