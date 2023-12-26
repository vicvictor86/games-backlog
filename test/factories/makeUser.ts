import { faker } from '@faker-js/faker';

import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@/core/entities/uniqueEntityId';
import { User, UserProps } from '@/domain/users/entities/user.entity';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { PrismaUserMapper } from '@/infra/database/prisma/mappers/prismaUser.mapper';

export function makeUser(override: Partial<UserProps> = {}, id?: UniqueEntityId) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      username: faker.internet.userName(),
      password: faker.internet.password(),
      birthDate: faker.date.past(),
      createdAt: new Date(),
      bio: faker.lorem.sentence(),
      facebook: faker.internet.url(),
      twitter: faker.internet.url(),
      role: 'CLIENT',
      emailConfirmed: false,
      ...override,
    },
    id,
  );

  return user;
}

@Injectable()
export class UserFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaUser(data: Partial<UserProps> = {}) {
    const user = makeUser(data);

    await this.prisma.user.create({
      data: PrismaUserMapper.toPrisma(user),
    });

    return user;
  }
}
