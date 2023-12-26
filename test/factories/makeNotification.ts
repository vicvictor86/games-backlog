import { faker } from '@faker-js/faker';

import { UniqueEntityId } from '@/core/entities/uniqueEntityId';
import { Notification, NotificationProps } from '@/domain/notification/entities/notification';

export function makeNotification(override: Partial<NotificationProps> = {}, id?: UniqueEntityId) {
  const notification = Notification.create(
    {
      recipientId: new UniqueEntityId(),
      title: faker.lorem.sentence(6),
      content: faker.lorem.sentence(10),
      createdAt: new Date(),
      readAt: null,
      ...override,
    },
    id,
  );

  return notification;
}
