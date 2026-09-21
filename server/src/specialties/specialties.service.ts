import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { SpecialtiesRepository } from './specialties.repository.js';
import { CreateSpecialtyDto } from './dto/create-specialty.dto.js';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto.js';
import { SpecialtyQueryDto } from './dto/specialty-query.dto.js';
import { createPaginationMeta } from '../common/pagination/pagination.utils.js';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

@Injectable()
export class SpecialtiesService {
  constructor(private readonly repo: SpecialtiesRepository) {}

  async findAll(query: SpecialtyQueryDto = {}) {
    const { rows, total } = await this.repo.findMany(query);

    const data = rows.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      isActive: s.isActive,
      doctorCount: s._count.doctors,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));

    return {
      data,
      meta: createPaginationMeta(query.page || 1, query.limit || 10, total),
    };
  }

  async findBySlug(slug: string) {
    const specialty = await this.repo.findBySlug(slug);

    if (!specialty) {
      throw new NotFoundException(`Specialty with slug "${slug}" not found`);
    }

    return {
      id: specialty.id,
      name: specialty.name,
      slug: specialty.slug,
      isActive: specialty.isActive,
      doctors: specialty.doctors.map((d) => d.doctor),
      createdAt: specialty.createdAt,
      updatedAt: specialty.updatedAt,
    };
  }

  async findOne(id: string) {
    const specialty = await this.repo.findById(id);

    if (!specialty) {
      throw new NotFoundException(`Specialty with ID "${id}" not found`);
    }

    return specialty;
  }

  async create(dto: CreateSpecialtyDto) {
    const slug = dto.slug ? slugify(dto.slug) : slugify(dto.name);

    if (!slug) {
      throw new BadRequestException('A valid name or slug is required');
    }

    if (await this.repo.findByName(dto.name)) {
      throw new ConflictException('A specialty with this name already exists');
    }

    if (await this.repo.findBySlugUnique(slug)) {
      throw new ConflictException('A specialty with this slug already exists');
    }

    return this.repo.create({
      name: dto.name,
      slug,
      isActive: dto.isActive ?? true,
    });
  }

  async update(id: string, dto: UpdateSpecialtyDto) {
    await this.findOne(id);

    let slug: string | undefined;
    if (dto.slug !== undefined) {
      slug = slugify(dto.slug);
    } else if (dto.name !== undefined) {
      slug = slugify(dto.name);
    }

    if (dto.name && (await this.repo.findByNameExcluding(dto.name, id))) {
      throw new ConflictException('A specialty with this name already exists');
    }

    if (slug && (await this.repo.findBySlugExcluding(slug, id))) {
      throw new ConflictException('A specialty with this slug already exists');
    }

    return this.repo.update(id, {
      name: dto.name,
      slug,
      isActive: dto.isActive,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    const doctorsCount = await this.repo.countDoctors(id);

    if (doctorsCount > 0) {
      throw new BadRequestException(
        `Cannot delete specialty because ${doctorsCount} doctor(s) are assigned to it. Deactivate it instead.`,
      );
    }

    return this.repo.delete(id);
  }
}
