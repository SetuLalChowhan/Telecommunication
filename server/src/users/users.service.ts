import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateProfileDto } from './dto/update-profile.dto.js';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto.js';
import { deleteFileFromDisk } from '../common/utils/file-upload.util.js';
import {
  PaginationDto,
} from '../common/pagination/pagination.dto.js';
import {
  createPaginationMeta,
  getPaginationParams,
} from '../common/pagination/pagination.utils.js';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationDto = {}) {
    const { skip, take } = getPaginationParams(query.page, query.limit);

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          name: true,
          firstName: true,
          lastName: true,
          email: true,
          emailVerified: true,
          image: true,
          dateOfBirth: true,
          phone: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      this.prisma.user.count(),
    ]);

    return {
      data: users,
      meta: createPaginationMeta(query.page || 1, query.limit || 10, total),
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        emailVerified: true,
        image: true,
        dateOfBirth: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }

  async create(dto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('A user with this email already exists');
    }

    const fullName =
      dto.name ||
      [dto.firstName, dto.lastName].filter(Boolean).join(' ') ||
      null;

    return this.prisma.user.create({
      data: {
        name: fullName,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        phone: dto.phone,
        role: dto.role ?? 'USER',
      },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        emailVerified: true,
        image: true,
        dateOfBirth: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * User self-profile update with optional image upload
   */
  async updateProfile(
    userId: string,
    dto: UpdateProfileDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.findOne(userId);

    let imageUrl = user.image;
    if (file) {
      imageUrl = `/uploads/avatars/${file.filename}`;
      // Clean up previous image file if existed
      if (user.image) {
        await deleteFileFromDisk(user.image);
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

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        name: computedName,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        image: imageUrl,
      },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        emailVerified: true,
        image: true,
        dateOfBirth: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  /**
   * Admin-level update allowing modification of all fields including role and verification status
   */
  async adminUpdateUser(
    id: string,
    dto: AdminUpdateUserDto,
    file?: Express.Multer.File,
  ) {
    const user = await this.findOne(id);

    if (dto.email && dto.email !== user.email) {
      const emailExists = await this.prisma.user.findUnique({
        where: { email: dto.email },
      });
      if (emailExists) {
        throw new ConflictException('A user with this email already exists');
      }
    }

    let imageUrl = dto.image !== undefined ? dto.image : user.image;
    if (file) {
      imageUrl = `/uploads/avatars/${file.filename}`;
      if (user.image) {
        await deleteFileFromDisk(user.image);
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

    return this.prisma.user.update({
      where: { id },
      data: {
        name: computedName,
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        emailVerified: dto.emailVerified,
        phone: dto.phone,
        dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
        role: dto.role,
        image: imageUrl,
      },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        emailVerified: true,
        image: true,
        dateOfBirth: true,
        phone: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    const user = await this.findOne(id);

    if (user.image) {
      await deleteFileFromDisk(user.image);
    }

    return this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }
}