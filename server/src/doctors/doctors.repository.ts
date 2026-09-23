import { Injectable } from '@nestjs/common';
import { BookingStatus, DayOfWeek, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { getPaginationParams } from '../common/pagination/pagination.utils.js';
import { DoctorQueryDto } from './dto/doctor-query.dto.js';
import { CreateAvailabilityDto } from './dto/create-availability.dto.js';
import { UpdateAvailabilityDto } from './dto/update-availability.dto.js';

export const DOCTOR_PROFILE_INCLUDE = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
    },
  },
  specialties: {
    include: { specialty: true },
    orderBy: { isPrimary: 'desc' as const },
  },
  qualifications: {
    orderBy: { passingYear: 'desc' as const },
  },
  documents: true,
  availability: true,
  daysOff: true,
} as const;

const BOOKING_PATIENT_INCLUDE = {
  patient: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          dateOfBirth: true,
        },
      },
    },
  },
} as const;

@Injectable()
export class DoctorRepository {
  constructor(private readonly prisma: PrismaService) {}

  // -- Profile --------------------------------------------------------------

  async findProfileByUserId(userId: string) {
    return this.prisma.doctorProfile.findUnique({
      where: { userId },
      include: { user: true },
    });
  }

  async findProfileById(id: string) {
    return this.prisma.doctorProfile.findUnique({
      where: { id },
      include: DOCTOR_PROFILE_INCLUDE,
    });
  }

  async findPublicDoctor(idOrSlug: string) {
    return this.prisma.doctorProfile.findFirst({
      where: { verified: true, OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
      include: DOCTOR_PROFILE_INCLUDE,
    });
  }

  async findSlugConflict(slug: string, excludeId: string) {
    return this.prisma.doctorProfile.findFirst({
      where: { slug, id: { not: excludeId } },
    });
  }

  /**
   * Every slug already in use for this base (e.g. `dr-ithika`,
   * `dr-ithika-2`), so uniqueness can be resolved with a single query instead
   * of one `findSlugConflict` per candidate.
   */
  async findSlugsStartingWith(base: string, excludeId?: string): Promise<string[]> {
    const rows = await this.prisma.doctorProfile.findMany({
      where: {
        slug: { startsWith: base },
        ...(excludeId && { id: { not: excludeId } }),
      },
      select: { slug: true },
    });

    return rows.map((row) => row.slug).filter((slug): slug is string => Boolean(slug));
  }

  async countActiveSpecialties(ids: string[]): Promise<number> {
    return this.prisma.specialty.count({
      where: { id: { in: ids }, isActive: true },
    });
  }

  async listPublicDoctors(query: DoctorQueryDto) {
    const { skip, take } = getPaginationParams(query.page, query.limit);

    const minExp = query.minExperience ?? query.experience;

    const where: Prisma.DoctorProfileWhereInput = {
      verified: true,
      ...(query.specialtySlug && {
        specialties: { some: { specialty: { slug: query.specialtySlug } } },
      }),
      ...(query.search && {
        OR: [
          {
            user: {
              OR: [
                { name: { contains: query.search, mode: 'insensitive' } },
                { firstName: { contains: query.search, mode: 'insensitive' } },
                { lastName: { contains: query.search, mode: 'insensitive' } },
              ],
            },
          },
          { designation: { contains: query.search, mode: 'insensitive' } },
          {
            specialties: {
              some: {
                specialty: {
                  name: { contains: query.search, mode: 'insensitive' },
                },
              },
            },
          },
        ],
      }),
      ...(query.minFee !== undefined || query.maxFee !== undefined
        ? {
            fee: {
              ...(query.minFee !== undefined && { gte: query.minFee }),
              ...(query.maxFee !== undefined && { lte: query.maxFee }),
            },
          }
        : {}),
      ...(minExp !== undefined ? { experienceYears: { gte: minExp } } : {}),
    };

    const orderBy: Prisma.DoctorProfileOrderByWithRelationInput =
      query.sortBy === 'fee'
        ? { fee: 'asc' }
        : query.sortBy === 'experience'
          ? { experienceYears: 'desc' }
          : query.sortBy === 'rating'
            ? { rating: 'desc' }
            : { createdAt: 'desc' };

    const [rows, total] = await Promise.all([
      this.prisma.doctorProfile.findMany({
        where,
        skip,
        take,
        orderBy,
        include: DOCTOR_PROFILE_INCLUDE,
      }),
      this.prisma.doctorProfile.count({ where }),
    ]);

    return { rows, total };
  }

  async countCompletedBookings(doctorId: string): Promise<number> {
    return this.prisma.booking.count({
      where: { doctorId, status: BookingStatus.COMPLETED },
    });
  }

  /**
   * Batched variant of `countCompletedBookings` for list endpoints: one grouped
   * query instead of one COUNT per doctor.
   */
  async countCompletedBookingsByDoctor(doctorIds: string[]): Promise<Map<string, number>> {
    if (doctorIds.length === 0) return new Map();

    const grouped = await this.prisma.booking.groupBy({
      by: ['doctorId'],
      where: { doctorId: { in: doctorIds }, status: BookingStatus.COMPLETED },
      _count: { _all: true },
    });

    return new Map(grouped.map((row) => [row.doctorId, row._count._all]));
  }

  // -- Dashboard -------------------------------------------------------------

  async getDashboardStats(
    doctorId: string,
    startOfDay: Date,
    endOfDay: Date,
    now: Date,
  ) {
    return Promise.all([
      this.prisma.booking.count({ where: { doctorId } }),
      this.prisma.booking.count({
        where: {
          doctorId,
          slotStart: { gte: startOfDay, lte: endOfDay },
          status: { not: BookingStatus.CANCELLED },
        },
      }),
      this.prisma.booking.count({ where: { doctorId, status: BookingStatus.PENDING } }),
      this.prisma.booking.count({ where: { doctorId, status: BookingStatus.COMPLETED } }),
      this.prisma.booking.count({ where: { doctorId, status: BookingStatus.CANCELLED } }),
      this.prisma.booking.count({ where: { doctorId, status: BookingStatus.CONFIRMED } }),
      this.prisma.availability.findMany({
        where: { doctorId, isActive: true },
        select: { dayOfWeek: true },
      }),
      this.prisma.booking.findFirst({
        where: {
          doctorId,
          status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] },
          slotEnd: { gte: now },
        },
        orderBy: { slotStart: 'asc' },
        include: BOOKING_PATIENT_INCLUDE,
      }),
      this.prisma.booking.findMany({
        where: {
          doctorId,
          slotStart: { gte: startOfDay, lte: endOfDay },
        },
        orderBy: { slotStart: 'asc' },
        include: BOOKING_PATIENT_INCLUDE,
      }),
      this.prisma.booking.findMany({
        where: {
          doctorId,
          status: { in: [BookingStatus.COMPLETED, BookingStatus.CONFIRMED] },
        },
        select: { patientId: true },
      }),
    ]);
  }

  // -- User ------------------------------------------------------------------

  async updateUser(userId: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({ where: { id: userId }, data });
  }

  // -- Profile update (transaction) ------------------------------------------

  async updateProfileInTx(
    profileId: string,
    data: Prisma.DoctorProfileUpdateInput,
    specialtyPayload:
      | { mode: 'primary-other'; mainId?: string; otherIds: string[] }
      | { mode: 'list'; ids: string[] }
      | null,
    qualifications:
      | Array<{
          degree: string;
          field?: string | null;
          institute: string;
          passingYear?: number | null;
          result?: string | null;
        }>
      | null,
  ) {
    return this.prisma.$transaction(async (tx) => {
      const txAny = tx as any;

      if (specialtyPayload) {
        await txAny.doctorSpecialty.deleteMany({ where: { doctorId: profileId } });

        if (specialtyPayload.mode === 'primary-other') {
          const { mainId, otherIds } = specialtyPayload;
          const rows = [
            ...(mainId ? [{ doctorId: profileId, specialtyId: mainId, isPrimary: true }] : []),
            ...otherIds
              .filter((id) => id !== mainId)
              .map((id) => ({ doctorId: profileId, specialtyId: id, isPrimary: false })),
          ];
          if (rows.length > 0) await txAny.doctorSpecialty.createMany({ data: rows });
        } else {
          const rows = specialtyPayload.ids.map((id, i) => ({
            doctorId: profileId,
            specialtyId: id,
            isPrimary: i === 0,
          }));
          if (rows.length > 0) await txAny.doctorSpecialty.createMany({ data: rows });
        }
      }

      if (qualifications !== null) {
        await txAny.doctorQualification.deleteMany({ where: { doctorId: profileId } });
        if (qualifications.length > 0) {
          await txAny.doctorQualification.createMany({
            data: qualifications.map((q) => ({ doctorId: profileId, ...q })),
          });
        }
      }

      return txAny.doctorProfile.update({
        where: { id: profileId },
        data,
        include: DOCTOR_PROFILE_INCLUDE,
      });
    });
  }

  // -- Availability ----------------------------------------------------------

  async listAvailability(doctorId: string) {
    return this.prisma.availability.findMany({
      where: { doctorId },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  async findAvailabilityById(id: string) {
    return this.prisma.availability.findUnique({ where: { id } });
  }

  async createAvailability(
    doctorId: string,
    dto: CreateAvailabilityDto,
  ) {
    return this.prisma.availability.create({
      data: {
        doctorId,
        dayOfWeek: dto.dayOfWeek,
        startTime: dto.startTime,
        endTime: dto.endTime,
        consultationDuration: dto.consultationDuration ?? 30,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async updateAvailability(id: string, dto: UpdateAvailabilityDto) {
    return this.prisma.availability.update({ where: { id }, data: dto });
  }

  async deleteAvailability(id: string) {
    return this.prisma.availability.delete({ where: { id } });
  }

  async findActiveAvailabilityByDay(doctorId: string, dayOfWeek: DayOfWeek) {
    return this.prisma.availability.findMany({
      where: { doctorId, dayOfWeek, isActive: true },
      orderBy: { startTime: 'asc' },
    });
  }

  // -- Days Off --------------------------------------------------------------

  async listDaysOff(doctorId: string) {
    return this.prisma.doctorDayOff.findMany({
      where: { doctorId },
      orderBy: { date: 'asc' },
    });
  }

  async upsertDayOff(doctorId: string, date: Date, reason?: string) {
    return this.prisma.doctorDayOff.upsert({
      where: { doctorId_date: { doctorId, date } },
      update: { reason },
      create: { doctorId, date, reason },
    });
  }

  async findDayOffById(id: string) {
    return this.prisma.doctorDayOff.findUnique({ where: { id } });
  }

  async deleteDayOff(id: string) {
    return this.prisma.doctorDayOff.delete({ where: { id } });
  }

  async findDayOffForDate(doctorId: string, date: Date) {
    return this.prisma.doctorDayOff.findFirst({ where: { doctorId, date } });
  }

  async listFutureDaysOff(doctorId: string) {
    return this.prisma.doctorDayOff.findMany({
      where: { doctorId, date: { gte: new Date() } },
      orderBy: { date: 'asc' },
    });
  }

  // -- Document --------------------------------------------------------------

  async createDocument(doctorId: string, docType: string, fileUrl: string) {
    return this.prisma.doctorDocument.create({
      data: { doctorId, docType: docType as any, fileUrl },
    });
  }

  // -- Patients --------------------------------------------------------------

  async listPatientBookings(doctorId: string) {
    return this.prisma.booking.findMany({
      where: { doctorId },
      include: {
        patient: {
          include: { user: true, medicalReports: true },
        },
      },
      orderBy: { slotStart: 'desc' },
    });
  }
}
