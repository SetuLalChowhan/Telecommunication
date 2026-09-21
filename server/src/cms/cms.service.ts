import { Injectable, NotFoundException } from '@nestjs/common';
import { CmsRepository } from './cms.repository.js';
import {
  CreateWebsiteSectionDto,
  UpdateWebsiteSectionDto,
} from './dto/update-section.dto.js';

@Injectable()
export class CmsService {
  constructor(private readonly repo: CmsRepository) {}

  async getAllSections() {
    const sections = await this.repo.findAllActive();

    const keyed: Record<string, unknown> = {};
    for (const sec of sections) {
      keyed[sec.key] = sec;
    }

    return { list: sections, sections: keyed };
  }

  async getSectionByKey(key: string) {
    const section = await this.repo.findByKey(key);

    if (!section) {
      throw new NotFoundException(`Website section not found: ${key}`);
    }

    return section;
  }

  async upsertSection(key: string, dto: UpdateWebsiteSectionDto) {
    return this.repo.upsert(key, dto);
  }

  async createSection(dto: CreateWebsiteSectionDto) {
    return this.repo.create(dto);
  }

  async deleteSection(key: string) {
    const section = await this.repo.findByKey(key);

    if (!section) {
      throw new NotFoundException(`Website section not found: ${key}`);
    }

    return this.repo.delete(key);
  }
}
