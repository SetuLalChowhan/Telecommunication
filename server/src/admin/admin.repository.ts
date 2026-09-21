import { Injectable } from '@nestjs/common';
import { DocumentStatus } from '@prisma/client';
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
}
