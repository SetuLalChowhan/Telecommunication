import { Injectable } from '@nestjs/common';
import { BookingStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

export const PATIENT_PROFILE_INCLUDE = {
  user: {
    select: {
      id: true,
      name: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      image: true,
      dateOfBirth: true,
      role: true,
      createdAt: true,
    },
  },
  _count: {
    select: {
      bookings: true,
      medicalReports: true,
    },
  },
} as const;

const BOOKING_WITH_DOCTOR_INCLUDE = {
  doctor: {
    include: {
      user: { select: { id: true, name: true, image: true, email: true, phone: true } },
      specialties: { include: { specialty: true } },
      qualifications: true,
    },
  },
} as const;

@Injectable()
export class PatientsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateProfile(userId: string) {
    let profile = await this.prisma.patientProfile.findUnique({
      where: { userId },
      include: PATIENT_PROFILE_INCLUDE,
    });

    if (!profile) {
      profile = await this.prisma.patientProfile.create({
        data: { userId },
        include: PATIENT_PROFILE_INCLUDE,
      });
    }

    return profile;
  }

  async findById(patientId: string) {
    return this.prisma.patientProfile.findUnique({
      where: { id: patientId },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, image: true, dateOfBirth: true } },
        medicalReports: { orderBy: { uploadedAt: 'desc' }, take: 10 },
      },
    });
  }

  async updateUser(userId: string, data: Record<string, any>) {
    return this.prisma.user.update({ where: { id: userId }, data });
  }

  async updateProfile(profileId: string, data: Record<string, any>) {
    return this.prisma.patientProfile.update({
      where: { id: profileId },
      data,
      include: PATIENT_PROFILE_INCLUDE,
    });
  }

  async getDashboardStats(patientId: string, now: Date) {
    return Promise.all([
      this.prisma.booking.count({ where: { patientId } }),
      this.prisma.booking.count({ where: { patientId, status: BookingStatus.CONFIRMED, slotEnd: { gte: now } } }),
      this.prisma.booking.count({ where: { patientId, status: BookingStatus.PENDING } }),
      this.prisma.booking.count({ where: { patientId, status: BookingStatus.COMPLETED } }),
      this.prisma.booking.count({ where: { patientId, status: BookingStatus.CANCELLED } }),
      this.prisma.medicalReport.count({ where: { patientId } }),
      this.prisma.booking.findFirst({
        where: { patientId, status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] }, slotEnd: { gte: now } },
        orderBy: { slotStart: 'asc' },
        include: BOOKING_WITH_DOCTOR_INCLUDE,
      }),
      this.prisma.booking.findMany({
        where: { patientId },
        orderBy: { slotStart: 'desc' },
        take: 6,
        include: BOOKING_WITH_DOCTOR_INCLUDE,
      }),
      this.prisma.doctorProfile.findMany({
        where: { verified: true },
        take: 4,
        orderBy: { rating: 'desc' },
        include: {
          user: { select: { id: true, name: true, image: true } },
          specialties: { include: { specialty: true } },
        },
      }),
    ]);
  }

  async findLatestActiveBooking(patientId: string) {
    return this.prisma.booking.findFirst({
      where: { patientId, status: { in: [BookingStatus.CONFIRMED, BookingStatus.PENDING] } },
      orderBy: { slotStart: 'desc' },
      include: {
        doctor: {
          include: {
            user: { select: { id: true, name: true, image: true, email: true, phone: true } },
            specialties: { include: { specialty: true } },
            qualifications: true,
          },
        },
      },
    });
  }
}
