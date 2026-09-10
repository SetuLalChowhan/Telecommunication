import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateSpecialtyDto } from './dto/create-specialty.dto.js';
import { UpdateSpecialtyDto } from './dto/update-specialty.dto.js';
import { SpecialtyQueryDto } from './dto/specialty-query.dto.js';
import {
  createPaginationMeta,
  getPaginationParams,
} from '../common/pagination/pagination.utils.js';

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
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: SpecialtyQueryDto = {}) {
    const { skip, take } = getPaginationParams(query.page, query.limit);

    const where = {
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
      ...(query.search
        ? {
            name: { contains: query.search, mode: 'insensitive' as const },
          }
        : {}),
    };

    const [specialties, total] = await Promise.all([
      this.prisma.specialty.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: { doctors: true },
          },
        },
      }),
      this.prisma.specialty.count({ where }),
    ]);

    const formatted = specialties.map((s) => ({
      id: s.id,
      name: s.name,
      slug: s.slug,
      isActive: s.isActive,
      doctorCount: s._count.doctors,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    }));

    return {
      data: formatted,
      meta: createPaginationMeta(query.page || 1, query.limit || 10, total),
    };
  }

  async findBySlug(slug: string) {
    const specialty = await this.prisma.specialty.findUnique({
      where: { slug },
      include: {
        doctors: {
          where: {
            doctor: { verified: true },
          },
          include: {
            doctor: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

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
    const specialty = await this.prisma.specialty.findUnique({
      where: { id },
      include: {
        _count: {
          select: { doctors: true },
        },
      },
    });

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

    const existingName = await this.prisma.specialty.findUnique({
      where: { name: dto.name },
    });
    if (existingName) {
      throw new ConflictException('A specialty with this name already exists');
    }

    const existingSlug = await this.prisma.specialty.findUnique({
      where: { slug },
    });
    if (existingSlug) {
      throw new ConflictException('A specialty with this slug already exists');
    }

    return this.prisma.specialty.create({
      data: {
        name: dto.name,
        slug,
        isActive: dto.isActive ?? true,
      },
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

    if (dto.name) {
      const existingName = await this.prisma.specialty.findFirst({
        where: { name: dto.name, NOT: { id } },
      });
      if (existingName) {
        throw new ConflictException('A specialty with this name already exists');
      }
    }

    if (slug) {
      const existingSlug = await this.prisma.specialty.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existingSlug) {
        throw new ConflictException('A specialty with this slug already exists');
      }
    }

    return this.prisma.specialty.update({
      where: { id },
      data: {
        name: dto.name,
        slug,
        isActive: dto.isActive,
      },
    });
  }

  async remove(id: string) {
    const specialty = await this.findOne(id);

    const doctorsCount = await this.prisma.doctorSpecialty.count({
      where: { specialtyId: id },
    });

    if (doctorsCount > 0) {
      throw new BadRequestException(
        `Cannot delete specialty because ${doctorsCount} doctor(s) are assigned to it. Deactivate it instead.`,
      );
    }

    return this.prisma.specialty.delete({
      where: { id },
    });
  }
}
