import { InMemoryUsersRepository } from 'test/repositories/InMemoryUsers.repository';
import { FakeHasher } from 'test/cryptography/fakeHasher';
import { FakeEncrypter } from 'test/cryptography/fakeEncrypter';
import { RegisterClientUseCase } from '../registerClient.useCase';
import { Encrypter } from '../../cryptography/encrypter';

let inMemoryUsersRepository: InMemoryUsersRepository;
let fakeHasher: FakeHasher;
let encrypter: Encrypter;
let sut: RegisterClientUseCase;

describe('Create Client Use Case', () => {
  beforeEach(() => {
    fakeHasher = new FakeHasher();
    encrypter = new FakeEncrypter();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    sut = new RegisterClientUseCase(inMemoryUsersRepository, fakeHasher, encrypter);
  });

  it('should be able to create a client', async () => {
    const result = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      username: 'johndoe',
      password: '123456',
      birthDate: new Date('1998-01-01'),
    });

    expect(result.isRight()).toBe(true);

    if (result.isRight()) {
      expect(result.value.client).toEqual(inMemoryUsersRepository.items[0]);
    }
    expect(inMemoryUsersRepository.items[0]).toEqual(expect.objectContaining({
      role: 'CLIENT',
    }));
  });

  it('should be able to hash a password upon registration', async () => {
    const result = await sut.execute({
      email: 'johndoe@example.com',
      name: 'John Doe',
      password: '123456',
      birthDate: new Date('1998-01-01'),
      username: 'johndoe',
    });

    const hashedPassword = await fakeHasher.hash('123456');

    expect(result.isRight()).toBe(true);
    expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword);
  });
});
