import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class CmsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAllActive() {
    return this.prisma.websiteSection.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findByKey(key: string) {
    return this.prisma.websiteSection.findUnique({ where: { key } });
  }

  async upsert(key: string, data: Prisma.WebsiteSectionUpdateInput) {
    return this.prisma.websiteSection.upsert({
      where: { key },
      update: data,
      create: { key, ...data } as Prisma.WebsiteSectionCreateInput,
    });
  }

  async create(data: Prisma.WebsiteSectionCreateInput) {
    return this.prisma.websiteSection.create({ data });
  }

  async delete(key: string) {
    return this.prisma.websiteSection.delete({ where: { key } });
  }
}
