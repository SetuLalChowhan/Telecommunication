import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { UsersRepository } from './users.repository.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto.js';
import { UpdateUserSettingsDto } from './dto/update-settings.dto.js';
import { CloudinaryService } from '../common/cloudinary/cloudinary.service.js';
import { PaginationDto } from '../common/pagination/pagination.dto.js';
import { createPaginationMeta } from '../common/pagination/pagination.utils.js';

@Injectable()
export class UsersService {
  constructor(
    private readonly repo: UsersRepository,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  async findAll(query: PaginationDto = {}) {
    const page = query.page || 1;
    const limit = query.limit || 10;
    const { rows, total } = await this.repo.findMany(query);

    return {
      data: rows,
      meta: createPaginationMeta(page, limit, total),
    };
  }

  async findOne(id: string) {
    const user = await this.repo.findById(id);

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }

  async create(dto: CreateUserDto) {
    const existing = await this.repo.findByEmail(dto.email);

    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    const fullName =
      dto.name ||
      [dto.firstName, dto.lastName].filter(Boolean).join(' ') ||
      null;

    return this.repo.create({
      name: fullName,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      phone: dto.phone,
      role: dto.role ?? Role.PATIENT,
    });
  }

  /**
   * User self-profile update with Cloudinary image upload and old asset cleanup
   */
  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.findOne(userId);

    let imageUrl = user.image;
    if (file) {
      const uploadRes = await this.cloudinaryService.uploadFile(
        file,
        'telehealth/avatars',
        { resourceType: 'image' },
      );
      imageUrl = uploadRes.secureUrl;

      // Clean up previous image asset on Cloudinary if existed
      if (user.image) {
        await this.cloudinaryService.deleteFile(user.image);
      }
    }

    const updatedFirstName =
      dto.firstName !== undefined ? dto.firstName : user.firstName;
    const updatedLastName =
      dto.lastName !== undefined ? dto.lastName : user.lastName;
    const computedName =
      dto.name ||
      [updatedFirstName, updatedLastName].filter(Boolean).join(' ') ||
      user.name;

    return this.repo.update(userId, {
      name: computedName,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      image: imageUrl,
    });
  }

  /**
   * Admin-level update allowing modification of all fields including role, verification status, and avatar
   */
  async adminUpdateUser(
    id: string,
    dto: AdminUpdateUserDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.findOne(id);

    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.repo.findByEmail(dto.email);
      if (emailExists) {
        throw new ConflictException('A user with this email already exists');
      }
    }

    let imageUrl = dto.image !== undefined ? dto.image : user.image;
    if (file) {
      const uploadRes = await this.cloudinaryService.uploadFile(
        file,
        'telehealth/avatars',
        { resourceType: 'image' },
      );
      imageUrl = uploadRes.secureUrl;

      if (user.image) {
        await this.cloudinaryService.deleteFile(user.image);
      }
    }

    const updatedFirstName =
      dto.firstName !== undefined ? dto.firstName : user.firstName;
    const updatedLastName =
      dto.lastName !== undefined ? dto.lastName : user.lastName;
    const computedName =
      dto.name ||
      [updatedFirstName, updatedLastName].filter(Boolean).join(' ') ||
      user.name;

    return this.repo.update(id, {
      name: computedName,
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      emailVerified: dto.emailVerified,
      phone: dto.phone,
      dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
      role: dto.role,
      image: imageUrl,
    });
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    if (user.image) {
      await this.cloudinaryService.deleteFile(user.image);
    }

    return this.repo.delete(id);
  }

  /**
   * Settings for the authenticated user. A row is created on first read so the
   * client always receives concrete defaults.
   */
  async getSettings(userId: string) {
    return this.repo.ensureSettings(userId);
  }

  async updateSettings(userId: string, dto: UpdateUserSettingsDto) {
    const data = Object.fromEntries(
      Object.entries(dto).filter(([, value]) => value !== undefined),
    );

    return this.repo.updateSettings(userId, data);
  }
}