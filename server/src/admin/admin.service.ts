import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DocumentStatus } from '@prisma/client';
import { AdminRepository } from './admin.repository.js';
import { AdminDoctorQueryDto } from './dto/admin-doctor-query.dto.js';
import { RejectDoctorDto } from './dto/reject-doctor.dto.js';
import { createPaginationMeta } from '../common/pagination/pagination.utils.js';

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

  async listReviews(query: { doctorId?: string; page?: number; limit?: number } = {}) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const { rows, total } = await this.repo.findReviews(query);

    return {
      data: rows,
      meta: createPaginationMeta(page, limit, total),
    };
  }
}
