import { Injectable } from '@nestjs/common';
import { BookingStatus, DocumentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  createPaginationMeta,
  getPaginationParams,
} from '../common/pagination/pagination.utils.js';

const ADMIN_DOCTOR_INCLUDE = {
  user: {
    select: { id: true, name: true, email: true, phone: true, image: true, createdAt: true },
  },
  specialties: { include: { specialty: true } },
  documents: { orderBy: { uploadedAt: 'desc' as const } },
  verifiedBy: { select: { id: true, name: true, email: true } },
  _count: { select: { bookings: true } },
} as const;

@Injectable()
export class AdminRepository {
  constructor(private readonly prisma: PrismaService) {}

  // -- Doctors ---------------------------------------------------------------

  async findDoctors(query: { search?: string; verified?: boolean; page?: number; limit?: number }) {
    const { skip, take } = getPaginationParams(query.page, query.limit);
    const where = {
      ...(query.verified !== undefined ? { verified: query.verified } : {}),
      ...(query.search
        ? { user: { name: { contains: query.search, mode: 'insensitive' as const } } }
        : {}),
    };

    const [rows, total] = await Promise.all([
      this.prisma.doctorProfile.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, include: ADMIN_DOCTOR_INCLUDE }),
      this.prisma.doctorProfile.count({ where }),
    ]);

    return { rows, total };
  }

  async findDoctorById(doctorId: string) {
    return this.prisma.doctorProfile.findUnique({
      where: { id: doctorId },
      include: { ...ADMIN_DOCTOR_INCLUDE, availability: true, daysOff: true },
    });
  }

  async updateDoctor(
    doctorId: string,
    data: {
      experienceYears?: number;
      fee?: number;
      bio?: string;
      bmdcNumber?: string;
      designation?: string;
      hospitalAffiliation?: string;
      clinicAddress?: string;
      slug?: string;
    },
  ) {
    return this.prisma.doctorProfile.update({
      where: { id: doctorId },
      data,
      include: { ...ADMIN_DOCTOR_INCLUDE, availability: true, daysOff: true },
    });
  }

  /**
   * Removes a doctor and everything that depends on them.
   * Bookings restrict deletion, so they are cleared first (their reviews cascade
   * and their reports have their booking link nulled by the schema).
   */
  async deleteDoctor(doctorId: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.booking.deleteMany({ where: { doctorId } });
      await tx.doctorProfile.delete({ where: { id: doctorId } });
      return { id: doctorId };
    });
  }

  async findDoctorWithDocs(doctorId: string) {
    return this.prisma.doctorProfile.findUnique({
      where: { id: doctorId },
      include: { documents: true },
    });
  }

  async approveDoctorInTx(doctorId: string, adminUserId: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.doctorDocument.updateMany({
        where: { doctorId, status: DocumentStatus.PENDING },
        data: { status: DocumentStatus.APPROVED },
      });
      return tx.doctorProfile.update({
        where: { id: doctorId },
        data: { verified: true, verifiedAt: new Date(), verifiedById: adminUserId },
        include: ADMIN_DOCTOR_INCLUDE,
      });
    });
  }

  async rejectDoctorInTx(doctorId: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.doctorDocument.updateMany({
        where: { doctorId },
        data: { status: DocumentStatus.REJECTED },
      });
      return tx.doctorProfile.update({
        where: { id: doctorId },
        data: { verified: false, verifiedAt: null, verifiedById: null },
        include: ADMIN_DOCTOR_INCLUDE,
      });
    });
  }

  async findDocumentById(documentId: string) {
    return this.prisma.doctorDocument.findUnique({ where: { id: documentId } });
  }

  async updateDocumentStatus(documentId: string, status: DocumentStatus) {
    return this.prisma.doctorDocument.update({ where: { id: documentId }, data: { status } });
  }

  // -- Dashboard -------------------------------------------------------------

  async getDashboardMetrics(today: Date, tomorrow: Date) {
    return Promise.all([
      this.prisma.user.count(),
      this.prisma.doctorProfile.count(),
      this.prisma.doctorProfile.count({ where: { verified: true } }),
      this.prisma.doctorProfile.count({ where: { verified: false } }),
      this.prisma.patientProfile.count(),
      this.prisma.specialty.count({ where: { isActive: true } }),
      this.prisma.booking.count(),
      this.prisma.booking.count({ where: { slotStart: { gte: today, lt: tomorrow } } }),
    ]);
  }

  // -- Patients --------------------------------------------------------------

  async findPatients(query: { search?: string; page?: number; limit?: number }) {
    const { skip, take } = getPaginationParams(query.page, query.limit);
    const where = query.search
      ? { user: { name: { contains: query.search, mode: 'insensitive' as const } } }
      : {};

    const [rows, total] = await Promise.all([
      this.prisma.patientProfile.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true, image: true, createdAt: true } },
          _count: { select: { bookings: true, medicalReports: true } },
        },
      }),
      this.prisma.patientProfile.count({ where }),
    ]);

    return { rows, total };
  }

  async findPatientById(patientId: string) {
    return this.prisma.patientProfile.findUnique({
      where: { id: patientId },
      include: {
        user: true,
        bookings: {
          orderBy: { slotStart: 'desc' },
          take: 10,
          include: { doctor: { include: { user: { select: { name: true, email: true } } } } },
        },
        medicalReports: { orderBy: { uploadedAt: 'desc' } },
      },
    });
  }

  async findPatientWithUser(patientId: string) {
    return this.prisma.patientProfile.findUnique({
      where: { id: patientId },
      select: { id: true, userId: true },
    });
  }

  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email }, select: { id: true } });
  }

  async updatePatient(
    patientId: string,
    userId: string,
    userData: Record<string, unknown>,
    profileData: Record<string, unknown>,
  ) {
    await this.prisma.$transaction(async (tx) => {
      if (Object.keys(userData).length > 0) {
        await tx.user.update({ where: { id: userId }, data: userData });
      }
      if (Object.keys(profileData).length > 0) {
        await tx.patientProfile.update({ where: { id: patientId }, data: profileData });
      }
    });

    return this.findPatientById(patientId);
  }

  /**
   * Deletes a patient account. The patient's bookings restrict deletion, so they
   * are removed first; the linked user cascades the profile and medical reports.
   */
  async deletePatient(patientId: string, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      await tx.booking.deleteMany({ where: { patientId } });
      await tx.user.delete({ where: { id: userId } });
      return { id: patientId };
    });
  }

  // -- Appointments ----------------------------------------------------------

  async findAppointments(query: { status?: any; doctorId?: string; patientId?: string; page?: number; limit?: number }) {
    const { skip, take } = getPaginationParams(query.page, query.limit);
    const where: any = {};
    if (query.status) where.status = query.status;
    if (query.doctorId) where.doctorId = query.doctorId;
    if (query.patientId) where.patientId = query.patientId;

    const [rows, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take,
        orderBy: { slotStart: 'desc' },
        include: {
          doctor: { include: { user: { select: { name: true, email: true, phone: true } } } },
          patient: { include: { user: { select: { name: true, email: true, phone: true } } } },
          reports: true,
          review: true,
        },
      }),
      this.prisma.booking.count({ where }),
    ]);

    return { rows, total };
  }

  async findBookingById(bookingId: string) {
    return this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        doctor: { include: { user: { select: { name: true, email: true, phone: true } } } },
        patient: { include: { user: { select: { name: true, email: true, phone: true } } } },
        reports: true,
        review: true,
      },
    });
  }

  async updateBooking(
    bookingId: string,
    data: { status?: BookingStatus; notes?: string; meetLink?: string },
  ) {
    return this.prisma.booking.update({
      where: { id: bookingId },
      data,
      include: {
        doctor: { include: { user: { select: { name: true, email: true, phone: true } } } },
        patient: { include: { user: { select: { name: true, email: true, phone: true } } } },
        reports: true,
        review: true,
      },
    });
  }

  async deleteBooking(bookingId: string) {
    return this.prisma.booking.delete({ where: { id: bookingId } });
  }

  // -- Reviews ---------------------------------------------------------------

  async findReviews(query: { doctorId?: string; page?: number; limit?: number }) {
    const { skip, take } = getPaginationParams(query.page, query.limit);
    const where = query.doctorId ? { booking: { doctorId: query.doctorId } } : {};

    const [rows, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          booking: {
            select: {
              slotStart: true,
              doctor: { include: { user: { select: { name: true } } } },
              patient: { include: { user: { select: { name: true } } } },
            },
          },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    return { rows, total };
  }

  /**
   * Deletes a review and recomputes the affected doctor's rating aggregate so
   * the public profile never shows a stale score.
   */
  async deleteReview(reviewId: string) {
    return this.prisma.$transaction(async (tx) => {
      const review = await tx.review.findUnique({
        where: { id: reviewId },
        include: { booking: { select: { doctorId: true } } },
      });
      if (!review) return null;

      await tx.review.delete({ where: { id: reviewId } });

      const doctorId = review.booking.doctorId;
      const aggregate = await tx.review.aggregate({
        where: { booking: { doctorId } },
        _avg: { rating: true },
        _count: { _all: true },
      });

      await tx.doctorProfile.update({
        where: { id: doctorId },
        data: {
          rating: aggregate._avg.rating ?? 0,
          totalReviews: aggregate._count._all,
        },
      });

      return { id: reviewId };
    });
  }
}
