import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  CreateWebsiteSectionDto,
  UpdateWebsiteSectionDto,
} from './dto/update-section.dto.js';

@Injectable()
export class CmsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllSections() {
    const sections = await this.prisma.websiteSection.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'asc' },
    });

    // Also return a keyed dictionary for direct frontend consumption
    const keyed: Record<string, any> = {};
    for (const sec of sections) {
      keyed[sec.key] = sec;
    }

    return {
      list: sections,
      sections: keyed,
    };
  }

  async getSectionByKey(key: string) {
    const section = await this.prisma.websiteSection.findUnique({
      where: { key },
    });

    if (!section) {
      throw new NotFoundException(`Website section not found: ${key}`);
    }

    return section;
  }

  async upsertSection(key: string, dto: UpdateWebsiteSectionDto) {
    return this.prisma.websiteSection.upsert({
      where: { key },
      update: {
        ...dto,
      },
      create: {
        key,
        ...dto,
      },
    });
  }

  async createSection(dto: CreateWebsiteSectionDto) {
    return this.prisma.websiteSection.create({
      data: dto,
    });
  }

  async deleteSection(key: string) {
    const section = await this.prisma.websiteSection.findUnique({
      where: { key },
    });

    if (!section) {
      throw new NotFoundException(`Website section not found: ${key}`);
    }

    return this.prisma.websiteSection.delete({
      where: { key },
    });
  }
}
