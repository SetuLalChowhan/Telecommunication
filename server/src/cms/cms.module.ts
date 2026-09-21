import { Module } from '@nestjs/common';
import { CmsController } from './cms.controller.js';
import { CmsService } from './cms.service.js';
import { CmsRepository } from './cms.repository.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [CmsController],
  providers: [CmsService, CmsRepository],
  exports: [CmsService],
})
export class CmsModule {}
