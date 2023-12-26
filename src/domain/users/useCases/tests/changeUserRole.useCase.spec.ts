import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsersRepository';
import { makeUser } from 'test/factories/makeUser';
import { ChangeUserRoleUseCase } from '../changeUserRole.useCase';

let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: ChangeUserRoleUseCase;

describe('Create Brand Use Case', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new ChangeUserRoleUseCase(inMemoryUsersRepository);
  });

  it('should be able to change a user role', async () => {
    const adminUser = makeUser({ role: 'ADMIN' });
    const userToBeAdmin = makeUser({ role: 'CLIENT' });

    await inMemoryUsersRepository.create(adminUser);
    await inMemoryUsersRepository.create(userToBeAdmin);

    const result = await sut.execute({
      userId: adminUser.id.toString(),
      userToChangeRoleId: userToBeAdmin.id.toString(),
      role: 'ADMIN',
    });

    const newAdmin = await inMemoryUsersRepository.findById(userToBeAdmin.id.toString());
    expect(result.isRight()).toBe(true);
    expect(newAdmin?.role).toBe('ADMIN');
  });

  it('should not be able to a client change a user role', async () => {
    const notAdminUser = makeUser({ role: 'CLIENT' });
    const userToBeAdmin = makeUser({ role: 'CLIENT' });

    await inMemoryUsersRepository.create(notAdminUser);
    await inMemoryUsersRepository.create(userToBeAdmin);

    const result = await sut.execute({
      userId: notAdminUser.id.toString(),
      userToChangeRoleId: userToBeAdmin.id.toString(),
      role: 'ADMIN',
    });

    const newAdmin = await inMemoryUsersRepository.findById(userToBeAdmin.id.toString());
    expect(result.isLeft()).toBe(true);
    expect(newAdmin?.role).toBe('CLIENT');
  });
});
