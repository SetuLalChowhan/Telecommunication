import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppointmentsService } from '../appointments.service.js';
import { BookingStatus, NotificationType } from '@prisma/client';
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';

describe('AppointmentsService - Booking Transitions Characterization', () => {
  let service: AppointmentsService;
  let mockPrisma: any;
  let mockGoogle: any;
  let mockNotifications: any;

  beforeEach(() => {
    mockPrisma = {
      patientProfile: {
        findUnique: vi.fn(),
        create: vi.fn(),
      },
      doctorProfile: {
        findFirst: vi.fn(),
        findUnique: vi.fn(),
      },
      doctorDayOff: {
        findFirst: vi.fn().mockResolvedValue(null),
      },
      availability: {
        findMany: vi.fn().mockResolvedValue([
          {
            dayOfWeek: 'FRIDAY',
            startTime: '09:00',
            endTime: '12:00',
            consultationDuration: 30,
            isActive: true,
          },
        ]),
      },
      booking: {
        findFirst: vi.fn(),
        findUnique: vi.fn(),
        findMany: vi.fn(),
        create: vi.fn(),
        update: vi.fn(),
      },
      $executeRaw: vi.fn().mockResolvedValue(1),
      $transaction: vi.fn((cb) => cb(mockPrisma)),
    };

    mockGoogle = {
      createMeetingEvent: vi.fn(),
    };

    mockNotifications = {
      createNotification: vi.fn().mockResolvedValue({ id: 'notif-1' }),
    };

    service = new AppointmentsService(mockPrisma, mockGoogle, mockNotifications);
  });

  describe('createBooking', () => {
    it('throws NotFoundException when doctor does not exist or is unverified', async () => {
      mockPrisma.patientProfile.findUnique.mockResolvedValue({ id: 'pat-1', userId: 'user-pat-1' });
      mockPrisma.doctorProfile.findUnique.mockResolvedValue(null);

      await expect(
        service.createBooking('user-pat-1', {
          doctorId: 'doc-1',
          slotStart: '2026-09-25T10:00:00.000Z',
          slotEnd: '2026-09-25T10:30:00.000Z',
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('throws ConflictException when requested slot has an overlapping active booking', async () => {
      mockPrisma.patientProfile.findUnique.mockResolvedValue({ id: 'pat-1', userId: 'user-pat-1' });
      mockPrisma.doctorProfile.findUnique.mockResolvedValue({ id: 'doc-1', verified: true, userId: 'user-doc-1' });

      // Simulate active conflict in DB inside transaction
      mockPrisma.booking.findFirst.mockResolvedValue({
        id: 'existing-booking',
        status: BookingStatus.PENDING,
      });

      await expect(
        service.createBooking('user-pat-1', {
          doctorId: 'doc-1',
          slotStart: '2026-09-25T10:00:00.000Z',
          slotEnd: '2026-09-25T10:30:00.000Z',
        }),
      ).rejects.toThrow(ConflictException);
    });

    it('successfully creates PENDING booking and dispatches notifications', async () => {
      mockPrisma.patientProfile.findUnique.mockResolvedValue({
        id: 'pat-1',
        userId: 'user-pat-1',
        user: { name: 'Alice Patient' },
      });
      mockPrisma.doctorProfile.findUnique.mockResolvedValue({
        id: 'doc-1',
        userId: 'user-doc-1',
        verified: true,
        user: { name: 'Dr. Bob' },
      });
      mockPrisma.booking.findFirst.mockResolvedValue(null); // No conflict

      const createdBooking = {
        id: 'booking-101',
        doctorId: 'doc-1',
        patientId: 'pat-1',
        slotStart: new Date('2026-09-25T10:00:00.000Z'),
        slotEnd: new Date('2026-09-25T10:30:00.000Z'),
        status: BookingStatus.PENDING,
      };
      mockPrisma.booking.create.mockResolvedValue(createdBooking);

      const result = await service.createBooking('user-pat-1', {
        doctorId: 'doc-1',
        slotStart: '2026-09-25T10:00:00.000Z',
        slotEnd: '2026-09-25T10:30:00.000Z',
      });

      expect(result.status).toBe(BookingStatus.PENDING);
      expect(mockNotifications.createNotification).toHaveBeenCalledTimes(2);
    });
  });

  describe('confirmBooking', () => {
    const existingBooking = {
      id: 'booking-101',
      status: BookingStatus.PENDING,
      doctor: { userId: 'user-doc-1', user: { name: 'Dr. Bob' } },
      patient: { userId: 'user-pat-1', user: { name: 'Alice', email: 'alice@example.com' } },
      slotStart: new Date('2026-09-25T10:00:00.000Z'),
      slotEnd: new Date('2026-09-25T10:30:00.000Z'),
      meetLink: null,
      googleEventId: null,
    };

    it('throws ForbiddenException when a different doctor attempts confirmation', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(existingBooking);

      await expect(
        service.confirmBooking('booking-101', 'intruder-doc-user', 'DOCTOR'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws BadRequestException when confirming an already confirmed booking', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        ...existingBooking,
        status: BookingStatus.CONFIRMED,
      });

      await expect(
        service.confirmBooking('booking-101', 'user-doc-1', 'DOCTOR'),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException when confirming a cancelled booking', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        ...existingBooking,
        status: BookingStatus.CANCELLED,
      });

      await expect(
        service.confirmBooking('booking-101', 'user-doc-1', 'DOCTOR'),
      ).rejects.toThrow(BadRequestException);
    });

    it('transitions PENDING to CONFIRMED with Google Meet link', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(existingBooking);
      mockGoogle.createMeetingEvent.mockResolvedValue({
        meetLink: 'https://meet.google.com/abc-defg-hij',
        googleEventId: 'google-evt-1',
      });
      mockPrisma.booking.update.mockResolvedValue({
        ...existingBooking,
        status: BookingStatus.CONFIRMED,
        meetLink: 'https://meet.google.com/abc-defg-hij',
      });

      const result = await service.confirmBooking('booking-101', 'user-doc-1', 'DOCTOR');

      expect(result.status).toBe(BookingStatus.CONFIRMED);
      expect(mockPrisma.booking.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            status: BookingStatus.CONFIRMED,
            meetLink: 'https://meet.google.com/abc-defg-hij',
          }),
        }),
      );
      expect(mockNotifications.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.BOOKING_CONFIRMED,
          userId: 'user-pat-1',
        }),
      );
    });
  });

  describe('cancelBooking', () => {
    it('throws BadRequestException if booking is already completed', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        id: 'booking-101',
        status: BookingStatus.COMPLETED,
        doctor: { userId: 'user-doc-1' },
        patient: { userId: 'user-pat-1' },
      });

      await expect(
        service.cancelBooking('booking-101', 'user-pat-1', 'PATIENT'),
      ).rejects.toThrow(BadRequestException);
    });

    it('throws BadRequestException if booking is already cancelled', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        id: 'booking-101',
        status: BookingStatus.CANCELLED,
        doctor: { userId: 'user-doc-1' },
        patient: { userId: 'user-pat-1' },
      });

      await expect(
        service.cancelBooking('booking-101', 'user-pat-1', 'PATIENT'),
      ).rejects.toThrow(BadRequestException);
    });

    it('transitions to CANCELLED and dispatches cancellation notification to counterpart', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        id: 'booking-101',
        status: BookingStatus.CONFIRMED,
        doctor: { userId: 'user-doc-1', user: { name: 'Dr. Bob' } },
        patient: { userId: 'user-pat-1', user: { name: 'Alice' } },
        slotStart: new Date('2026-09-25T10:00:00.000Z'),
      });
      mockPrisma.booking.update.mockResolvedValue({
        id: 'booking-101',
        status: BookingStatus.CANCELLED,
      });

      const result = await service.cancelBooking('booking-101', 'user-pat-1', 'PATIENT');
      expect(result.status).toBe(BookingStatus.CANCELLED);
      expect(mockNotifications.createNotification).toHaveBeenCalledWith(
        expect.objectContaining({
          type: NotificationType.BOOKING_CANCELLED,
          userId: 'user-doc-1', // Notifies the doctor when patient cancels
        }),
      );
    });
  });

  describe('completeBooking', () => {
    it('throws ForbiddenException if a non-assigned user tries to complete', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        id: 'booking-101',
        status: BookingStatus.CONFIRMED,
        doctor: { userId: 'user-doc-1' },
        patient: { userId: 'user-pat-1' },
      });

      await expect(
        service.completeBooking('booking-101', 'user-pat-1', 'PATIENT'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('throws BadRequestException if attempting to complete a cancelled booking', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        id: 'booking-101',
        status: BookingStatus.CANCELLED,
        doctor: { userId: 'user-doc-1' },
        patient: { userId: 'user-pat-1' },
      });

      await expect(
        service.completeBooking('booking-101', 'user-doc-1', 'DOCTOR'),
      ).rejects.toThrow(BadRequestException);
    });

    it('successfully transitions CONFIRMED booking to COMPLETED', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        id: 'booking-101',
        status: BookingStatus.CONFIRMED,
        doctor: { userId: 'user-doc-1' },
        patient: { userId: 'user-pat-1' },
      });
      mockPrisma.booking.update.mockResolvedValue({
        id: 'booking-101',
        status: BookingStatus.COMPLETED,
      });

      const result = await service.completeBooking('booking-101', 'user-doc-1', 'DOCTOR');
      expect(result.status).toBe(BookingStatus.COMPLETED);
    });
  });
});
