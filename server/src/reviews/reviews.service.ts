import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { ReviewsRepository } from './reviews.repository.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { createPaginationMeta } from '../common/pagination/pagination.utils.js';
import { PaginationDto } from '../common/pagination/pagination.dto.js';

@Injectable()
export class ReviewsService {
  constructor(private readonly repo: ReviewsRepository) {}

  async createReview(userId: string, dto: CreateReviewDto) {
    const booking = await this.repo.findBookingForReview(dto.bookingId);

    if (!booking) {
      throw new NotFoundException(`Booking with ID "${dto.bookingId}" not found`);
    }

    if (booking.patient.userId !== userId) {
      throw new ForbiddenException(
        'You can only review your own completed appointments',
      );
    }

    if (booking.status !== BookingStatus.COMPLETED) {
      throw new BadRequestException(
        'You can only review completed appointments',
      );
    }

    if (booking.review) {
      throw new ConflictException(
        'You have already reviewed this appointment',
      );
    }

    return this.repo.runTransaction(async (tx) => {
      const review = await this.repo.createReviewInTx(
        tx,
        dto.bookingId,
        dto.rating,
        dto.comment,
      );

      await this.repo.recalcDoctorRatingInTx(tx, booking.doctorId);

      return review;
    });
  }

  async getDoctorReviews(doctorId: string, query: PaginationDto = {}) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const { rows, total } = await this.repo.findDoctorReviews(doctorId, query);

    const formatted = rows.map((r: any) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      appointmentDate: r.booking?.slotStart,
      patientName: r.booking?.patient?.user?.name || 'Anonymous Patient',
      patientImage: r.booking?.patient?.user?.image,
    }));

    return {
      data: formatted,
      meta: createPaginationMeta(page, limit, total),
    };
  }

  async getMyReviews(userId: string, query: PaginationDto = {}) {
    const patient = await this.repo.findPatientByUserId(userId);

    if (!patient) {
      return {
        data: [],
        meta: createPaginationMeta(query.page || 1, query.limit || 10, 0),
      };
    }

    const page = query.page || 1;
    const limit = query.limit || 10;
    const { rows, total } = await this.repo.findPatientReviews(patient.id, query);

    const formatted = rows.map((r: any) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      appointmentDate: r.booking?.slotStart,
      doctorName: r.booking?.doctor?.user?.name || 'Doctor',
      doctorImage: r.booking?.doctor?.user?.image,
    }));

    return {
      data: formatted,
      meta: createPaginationMeta(page, limit, total),
    };
  }
}
