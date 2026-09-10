import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DocumentStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { AdminDoctorQueryDto } from './dto/admin-doctor-query.dto.js';
import { RejectDoctorDto } from './dto/reject-doctor.dto.js';
import {
  createPaginationMeta,
  getPaginationParams,
} from '../common/pagination/pagination.utils.js';

const ADMIN_DOCTOR_INCLUDE = {
  user: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      createdAt: true,
    },
  },
  specialties: { include: { specialty: true } },
  documents: {
    orderBy: { uploadedAt: 'desc' as const },
  },
  verifiedBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  _count: {
    select: { bookings: true },
  },
} as const;

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async listDoctors(query: AdminDoctorQueryDto = {}) {
    const { skip, take } = getPaginationParams(query.page, query.limit);

    const where = {
      ...(query.verified !== undefined ? { verified: query.verified } : {}),
      ...(query.search
        ? {
            user: {
              name: { contains: query.search, mode: 'insensitive' as const },
            },
          }
        : {}),
    };

    const [doctors, total] = await Promise.all([
      this.prisma.doctorProfile.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: ADMIN_DOCTOR_INCLUDE,
      }),
      this.prisma.doctorProfile.count({ where }),
    ]);

    return {
      data: doctors,
      meta: createPaginationMeta(query.page || 1, query.limit || 10, total),
    };
  }

  async listPendingDoctors(query: AdminDoctorQueryDto = {}) {
    return this.listDoctors({ ...query, verified: false });
  }

  async getDoctorDetails(doctorId: string) {
    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { id: doctorId },
      include: {
        ...ADMIN_DOCTOR_INCLUDE,
        availability: true,
        daysOff: true,
      },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID "${doctorId}" not found`);
    }

    return doctor;
  }

  async approveDoctor(doctorId: string, adminUserId: string) {
    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { id: doctorId },
      include: { documents: true },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID "${doctorId}" not found`);
    }

    return this.prisma.$transaction(async (tx) => {
      // Mark all pending documents as APPROVED
      await tx.doctorDocument.updateMany({
        where: { doctorId, status: DocumentStatus.PENDING },
        data: { status: DocumentStatus.APPROVED },
      });

      return tx.doctorProfile.update({
        where: { id: doctorId },
        data: {
          verified: true,
          verifiedAt: new Date(),
          verifiedById: adminUserId,
        },
        include: ADMIN_DOCTOR_INCLUDE,
      });
    });
  }

  async rejectDoctor(
    doctorId: string,
    adminUserId: string,
    _dto: RejectDoctorDto,
  ) {
    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { id: doctorId },
    });

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID "${doctorId}" not found`);
    }

    return this.prisma.$transaction(async (tx) => {
      // Mark all documents as REJECTED
      await tx.doctorDocument.updateMany({
        where: { doctorId },
        data: { status: DocumentStatus.REJECTED },
      });

      return tx.doctorProfile.update({
        where: { id: doctorId },
        data: {
          verified: false,
          verifiedAt: null,
          verifiedById: null,
        },
        include: ADMIN_DOCTOR_INCLUDE,
      });
    });
  }

  async updateDocumentStatus(documentId: string, status: DocumentStatus) {
    const doc = await this.prisma.doctorDocument.findUnique({
      where: { id: documentId },
    });

    if (!doc) {
      throw new NotFoundException(`Document with ID "${documentId}" not found`);
    }

    return this.prisma.doctorDocument.update({
      where: { id: documentId },
      data: { status },
    });
  }

  async getDashboardMetrics() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const [
      totalUsers,
      totalDoctors,
      verifiedDoctors,
      pendingDoctors,
      totalPatients,
      totalSpecialties,
      totalBookings,
      todayBookings,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.doctorProfile.count(),
      this.prisma.doctorProfile.count({ where: { verified: true } }),
      this.prisma.doctorProfile.count({ where: { verified: false } }),
      this.prisma.patientProfile.count(),
      this.prisma.specialty.count({ where: { isActive: true } }),
      this.prisma.booking.count(),
      this.prisma.booking.count({
        where: {
          slotStart: {
            gte: today,
            lt: tomorrow,
          },
        },
      }),
    ]);

    return {
      totalUsers,
      totalDoctors,
      verifiedDoctors,
      pendingDoctors,
      totalPatients,
      totalSpecialties,
      totalBookings,
      todayBookings,
    };
  }
}
