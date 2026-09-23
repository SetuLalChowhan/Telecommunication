import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AppointmentsService } from '../appointments.service.js';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { DayOfWeek } from '@prisma/client';

describe('AppointmentsService - Slot Calculation Characterization', () => {
  let service: AppointmentsService;
  let mockRepo: any;
  let mockGoogle: any;
  let mockNotifications: any;

  beforeEach(() => {
    // Only `Date` is faked: slot generation marks times that have already
    // passed as unavailable, so the clock has to be pinned for these fixed
    // 2026-09-25 expectations to stay meaningful.
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2026-09-25T08:00:00.000Z'));

    mockRepo = {
      findVerifiedDoctor: vi.fn(),
      findDoctorById: vi.fn(),
      findOrCreatePatient: vi.fn(),
      findPatientByUserId: vi.fn(),
      findDoctorProfileByUserId: vi.fn(),
      findDayOff: vi.fn().mockResolvedValue(null),
      findActiveSchedules: vi.fn().mockResolvedValue([]),
      findActiveBookingsForDate: vi.fn().mockResolvedValue([]),
      findConflictInTx: vi.fn().mockResolvedValue(null),
      createBookingInTx: vi.fn(),
      acquireAdvisoryLock: vi.fn().mockResolvedValue(undefined),
      findBookings: vi.fn(),
      findBookingById: vi.fn(),
      updateBooking: vi.fn(),
      runTransaction: vi.fn((fn) => fn(mockRepo)),
    };

    mockGoogle = { createMeetingEvent: vi.fn() };
    mockNotifications = { createNotification: vi.fn() };

    service = new AppointmentsService(mockRepo, mockGoogle, mockNotifications);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('throws NotFoundException if doctor is not found or not verified', async () => {
    mockRepo.findVerifiedDoctor.mockResolvedValue(null);

    await expect(
      service.getAvailableSlots({ doctorId: 'doc-123', date: '2026-09-25' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('throws BadRequestException on malformed date string', async () => {
    mockRepo.findVerifiedDoctor.mockResolvedValue({ id: 'doc-123', verified: true });

    await expect(
      service.getAvailableSlots({ doctorId: 'doc-123', date: 'invalid-date' }),
    ).rejects.toThrow(BadRequestException);
  });

  it('returns empty slots and isDayOff=true when doctor has scheduled a day off', async () => {
    mockRepo.findVerifiedDoctor.mockResolvedValue({ id: 'doc-123', verified: true });
    mockRepo.findDayOff.mockResolvedValue({
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
    mockRepo.findVerifiedDoctor.mockResolvedValue({ id: 'doc-123', verified: true });
    mockRepo.findDayOff.mockResolvedValue(null);

    // 2026-09-25 is Friday
    mockRepo.findActiveSchedules.mockResolvedValue([
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
    mockRepo.findActiveBookingsForDate.mockResolvedValue([
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

  it('marks slots that already passed as unavailable with a PAST reason', async () => {
    // The clock is pinned to 08:00 UTC and this schedule starts at 07:00.
    mockRepo.findVerifiedDoctor.mockResolvedValue({ id: 'doc-123', verified: true });
    mockRepo.findDayOff.mockResolvedValue(null);
    mockRepo.findActiveSchedules.mockResolvedValue([
      {
        id: 'avail-1',
        doctorId: 'doc-123',
        dayOfWeek: DayOfWeek.FRIDAY,
        startTime: '07:00',
        endTime: '09:00',
        consultationDuration: 30,
        isActive: true,
      },
    ]);
    mockRepo.findActiveBookingsForDate.mockResolvedValue([]);

    const result = await service.getAvailableSlots({
      doctorId: 'doc-123',
      date: '2026-09-25',
    });

    // 07:00, 07:30 and 08:00 have passed; 08:30 has not started yet.
    expect(result.slots.map((slot) => slot.reason)).toEqual([
      'PAST',
      'PAST',
      'PAST',
      null,
    ]);
    expect(result.slots[3].isAvailable).toBe(true);
  });

  it('returns empty slots when doctor has no active schedule for that day of week', async () => {
    mockRepo.findVerifiedDoctor.mockResolvedValue({ id: 'doc-123', verified: true });
    mockRepo.findDayOff.mockResolvedValue(null);
    mockRepo.findActiveSchedules.mockResolvedValue([]);

    const result = await service.getAvailableSlots({
      doctorId: 'doc-123',
      date: '2026-09-25',
    });

    expect(result.isDayOff).toBe(false);
    expect(result.slots).toEqual([]);
    expect(result.message).toBe('No active schedule for this day');
  });
});
