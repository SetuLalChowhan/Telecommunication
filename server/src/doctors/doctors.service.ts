import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DocumentType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto.js';
import { CreateAvailabilityDto } from './dto/create-availability.dto.js';
import { UpdateAvailabilityDto } from './dto/update-availability.dto.js';
import { DoctorQueryDto } from './dto/doctor-query.dto.js';
import { CreateDayOffDto } from './dto/create-day-off.dto.js';
import {
  createPaginationMeta,
  getPaginationParams,
} from '../common/pagination/pagination.utils.js';

const DOCTOR_PROFILE_INCLUDE = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
    },
  },
  specialties: { include: { specialty: true } },
  documents: true,
  availability: true,
  daysOff: true,
} as const;

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) {}

  private async getOwnProfileOrThrow(userId: string) {
    const profile = await this.prisma.doctorProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundException(
        'No doctor profile found for this account',
      );
    }

    return profile;
  }

  async getMyProfile(userId: string) {
    const profile = await this.getOwnProfileOrThrow(userId);

    return this.prisma.doctorProfile.findUnique({
      where: { id: profile.id },
      include: DOCTOR_PROFILE_INCLUDE,
    });
  }

  async updateMyProfile(userId: string, dto: UpdateDoctorProfileDto) {
    const profile = await this.getOwnProfileOrThrow(userId);

    if (dto.specialtyIds) {
      const validCount = await this.prisma.specialty.count({
        where: { id: { in: dto.specialtyIds }, isActive: true },
      });
      if (validCount !== dto.specialtyIds.length) {
        throw new NotFoundException(
          'One or more specialty IDs are invalid or inactive',
        );
      }
    }

    return this.prisma.$transaction(async (tx) => {
      if (dto.specialtyIds) {
        await tx.doctorSpecialty.deleteMany({
          where: { doctorId: profile.id },
        });
        await tx.doctorSpecialty.createMany({
          data: dto.specialtyIds.map((specialtyId) => ({
            doctorId: profile.id,
            specialtyId,
          })),
        });
      }

      return tx.doctorProfile.update({
        where: { id: profile.id },
        data: {
          bio: dto.bio,
          experienceYears: dto.experienceYears,
          fee: dto.fee,
        },
        include: DOCTOR_PROFILE_INCLUDE,
      });
    });
  }

  async listMyAvailability(userId: string) {
    const profile = await this.getOwnProfileOrThrow(userId);
    return this.prisma.availability.findMany({
      where: { doctorId: profile.id },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  async createAvailability(userId: string, dto: CreateAvailabilityDto) {
    const profile = await this.getOwnProfileOrThrow(userId);

    if (dto.startTime >= dto.endTime) {
      throw new ForbiddenException('startTime must be earlier than endTime');
    }

    return this.prisma.availability.create({
      data: {
        doctorId: profile.id,
        dayOfWeek: dto.dayOfWeek,
        startTime: dto.startTime,
        endTime: dto.endTime,
        consultationDuration: dto.consultationDuration ?? 30,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async updateAvailability(
    userId: string,
    availabilityId: string,
    dto: UpdateAvailabilityDto,
  ) {
    const profile = await this.getOwnProfileOrThrow(userId);
    await this.assertOwnsAvailability(profile.id, availabilityId);

    // Changing consultationDuration or hours here only affects future slot
    // generation — it never touches already-confirmed Booking rows, since
    // Booking stores its own slotStart/slotEnd independent of Availability.
    return this.prisma.availability.update({
      where: { id: availabilityId },
      data: dto,
    });
  }

  async deleteAvailability(userId: string, availabilityId: string) {
    const profile = await this.getOwnProfileOrThrow(userId);
    await this.assertOwnsAvailability(profile.id, availabilityId);

    return this.prisma.availability.delete({ where: { id: availabilityId } });
  }

  private async assertOwnsAvailability(doctorId: string, availabilityId: string) {
    const row = await this.prisma.availability.findUnique({
      where: { id: availabilityId },
    });
    if (!row || row.doctorId !== doctorId) {
      throw new NotFoundException('Availability slot not found');
    }
  }

  async uploadDocument(
    userId: string,
    docType: DocumentType,
    file: Express.Multer.File,
  ) {
    const profile = await this.getOwnProfileOrThrow(userId);

    return this.prisma.doctorDocument.create({
      data: {
        doctorId: profile.id,
        docType,
        fileUrl: `/uploads/documents/${file.filename}`,
      },
    });
  }

  /**
   * Public search — only ever returns verified doctors. This backs the
   * "Find a Doctor" page, so an unverified doctor is invisible to visitors
   * regardless of query filters.
   */
  async listPublicDoctors(query: DoctorQueryDto) {
    const { skip, take } = getPaginationParams(query.page, query.limit);

    const where = {
      verified: true,
      ...(query.specialtySlug && {
        specialties: { some: { specialty: { slug: query.specialtySlug } } },
      }),
      ...(query.search && {
        user: {
          name: { contains: query.search, mode: 'insensitive' as const },
        },
      }),
      ...(query.minFee !== undefined || query.maxFee !== undefined
        ? {
            fee: {
              ...(query.minFee !== undefined && { gte: query.minFee }),
              ...(query.maxFee !== undefined && { lte: query.maxFee }),
            },
          }
        : {}),
    };

    const orderBy =
      query.sortBy === 'fee'
        ? { fee: 'asc' as const }
        : query.sortBy === 'experience'
          ? { experienceYears: 'desc' as const }
          : { rating: 'desc' as const };

    const [doctors, total] = await Promise.all([
      this.prisma.doctorProfile.findMany({
        where,
        skip,
        take,
        orderBy,
        include: DOCTOR_PROFILE_INCLUDE,
      }),
      this.prisma.doctorProfile.count({ where }),
    ]);

    return {
      data: doctors,
      meta: createPaginationMeta(query.page || 1, query.limit || 10, total),
    };
  }

  async getPublicDoctorById(id: string) {
    const doctor = await this.prisma.doctorProfile.findFirst({
      where: { id, verified: true },
      include: DOCTOR_PROFILE_INCLUDE,
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return doctor;
  }

  async listMyDaysOff(userId: string) {
    const profile = await this.getOwnProfileOrThrow(userId);
    return (this.prisma as any).doctorDayOff.findMany({
      where: { doctorId: profile.id },
      orderBy: { date: 'asc' },
    });
  }

  async createDayOff(userId: string, dto: CreateDayOffDto) {
    const profile = await this.getOwnProfileOrThrow(userId);
    const dateObj = new Date(dto.date);

    return (this.prisma as any).doctorDayOff.upsert({
      where: {
        doctorId_date: {
          doctorId: profile.id,
          date: dateObj,
        },
      },
      update: {
        reason: dto.reason,
      },
      create: {
        doctorId: profile.id,
        date: dateObj,
        reason: dto.reason,
      },
    });
  }

  async deleteDayOff(userId: string, dayOffId: string) {
    const profile = await this.getOwnProfileOrThrow(userId);
    const dayOff = await (this.prisma as any).doctorDayOff.findUnique({
      where: { id: dayOffId },
    });

    if (!dayOff || dayOff.doctorId !== profile.id) {
      throw new NotFoundException('Day off entry not found');
    }

    return (this.prisma as any).doctorDayOff.delete({
      where: { id: dayOffId },
    });
  }

  async getPublicDoctorAvailability(id: string) {
    await this.getPublicDoctorById(id);

    return this.prisma.availability.findMany({
      where: { doctorId: id, isActive: true },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  async getPublicDoctorDaysOff(id: string) {
    await this.getPublicDoctorById(id);

    return (this.prisma as any).doctorDayOff.findMany({
      where: {
        doctorId: id,
        date: { gte: new Date() },
      },
      orderBy: { date: 'asc' },
    });
  }
}