import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus, DayOfWeek, NotificationType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { SlotQueryDto } from './dto/slot-query.dto.js';
import { BookingQueryDto } from './dto/booking-query.dto.js';
import {
  createPaginationMeta,
  getPaginationParams,
} from '../common/pagination/pagination.utils.js';

import { GoogleService } from '../google/google.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';

const DAYS_MAP: Record<number, DayOfWeek> = {
  0: DayOfWeek.SUNDAY,
  1: DayOfWeek.MONDAY,
  2: DayOfWeek.TUESDAY,
  3: DayOfWeek.WEDNESDAY,
  4: DayOfWeek.THURSDAY,
  5: DayOfWeek.FRIDAY,
  6: DayOfWeek.SATURDAY,
};

const BOOKING_INCLUDE = {
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
export class AppointmentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly googleService: GoogleService,
    private readonly notificationsService: NotificationsService,
  ) {}

  /**
   * Generates concrete slots for a specific date and marks occupied ones
   */
  async getAvailableSlots(query: SlotQueryDto) {
    const { doctorId, date } = query;

    const doctor = await this.prisma.doctorProfile.findFirst({
      where: {
        verified: true,
        OR: [{ id: doctorId }, { slug: doctorId }],
      },
    });

    if (!doctor) {
      throw new NotFoundException('Doctor not found or not verified');
    }

    const resolvedDoctorId = doctor.id;

    const targetDate = new Date(`${date}T00:00:00.000Z`);
    if (isNaN(targetDate.getTime())) {
      throw new BadRequestException('Invalid date format. Expected YYYY-MM-DD');
    }

    // 1. Check if doctor is on Day Off for this date
    const dayOff = await this.prisma.doctorDayOff.findFirst({
      where: {
        doctorId: resolvedDoctorId,
        date: targetDate,
      },
    });

    if (dayOff) {
      return {
        date,
        isDayOff: true,
        reason: dayOff.reason || 'Doctor is unavailable on this date',
        slots: [],
      };
    }

    // 2. Find matching weekly availability for the day of week
    const dayOfWeek = DAYS_MAP[targetDate.getUTCDay()];
    const schedules = await this.prisma.availability.findMany({
      where: {
        doctorId: resolvedDoctorId,
        dayOfWeek,
        isActive: true,
      },
      orderBy: { startTime: 'asc' },
    });

    if (schedules.length === 0) {
      return {
        date,
        isDayOff: false,
        message: 'No active schedule for this day',
        slots: [],
      };
    }

    // 3. Fetch all active bookings for this doctor on that date
    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const existingBookings = await this.prisma.booking.findMany({
      where: {
        doctorId: resolvedDoctorId,
        slotStart: { gte: startOfDay, lte: endOfDay },
        status: { not: BookingStatus.CANCELLED },
      },
      select: { slotStart: true, slotEnd: true },
    });

    const isSlotOccupied = (slotStart: Date, slotEnd: Date) => {
      return existingBookings.some((b) => {
        return (
          (slotStart >= b.slotStart && slotStart < b.slotEnd) ||
          (slotEnd > b.slotStart && slotEnd <= b.slotEnd) ||
          (slotStart <= b.slotStart && slotEnd >= b.slotEnd)
        );
      });
    };

    // 4. Generate concrete slots for each schedule window
    const slots: Array<{
      slotStart: string;
      slotEnd: string;
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    }> = [];

    for (const schedule of schedules) {
      const duration = schedule.consultationDuration || 30;
      const [startH, startM] = schedule.startTime.split(':').map(Number);
      const [endH, endM] = schedule.endTime.split(':').map(Number);

      let currentMinute = startH * 60 + startM;
      const endMinute = endH * 60 + endM;

      while (currentMinute + duration <= endMinute) {
        const nextMinute = currentMinute + duration;

        const slotStartH = String(Math.floor(currentMinute / 60)).padStart(2, '0');
        const slotStartM = String(currentMinute % 60).padStart(2, '0');
        const slotEndH = String(Math.floor(nextMinute / 60)).padStart(2, '0');
        const slotEndM = String(nextMinute % 60).padStart(2, '0');

        const slotStartTimeStr = `${slotStartH}:${slotStartM}`;
        const slotEndTimeStr = `${slotEndH}:${slotEndM}`;

        const slotStartDate = new Date(`${date}T${slotStartTimeStr}:00.000Z`);
        const slotEndDate = new Date(`${date}T${slotEndTimeStr}:00.000Z`);

        const occupied = isSlotOccupied(slotStartDate, slotEndDate);

        slots.push({
          slotStart: slotStartDate.toISOString(),
          slotEnd: slotEndDate.toISOString(),
          startTime: slotStartTimeStr,
          endTime: slotEndTimeStr,
          isAvailable: !occupied,
        });

        currentMinute = nextMinute;
      }
    }

    return {
      date,
      isDayOff: false,
      slots,
    };
  }

  /**
   * Patient creates a booking for an available slot
   */
  async createBooking(userId: string, dto: CreateBookingDto) {
    // 1. Ensure PatientProfile exists
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

    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { id: dto.doctorId },
      include: { user: true },
    });

    if (!doctor || !doctor.verified) {
      throw new NotFoundException('Doctor not found or not verified');
    }

    const slotStart = new Date(dto.slotStart);
    const slotEnd = new Date(dto.slotEnd);

    if (slotStart >= slotEnd) {
      throw new BadRequestException('slotStart must be earlier than slotEnd');
    }

    if (slotStart < new Date()) {
      throw new BadRequestException('Cannot book a time slot in the past');
    }

    // 2. Check for DayOff on that date
    const slotDateOnly = new Date(slotStart.toISOString().split('T')[0] + 'T00:00:00.000Z');
    const dayOff = await this.prisma.doctorDayOff.findFirst({
      where: {
        doctorId: dto.doctorId,
        date: slotDateOnly,
      },
    });

    if (dayOff) {
      throw new ConflictException(
        'Doctor is unavailable on this date: ' + (dayOff.reason || 'Day off'),
      );
    }

    // 3. Validate requested slot strictly against Doctor's active Availability grid
    const dayOfWeek = DAYS_MAP[slotStart.getUTCDay()];
    const schedules = await this.prisma.availability.findMany({
      where: {
        doctorId: dto.doctorId,
        dayOfWeek,
        isActive: true,
      },
    });

    if (schedules.length === 0) {
      throw new BadRequestException('Doctor has no available schedule on this day');
    }

    const dateStr = slotStart.toISOString().split('T')[0];
    let isValidSlot = false;

    for (const schedule of schedules) {
      const duration = schedule.consultationDuration || 30;
      const [startH, startM] = schedule.startTime.split(':').map(Number);
      const [endH, endM] = schedule.endTime.split(':').map(Number);

      let currentMinute = startH * 60 + startM;
      const endMinute = endH * 60 + endM;

      while (currentMinute + duration <= endMinute) {
        const nextMinute = currentMinute + duration;
        const sH = String(Math.floor(currentMinute / 60)).padStart(2, '0');
        const sM = String(currentMinute % 60).padStart(2, '0');
        const eH = String(Math.floor(nextMinute / 60)).padStart(2, '0');
        const eM = String(nextMinute % 60).padStart(2, '0');

        const validStart = new Date(`${dateStr}T${sH}:${sM}:00.000Z`);
        const validEnd = new Date(`${dateStr}T${eH}:${eM}:00.000Z`);

        if (
          slotStart.getTime() === validStart.getTime() &&
          slotEnd.getTime() === validEnd.getTime()
        ) {
          isValidSlot = true;
          break;
        }

        currentMinute = nextMinute;
      }

      if (isValidSlot) break;
    }

    if (!isValidSlot) {
      throw new BadRequestException(
        'The requested slot does not match the doctor\'s predefined availability schedule',
      );
    }

    // 4. Database-level concurrency protection inside transaction with Postgres advisory lock
    const booking = await this.prisma.$transaction(async (tx) => {
      // Serializes concurrent booking attempts for this doctor at DB level
      await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${dto.doctorId}));`;

      const conflict = await tx.booking.findFirst({
        where: {
          doctorId: dto.doctorId,
          status: { not: BookingStatus.CANCELLED },
          OR: [
            {
              slotStart: { lte: slotStart },
              slotEnd: { gt: slotStart },
            },
            {
              slotStart: { lt: slotEnd },
              slotEnd: { gte: slotEnd },
            },
            {
              slotStart: { gte: slotStart },
              slotEnd: { lte: slotEnd },
            },
          ],
        },
      });

      if (conflict) {
        throw new ConflictException(
          'This time slot is no longer available. Please select another slot.',
        );
      }

      return tx.booking.create({
        data: {
          doctorId: dto.doctorId,
          patientId: patient.id,
          slotStart,
          slotEnd,
          notes: dto.notes,
          status: BookingStatus.PENDING,
        },
        include: BOOKING_INCLUDE,
      });
    });

    // 4. Dispatch initial notifications for pending appointment
    try {
      const patientName = patient.user?.name || 'A patient';
      const slotTime = slotStart.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });

      // Notify doctor of new pending booking request
      await this.notificationsService.createNotification({
        userId: doctor.userId,
        type: NotificationType.GENERAL,
        title: 'New Appointment Request',
        message: `${patientName} has requested a video consultation for ${slotTime}. Please review and confirm.`,
        relatedBookingId: booking.id,
      });

      // Notify patient of submitted request
      await this.notificationsService.createNotification({
        userId: patient.userId,
        type: NotificationType.GENERAL,
        title: 'Appointment Request Submitted',
        message: `Your appointment request with Dr. ${doctor.user?.name || 'Specialist'} for ${slotTime} is pending doctor confirmation.`,
        relatedBookingId: booking.id,
      });
    } catch (err) {
      console.error('Failed to dispatch booking creation notifications:', err);
    }

    return booking;
  }

  /**
   * List bookings for the logged-in user (either Doctor or Patient)
   */
  async getMyBookings(userId: string, role: string, query: BookingQueryDto) {
    const { skip, take } = getPaginationParams(query.page, query.limit);

    let where: any = {};

    if (role === 'DOCTOR') {
      const doctor = await this.prisma.doctorProfile.findUnique({
        where: { userId },
      });
      if (!doctor) {
        throw new NotFoundException('Doctor profile not found');
      }
      where.doctorId = doctor.id;
    } else if (role === 'PATIENT') {
      const patient = await this.prisma.patientProfile.findUnique({
        where: { userId },
      });
      if (!patient) {
        return {
          data: [],
          meta: createPaginationMeta(query.page || 1, query.limit || 10, 0),
        };
      }
      where.patientId = patient.id;
    }

    if (query.status) {
      where.status = query.status;
    }

    const [bookings, total] = await Promise.all([
      this.prisma.booking.findMany({
        where,
        skip,
        take,
        orderBy: { slotStart: 'desc' },
        include: BOOKING_INCLUDE,
      }),
      this.prisma.booking.count({ where }),
    ]);

    return {
      data: bookings,
      meta: createPaginationMeta(query.page || 1, query.limit || 10, total),
    };
  }

  /**
   * Get single booking details with authorization check
   */
  async getBookingById(bookingId: string, userId: string, role: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
      include: BOOKING_INCLUDE,
    });

    if (!booking) {
      throw new NotFoundException(`Booking with ID "${bookingId}" not found`);
    }

    if (role !== 'ADMIN') {
      const isAuthorizedDoctor = booking.doctor.userId === userId;
      const isAuthorizedPatient = booking.patient.userId === userId;

      if (!isAuthorizedDoctor && !isAuthorizedPatient) {
        throw new ForbiddenException(
          'You are not authorized to view this booking',
        );
      }
    }

    return booking;
  }

  /**
   * Confirm booking (Doctor or Admin)
   * Transitions status from PENDING to CONFIRMED, generates Google Meet link / Calendar event,
   * updates booking record with meetLink, and dispatches notification to patient.
   */
  async confirmBooking(bookingId: string, userId: string, role: string) {
    const booking = await this.getBookingById(bookingId, userId, role);

    if (role !== 'ADMIN' && booking.doctor.userId !== userId) {
      throw new ForbiddenException(
        'Only the assigned doctor or admin can confirm this booking',
      );
    }

    if (booking.status === BookingStatus.CONFIRMED) {
      throw new BadRequestException('Booking is already confirmed');
    }

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cannot confirm an already completed booking');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Cannot confirm a cancelled booking');
    }

    let meetLink = booking.meetLink;
    let googleEventId = booking.googleEventId;

    // Generate Google Calendar event & Meet link if not already generated
    try {
      const meetingResult = await this.googleService.createMeetingEvent({
        doctorUserId: booking.doctor.userId,
        doctorName: booking.doctor.user?.name,
        patientEmail: booking.patient.user?.email || '',
        patientName: booking.patient.user?.name,
        slotStart: booking.slotStart,
        slotEnd: booking.slotEnd,
        bookingId: booking.id,
        notes: booking.notes,
      });

      if (meetingResult.meetLink) {
        meetLink = meetingResult.meetLink;
        googleEventId = meetingResult.googleEventId || null;
      }
    } catch (err) {
      console.error('Failed to create Google Meet event during confirmation:', err);
      if (!meetLink) {
        meetLink = `https://meet.google.com/tele-${booking.id.slice(-8)}`;
      }
    }

    const updatedBooking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CONFIRMED,
        meetLink,
        googleEventId,
      },
      include: BOOKING_INCLUDE,
    });

    // Send confirmation notification to patient
    try {
      const slotTime = booking.slotStart.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
      await this.notificationsService.createNotification({
        userId: booking.patient.userId,
        type: NotificationType.BOOKING_CONFIRMED,
        title: 'Appointment Confirmed',
        message: `Dr. ${booking.doctor.user?.name || 'Specialist'} has confirmed your video consultation for ${slotTime}. Your meet link is ready.`,
        relatedBookingId: booking.id,
      });
    } catch (err) {
      console.error('Failed to dispatch patient confirmation notification:', err);
    }

    return updatedBooking;
  }

  /**
   * Cancel booking (Patient or Doctor or Admin)
   */
  async cancelBooking(bookingId: string, userId: string, role: string) {
    const booking = await this.getBookingById(bookingId, userId, role);

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel an already completed booking');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    const updated = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.CANCELLED },
      include: BOOKING_INCLUDE,
    });

    // Notify the other party of cancellation
    try {
      const isDoctor = booking.doctor.userId === userId;
      const targetUserId = isDoctor ? booking.patient.userId : booking.doctor.userId;
      const actorName = isDoctor
        ? `Dr. ${booking.doctor.user?.name || 'Doctor'}`
        : booking.patient.user?.name || 'Patient';

      await this.notificationsService.createNotification({
        userId: targetUserId,
        type: NotificationType.BOOKING_CANCELLED,
        title: 'Appointment Cancelled',
        message: `${actorName} has cancelled the appointment scheduled for ${booking.slotStart.toLocaleDateString()}.`,
        relatedBookingId: booking.id,
      });
    } catch (err) {
      console.error('Failed to dispatch cancellation notification:', err);
    }

    return updated;
  }

  /**
   * Complete booking (Doctor or Admin)
   */
  async completeBooking(bookingId: string, userId: string, role: string) {
    const booking = await this.getBookingById(bookingId, userId, role);

    if (role !== 'ADMIN' && booking.doctor.userId !== userId) {
      throw new ForbiddenException(
        'Only the assigned doctor or admin can mark a booking as completed',
      );
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Cannot complete a cancelled booking');
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: BookingStatus.COMPLETED },
      include: BOOKING_INCLUDE,
    });
  }
}
