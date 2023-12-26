import { UniqueEntityId } from '@/core/entities/uniqueEntityId';
import { Notification as DomainNotification, NotificationProps } from '@/domain/notification/entities/notification';

export interface RedisNotification {
  _id: {
    value: string;
  };

  props: Omit<NotificationProps, 'recipientId'> & { recipientId: { value: string } };
}

export class RedisNotificationMapper {
  static toDomain(raw: RedisNotification): DomainNotification {
    return DomainNotification.create({
      recipientId: new UniqueEntityId(raw.props.recipientId.value),
      content: raw.props.content,
      title: raw.props.title,
      createdAt: raw.props.createdAt,
      readAt: raw.props.readAt,
    }, new UniqueEntityId(raw._id.value));
  }
}
