import {
  BadRequestException,
  ConflictException,
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
import { generateDoctorSlug, slugify } from '../common/utils/slug.utils.js';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service.js';

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

@Injectable()
export class DoctorService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private async getOwnProfileOrThrow(userId: string) {
    const profile = await this.prisma.doctorProfile.findUnique({
      where: { userId },
      include: { user: true },
    });

    if (!profile) {
      throw new NotFoundException(
        'No doctor profile found for this account',
      );
    }

    return profile;
  }

  private async enrichDoctorWithConsultationStats(doctor: any) {
    if (!doctor) return null;

    const totalPatientsConsulted = await this.prisma.booking.count({
      where: {
        doctorId: doctor.id,
        status: 'COMPLETED',
      },
    });

    const mainSpecialtyItem =
      doctor.specialties?.find((s: any) => s.isPrimary) ||
      doctor.specialties?.[0];

    const mainSpecialty = mainSpecialtyItem?.specialty || null;

    const otherSpecialties =
      doctor.specialties
        ?.filter(
          (s: any) =>
            !s.isPrimary && s.specialtyId !== mainSpecialtyItem?.specialtyId,
        )
        ?.map((s: any) => s.specialty) || [];

    return {
      ...doctor,
      totalPatientsConsulted,
      mainSpecialty,
      otherSpecialties,
    };
  }

  async getMyProfile(userId: string) {
    const profile = await this.getOwnProfileOrThrow(userId);

    const doc = await this.prisma.doctorProfile.findUnique({
      where: { id: profile.id },
      include: DOCTOR_PROFILE_INCLUDE,
    });

    return this.enrichDoctorWithConsultationStats(doc);
  }

  async updateMyProfile(userId: string, dto: UpdateDoctorProfileDto) {
    const profile = await this.getOwnProfileOrThrow(userId);

    // 1. Gather all specialty IDs to validate
    const targetMainId = dto.mainSpecialtyId;
    const targetOtherIds = dto.otherSpecialtyIds || [];
    let allSpecialtyIds: string[] = [];

    if (targetMainId || targetOtherIds.length > 0) {
      allSpecialtyIds = Array.from(
        new Set([
          ...(targetMainId ? [targetMainId] : []),
          ...targetOtherIds,
        ]),
      );
    } else if (dto.specialtyIds) {
      allSpecialtyIds = dto.specialtyIds;
    }

    if (allSpecialtyIds.length > 0) {
      const validCount = await this.prisma.specialty.count({
        where: { id: { in: allSpecialtyIds }, isActive: true },
      });
      if (validCount !== allSpecialtyIds.length) {
        throw new NotFoundException(
          'One or more specialty IDs are invalid or inactive',
        );
      }
    }

    let sanitizedSlug: string | undefined = undefined;
    if (dto.slug) {
      sanitizedSlug = slugify(dto.slug);
      const existing = await this.prisma.doctorProfile.findFirst({
        where: {
          slug: sanitizedSlug,
          id: { not: profile.id },
        },
      });
      if (existing) {
        throw new ConflictException(
          'This doctor slug is already taken. Please choose another.',
        );
      }
    }

    const updatedProfile = await this.prisma.$transaction(async (tx) => {
      // Manage Specialties
      if (
        dto.mainSpecialtyId !== undefined ||
        dto.otherSpecialtyIds !== undefined ||
        dto.specialtyIds !== undefined
      ) {
        await (tx as any).doctorSpecialty.deleteMany({
          where: { doctorId: profile.id },
        });

        if (targetMainId || targetOtherIds.length > 0) {
          const specialtyData = [
            ...(targetMainId
              ? [{ doctorId: profile.id, specialtyId: targetMainId, isPrimary: true }]
              : []),
            ...targetOtherIds
              .filter((id) => id !== targetMainId)
              .map((id) => ({
                doctorId: profile.id,
                specialtyId: id,
                isPrimary: false,
              })),
          ];

          if (specialtyData.length > 0) {
            await (tx as any).doctorSpecialty.createMany({
              data: specialtyData,
            });
          }
        } else if (dto.specialtyIds && dto.specialtyIds.length > 0) {
          await (tx as any).doctorSpecialty.createMany({
            data: dto.specialtyIds.map((specialtyId, index) => ({
              doctorId: profile.id,
              specialtyId,
              isPrimary: index === 0,
            })),
          });
        }
      }

      // Manage Qualifications
      if (dto.qualifications !== undefined) {
        await (tx as any).doctorQualification.deleteMany({
          where: { doctorId: profile.id },
        });

        if (dto.qualifications.length > 0) {
          await (tx as any).doctorQualification.createMany({
            data: dto.qualifications.map((q) => ({
              doctorId: profile.id,
              degree: q.degree,
              field: q.field,
              institute: q.institute,
              passingYear: q.passingYear,
              result: q.result,
            })),
          });
        }
      }

      return (tx as any).doctorProfile.update({
        where: { id: profile.id },
        data: {
          ...(dto.bio !== undefined ? { bio: dto.bio } : {}),
          ...(dto.experienceYears !== undefined
            ? { experienceYears: dto.experienceYears }
            : {}),
          ...(dto.fee !== undefined ? { fee: dto.fee } : {}),
          ...(dto.bmdcNumber !== undefined ? { bmdcNumber: dto.bmdcNumber } : {}),
          ...(dto.designation !== undefined
            ? { designation: dto.designation }
            : {}),
          ...(dto.hospitalAffiliation !== undefined
            ? { hospitalAffiliation: dto.hospitalAffiliation }
            : {}),
          ...(dto.clinicAddress !== undefined
            ? { clinicAddress: dto.clinicAddress }
            : {}),
          ...(sanitizedSlug ? { slug: sanitizedSlug } : {}),
        },
        include: DOCTOR_PROFILE_INCLUDE,
      });
    });

    return this.enrichDoctorWithConsultationStats(updatedProfile);
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

    const uploadRes = await this.cloudinaryService.uploadFile(
      file,
      'telehealth/documents',
      { resourceType: 'auto' },
    );

    return this.prisma.doctorDocument.create({
      data: {
        doctorId: profile.id,
        docType,
        fileUrl: uploadRes.secureUrl,
      },
    });
  }

  /**
   * Public search — only ever returns verified doctors.
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

    const enrichedDoctors = await Promise.all(
      doctors.map((doc) => this.enrichDoctorWithConsultationStats(doc)),
    );

    return {
      data: enrichedDoctors,
      meta: createPaginationMeta(query.page || 1, query.limit || 10, total),
    };
  }

  /**
   * Public doctor profile lookup by either CUID ID or SEO slug
   */
  async getPublicDoctorById(idOrSlug: string) {
    const doctor = await this.prisma.doctorProfile.findFirst({
      where: {
        verified: true,
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: DOCTOR_PROFILE_INCLUDE,
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return this.enrichDoctorWithConsultationStats(doctor);
  }

  async listMyDaysOff(userId: string) {
    const profile = await this.getOwnProfileOrThrow(userId);
    return this.prisma.doctorDayOff.findMany({
      where: { doctorId: profile.id },
      orderBy: { date: 'asc' },
    });
  }

  async createDayOff(userId: string, dto: CreateDayOffDto) {
    const profile = await this.getOwnProfileOrThrow(userId);
    const dateObj = new Date(dto.date);

    return this.prisma.doctorDayOff.upsert({
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
    const dayOff = await this.prisma.doctorDayOff.findUnique({
      where: { id: dayOffId },
    });

    if (!dayOff || dayOff.doctorId !== profile.id) {
      throw new NotFoundException('Day off entry not found');
    }

    return this.prisma.doctorDayOff.delete({
      where: { id: dayOffId },
    });
  }

  async getPublicDoctorAvailability(idOrSlug: string) {
    const doctor = await this.getPublicDoctorById(idOrSlug);

    return this.prisma.availability.findMany({
      where: { doctorId: doctor.id, isActive: true },
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
    });
  }

  async getPublicDoctorDaysOff(idOrSlug: string) {
    const doctor = await this.getPublicDoctorById(idOrSlug);

    return this.prisma.doctorDayOff.findMany({
      where: {
        doctorId: doctor.id,
        date: { gte: new Date() },
      },
      orderBy: { date: 'asc' },
    });
  }

  async listMyPatients(userId: string, search?: string) {
    const profile = await this.getOwnProfileOrThrow(userId);

    const bookings = await this.prisma.booking.findMany({
      where: { doctorId: profile.id },
      include: {
        patient: {
          include: {
            user: true,
            medicalReports: true,
          },
        },
      },
      orderBy: { slotStart: 'desc' },
    });

    const patientMap = new Map<string, any>();

    for (const b of bookings) {
      if (!b.patient) continue;
      const pid = b.patient.id;
      if (!patientMap.has(pid)) {
        patientMap.set(pid, {
          patientId: b.patient.id,
          name: b.patient.user.name || 'Patient',
          email: b.patient.user.email,
          phone: b.patient.user.phone || b.patient.emergencyContactPhone || 'N/A',
          gender: b.patient.gender || 'OTHER',
          bloodGroup: b.patient.bloodGroup || 'N/A',
          image: b.patient.user.image,
          address: b.patient.address,
          emergencyContactName: b.patient.emergencyContactName,
          lastConsultation: b.slotStart,
          lastCondition: b.notes || 'Routine Consultation',
          consultationCount: 1,
          reportsCount: b.patient.medicalReports?.length || 0,
        });
      } else {
        const existing = patientMap.get(pid);
        existing.consultationCount += 1;
      }
    }

    let result = Array.from(patientMap.values());
    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.phone.toLowerCase().includes(q) ||
          p.lastCondition.toLowerCase().includes(q),
      );
    }

    return result;
  }
}