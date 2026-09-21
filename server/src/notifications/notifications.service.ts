import { Injectable, NotFoundException } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { NotificationsRepository } from './notifications.repository.js';
import { createPaginationMeta } from '../common/pagination/pagination.utils.js';
import { PaginationDto } from '../common/pagination/pagination.dto.js';

@Injectable()
export class NotificationsService {
  constructor(private readonly repo: NotificationsRepository) {}

  async createNotification(data: {
    userId: string;
    type: NotificationType;
    title: string;
    message: string;
    relatedBookingId?: string;
  }) {
    return this.repo.create(data);
  }

  async getMyNotifications(userId: string, query: PaginationDto = {}) {
    const { rows, total, unreadCount } = await this.repo.findMany(userId, query);

    return {
      data: rows,
      unreadCount,
      meta: createPaginationMeta(query.page || 1, query.limit || 10, total),
    };
  }

  async getUnreadCount(userId: string) {
    const count = await this.repo.countUnread(userId);
    return { unreadCount: count };
  }

  async markAsRead(notificationId: string, userId: string) {
    const notification = await this.repo.findById(notificationId);

    if (!notification || notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }

    return this.repo.markRead(notificationId);
  }

  async markAllAsRead(userId: string) {
    await this.repo.markAllRead(userId);
    return { message: 'All notifications marked as read' };
  }
}
