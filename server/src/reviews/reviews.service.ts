import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import {
  createPaginationMeta,
  getPaginationParams,
} from '../common/pagination/pagination.utils.js';
import { PaginationDto } from '../common/pagination/pagination.dto.js';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(userId: string, dto: CreateReviewDto) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: dto.bookingId },
      include: {
        patient: true,
        review: true,
      },
    });

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

    return this.prisma.$transaction(async (tx) => {
      // 1. Create the Review record
      const review = await tx.review.create({
        data: {
          bookingId: dto.bookingId,
          rating: dto.rating,
          comment: dto.comment,
        },
      });

      // 2. Recalculate average rating & total reviews for the doctor
      const allDoctorReviews = await tx.review.findMany({
        where: {
          booking: {
            doctorId: booking.doctorId,
          },
        },
        select: { rating: true },
      });

      const totalReviews = allDoctorReviews.length;
      const averageRating =
        totalReviews > 0
          ? Number(
              (
                allDoctorReviews.reduce((sum, r) => sum + r.rating, 0) /
                totalReviews
              ).toFixed(1),
            )
          : 0;

      // 3. Update DoctorProfile
      await tx.doctorProfile.update({
        where: { id: booking.doctorId },
        data: {
          rating: averageRating,
          totalReviews,
        },
      });

      return review;
    });
  }

  async getDoctorReviews(doctorId: string, query: PaginationDto = {}) {
    const { skip, take } = getPaginationParams(query.page, query.limit);

    const where = {
      booking: { doctorId },
    };

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          booking: {
            select: {
              slotStart: true,
              patient: {
                include: {
                  user: {
                    select: {
                      name: true,
                      image: true,
                    },
                  },
                },
              },
            },
          },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    const formatted = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      appointmentDate: r.booking.slotStart,
      patientName: r.booking.patient.user.name || 'Anonymous Patient',
      patientImage: r.booking.patient.user.image,
    }));

    return {
      data: formatted,
      meta: createPaginationMeta(query.page || 1, query.limit || 10, total),
    };
  }

  async getMyReviews(userId: string, query: PaginationDto = {}) {
    const patient = await this.prisma.patientProfile.findUnique({
      where: { userId },
    });

    if (!patient) {
      return {
        data: [],
        meta: createPaginationMeta(query.page || 1, query.limit || 10, 0),
      };
    }

    const { skip, take } = getPaginationParams(query.page, query.limit);

    const where = {
      booking: { patientId: patient.id },
    };

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          booking: {
            select: {
              slotStart: true,
              doctor: {
                include: {
                  user: { select: { name: true, image: true } },
                },
              },
            },
          },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    const formatted = reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      comment: r.comment,
      createdAt: r.createdAt,
      appointmentDate: r.booking.slotStart,
      doctorName: r.booking.doctor.user.name || 'Doctor',
      doctorImage: r.booking.doctor.user.image,
    }));

    return {
      data: formatted,
      meta: createPaginationMeta(query.page || 1, query.limit || 10, total),
    };
  }
}
