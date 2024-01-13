import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@/core/entities/uniqueEntityId';
import { Following, FollowingProps } from '@/domain/social/entities/following.entity';

export function makeFollowing(override: Partial<FollowingProps> = {}, id?: UniqueEntityId) {
  const following = Following.create(
    {
      userAccountId: new UniqueEntityId(),
      userFollowingId: new UniqueEntityId(),
      createdAt: new Date(),
      ...override,
    },
    id,
  );

  return following;
}

// @Injectable()
// export class FollowingFactory {
//   constructor(private prisma: PrismaService) {}

//   async makePrismaFollowing(data: Partial<FollowingProps> = {}) {
//     const following = makeFollowing(data);

//     await this.prisma.following.create({
//       data: PrismaFollowingMapper.toPrisma(following),
//     });

//     return following;
//   }
// }
