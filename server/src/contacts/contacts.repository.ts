import { Injectable } from '@nestjs/common';
import { ContactMessageStatus, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { getPaginationParams } from '../common/pagination/pagination.utils.js';
import { ContactQueryDto } from './dto/contact-query.dto.js';
import { CreateContactMessageDto } from './dto/create-contact-message.dto.js';

export interface ContactRequestContext {
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class ContactsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContactMessageDto, context: ContactRequestContext = {}) {
    return this.prisma.contactMessage.create({
      data: {
        fullName: dto.fullName.trim(),
        email: dto.email.trim().toLowerCase(),
        phone: dto.phone.trim(),
        subject: dto.subject.trim(),
        message: dto.message.trim(),
        source: dto.source?.trim() || 'website',
        ipAddress: context.ipAddress,
        userAgent: context.userAgent?.slice(0, 400),
      },
      select: {
        id: true,
        createdAt: true,
        status: true,
      },
    });
  }

  async findMany(query: ContactQueryDto) {
    const { skip, take } = getPaginationParams(query.page, query.limit);

    const where: Prisma.ContactMessageWhereInput = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.search
        ? {
            OR: [
              { fullName: { contains: query.search, mode: 'insensitive' } },
              { email: { contains: query.search, mode: 'insensitive' } },
              { subject: { contains: query.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [rows, total] = await Promise.all([
      this.prisma.contactMessage.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.contactMessage.count({ where }),
    ]);

    return { rows, total };
  }

  async findById(id: string) {
    return this.prisma.contactMessage.findUnique({ where: { id } });
  }

  async updateStatus(id: string, status: ContactMessageStatus) {
    return this.prisma.contactMessage.update({
      where: { id },
      data: { status },
    });
  }

  async countNew() {
    return this.prisma.contactMessage.count({
      where: { status: ContactMessageStatus.NEW },
    });
  }

  /**
   * Lightweight abuse signal: how many messages this IP sent in the window.
   */
  async countRecentByIp(ipAddress: string, since: Date) {
    return this.prisma.contactMessage.count({
      where: { ipAddress, createdAt: { gte: since } },
    });
  }
}
