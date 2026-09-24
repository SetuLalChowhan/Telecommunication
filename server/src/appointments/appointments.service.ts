import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus, DayOfWeek, NotificationType } from '@prisma/client';
import { AppointmentsRepository } from './appointments.repository.js';
import { CreateBookingDto } from './dto/create-booking.dto.js';
import { SlotQueryDto } from './dto/slot-query.dto.js';
import { BookingQueryDto } from './dto/booking-query.dto.js';
import { createPaginationMeta } from '../common/pagination/pagination.utils.js';
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

// -- Pure slot helpers (no I/O — easy to unit-test) -------------------------

/**
 * Platform timezone offset (Asia/Dhaka is UTC+6 = +06:00).
 * Doctors configure availability hours in local wall-clock time.
 */
export const APP_TIMEZONE_OFFSET = '+06:00';
export const APP_TIMEZONE_OFFSET_HOURS = 6;

export function parseLocalSlot(date: string, time: string): Date {
  return new Date(`${date}T${time}:00${APP_TIMEZONE_OFFSET}`);
}

export function getLocalCalendarDate(instant: Date): { dateStr: string; dayOfWeek: DayOfWeek } {
  const localMs = instant.getTime() + APP_TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000;
  const localDate = new Date(localMs);
  const year = localDate.getUTCFullYear();
  const month = String(localDate.getUTCMonth() + 1).padStart(2, '0');
  const day = String(localDate.getUTCDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  const dayOfWeek = DAYS_MAP[localDate.getUTCDay()];
  return { dateStr, dayOfWeek };
}

/**
 * Why a generated slot cannot be booked. The client renders every slot of the
 * day and disables the unavailable ones, so it needs the reason, not just a
 * boolean — "already booked" and "the time has passed" read very differently.
 */
export type SlotUnavailableReason = 'PAST' | 'BOOKED';

function generateSlots(
  date: string,
  schedules: Array<{
    startTime: string;
    endTime: string;
    consultationDuration: number | null;
  }>,
  existingBookings: Array<{ slotStart: Date; slotEnd: Date }>,
  now: Date,
) {
  const slots: Array<{
    slotStart: string;
    slotEnd: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    reason: SlotUnavailableReason | null;
  }> = [];

  const isOccupied = (s: Date, e: Date) =>
    existingBookings.some(
      (b) =>
        (s >= b.slotStart && s < b.slotEnd) ||
        (e > b.slotStart && e <= b.slotEnd) ||
        (s <= b.slotStart && e >= b.slotEnd),
    );

  for (const schedule of schedules) {
    const duration = schedule.consultationDuration || 30;
    const [startH, startM] = schedule.startTime.split(':').map(Number);
    const [endH, endM] = schedule.endTime.split(':').map(Number);

    let cur = startH * 60 + startM;
    const stop = endH * 60 + endM;

    while (cur + duration <= stop) {
      const next = cur + duration;
      const sH = String(Math.floor(cur / 60)).padStart(2, '0');
      const sM = String(cur % 60).padStart(2, '0');
      const eH = String(Math.floor(next / 60)).padStart(2, '0');
      const eM = String(next % 60).padStart(2, '0');

      const slotStart = parseLocalSlot(date, `${sH}:${sM}`);
      const slotEnd = parseLocalSlot(date, `${eH}:${eM}`);

      // `createBooking` refuses past slots, so mark them unavailable here too —
      // otherwise the UI offers a time the API will reject on submit.
      const reason: SlotUnavailableReason | null =
        slotStart.getTime() <= now.getTime()
          ? 'PAST'
          : isOccupied(slotStart, slotEnd)
            ? 'BOOKED'
            : null;

      slots.push({
        slotStart: slotStart.toISOString(),
        slotEnd: slotEnd.toISOString(),
        startTime: `${sH}:${sM}`,
        endTime: `${eH}:${eM}`,
        isAvailable: reason === null,
        reason,
      });

      cur = next;
    }
  }

  return slots;
}

function isValidSlotAgainstSchedules(
  slotStart: Date,
  slotEnd: Date,
  dateStr: string,
  schedules: Array<{
    startTime: string;
    endTime: string;
    consultationDuration: number | null;
  }>,
): boolean {
  for (const schedule of schedules) {
    const duration = schedule.consultationDuration || 30;
    const [startH, startM] = schedule.startTime.split(':').map(Number);
    const [endH, endM] = schedule.endTime.split(':').map(Number);

    let cur = startH * 60 + startM;
    const stop = endH * 60 + endM;

    while (cur + duration <= stop) {
      const next = cur + duration;
      const sH = String(Math.floor(cur / 60)).padStart(2, '0');
      const sM = String(cur % 60).padStart(2, '0');
      const eH = String(Math.floor(next / 60)).padStart(2, '0');
      const eM = String(next % 60).padStart(2, '0');

      const validStart = parseLocalSlot(dateStr, `${sH}:${sM}`);
      const validEnd = parseLocalSlot(dateStr, `${eH}:${eM}`);

      if (
        slotStart.getTime() === validStart.getTime() &&
        slotEnd.getTime() === validEnd.getTime()
      ) {
        return true;
      }

      cur = next;
    }
  }
  return false;
}

// -- Service ---------------------------------------------------------------

@Injectable()
export class AppointmentsService {
  constructor(
    private readonly repo: AppointmentsRepository,
    private readonly googleService: GoogleService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getAvailableSlots(query: SlotQueryDto) {
    const { doctorId, date } = query;

    const doctor = await this.repo.findVerifiedDoctor(doctorId);
    if (!doctor) throw new NotFoundException('Doctor not found or not verified');

    const targetDate = new Date(`${date}T12:00:00.000Z`);
    if (isNaN(targetDate.getTime())) {
      throw new BadRequestException('Invalid date format. Expected YYYY-MM-DD');
    }

    const dayOffDate = new Date(`${date}T00:00:00.000Z`);
    const dayOff = await this.repo.findDayOff(doctor.id, dayOffDate);
    if (dayOff) {
      return {
        date,
        isDayOff: true,
        reason: dayOff.reason || 'Doctor is unavailable on this date',
        slots: [],
      };
    }

    const dayOfWeek = DAYS_MAP[targetDate.getUTCDay()];
    const schedules = await this.repo.findActiveSchedules(doctor.id, dayOfWeek);

    if (schedules.length === 0) {
      return { date, isDayOff: false, message: 'No active schedule for this day', slots: [] };
    }

    const start = new Date(`${date}T00:00:00.000${APP_TIMEZONE_OFFSET}`);
    const end = new Date(`${date}T23:59:59.999${APP_TIMEZONE_OFFSET}`);
    const existing = await this.repo.findActiveBookingsForDate(doctor.id, start, end);

    return {
      date,
      isDayOff: false,
      slots: generateSlots(date, schedules, existing, new Date()),
    };
  }

  async createBooking(userId: string, dto: CreateBookingDto) {
    const patient = await this.repo.findOrCreatePatient(userId);

    if (dto.phone?.trim()) {
      try {
        await this.repo.updateUserPhone(userId, dto.phone.trim());
      } catch (err) {
        // Non-blocking if phone update fails
      }
    }

    const doctor = await this.repo.findDoctorById(dto.doctorId);
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

    const { dateStr, dayOfWeek } = getLocalCalendarDate(slotStart);

    const slotDateOnly = new Date(`${dateStr}T00:00:00.000Z`);
    const dayOff = await this.repo.findDayOff(dto.doctorId, slotDateOnly);
    if (dayOff) {
      throw new ConflictException(
        'Doctor is unavailable on this date: ' + (dayOff.reason || 'Day off'),
      );
    }

    const schedules = await this.repo.findActiveSchedules(dto.doctorId, dayOfWeek);

    if (schedules.length === 0) {
      throw new BadRequestException('Doctor has no available schedule on this day');
    }

    if (!isValidSlotAgainstSchedules(slotStart, slotEnd, dateStr, schedules)) {
      throw new BadRequestException(
        "The requested slot does not match the doctor's predefined availability schedule",
      );
    }

    const booking = await this.repo.runTransaction(async (tx) => {
      await this.repo.acquireAdvisoryLock(tx, dto.doctorId);

      const conflict = await this.repo.findConflictInTx(tx, dto.doctorId, slotStart, slotEnd);
      if (conflict) {
        throw new ConflictException(
          'This time slot is no longer available. Please select another slot.',
        );
      }

      return this.repo.createBookingInTx(
        tx,
        dto.doctorId,
        patient.id,
        slotStart,
        slotEnd,
        dto.notes,
      );
    });

    try {
      const patientName = patient.user?.name || 'A patient';
      const slotTime = slotStart.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });

      await this.notificationsService.createNotification({
        userId: doctor.userId,
        type: NotificationType.GENERAL,
        title: 'New Appointment Request',
        message: `${patientName} has requested a video consultation for ${slotTime}. Please review and confirm.`,
        relatedBookingId: booking.id,
      });

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
   * Builds the Prisma `where` scope for the current user's bookings.
   * Returns `null` when a PATIENT has no profile yet (no bookings to show).
   */
  private async resolveBookingScope(
    userId: string,
    role: string,
  ): Promise<Record<string, any> | null> {
    const where: Record<string, any> = {};

    if (role === 'DOCTOR') {
      const doctor = await this.repo.findDoctorProfileByUserId(userId);
      if (!doctor) throw new NotFoundException('Doctor profile not found');
      where.doctorId = doctor.id;
    } else if (role === 'PATIENT') {
      const patient = await this.repo.findPatientByUserId(userId);
      if (!patient) return null;
      where.patientId = patient.id;
    }

    return where;
  }

  async getMyBookings(userId: string, role: string, query: BookingQueryDto) {
    const where = await this.resolveBookingScope(userId, role);

    if (where === null) {
      return {
        data: [],
        meta: createPaginationMeta(query.page || 1, query.limit || 10, 0),
      };
    }

    if (query.status) where.status = query.status;

    const { rows, total } = await this.repo.findBookings(where, query);

    return {
      data: rows,
      meta: createPaginationMeta(query.page || 1, query.limit || 10, total),
    };
  }

  /**
   * Returns per-status booking counts for the current user, scoped by role.
   * Drives the status tabs from the backend instead of counting on the client.
   */
  async getMyBookingSummary(userId: string, role: string) {
    const summary = {
      all: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };

    const where = await this.resolveBookingScope(userId, role);
    if (where === null) return summary;

    const grouped = await this.repo.countBookingsByStatus(where);

    for (const group of grouped) {
      const count = group._count._all;
      summary.all += count;
      const key = String(group.status).toLowerCase();
      if (key in summary) {
        summary[key as keyof typeof summary] += count;
      }
    }

    return summary;
  }

  async getBookingById(bookingId: string, userId: string, role: string) {
    const booking = await this.repo.findBookingById(bookingId);

    if (!booking) {
      throw new NotFoundException(`Booking with ID "${bookingId}" not found`);
    }

    if (role !== 'ADMIN') {
      const isDoctor = booking.doctor.userId === userId;
      const isPatient = booking.patient.userId === userId;
      if (!isDoctor && !isPatient) {
        throw new ForbiddenException('You are not authorized to view this booking');
      }
    }

    return booking;
  }

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

    try {
      const result = await this.googleService.createMeetingEvent({
        doctorUserId: booking.doctor.userId,
        doctorName: booking.doctor.user?.name,
        patientEmail: booking.patient.user?.email || '',
        patientName: booking.patient.user?.name,
        slotStart: booking.slotStart,
        slotEnd: booking.slotEnd,
        bookingId: booking.id,
        notes: booking.notes,
        existingGoogleEventId: booking.googleEventId,
        existingMeetLink: booking.meetLink,
      });
      if (result?.meetLink) {
        meetLink = result.meetLink;
        googleEventId = result.googleEventId || null;
      }
    } catch (err) {
      console.error('Failed to create Google Meet event during confirmation:', err);
    }

    const updated = await this.repo.updateBooking(bookingId, {
      status: BookingStatus.CONFIRMED,
      meetLink,
      googleEventId,
    });

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

    return updated;
  }

  async cancelBooking(bookingId: string, userId: string, role: string) {
    const booking = await this.getBookingById(bookingId, userId, role);

    if (booking.status === BookingStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel an already completed booking');
    }
    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    const updated = await this.repo.updateBooking(bookingId, {
      status: BookingStatus.CANCELLED,
    });

    try {
      const isDoctor = booking.doctor.userId === userId;
      const targetUserId = isDoctor
        ? booking.patient.userId
        : booking.doctor.userId;
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

    return this.repo.updateBooking(bookingId, { status: BookingStatus.COMPLETED });
  }
}
