import { Module } from '@nestjs/common';
import { BlogsController } from './blogs.controller.js';
import { BlogsService } from './blogs.service.js';
import { BlogsRepository } from './blogs.repository.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [BlogsController],
  providers: [BlogsService, BlogsRepository],
  exports: [BlogsService, BlogsRepository],
})
export class BlogsModule {}

