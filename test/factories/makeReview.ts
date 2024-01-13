import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@/core/entities/uniqueEntityId';
import { Review, ReviewProps } from '@/domain/gamesInLog/entities/review.entity';

export function makeReview(override: Partial<ReviewProps> = {}, id?: UniqueEntityId) {
  const review = Review.create(
    {
      ownerId: new UniqueEntityId(),
      gameInLogId: new UniqueEntityId(),
      content: 'This is a review',
      rating: 1,
      ...override,
    },
    id,
  );

  return review;
}

// @Injectable()
// export class ReviewFactory {
//   constructor(private prisma: PrismaService) {}

//   async makePrismaReview(data: Partial<ReviewProps> = {}) {
//     const review = makeReview(data);

//     await this.prisma.review.create({
//       data: PrismaReviewMapper.toPrisma(review),
//     });

//     return review;
//   }
// }
