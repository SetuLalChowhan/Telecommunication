import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ContactMessageStatus } from '@prisma/client';
import {
  ContactsRepository,
  ContactRequestContext,
} from './contacts.repository.js';
import {
  CreateContactMessageDto,
  UpdateContactMessageStatusDto,
} from './dto/create-contact-message.dto.js';
import { ContactQueryDto } from './dto/contact-query.dto.js';
import { createPaginationMeta } from '../common/pagination/pagination.utils.js';

/** Per-IP submission cap inside a rolling window. */
const IP_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const IP_MAX_SUBMISSIONS = 5;

@Injectable()
export class ContactsService {
  constructor(private readonly repo: ContactsRepository) {}

  async submit(dto: CreateContactMessageDto, context: ContactRequestContext = {}) {
    if (context.ipAddress) {
      const since = new Date(Date.now() - IP_WINDOW_MS);
      const recent = await this.repo.countRecentByIp(context.ipAddress, since);

      if (recent >= IP_MAX_SUBMISSIONS) {
        throw new BadRequestException(
          'Too many messages sent from this network. Please try again later.',
        );
      }
    }

    const created = await this.repo.create(dto, context);

    return {
      id: created.id,
      status: created.status,
      createdAt: created.createdAt,
    };
  }

  async listForAdmin(query: ContactQueryDto) {
    const { rows, total } = await this.repo.findMany(query);

    return {
      items: rows,
      unreadCount: await this.repo.countNew(),
      meta: createPaginationMeta(query.page || 1, query.limit || 20, total),
    };
  }

  async updateStatus(id: string, dto: UpdateContactMessageStatusDto) {
    const existing = await this.repo.findById(id);
    if (!existing) {
      throw new NotFoundException(`Contact message not found: ${id}`);
    }

    return this.repo.updateStatus(id, dto.status as ContactMessageStatus);
  }
}
