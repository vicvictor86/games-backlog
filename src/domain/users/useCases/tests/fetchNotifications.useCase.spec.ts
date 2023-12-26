import { makeUser } from 'test/factories/makeUser';
import { InMemoryNotificationsRepository } from 'test/repositories/InMemoryNotificationsRepository';
import { FetchNotificationsUseCase } from '../fetchNotifications.useCase';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: FetchNotificationsUseCase;

describe('Fetch Notifications Use Case', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();
    sut = new FetchNotificationsUseCase(
      inMemoryNotificationsRepository,
    );
  });

  it.skip('should be able to fetch notifications from a user', async () => {
    const user = makeUser({ role: 'CLIENT' });

    const result = await sut.execute({
      userId: user.id.toString(),
      page: 1,
      returnPerPage: 10,
    });

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value.notifications).toHaveLength(1);
      expect(result.value.notifications).toEqual(expect.arrayContaining([
        expect.objectContaining({
          props: expect.objectContaining({
            recipientId: user.id,
            title: 'Produto abaixo da quantidade mínima',
          }),
        }),

      ]));
    }
  });
});
