import { Injectable } from '@nestjs/common';
import { BookingStatus, DayOfWeek } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { getPaginationParams } from '../common/pagination/pagination.utils.js';
import { BookingQueryDto } from './dto/booking-query.dto.js';

export const BOOKING_INCLUDE = {
  doctor: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
        },
      },
      specialties: { include: { specialty: true } },
    },
  },
  patient: {
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          dateOfBirth: true,
        },
      },
    },
  },
  reports: true,
  review: true,
} as const;

@Injectable()
export class AppointmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // -- Doctor lookups --------------------------------------------------------

  async findVerifiedDoctor(idOrSlug: string) {
    return this.prisma.doctorProfile.findFirst({
      where: { verified: true, OR: [{ id: idOrSlug }, { slug: idOrSlug }] },
    });
  }

  async findDoctorById(id: string) {
    return this.prisma.doctorProfile.findUnique({
      where: { id },
      include: { user: true },
    });
  }

  // -- Patient lookups -------------------------------------------------------

  async findOrCreatePatient(userId: string) {
    let patient = await this.prisma.patientProfile.findUnique({
      where: { userId },
      include: { user: true },
    });
    if (!patient) {
      patient = await this.prisma.patientProfile.create({
        data: { userId },
        include: { user: true },
      });
    }
    return patient;
  }

  async findPatientByUserId(userId: string) {
    return this.prisma.patientProfile.findUnique({ where: { userId } });
  }

  async findDoctorProfileByUserId(userId: string) {
    return this.prisma.doctorProfile.findUnique({ where: { userId } });
  }

  // -- Day off / Availability -------------------------------------------------

  async findDayOff(doctorId: string, date: Date) {
    return this.prisma.doctorDayOff.findFirst({ where: { doctorId, date } });
  }

  async findActiveSchedules(doctorId: string, dayOfWeek: DayOfWeek) {
    return this.prisma.availability.findMany({
      where: { doctorId, dayOfWeek, isActive: true },
      orderBy: { startTime: 'asc' },
    });
  }

  // -- Bookings --------------------------------------------------------------

  async findActiveBookingsForDate(doctorId: string, start: Date, end: Date) {
    return this.prisma.booking.findMany({
      where: {
        doctorId,
        slotStart: { gte: start, lte: end },
        status: { not: BookingStatus.CANCELLED },
      },
      select: { slotStart: true, slotEnd: true },
    });
  }

  async findConflictInTx(
    tx: any,
    doctorId: string,
    slotStart: Date,
    slotEnd: Date,
  ) {
    return tx.booking.findFirst({
      where: {
        doctorId,
        status: { not: BookingStatus.CANCELLED },
        OR: [
          { slotStart: { lte: slotStart }, slotEnd: { gt: slotStart } },
          { slotStart: { lt: slotEnd }, slotEnd: { gte: slotEnd } },
          { slotStart: { gte: slotStart }, slotEnd: { lte: slotEnd } },
        ],
      },
    });
  }

  async createBookingInTx(
    tx: any,
    doctorId: string,
    patientId: string,
    slotStart: Date,
    slotEnd: Date,
    notes?: string,
  ) {
    return tx.booking.create({
      data: {
        doctorId,
        patientId,
        slotStart,
        slotEnd,
        notes,
        status: BookingStatus.PENDING,
      },
      include: BOOKING_INCLUDE,
    });
  }

  async acquireAdvisoryLock(tx: any, doctorId: string) {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${doctorId}));`;
  }

  async findBookings(where: any, query: BookingQueryDto) {
    const { skip, take } = getPaginationParams(query.page, query.limit);

    const [rows, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take,
        orderBy: { slotStart: 'desc' },
        include: BOOKING_INCLUDE,
      }),
      this.prisma.booking.count({ where }),
    ]);

    return { rows, total };
  }

  async findBookingById(id: string) {
    return this.prisma.booking.findUnique({
      where: { id },
      include: BOOKING_INCLUDE,
    });
  }

  async updateBooking(id: string, data: { status: BookingStatus; meetLink?: string | null; googleEventId?: string | null }) {
    return this.prisma.booking.update({
      where: { id },
      data,
      include: BOOKING_INCLUDE,
    });
  }

  runTransaction<T>(fn: (tx: any) => Promise<T>): Promise<T> {
    return this.prisma.$transaction(fn);
  }
}
