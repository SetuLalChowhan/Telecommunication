import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto.js';

const PATIENT_PROFILE_INCLUDE = {
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

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  private async getOwnProfileOrThrow(userId: string) {
    let profile = await this.prisma.patientProfile.findUnique({
      where: { userId },
      include: PATIENT_PROFILE_INCLUDE,
    });

    // In case profile was not created by hook
    if (!profile) {
      profile = await this.prisma.patientProfile.create({
        data: { userId },
        include: PATIENT_PROFILE_INCLUDE,
      });
    }

    return profile;
  }

  async getMyProfile(userId: string) {
    return this.getOwnProfileOrThrow(userId);
  }

  async updateMyProfile(userId: string, dto: UpdatePatientProfileDto) {
    const profile = await this.getOwnProfileOrThrow(userId);

    return this.prisma.patientProfile.update({
      where: { id: profile.id },
      data: {
        address: dto.address,
        gender: dto.gender,
        bloodGroup: dto.bloodGroup,
        emergencyContactName: dto.emergencyContactName,
        emergencyContactPhone: dto.emergencyContactPhone,
      },
      include: PATIENT_PROFILE_INCLUDE,
    });
  }

  async getPatientById(patientId: string) {
    const patient = await this.prisma.patientProfile.findUnique({
      where: { id: patientId },
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
        medicalReports: {
          orderBy: { uploadedAt: 'desc' },
          take: 10,
        },
      },
    });

    if (!patient) {
      throw new NotFoundException(`Patient with ID "${patientId}" not found`);
    }

    return patient;
  }
}
