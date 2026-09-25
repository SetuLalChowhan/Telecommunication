import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { getPaginationParams } from '../common/pagination/pagination.utils.js';
import { PaginationDto } from '../common/pagination/pagination.dto.js';

export const USER_SELECT = {
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
} as const;

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(query: PaginationDto = {}) {
    const { skip, take } = getPaginationParams(query.page, query.limit);

    const [rows, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: USER_SELECT,
      }),
      this.prisma.user.count(),
    ]);

    return { rows, total };
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: USER_SELECT,
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data,
      select: USER_SELECT,
    });
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: USER_SELECT,
    });
  }

  async delete(id: string) {
    return this.prisma.user.delete({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }

  // -- Settings --------------------------------------------------------------

  async findSettings(userId: string) {
    return this.prisma.userSetting.findUnique({ where: { userId } });
  }

  /**
   * Returns the user's settings, creating a row with schema defaults on first
   * access so callers never have to special-case a missing record.
   */
  async ensureSettings(userId: string) {
    const existing = await this.prisma.userSetting.findUnique({ where: { userId } });
    if (existing) return existing;
    return this.prisma.userSetting.create({ data: { userId } });
  }

  async updateSettings(userId: string, data: UserSettingsInput) {
    return this.prisma.userSetting.upsert({
      where: { userId },
      update: data,
      create: { userId, ...data },
    });
  }
}

export interface UserSettingsInput {
  language?: string;
  theme?: string;
  timezone?: string;
  emailAlerts?: boolean;
  pushAlerts?: boolean;
  weeklyDigest?: boolean;
  marketingEmails?: boolean;
}
