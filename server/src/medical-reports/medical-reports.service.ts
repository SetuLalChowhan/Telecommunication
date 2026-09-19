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
    role: string,
    dto: UploadReportDto,
    file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Report file is required (PDF, JPG, PNG)');
    }

    let patientId: string;

    if (role === 'DOCTOR') {
      if (!dto.bookingId) {
        throw new BadRequestException(
          'bookingId is required when a doctor uploads a prescription or medical report',
        );
      }

      const booking = await this.prisma.booking.findUnique({
        where: { id: dto.bookingId },
        include: { doctor: true },
      });

      if (!booking) {
        throw new NotFoundException(`Booking with ID "${dto.bookingId}" not found`);
      }

      if (booking.doctor.userId !== userId) {
        throw new ForbiddenException(
          'You can only upload prescriptions or reports for your own appointments',
        );
      }

      patientId = booking.patientId;
    } else {
      // Patient upload
      const patient = await this.getOrCreatePatient(userId);
      patientId = patient.id;

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
    }

    const uploadRes = await this.cloudinaryService.uploadFile(
      file,
      'telehealth/reports',
      { resourceType: 'auto' },
    );
    const fileUrl = uploadRes.secureUrl;

    let displayName = dto.fileName || file.originalname;
    if (role === 'DOCTOR' && !displayName.toLowerCase().includes('prescription')) {
      displayName = `Prescription - ${displayName}`;
    }

    return this.prisma.medicalReport.create({
      data: {
        patientId,
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
              select: {
                id: true,
                slug: true,
                designation: true,
                hospitalAffiliation: true,
                user: {
                  select: { name: true, email: true, image: true },
                },
                specialties: {
                  include: { specialty: true },
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
                select: {
                  id: true,
                  slug: true,
                  designation: true,
                  hospitalAffiliation: true,
                  user: {
                    select: { name: true, email: true, image: true },
                  },
                  specialties: {
                    include: { specialty: true },
                  },
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
