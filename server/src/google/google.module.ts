import { Module } from '@nestjs/common';
import { GoogleService } from './google.service.js';
import { GoogleController } from './google.controller.js';
import { GoogleRepository } from './google.repository.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [GoogleController],
  providers: [GoogleService, GoogleRepository],
  exports: [GoogleService, GoogleRepository],
})
export class GoogleModule {}

