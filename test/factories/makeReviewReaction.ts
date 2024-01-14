import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@/core/entities/uniqueEntityId';
import { ReviewReaction, ReviewReactionProps } from '@/domain/gamesInLog/entities/reviewReaction.entity';

export function makeReviewReaction(override: Partial<ReviewReactionProps> = {}, id?: UniqueEntityId) {
  const reviewReaction = ReviewReaction.create(
    {
      reactOwnerId: new UniqueEntityId(),
      reviewId: new UniqueEntityId(),
      reviewReaction: 'LIKE',
      createdAt: new Date(),
      ...override,
    },
    id,
  );

  return reviewReaction;
}

// @Injectable()
// export class ReviewReactionFactory {
//   constructor(private prisma: PrismaService) {}

//   async makePrismaReviewReaction(data: Partial<ReviewReactionProps> = {}) {
//     const reviewreaction = makeReviewReaction(data);

//     await this.prisma.reviewreaction.create({
//       data: PrismaReviewReactionMapper.toPrisma(reviewreaction),
//     });

//     return reviewreaction;
//   }
// }
