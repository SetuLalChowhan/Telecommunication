import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DocumentType } from '@prisma/client';
import { DoctorRepository } from './doctors.repository.js';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto.js';
import { CreateAvailabilityDto } from './dto/create-availability.dto.js';
import { UpdateAvailabilityDto } from './dto/update-availability.dto.js';
import { DoctorQueryDto } from './dto/doctor-query.dto.js';
import { CreateDayOffDto } from './dto/create-day-off.dto.js';
import { createPaginationMeta } from '../common/pagination/pagination.utils.js';
import { slugify } from '../common/utils/slug.utils.js';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service.js';

@Injectable()
export class DoctorService {
  constructor(
    private readonly repo: DoctorRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  // -- Private helpers -------------------------------------------------------

  private async getOwnProfileOrThrow(userId: string) {
    const profile = await this.repo.findProfileByUserId(userId);
    if (!profile) {
      throw new NotFoundException('No doctor profile found for this account');
    }
    return profile;
  }

  private async enrichDoctorWithConsultationStats(doctor: any) {
    if (!doctor) return null;

    const totalPatientsConsulted = await this.repo.countCompletedBookings(doctor.id);

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

  // -- Dashboard -------------------------------------------------------------

  async getDoctorDashboard(userId: string) {
    const profile = await this.getOwnProfileOrThrow(userId);
    const doctorId = profile.id;
    const now = new Date();

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const [
      totalConsultations,
      todayConsultationsCount,
      pendingConfirmationCount,
      completedConsultationsCount,
      cancelledCount,
      confirmedCount,
      activeAvailabilitySlots,
      nextAppointment,
      todaySchedule,
      distinctPatients,
    ] = await this.repo.getDashboardStats(doctorId, startOfDay, endOfDay, now);

    const activeDaysSet = new Set(activeAvailabilitySlots.map((s) => s.dayOfWeek));
    const activeAvailabilityDaysCount = activeDaysSet.size;
    const uniquePatientIds = new Set(distinctPatients.map((b) => b.patientId));
    const totalPatientsCount = uniquePatientIds.size;

    return {
      stats: {
        totalConsultations,
        todayConsultationsCount,
        pendingConfirmationCount,
        completedConsultationsCount,
        cancelledCount,
        confirmedCount,
        totalPatientsCount,
        activeAvailabilityDaysCount,
      },
      nextAppointment,
      todaySchedule,
      activeDaysCount: activeAvailabilityDaysCount,
      verified: profile.verified,
    };
  }

  // -- Profile ---------------------------------------------------------------

  async getMyProfile(userId: string) {
    const profile = await this.getOwnProfileOrThrow(userId);
    const doc = await this.repo.findProfileById(profile.id);
    return this.enrichDoctorWithConsultationStats(doc);
  }

  async updateMyProfile(
    userId: string,
    dto: UpdateDoctorProfileDto,
    file?: Express.Multer.File,
  ) {
    const profile = await this.getOwnProfileOrThrow(userId);

    let imageUrl: string | undefined;

    if (file) {
      const uploadRes = await this.cloudinaryService.uploadFile(
        file,
        'telehealth/avatars',
        {
          transformation: [
            { width: 400, height: 400, crop: 'fill', gravity: 'face' },
          ],
        },
      );
      imageUrl = uploadRes.secureUrl;
      if (profile.user?.image) {
        await this.cloudinaryService.deleteFile(profile.user.image);
      }
    } else if (dto.image) {
      imageUrl = dto.image;
    }

    // User scalar updates
    const userUpdateData: Record<string, any> = {};
    if (dto.name !== undefined) userUpdateData.name = dto.name;
    if (dto.phone !== undefined) userUpdateData.phone = dto.phone;
    if (imageUrl !== undefined) userUpdateData.image = imageUrl;

    if (Object.keys(userUpdateData).length > 0) {
      await this.repo.updateUser(userId, userUpdateData);
    }

    // Specialty resolution
    const targetMainId = dto.mainSpecialtyId || dto.primarySpecialtyId;
    const targetOtherIds = dto.otherSpecialtyIds || [];
    let allSpecialtyIds: string[] = [];

    if (targetMainId || targetOtherIds.length > 0) {
      allSpecialtyIds = Array.from(
        new Set([...(targetMainId ? [targetMainId] : []), ...targetOtherIds]),
      );
    } else if (dto.specialtyIds) {
      allSpecialtyIds = dto.specialtyIds;
    }

    if (allSpecialtyIds.length > 0) {
      const validCount = await this.repo.countActiveSpecialties(allSpecialtyIds);
      if (validCount !== allSpecialtyIds.length) {
        throw new NotFoundException(
          'One or more specialty IDs are invalid or inactive',
        );
      }
    }

    // Slug conflict check
    let sanitizedSlug: string | undefined;
    if (dto.slug) {
      sanitizedSlug = slugify(dto.slug);
      if (await this.repo.findSlugConflict(sanitizedSlug, profile.id)) {
        throw new ConflictException(
          'This doctor slug is already taken. Please choose another.',
        );
      }
    }

    // Build specialty payload
    const specialtyPayload =
      dto.mainSpecialtyId !== undefined ||
      dto.primarySpecialtyId !== undefined ||
      dto.otherSpecialtyIds !== undefined ||
      dto.specialtyIds !== undefined
        ? targetMainId || targetOtherIds.length > 0
          ? ({
              mode: 'primary-other' as const,
              mainId: targetMainId,
              otherIds: targetOtherIds,
            })
          : dto.specialtyIds && dto.specialtyIds.length > 0
            ? ({ mode: 'list' as const, ids: dto.specialtyIds })
            : null
        : null;

    const qualifications = dto.qualifications !== undefined
      ? dto.qualifications.map((q) => ({
          degree: q.degree.trim(),
          field: q.field ? q.field.trim() : null,
          institute: q.institute.trim(),
          passingYear: q.passingYear !== undefined && q.passingYear !== null && !isNaN(Number(q.passingYear))
            ? Number(q.passingYear)
            : null,
          result: q.result ? q.result.trim() : null,
        }))
      : null;

    const profileData: Record<string, any> = {
      ...(dto.bio !== undefined && { bio: dto.bio }),
      ...(dto.experienceYears !== undefined && { experienceYears: dto.experienceYears }),
      ...(dto.fee !== undefined && { fee: dto.fee }),
      ...(dto.bmdcNumber !== undefined && { bmdcNumber: dto.bmdcNumber }),
      ...(dto.designation !== undefined && { designation: dto.designation }),
      ...(dto.hospitalAffiliation !== undefined && { hospitalAffiliation: dto.hospitalAffiliation }),
      ...(dto.clinicAddress !== undefined && { clinicAddress: dto.clinicAddress }),
      ...(sanitizedSlug && { slug: sanitizedSlug }),
    };

    const updatedProfile = await this.repo.updateProfileInTx(
      profile.id,
      profileData,
      specialtyPayload,
      qualifications,
    );

    return this.enrichDoctorWithConsultationStats(updatedProfile);
  }

  // -- Public listing --------------------------------------------------------

  async listPublicDoctors(query: DoctorQueryDto) {
    const { rows, total } = await this.repo.listPublicDoctors(query);

    const enriched = await Promise.all(
      rows.map((doc) => this.enrichDoctorWithConsultationStats(doc)),
    );

    return {
      data: enriched,
      meta: createPaginationMeta(query.page || 1, query.limit || 10, total),
    };
  }

  async getPublicDoctorById(idOrSlug: string) {
    const doctor = await this.repo.findPublicDoctor(idOrSlug);

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return this.enrichDoctorWithConsultationStats(doctor);
  }

  // -- Availability ----------------------------------------------------------

  async listMyAvailability(userId: string) {
    const profile = await this.getOwnProfileOrThrow(userId);
    return this.repo.listAvailability(profile.id);
  }

  async createAvailability(userId: string, dto: CreateAvailabilityDto) {
    const profile = await this.getOwnProfileOrThrow(userId);

    if (dto.startTime >= dto.endTime) {
      throw new ForbiddenException('startTime must be earlier than endTime');
    }

    return this.repo.createAvailability(profile.id, dto);
  }

  async updateAvailability(
    userId: string,
    availabilityId: string,
    dto: UpdateAvailabilityDto,
  ) {
    const profile = await this.getOwnProfileOrThrow(userId);
    await this.assertOwnsAvailability(profile.id, availabilityId);
    return this.repo.updateAvailability(availabilityId, dto);
  }

  async deleteAvailability(userId: string, availabilityId: string) {
    const profile = await this.getOwnProfileOrThrow(userId);
    await this.assertOwnsAvailability(profile.id, availabilityId);
    return this.repo.deleteAvailability(availabilityId);
  }

  private async assertOwnsAvailability(doctorId: string, availabilityId: string) {
    const row = await this.repo.findAvailabilityById(availabilityId);
    if (!row || row.doctorId !== doctorId) {
      throw new NotFoundException('Availability slot not found');
    }
  }

  async getPublicDoctorAvailability(idOrSlug: string) {
    const doctor = await this.getPublicDoctorById(idOrSlug);
    return this.repo.listAvailability(doctor.id);
  }

  // -- Days Off --------------------------------------------------------------

  async listMyDaysOff(userId: string) {
    const profile = await this.getOwnProfileOrThrow(userId);
    return this.repo.listDaysOff(profile.id);
  }

  async createDayOff(userId: string, dto: CreateDayOffDto) {
    const profile = await this.getOwnProfileOrThrow(userId);
    return this.repo.upsertDayOff(profile.id, new Date(dto.date), dto.reason);
  }

  async deleteDayOff(userId: string, dayOffId: string) {
    const profile = await this.getOwnProfileOrThrow(userId);
    const dayOff = await this.repo.findDayOffById(dayOffId);

    if (!dayOff || dayOff.doctorId !== profile.id) {
      throw new NotFoundException('Day off entry not found');
    }

    return this.repo.deleteDayOff(dayOffId);
  }

  async getPublicDoctorDaysOff(idOrSlug: string) {
    const doctor = await this.getPublicDoctorById(idOrSlug);
    return this.repo.listFutureDaysOff(doctor.id);
  }

  // -- Document upload -------------------------------------------------------

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

    return this.repo.createDocument(profile.id, docType, uploadRes.secureUrl);
  }

  // -- Patients --------------------------------------------------------------

  async listMyPatients(userId: string, search?: string) {
    const profile = await this.getOwnProfileOrThrow(userId);
    const bookings = await this.repo.listPatientBookings(profile.id);

    const patientMap = new Map<string, any>();

    for (const b of bookings) {
      if (!b.patient) continue;
      const pid = b.patient.id;
      if (!patientMap.has(pid)) {
        patientMap.set(pid, {
          patientId: b.patient.id,
          name: b.patient.user.name || 'Patient',
          email: b.patient.user.email,
          phone:
            b.patient.user.phone ||
            (b.patient as any).emergencyContactPhone ||
            'N/A',
          gender: (b.patient as any).gender || 'OTHER',
          bloodGroup: (b.patient as any).bloodGroup || 'N/A',
          image: b.patient.user.image,
          address: (b.patient as any).address,
          emergencyContactName: (b.patient as any).emergencyContactName,
          lastConsultation: b.slotStart,
          lastCondition: b.notes || 'Routine Consultation',
          consultationCount: 1,
          reportsCount: (b.patient as any).medicalReports?.length || 0,
        });
      } else {
        patientMap.get(pid).consultationCount += 1;
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
