import { Injectable, NotFoundException } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto.js';

const PATIENT_PROFILE_INCLUDE = {
  user: {
    select: {
      id: true,
      name: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      image: true,
      dateOfBirth: true,
      role: true,
      createdAt: true,
    },
  },
  _count: {
    select: {
      bookings: true,
      medicalReports: true,
    },
  },
} as const;

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getOwnProfileOrThrow(userId: string) {
    let profile = await this.prisma.patientProfile.findUnique({
      where: { userId },
      include: PATIENT_PROFILE_INCLUDE,
    });

    // In case profile was not created by hook
    if (!profile) {
      profile = await this.prisma.patientProfile.create({
        data: { userId },
        include: PATIENT_PROFILE_INCLUDE,
      });
    }

    return profile;
  }

  async getMyProfile(userId: string) {
    return this.getOwnProfileOrThrow(userId);
  }

  async updateMyProfile(userId: string, dto: UpdatePatientProfileDto) {
    const profile = await this.getOwnProfileOrThrow(userId);

    return this.prisma.patientProfile.update({
      where: { id: profile.id },
      data: {
        address: dto.address,
        gender: dto.gender,
        bloodGroup: dto.bloodGroup,
        emergencyContactName: dto.emergencyContactName,
        emergencyContactPhone: dto.emergencyContactPhone,
      },
      include: PATIENT_PROFILE_INCLUDE,
    });
  }

  async getPatientById(patientId: string) {
    const patient = await this.prisma.patientProfile.findUnique({
      where: { id: patientId },
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
        medicalReports: {
          orderBy: { uploadedAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID "${patientId}" not found`);
    }

    return patient;
  }

  /**
   * Fetches patient dashboard data:
   * - Aggregated consultation & record stats
   * - Immediate upcoming / active consultation
   * - Recent consultation list
   * - Top recommended doctors
   */
  async getPatientDashboard(userId: string) {
    const profile = await this.getOwnProfileOrThrow(userId);
    const patientId = profile.id;
    const now = new Date();

    const [
      totalConsultations,
      upcomingCount,
      pendingCount,
      completedCount,
      cancelledCount,
      medicalReportsCount,
      nextUpcomingBooking,
      recentBookings,
      topDoctors,
    ] = await Promise.all([
      // 1. Total consultations
      this.prisma.booking.count({ where: { patientId } }),

      // 2. Confirmed upcoming consultations
      this.prisma.booking.count({
        where: {
          patientId,
          status: BookingStatus.CONFIRMED,
          slotEnd: { gte: now },
        },
      }),

      // 3. Pending consultations awaiting doctor confirmation
      this.prisma.booking.count({
        where: {
          patientId,
          status: BookingStatus.PENDING,
        },
      }),

      // 4. Completed consultations
      this.prisma.booking.count({
        where: {
          patientId,
          status: BookingStatus.COMPLETED,
        },
      }),

      // 5. Cancelled consultations
      this.prisma.booking.count({
        where: {
          patientId,
          status: BookingStatus.CANCELLED,
        },
      }),

      // 6. Medical records count
      this.prisma.medicalReport.count({
        where: { patientId },
      }),

      // 7. Earliest active upcoming consultation
      this.prisma.booking.findFirst({
        where: {
          patientId,
          status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] },
          slotEnd: { gte: now },
        },
        orderBy: { slotStart: 'asc' },
        include: {
          doctor: {
            include: {
              user: {
                select: { id: true, name: true, image: true, email: true, phone: true },
              },
              specialties: { include: { specialty: true } },
              qualifications: true,
            },
          },
        },
      }),

      // 8. Recent consultations (last 6)
      this.prisma.booking.findMany({
        where: { patientId },
        orderBy: { slotStart: 'desc' },
        take: 6,
        include: {
          doctor: {
            include: {
              user: {
                select: { id: true, name: true, image: true, email: true, phone: true },
              },
              specialties: { include: { specialty: true } },
              qualifications: true,
            },
          },
        },
      }),

      // 9. Recommended top verified doctors
      this.prisma.doctorProfile.findMany({
        where: { verified: true },
        take: 4,
        orderBy: { rating: 'desc' },
        include: {
          user: {
            select: { id: true, name: true, image: true },
          },
          specialties: { include: { specialty: true } },
        },
      }),
    ]);

    // Fallback: if no future booking, check if any active booking exists
    let nextConsultationRaw = nextUpcomingBooking;
    if (!nextConsultationRaw) {
      nextConsultationRaw = await this.prisma.booking.findFirst({
        where: {
          patientId,
          status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] },
        },
        orderBy: { slotStart: 'desc' },
        include: {
          doctor: {
            include: {
              user: {
                select: { id: true, name: true, image: true, email: true, phone: true },
              },
              specialties: { include: { specialty: true } },
              qualifications: true,
            },
          },
        },
      });
    }

    const formatConsultation = (b: typeof nextUpcomingBooking) => {
      if (!b) return null;
      const start = new Date(b.slotStart);

      const isToday =
        start.getUTCFullYear() === now.getUTCFullYear() &&
        start.getUTCMonth() === now.getUTCMonth() &&
        start.getUTCDate() === now.getUTCDate();

      const tomorrow = new Date(now);
      tomorrow.setUTCDate(now.getUTCDate() + 1);
      const isTomorrow =
        start.getUTCFullYear() === tomorrow.getUTCFullYear() &&
        start.getUTCMonth() === tomorrow.getUTCMonth() &&
        start.getUTCDate() === tomorrow.getUTCDate();

      let dateFormatted = start.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      if (isToday) dateFormatted = 'Today';
      else if (isTomorrow) dateFormatted = 'Tomorrow';

      const timeFormatted = start.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      const doctor = b.doctor;
      const doctorName = doctor?.user?.name || 'Dr. Specialist';
      const primarySpecialty =
        doctor?.specialties?.find((s) => s.isPrimary)?.specialty?.name ||
        doctor?.specialties?.[0]?.specialty?.name ||
        'Specialist';

      const doctorDegrees =
        doctor?.qualifications?.map((q) => q.degree).filter(Boolean) || [];

      return {
        id: b.id,
        doctorId: doctor?.id,
        doctorSlug: doctor?.slug,
        doctorName,
        doctorSpecialty: primarySpecialty,
        doctorAvatar: doctor?.user?.image || '/images/doctor-placeholder.jpg',
        doctorHospital: doctor?.hospitalAffiliation || '',
        doctorDegrees,
        slotStart: b.slotStart.toISOString(),
        slotEnd: b.slotEnd.toISOString(),
        dateFormatted,
        timeFormatted,
        consultationType: 'Video Consultation' as const,
        status: b.status,
        meetLink: b.meetLink || null,
        notes: b.notes || null,
        fee: Number(doctor?.fee || 0),
        isToday,
      };
    };

    const nextConsultation = formatConsultation(nextConsultationRaw);
    const recentConsultations = recentBookings.map((b) => formatConsultation(b)).filter(Boolean);

    const recommendedDoctors = topDoctors.map((doc) => {
      const primarySpecialty =
        doc.specialties.find((s) => s.isPrimary)?.specialty?.name ||
        doc.specialties[0]?.specialty?.name ||
        'Specialist';

      return {
        id: doc.id,
        slug: doc.slug,
        name: doc.user.name,
        specialty: primarySpecialty,
        hospital: doc.hospitalAffiliation || '',
        rating: Number(doc.rating) || 5.0,
        fee: Number(doc.fee) || 0,
        experienceYears: doc.experienceYears || 0,
        avatar: doc.user.image || '/images/doctor-placeholder.jpg',
      };
    });

    return {
      stats: {
        totalConsultations,
        upcomingConsultations: upcomingCount,
        pendingConsultations: pendingCount,
        completedConsultations: completedCount,
        cancelledConsultations: cancelledCount,
        medicalReportsCount,
      },
      nextConsultation,
      recentConsultations,
      recommendedDoctors,
    };
  }
}
