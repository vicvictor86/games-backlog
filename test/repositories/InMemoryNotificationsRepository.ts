import { PaginationParams } from '@/core/repositories/paginationParams';
import { Notification } from '@/domain/notification/entities/notification';
import { NotificationsRepository } from '@/domain/notification/repositories/notifications.repository';

export class InMemoryNotificationsRepository implements NotificationsRepository {
  public items: Notification[] = [];

  async get(recipientId: string, notificationId: string): Promise<Notification | null> {
    const notificationFound = this.items
      .find((item) => item.id.toString() === notificationId && item.recipientId.toString() === recipientId);

    if (!notificationFound) {
      return null;
    }

    return notificationFound;
  }

  async fetchByUserId(userId: string, { page, returnPerPage }: PaginationParams): Promise<Notification[]> {
    const notifications = this.items
      .filter((item) => item.recipientId.toString() === userId)
      .slice((page - 1) * returnPerPage, page * returnPerPage);

    return notifications;
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = this.items.find((item) => item.id.toString() === id);

    if (!notification) {
      return null;
    }

    return notification;
  }

  async create(notification: Notification) {
    this.items.push(notification);
  }

  async save(notification: Notification): Promise<void> {
    const index = this.items.findIndex((item) => item.id === notification.id);

    this.items[index] = notification;
  }
}
