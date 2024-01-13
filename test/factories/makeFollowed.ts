import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@/core/entities/uniqueEntityId';
import { Followed, FollowedProps } from '@/domain/social/entities/followed.entity';

export function makeFollowed(override: Partial<FollowedProps> = {}, id?: UniqueEntityId) {
  const followed = Followed.create(
    {
      userAccountId: new UniqueEntityId(),
      userFollowedId: new UniqueEntityId(),
      createdAt: new Date(),
      ...override,
    },
    id,
  );

  return followed;
}

// @Injectable()
// export class FollowedFactory {
//   constructor(private prisma: PrismaService) {}

//   async makePrismaFollowed(data: Partial<FollowedProps> = {}) {
//     const followed = makeFollowed(data);

//     await this.prisma.followed.create({
//       data: PrismaFollowedMapper.toPrisma(followed),
//     });

//     return followed;
//   }
// }
