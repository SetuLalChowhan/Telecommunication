import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DoctorService } from '../doctors.service.js';
import { generateDoctorSlug, slugify } from '../../common/utils/slug.utils.js';
import { NotFoundException } from '@nestjs/common';

describe('Doctor Profile & Slug Characterization', () => {
  let service: DoctorService;
  let mockPrisma: any;
  let mockCloudinary: any;

  beforeEach(() => {
    mockPrisma = {
      doctorProfile: {
        findUnique: vi.fn(),
        findFirst: vi.fn(),
        update: vi.fn(),
      },
      user: {
        update: vi.fn(),
      },
      specialty: {
        findMany: vi.fn(),
      },
      doctorSpecialty: {
        deleteMany: vi.fn(),
        createMany: vi.fn(),
      },
      booking: {
        count: vi.fn().mockResolvedValue(15),
      },
      $transaction: vi.fn((cb) => cb(mockPrisma)),
    };

    mockCloudinary = {
      uploadFile: vi.fn().mockResolvedValue({
        secureUrl: 'https://res.cloudinary.com/demo/image/upload/avatar.png',
        publicId: 'avatars/avatar1',
      }),
      deleteFile: vi.fn(),
    };

    service = new DoctorService(mockPrisma, mockCloudinary);
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
      mockPrisma.doctorProfile.findUnique.mockResolvedValue(null);

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
      mockPrisma.doctorProfile.findUnique.mockResolvedValue(profile);

      const result = await service.getMyProfile('user-1');
      expect(result).toMatchObject({
        id: 'doc-1',
        totalPatientsConsulted: 15,
      });
    });
  });

  describe('DoctorService.updateMyProfile', () => {
    it('throws NotFoundException if doctor does not exist', async () => {
      mockPrisma.doctorProfile.findUnique.mockResolvedValue(null);

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
      mockPrisma.doctorProfile.findUnique.mockResolvedValue(existingProfile);

      const updatedProfile = {
        ...existingProfile,
        bio: 'Updated bio',
        fee: 150,
        user: {
          name: 'Dr. New Name',
          image: 'https://res.cloudinary.com/demo/image/upload/avatar.png',
        },
      };
      mockPrisma.doctorProfile.update.mockResolvedValue(updatedProfile);

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
      expect(mockPrisma.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'user-1' },
          data: expect.objectContaining({
            name: 'Dr. New Name',
            image: 'https://res.cloudinary.com/demo/image/upload/avatar.png',
          }),
        }),
      );
      expect(result).toMatchObject({
        bio: 'Updated bio',
        totalPatientsConsulted: 15,
      });
    });
  });
});
