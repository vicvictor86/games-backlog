import { Injectable } from '@nestjs/common';
import { PaginationParams } from '@/core/repositories/paginationParams';
import { NotificationsRepository } from '@/domain/notification/repositories/notifications.repository';
import { Notification } from '@/domain/notification/entities/notification';
import { RedisNotificationService } from './redisNotification.service';
import { RedisNotification, RedisNotificationMapper } from './mappers/RedisNotificationMapper';

@Injectable()
export class RedisNotificationsRepository implements NotificationsRepository {
  constructor(
    private redis: RedisNotificationService,
  ) {}

  async get(recipientId: string, notificationId: string): Promise<Notification | null> {
    const notificationString = await this.redis.get(`notifications:${recipientId}:${notificationId}`);

    if (!notificationString) {
      return null;
    }

    return JSON.parse(notificationString);
  }

  async fetchByUserId(userId: string, { page, returnPerPage }: PaginationParams): Promise<Notification[]> {
    const notificationsKeys = await this.redis.keys(`notifications:${userId}:*`);

    const notificationsStringPromises = notificationsKeys.map((key) => this.redis.get(key));

    const notificationsString = await Promise.all(notificationsStringPromises) as string[];

    if (notificationsString.length <= 0) {
      return [];
    }

    const notifications: RedisNotification[] = notificationsString.map((notification) => JSON.parse(notification));

    return notifications.slice((page - 1) * returnPerPage, page * returnPerPage).map((notification) => RedisNotificationMapper.toDomain(notification));
  }

  async create(notification: Notification): Promise<void> {
    const sevenDays = 60 * 60 * 24 * 7;

    await this.redis.set(
      `notifications:${notification.recipientId.toString()}:${notification.id}`,
      JSON.stringify(notification),
      'EX',
      sevenDays,
    );
  }

  async save(notification: Notification): Promise<void> {
    const sevenDays = 60 * 60 * 24 * 7;

    await this.redis.set(
      `notifications:${notification.recipientId.toString()}:${notification.id}`,
      JSON.stringify(notification),
      'EX',
      sevenDays,
    );
  }
}
