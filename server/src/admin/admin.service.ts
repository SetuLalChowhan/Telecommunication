import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import type { Response } from 'express';
import { DocumentStatus } from '@prisma/client';
import { AdminRepository } from './admin.repository.js';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service.js';
import { AdminDoctorQueryDto } from './dto/admin-doctor-query.dto.js';
import { RejectDoctorDto } from './dto/reject-doctor.dto.js';
import { UpdatePatientDto } from './dto/update-patient.dto.js';
import { UpdateBookingDto } from './dto/update-booking.dto.js';
import { UpdateDoctorDto } from './dto/update-doctor.dto.js';
import { createPaginationMeta } from '../common/pagination/pagination.utils.js';

/** MIME types keyed by the file extension we resolve from the stored URL. */
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

/** Drops keys whose value is `undefined` so Prisma never receives empty sets. */
function compact<T extends object>(input: T): T {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  ) as T;
}

@Injectable()
export class AdminService {
  constructor(
    private readonly repo: AdminRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async listDoctors(query: AdminDoctorQueryDto = {}) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const { rows, total } = await this.repo.findDoctors(query);

    return {
      data: rows,
      meta: createPaginationMeta(page, limit, total),
    };
  }

  async listPendingDoctors(query: AdminDoctorQueryDto = {}) {
    return this.listDoctors({ ...query, verified: false });
  }

  async getDoctorDetails(doctorId: string) {
    const doctor = await this.repo.findDoctorById(doctorId);

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID "${doctorId}" not found`);
    }

    return doctor;
  }

  async updateDoctor(doctorId: string, dto: UpdateDoctorDto) {
    const doctor = await this.repo.findDoctorById(doctorId);

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID "${doctorId}" not found`);
    }

    return this.repo.updateDoctor(doctorId, compact(dto));
  }

  async deleteDoctor(doctorId: string) {
    const doctor = await this.repo.findDoctorById(doctorId);

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID "${doctorId}" not found`);
    }

    return this.repo.deleteDoctor(doctorId);
  }

  async approveDoctor(doctorId: string, adminUserId: string) {
    const doctor = await this.repo.findDoctorWithDocs(doctorId);

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID "${doctorId}" not found`);
    }

    return this.repo.approveDoctorInTx(doctorId, adminUserId);
  }

  async rejectDoctor(
    doctorId: string,
    _adminUserId: string,
    _dto: RejectDoctorDto,
  ) {
    const doctor = await this.repo.findDoctorById(doctorId);

    if (!doctor) {
      throw new NotFoundException(`Doctor with ID "${doctorId}" not found`);
    }

    return this.repo.rejectDoctorInTx(doctorId);
  }

  async updateDocumentStatus(documentId: string, status: DocumentStatus) {
    const doc = await this.repo.findDocumentById(documentId);

    if (!doc) {
      throw new NotFoundException(`Document with ID "${documentId}" not found`);
    }

    return this.repo.updateDocumentStatus(documentId, status);
  }

  /**
   * Streams a doctor's verification document through the backend.
   *
   * The stored storage URL is not publicly deliverable — opening it directly
   * returns 401 — so, exactly like medical reports, the file is fetched with a
   * short-lived signed URL and proxied to the caller. Admin authorization is
   * enforced by the controller's ADMIN guard, never by knowledge of the id.
   */
  async streamDocumentFile(
    documentId: string,
    action: 'view' | 'download',
    res: Response,
  ) {
    const document = await this.repo.findDocumentById(documentId);

    if (!document || !document.fileUrl) {
      throw new NotFoundException(`Document with ID "${documentId}" not found`);
    }

    const rawFileName = `${document.docType}`;
    const extFromUrl = document.fileUrl.match(/\.([a-zA-Z0-9]+)(?:[?#]|$)/)?.[1];
    const format = normalizeFormat(extFromUrl);

    const { publicId, resourceType } = this.cloudinaryService.extractPublicId(
      document.fileUrl,
    );
    const isCloudinary = document.fileUrl.includes('res.cloudinary.com');

    let sourceUrl: string;
    if (isCloudinary) {
      sourceUrl = this.cloudinaryService.getPrivateDownloadUrl(
        publicId,
        format,
        resourceType,
      );
    } else if (document.fileUrl.startsWith('/')) {
      const base = (process.env.BETTER_AUTH_URL || '').replace(/\/+$/, '');
      sourceUrl = `${base}${document.fileUrl}`;
    } else {
      sourceUrl = document.fileUrl;
    }

    const response = await fetch(sourceUrl);
    if (!response.ok) {
      throw new NotFoundException(
        'Could not retrieve document from storage provider',
      );
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
    res.end(Buffer.from(arrayBuffer));
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
    ] = await this.repo.getDashboardMetrics(today, tomorrow);

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

  async listPatients(query: { search?: string; page?: number; limit?: number } = {}) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const { rows, total } = await this.repo.findPatients(query);

    return {
      data: rows,
      meta: createPaginationMeta(page, limit, total),
    };
  }

  async getPatientDetails(patientId: string) {
    const patient = await this.repo.findPatientById(patientId);

    if (!patient) {
      throw new NotFoundException(`Patient with ID "${patientId}" not found`);
    }

    return patient;
  }

  async updatePatient(patientId: string, dto: UpdatePatientDto) {
    const patient = await this.repo.findPatientWithUser(patientId);

    if (!patient) {
      throw new NotFoundException(`Patient with ID "${patientId}" not found`);
    }

    if (dto.email) {
      const existing = await this.repo.findUserByEmail(dto.email);
      if (existing && existing.id !== patient.userId) {
        throw new ConflictException('A user with this email already exists');
      }
    }

    const userData = compact({
      name: dto.name,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      emailVerified: dto.emailVerified,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
    });

    const profileData = compact({
      address: dto.address,
      gender: dto.gender,
      bloodGroup: dto.bloodGroup,
      emergencyContactName: dto.emergencyContactName,
      emergencyContactPhone: dto.emergencyContactPhone,
    });

    return this.repo.updatePatient(patientId, patient.userId, userData, profileData);
  }

  async deletePatient(patientId: string) {
    const patient = await this.repo.findPatientWithUser(patientId);

    if (!patient) {
      throw new NotFoundException(`Patient with ID "${patientId}" not found`);
    }

    return this.repo.deletePatient(patientId, patient.userId);
  }

  async listAppointments(query: {
    status?: any;
    doctorId?: string;
    patientId?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const { rows, total } = await this.repo.findAppointments(query);

    return {
      data: rows,
      meta: createPaginationMeta(page, limit, total),
    };
  }

  async getAppointmentDetails(bookingId: string) {
    const booking = await this.repo.findBookingById(bookingId);

    if (!booking) {
      throw new NotFoundException(`Booking with ID "${bookingId}" not found`);
    }

    return booking;
  }

  async updateAppointment(bookingId: string, dto: UpdateBookingDto) {
    const booking = await this.repo.findBookingById(bookingId);

    if (!booking) {
      throw new NotFoundException(`Booking with ID "${bookingId}" not found`);
    }

    return this.repo.updateBooking(bookingId, compact(dto));
  }

  async deleteAppointment(bookingId: string) {
    const booking = await this.repo.findBookingById(bookingId);

    if (!booking) {
      throw new NotFoundException(`Booking with ID "${bookingId}" not found`);
    }

    return this.repo.deleteBooking(bookingId);
  }

  async listReviews(query: { doctorId?: string; page?: number; limit?: number } = {}) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const { rows, total } = await this.repo.findReviews(query);

    return {
      data: rows,
      meta: createPaginationMeta(page, limit, total),
    };
  }

  async deleteReview(reviewId: string) {
    const result = await this.repo.deleteReview(reviewId);

    if (!result) {
      throw new NotFoundException(`Review with ID "${reviewId}" not found`);
    }

    return result;
  }
}
