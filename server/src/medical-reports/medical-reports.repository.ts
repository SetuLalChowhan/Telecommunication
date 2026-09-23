import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  getPaginationParams,
} from '../common/pagination/pagination.utils.js';
import { PaginationDto } from '../common/pagination/pagination.dto.js';

const REPORT_INCLUDE = {
  booking: {
    select: {
      id: true,
      slotStart: true,
      status: true,
      doctor: {
        select: {
          id: true,
          slug: true,
          designation: true,
          hospitalAffiliation: true,
          user: { select: { name: true, email: true, image: true } },
          specialties: { include: { specialty: true } },
        },
      },
    },
  },
} as const;

@Injectable()
export class MedicalReportsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreatePatient(userId: string) {
    let patient = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patient) {
      patient = await this.prisma.patientProfile.create({ data: { userId } });
    }
    return patient;
  }

  async findBookingForDoctor(bookingId: string) {
    return this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { doctor: true },
    });
  }

  async findBookingById(bookingId: string) {
    return this.prisma.booking.findUnique({ where: { id: bookingId } });
  }

  async createReport(data: {
    patientId: string;
    bookingId?: string | null;
    fileUrl: string;
    fileName: string;
  }) {
    return this.prisma.medicalReport.create({
      data: {
        patientId: data.patientId,
        bookingId: data.bookingId || null,
        fileUrl: data.fileUrl,
        fileName: data.fileName,
      },
      include: REPORT_INCLUDE,
    });
  }

  async findByPatient(patientId: string, query: PaginationDto) {
    const { skip, take } = getPaginationParams(query.page, query.limit);

    const [rows, total] = await Promise.all([
      this.prisma.medicalReport.findMany({
        where: { patientId },
        skip,
        take,
        orderBy: { uploadedAt: 'desc' },
        include: REPORT_INCLUDE,
      }),
      this.prisma.medicalReport.count({ where: { patientId } }),
    ]);

    return { rows, total };
  }

  async findByBooking(bookingId: string) {
    return this.prisma.medicalReport.findMany({
      where: { bookingId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async findByBookingWithParties(bookingId: string) {
    return this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { doctor: true, patient: true },
    });
  }

  async findReportById(reportId: string) {
    return this.prisma.medicalReport.findUnique({
      where: { id: reportId },
      include: {
        patient: true,
        booking: { include: { doctor: true } },
      },
    });
  }

  async deleteReport(reportId: string) {
    return this.prisma.medicalReport.delete({ where: { id: reportId } });
  }
}
