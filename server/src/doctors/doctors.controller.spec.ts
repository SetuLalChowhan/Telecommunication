import { Test, TestingModule } from '@nestjs/testing';
import { DoctorController } from './doctors.controller.js';
import { DoctorService } from './doctors.service.js';
import { PrismaService } from '../prisma/prisma.service.js';

describe('DoctorController', () => {
  let controller: DoctorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorController],
      providers: [
        {
          provide: DoctorService,
          useValue: {},
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<DoctorController>(DoctorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
