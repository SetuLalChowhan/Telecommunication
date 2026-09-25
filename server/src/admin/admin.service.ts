import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DocumentStatus } from '@prisma/client';
import { AdminRepository } from './admin.repository.js';
import { AdminDoctorQueryDto } from './dto/admin-doctor-query.dto.js';
import { RejectDoctorDto } from './dto/reject-doctor.dto.js';
import { UpdatePatientDto } from './dto/update-patient.dto.js';
import { UpdateBookingDto } from './dto/update-booking.dto.js';
import { UpdateDoctorDto } from './dto/update-doctor.dto.js';
import { createPaginationMeta } from '../common/pagination/pagination.utils.js';

/** Drops keys whose value is `undefined` so Prisma never receives empty sets. */
function compact<T extends object>(input: T): T {
  return Object.fromEntries(
    Object.entries(input).filter(([, value]) => value !== undefined),
  ) as T;
}

@Injectable()
export class AdminService {
  constructor(private readonly repo: AdminRepository) {}

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
