import { PaginationParams } from '@/core/repositories/paginationParams';
import { Notification } from '../entities/notification';

export abstract class NotificationsRepository {
  abstract get(recipientId: string, notificationId: string): Promise<Notification | null>;
  abstract create(notification: Notification): Promise<void>;
  abstract save(notification: Notification): Promise<void>;
  abstract fetchByUserId(userId: string, pagination: PaginationParams): Promise<Notification[]>;
}
