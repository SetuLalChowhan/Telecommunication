import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class GoogleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAccountByGoogleId(providerId: string, accountId: string) {
    return this.prisma.account.findFirst({
      where: { providerId, accountId },
    });
  }

  async findAccountByUserIdAndProvider(userId: string, providerId: string) {
    return this.prisma.account.findFirst({
      where: { userId, providerId },
    });
  }

  async findFirstAccountForUser(userId: string, providerIds: string[]) {
    return this.prisma.account.findFirst({
      where: {
        userId,
        providerId: { in: providerIds },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAccount(data: Prisma.AccountCreateInput) {
    return this.prisma.account.create({ data });
  }

  async updateAccount(id: string, data: Prisma.AccountUpdateInput) {
    return this.prisma.account.update({
      where: { id },
      data,
    });
  }

  async deleteAccount(id: string) {
    return this.prisma.account.delete({
      where: { id },
    });
  }

  async deleteAccountsForUser(userId: string, providerIds: string[]) {
    return this.prisma.account.deleteMany({
      where: {
        userId,
        providerId: { in: providerIds },
      },
    });
  }
}
