import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { getPaginationParams } from '../common/pagination/pagination.utils.js';
import { SpecialtyQueryDto } from './dto/specialty-query.dto.js';

@Injectable()
export class SpecialtiesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(query: SpecialtyQueryDto) {
    const { skip, take } = getPaginationParams(query.page, query.limit);

    const where: Prisma.SpecialtyWhereInput = {
      ...(query.isActive !== undefined ? { isActive: query.isActive } : {}),
      ...(query.search
        ? { name: { contains: query.search, mode: 'insensitive' } }
        : {}),
    };

    const [rows, total] = await Promise.all([
      this.prisma.specialty.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
        include: { _count: { select: { doctors: true } } },
      }),
      this.prisma.specialty.count({ where }),
    ]);

    return { rows, total };
  }

  async findBySlug(slug: string) {
    return this.prisma.specialty.findUnique({
      where: { slug },
      include: {
        doctors: {
          where: { doctor: { verified: true } },
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
  }

  async findById(id: string) {
    return this.prisma.specialty.findUnique({
      where: { id },
      include: { _count: { select: { doctors: true } } },
    });
  }

  async findByName(name: string) {
    return this.prisma.specialty.findUnique({ where: { name } });
  }

  async findByNameExcluding(name: string, excludeId: string) {
    return this.prisma.specialty.findFirst({
      where: { name, NOT: { id: excludeId } },
    });
  }

  async findBySlugUnique(slug: string) {
    return this.prisma.specialty.findUnique({ where: { slug } });
  }

  async findBySlugExcluding(slug: string, excludeId: string) {
    return this.prisma.specialty.findFirst({
      where: { slug, NOT: { id: excludeId } },
    });
  }

  async create(data: Prisma.SpecialtyCreateInput) {
    return this.prisma.specialty.create({ data });
  }

  async update(id: string, data: Prisma.SpecialtyUpdateInput) {
    return this.prisma.specialty.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.specialty.delete({ where: { id } });
  }

  async countDoctors(specialtyId: string): Promise<number> {
    return this.prisma.doctorSpecialty.count({ where: { specialtyId } });
  }
}
