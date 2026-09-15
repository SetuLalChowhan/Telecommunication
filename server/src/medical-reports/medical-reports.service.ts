import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UploadReportDto } from './dto/upload-report.dto.js';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service.js';
import {
  createPaginationMeta,
  getPaginationParams,
} from '../common/pagination/pagination.utils.js';
import { PaginationDto } from '../common/pagination/pagination.dto.js';

@Injectable()
export class MedicalReportsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  private async getOrCreatePatient(userId: string) {
    let patient = await this.prisma.patientProfile.findUnique({
      where: { userId },
    });

    if (!patient) {
      patient = await this.prisma.patientProfile.create({
        data: { userId },
      });
    }

    return patient;
  }

  async uploadReport(
    userId: string,
    dto: UploadReportDto,
    file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Report file is required (PDF, JPG, PNG)');
    }

    const patient = await this.getOrCreatePatient(userId);

    // If bookingId is provided, verify it belongs to this patient
    if (dto.bookingId) {
      const booking = await this.prisma.booking.findUnique({
        where: { id: dto.bookingId },
      });

      if (!booking) {
        throw new NotFoundException(`Booking with ID "${dto.bookingId}" not found`);
      }

      if (booking.patientId !== patient.id) {
        throw new ForbiddenException(
          'You can only attach reports to your own appointments',
        );
      }
    }

    const uploadRes = await this.cloudinaryService.uploadFile(
      file,
      'telehealth/reports',
      { resourceType: 'auto' },
    );
    const fileUrl = uploadRes.secureUrl;
    const displayName = dto.fileName || file.originalname;

    return this.prisma.medicalReport.create({
      data: {
        patientId: patient.id,
        bookingId: dto.bookingId || null,
        fileUrl,
        fileName: displayName,
      },
      include: {
        booking: {
          select: {
            id: true,
            slotStart: true,
            status: true,
            doctor: {
              include: {
                user: {
                  select: { name: true, email: true },
                },
              },
            },
          },
        },
      },
    });
  }

  async getMyReports(userId: string, query: PaginationDto = {}) {
    const patient = await this.getOrCreatePatient(userId);
    const { skip, take } = getPaginationParams(query.page, query.limit);

    const [reports, total] = await Promise.all([
      this.prisma.medicalReport.findMany({
        where: { patientId: patient.id },
        skip,
        take,
        orderBy: { uploadedAt: 'desc' },
        include: {
          booking: {
            select: {
              id: true,
              slotStart: true,
              status: true,
              doctor: {
                include: {
                  user: { select: { name: true, email: true } },
                },
              },
            },
          },
        },
      }),
      this.prisma.medicalReport.count({
        where: { patientId: patient.id },
      }),
    ]);

    return {
      data: reports,
      meta: createPaginationMeta(query.page || 1, query.limit || 10, total),
    };
  }

  async getReportsByBooking(bookingId: string, userId: string, role: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        doctor: true,
        patient: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID "${bookingId}" not found`);
    }

    if (role !== 'ADMIN') {
      const isDoctor = booking.doctor.userId === userId;
      const isPatient = booking.patient.userId === userId;

      if (!isDoctor && !isPatient) {
        throw new ForbiddenException(
          'You are not authorized to view reports for this appointment',
        );
      }
    }

    return this.prisma.medicalReport.findMany({
      where: { bookingId },
      orderBy: { uploadedAt: 'desc' },
    });
  }

  async deleteReport(reportId: string, userId: string, role: string) {
    const report = await this.prisma.medicalReport.findUnique({
      where: { id: reportId },
      include: {
        patient: true,
      },
    });

    if (!report) {
      throw new NotFoundException(`Report with ID "${reportId}" not found`);
    }

    if (role !== 'ADMIN' && report.patient.userId !== userId) {
      throw new ForbiddenException(
        'You can only delete your own medical reports',
      );
    }

    if (report.fileUrl) {
      await this.cloudinaryService.deleteFile(report.fileUrl);
    }

    return this.prisma.medicalReport.delete({
      where: { id: reportId },
    });
  }
}
