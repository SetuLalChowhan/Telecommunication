import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Response } from 'express';
import { MedicalReportsRepository } from './medical-reports.repository.js';
import { UploadReportDto } from './dto/upload-report.dto.js';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service.js';
import { assertFileSignature } from '../common/utils/file-upload.util.js';
import { createPaginationMeta } from '../common/pagination/pagination.utils.js';
import { PaginationDto } from '../common/pagination/pagination.dto.js';

const CONTENT_TYPES: Record<string, string> = {
  pdf: 'application/pdf',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
};

function normalizeFormat(ext?: string | null): string {
  const normalized = (ext || '').toLowerCase();
  return normalized in CONTENT_TYPES ? normalized : 'pdf';
}

@Injectable()
export class MedicalReportsService {
  constructor(
    private readonly repo: MedicalReportsRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async uploadReport(
    userId: string,
    role: string,
    dto: UploadReportDto,
    file?: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Report file is required (PDF, JPG, PNG)');
    }

    // The extension/MIME are client-controlled; verify the real content before
    // anything is forwarded to storage.
    assertFileSignature(file, ['image', 'pdf']);

    let patientId: string;

    if (role === 'DOCTOR') {
      if (!dto.bookingId) {
        throw new BadRequestException(
          'bookingId is required when a doctor uploads a prescription or medical report',
        );
      }

      const booking = await this.repo.findBookingForDoctor(dto.bookingId);

      if (!booking) {
        throw new NotFoundException(`Booking with ID "${dto.bookingId}" not found`);
      }

      if (booking.doctor.userId !== userId) {
        throw new ForbiddenException(
          'You can only upload prescriptions or reports for your own appointments',
        );
      }

      if (booking.status === 'CANCELLED' || booking.status === 'COMPLETED') {
        throw new BadRequestException(
          'You can only upload reports for active appointments',
        );
      }

      patientId = booking.patientId;
    } else {
      // Patient upload
      const patient = await this.repo.findOrCreatePatient(userId);
      patientId = patient.id;

      if (dto.bookingId) {
        const booking = await this.repo.findBookingById(dto.bookingId);

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
    const fileExt = file.originalname.match(/\.([a-zA-Z0-9]+)$/)?.[0] || '';
    if (fileExt && !displayName.toLowerCase().endsWith(fileExt.toLowerCase())) {
      displayName = `${displayName}${fileExt}`;
    }
    if (role === 'DOCTOR' && !displayName.toLowerCase().includes('prescription')) {
      displayName = `Prescription - ${displayName}`;
    }

    return this.repo.createReport({
      patientId,
      bookingId: dto.bookingId,
      fileUrl,
      fileName: displayName,
    });
  }

  async getMyReports(userId: string, query: PaginationDto = {}) {
    const patient = await this.repo.findOrCreatePatient(userId);
    const page = query.page || 1;
    const limit = query.limit || 10;
    const { rows, total } = await this.repo.findByPatient(patient.id, query);

    return {
      data: rows,
      meta: createPaginationMeta(page, limit, total),
    };
  }

  async getReportsByBooking(bookingId: string, userId: string, role: string) {
    const booking = await this.repo.findByBookingWithParties(bookingId);

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

    return this.repo.findByBooking(bookingId);
  }

  async deleteReport(reportId: string, userId: string, role: string) {
    const report = await this.repo.findReportById(reportId);

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

    return this.repo.deleteReport(reportId);
  }

  async streamReportFile(
    reportId: string,
    action: 'view' | 'download',
    userId: string,
    role: string,
    res: Response,
  ) {
    const report = await this.repo.findReportById(reportId);

    if (!report || !report.fileUrl) {
      throw new NotFoundException('Medical report file not found');
    }

    // Medical documents are protected health information: only the owning
    // patient, the doctor on the related booking, or an admin may read them.
    // The report id is never sufficient on its own to authorize access.
    const isAdmin = role === 'ADMIN';
    const isOwner = report.patient?.userId === userId;
    const isTreatingDoctor = report.booking?.doctor?.userId === userId;

    if (!isAdmin && !isOwner && !isTreatingDoctor) {
      throw new ForbiddenException(
        'You are not authorized to access this medical report',
      );
    }

    const rawFileName = report.fileName || 'medical-document';
    const extFromName = rawFileName.match(/\.([a-zA-Z0-9]+)$/)?.[1];
    const extFromUrl = report.fileUrl.match(/\.([a-zA-Z0-9]+)(?:[?#]|$)/)?.[1];
    const format = normalizeFormat(extFromName || extFromUrl);

    const { publicId, resourceType } = this.cloudinaryService.extractPublicId(
      report.fileUrl,
    );
    const isCloudinary = report.fileUrl.includes('res.cloudinary.com');

    // Every protected file is streamed through the backend, never handed back
    // as a permanent public URL. Cloudinary assets — images included, not just
    // PDFs — are fetched through a short-lived signed URL.
    let sourceUrl: string;
    if (isCloudinary) {
      sourceUrl = this.cloudinaryService.getPrivateDownloadUrl(
        publicId,
        format,
        resourceType,
      );
    } else if (report.fileUrl.startsWith('/')) {
      const base = (process.env.BETTER_AUTH_URL || '').replace(/\/+$/, '');
      sourceUrl = `${base}${report.fileUrl}`;
    } else {
      sourceUrl = report.fileUrl;
    }

    const response = await fetch(sourceUrl);
    if (!response.ok) {
      throw new NotFoundException('Could not retrieve file from storage provider');
    }

    const contentType =
      CONTENT_TYPES[format] ||
      response.headers.get('content-type') ||
      'application/octet-stream';

    const dispositionType = action === 'download' ? 'attachment' : 'inline';

    let safeFileName = rawFileName.replace(/[^\w.-]/g, '_');
    if (!safeFileName.toLowerCase().endsWith(`.${format}`)) {
      safeFileName = `${safeFileName}.${format}`;
    }

    // Protected health information must never be cached or sniffed into a
    // different content type by the browser or an intermediary proxy.
    res.setHeader('Content-Type', contentType);
    res.setHeader(
      'Content-Disposition',
      `${dispositionType}; filename="${safeFileName}"; filename*=UTF-8''${encodeURIComponent(safeFileName)}`,
    );
    res.setHeader('Cache-Control', 'private, no-store, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'no-referrer');

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    res.end(buffer);
  }
}
