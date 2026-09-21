import { Test, TestingModule } from '@nestjs/testing';
import { DoctorService } from './doctors.service.js';
import { DoctorRepository } from './doctors.repository.js';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service.js';
import { vi } from 'vitest';

describe('DoctorService', () => {
  let service: DoctorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorService,
        {
          provide: DoctorRepository,
          useValue: {
            findProfileByUserId: vi.fn(),
            findProfileById: vi.fn(),
            findPublicDoctor: vi.fn(),
            countCompletedBookings: vi.fn(),
          },
        },
        {
          provide: CloudinaryService,
          useValue: {
            uploadFile: vi.fn(),
            deleteFile: vi.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<DoctorService>(DoctorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
