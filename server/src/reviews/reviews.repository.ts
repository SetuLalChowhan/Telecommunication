import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { getPaginationParams } from '../common/pagination/pagination.utils.js';
import { PaginationDto } from '../common/pagination/pagination.dto.js';

const REVIEW_INCLUDE = {
  booking: {
    select: {
      slotStart: true,
      doctorId: true,
      patientId: true,
      patient: {
        include: { user: { select: { name: true, image: true } } },
      },
      doctor: {
        include: { user: { select: { name: true, image: true } } },
      },
    },
  },
} as const;

@Injectable()
export class ReviewsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBookingForReview(bookingId: string) {
    return this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: { patient: true, review: true },
    });
  }

  async findDoctorReviews(doctorId: string, query: PaginationDto) {
    const { skip, take } = getPaginationParams(query.page, query.limit);
    const where = { booking: { doctorId } };

    const [rows, total] = await Promise.all([
      this.prisma.review.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, include: REVIEW_INCLUDE }),
      this.prisma.review.count({ where }),
    ]);

    return { rows, total };
  }

  async findPatientByUserId(userId: string) {
    return this.prisma.patientProfile.findUnique({ where: { userId } });
  }

  async findPatientReviews(patientId: string, query: PaginationDto) {
    const { skip, take } = getPaginationParams(query.page, query.limit);
    const where = { booking: { patientId } };

    const [rows, total] = await Promise.all([
      this.prisma.review.findMany({ where, skip, take, orderBy: { createdAt: 'desc' }, include: REVIEW_INCLUDE }),
      this.prisma.review.count({ where }),
    ]);

    return { rows, total };
  }

  async createReviewInTx(
    tx: any,
    bookingId: string,
    rating: number,
    comment?: string,
  ) {
    return tx.review.create({
      data: { bookingId, rating, comment },
    });
  }

  async recalcDoctorRatingInTx(tx: any, doctorId: string) {
    const allReviews = await tx.review.findMany({
      where: { booking: { doctorId } },
      select: { rating: true },
    });
    const totalReviews = allReviews.length;
    const averageRating =
      totalReviews > 0
        ? Number((allReviews.reduce((s: number, r: any) => s + r.rating, 0) / totalReviews).toFixed(1))
        : 0;
    await tx.doctorProfile.update({
      where: { id: doctorId },
      data: { rating: averageRating, totalReviews },
    });
  }

  runTransaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn);
  }
}
