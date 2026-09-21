import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DoctorService } from '../doctors.service.js';
import { generateDoctorSlug, slugify } from '../../common/utils/slug.utils.js';
import { NotFoundException } from '@nestjs/common';

describe('Doctor Profile & Slug Characterization', () => {
  let service: DoctorService;
  let mockRepo: any;
  let mockCloudinary: any;

  beforeEach(() => {
    mockRepo = {
      findProfileByUserId: vi.fn(),
      findProfileById: vi.fn(),
      findPublicDoctor: vi.fn(),
      findSlugConflict: vi.fn().mockResolvedValue(null),
      countActiveSpecialties: vi.fn().mockResolvedValue(0),
      countCompletedBookings: vi.fn().mockResolvedValue(15),
      listPublicDoctors: vi.fn(),
      getDashboardStats: vi.fn(),
      updateUser: vi.fn().mockResolvedValue({}),
      updateProfileInTx: vi.fn(),
      listAvailability: vi.fn(),
      findAvailabilityById: vi.fn(),
      createAvailability: vi.fn(),
      updateAvailability: vi.fn(),
      deleteAvailability: vi.fn(),
      findActiveAvailabilityByDay: vi.fn(),
      listDaysOff: vi.fn(),
      upsertDayOff: vi.fn(),
      findDayOffById: vi.fn(),
      deleteDayOff: vi.fn(),
      findDayOffForDate: vi.fn(),
      listFutureDaysOff: vi.fn(),
      createDocument: vi.fn(),
      listPatientBookings: vi.fn(),
    };

    mockCloudinary = {
      uploadFile: vi.fn().mockResolvedValue({
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/avatar.png',
        publicId: 'avatars/avatar1',
      }),
      deleteFile: vi.fn(),
    };

    service = new DoctorService(mockRepo, mockCloudinary);
  });

  describe('slugify & generateDoctorSlug pure utility', () => {
    it('generates clean URL-safe slugs with lowercase and hyphens', () => {
      expect(slugify('Dr. John Doe, MD')).toBe('dr-john-doe-md');
      expect(slugify('Cardiologist & Specialist')).toBe('cardiologist-and-specialist');
      expect(slugify('  Messy   Spacing   ')).toBe('messy-spacing');
    });

    it('generates doctor slug appending short unique id suffix', () => {
      const slug = generateDoctorSlug('Dr. Alice Smith', 'usr-12345678-abcd');
      expect(slug).toMatch(/^dr-alice-smith-[a-z0-9\-]+$/);
    });
  });

  describe('DoctorService.getMyProfile', () => {
    it('throws NotFoundException if profile does not exist for the user', async () => {
      mockRepo.findProfileByUserId.mockResolvedValue(null);

      await expect(service.getMyProfile('unknown-user')).rejects.toThrow(NotFoundException);
    });

    it('returns doctor profile when found', async () => {
      const profile = {
        id: 'doc-1',
        userId: 'user-1',
        bio: 'Expert surgeon',
        fee: 100,
        user: { name: 'Dr. John', email: 'john@example.com' },
        specialties: [],
      };
      mockRepo.findProfileByUserId.mockResolvedValue(profile);
      mockRepo.findProfileById.mockResolvedValue(profile);

      const result = await service.getMyProfile('user-1');
      expect(result).toMatchObject({
        id: 'doc-1',
        totalPatientsConsulted: 15,
      });
    });
  });

  describe('DoctorService.updateMyProfile', () => {
    it('throws NotFoundException if doctor does not exist', async () => {
      mockRepo.findProfileByUserId.mockResolvedValue(null);

      await expect(
        service.updateMyProfile('user-1', { bio: 'New bio' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('updates user name, uploads avatar to Cloudinary, and updates profile within transaction', async () => {
      const existingProfile = {
        id: 'doc-1',
        userId: 'user-1',
        slug: 'dr-old-slug',
        user: { name: 'Dr. Old', image: null },
      };
      mockRepo.findProfileByUserId.mockResolvedValue(existingProfile);

      const updatedProfile = {
        ...existingProfile,
        bio: 'Updated bio',
        fee: 150,
        user: {
          name: 'Dr. New Name',
          image: 'https://res.cloudinary.com/demo/image/upload/avatar.png',
        },
        specialties: [],
      };
      mockRepo.updateProfileInTx.mockResolvedValue(updatedProfile);

      const dummyFile: any = {
        buffer: Buffer.from('fake-image-data'),
        mimetype: 'image/png',
        originalname: 'avatar.png',
      };

      const result = await service.updateMyProfile(
        'user-1',
        {
          name: 'Dr. New Name',
          bio: 'Updated bio',
          fee: 150,
        },
        dummyFile,
      );

      expect(mockCloudinary.uploadFile).toHaveBeenCalledWith(
        dummyFile,
        'telehealth/avatars',
        expect.objectContaining({
          transformation: expect.arrayContaining([
            expect.objectContaining({ width: 400, height: 400, crop: 'fill', gravity: 'face' }),
          ]),
        }),
      );
      expect(mockRepo.updateUser).toHaveBeenCalledWith(
        'user-1',
        expect.objectContaining({
          name: 'Dr. New Name',
          image: 'https://res.cloudinary.com/demo/image/upload/avatar.png',
        }),
      );
      expect(result).toMatchObject({
        bio: 'Updated bio',
        totalPatientsConsulted: 15,
      });
    });
  });
});
