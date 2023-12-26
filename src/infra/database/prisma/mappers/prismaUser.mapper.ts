import { Prisma, User as PrismaUser } from '@prisma/client';
import { User as DomainUser } from '@/domain/users/entities/user.entity';
import { UniqueEntityId } from '@/core/entities/uniqueEntityId';

export class PrismaUserMapper {
  static toDomain(raw: PrismaUser): DomainUser {
    return DomainUser.create({
      email: raw.email,
      name: raw.name,
      password: raw.password,
      birthDate: raw.birthDate,
      username: raw.username,
      bio: raw.bio,
      facebook: raw.facebook,
      twitter: raw.twitter,
      role: raw.role,
      emailConfirmed: raw.emailConfirmed,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    }, new UniqueEntityId(raw.id));
  }

  static toPrisma(user: DomainUser): Prisma.UserUncheckedCreateInput {
    return {
      id: user.id.toString(),
      email: user.email,
      name: user.name,
      password: user.password,
      birthDate: user.birthDate,
      username: user.username,
      bio: user.bio,
      facebook: user.facebook,
      twitter: user.twitter,
      role: user.role,
      emailConfirmed: user.emailConfirmed,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
