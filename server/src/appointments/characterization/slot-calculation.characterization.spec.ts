import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AppointmentsService } from '../appointments.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { GoogleService } from '../../google/google.service.js';
import { NotificationsService } from '../../notifications/notifications.service.js';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { DayOfWeek } from '@prisma/client';

describe('AppointmentsService - Slot Calculation Characterization', () => {
  let service: AppointmentsService;
  let mockPrisma: any;
  let mockGoogle: any;
  let mockNotifications: any;

  beforeEach(() => {
    mockPrisma = {
      doctorProfile: {
        findFirst: vi.fn(),
      },
      doctorDayOff: {
        findFirst: vi.fn(),
      },
      availability: {
        findMany: vi.fn(),
      },
      booking: {
        findMany: vi.fn(),
      },
    };

    mockGoogle = {
      createMeetingEvent: vi.fn(),
    };

    mockNotifications = {
      createNotification: vi.fn(),
    };

    service = new AppointmentsService(mockPrisma, mockGoogle, mockNotifications);
  });

  it('throws NotFoundException if doctor is not found or not verified', async () => {
    mockPrisma.doctorProfile.findFirst.mockResolvedValue(null);

    await expect(
      service.getAvailableSlots({ doctorId: 'doc-123', date: '2026-09-25' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws BadRequestException on malformed date string', async () => {
    mockPrisma.doctorProfile.findFirst.mockResolvedValue({ id: 'doc-123', verified: true });

    await expect(
      service.getAvailableSlots({ doctorId: 'doc-123', date: 'invalid-date' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns empty slots and isDayOff=true when doctor has scheduled a day off', async () => {
    mockPrisma.doctorProfile.findFirst.mockResolvedValue({ id: 'doc-123', verified: true });
    mockPrisma.doctorDayOff.findFirst.mockResolvedValue({
      id: 'day-off-1',
      doctorId: 'doc-123',
      date: new Date('2026-09-25T00:00:00.000Z'),
      reason: 'Medical Conference',
    });

    const result = await service.getAvailableSlots({
      doctorId: 'doc-123',
      date: '2026-09-25',
    });

    expect(result.isDayOff).toBe(true);
    expect(result.slots).toEqual([]);
    expect(result.reason).toBe('Medical Conference');
  });

  it('generates 30-minute interval slots and marks overlapping bookings as unavailable', async () => {
    mockPrisma.doctorProfile.findFirst.mockResolvedValue({ id: 'doc-123', verified: true });
    mockPrisma.doctorDayOff.findFirst.mockResolvedValue(null);

    // 2026-09-25 is Friday
    mockPrisma.availability.findMany.mockResolvedValue([
      {
        id: 'avail-1',
        doctorId: 'doc-123',
        dayOfWeek: DayOfWeek.FRIDAY,
        startTime: '09:00',
        endTime: '11:00',
        consultationDuration: 30,
        isActive: true,
      },
    ]);

    // Existing booking from 09:30 to 10:00
    mockPrisma.booking.findMany.mockResolvedValue([
      {
        slotStart: new Date('2026-09-25T09:30:00.000Z'),
        slotEnd: new Date('2026-09-25T10:00:00.000Z'),
      },
    ]);

    const result = await service.getAvailableSlots({
      doctorId: 'doc-123',
      date: '2026-09-25',
    });

    expect(result.isDayOff).toBe(false);
    expect(result.slots.length).toBe(4); // 09:00, 09:30, 10:00, 10:30

    expect(result.slots[0]).toMatchObject({
      startTime: '09:00',
      endTime: '09:30',
      isAvailable: true,
    });

    expect(result.slots[1]).toMatchObject({
      startTime: '09:30',
      endTime: '10:00',
      isAvailable: false, // Booked!
    });

    expect(result.slots[2]).toMatchObject({
      startTime: '10:00',
      endTime: '10:30',
      isAvailable: true,
    });

    expect(result.slots[3]).toMatchObject({
      startTime: '10:30',
      endTime: '11:00',
      isAvailable: true,
    });
  });

  it('returns empty slots when doctor has no active schedule for that day of week', async () => {
    mockPrisma.doctorProfile.findFirst.mockResolvedValue({ id: 'doc-123', verified: true });
    mockPrisma.doctorDayOff.findFirst.mockResolvedValue(null);
    mockPrisma.availability.findMany.mockResolvedValue([]);

    const result = await service.getAvailableSlots({
      doctorId: 'doc-123',
      date: '2026-09-25',
    });

    expect(result.isDayOff).toBe(false);
    expect(result.slots).toEqual([]);
    expect(result.message).toBe('No active schedule for this day');
  });
});
