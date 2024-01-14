import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@/core/entities/uniqueEntityId';
import { AnswerReaction, AnswerReactionProps } from '@/domain/gamesInLog/entities/answerReaction.entity';

export function makeAnswerReaction(override: Partial<AnswerReactionProps> = {}, id?: UniqueEntityId) {
  const answerReaction = AnswerReaction.create(
    {
      reactOwnerId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      answerReaction: 'LIKE',
      createdAt: new Date(),
      ...override,
    },
    id,
  );

  return answerReaction;
}

// @Injectable()
// export class AnswerReactionFactory {
//   constructor(private prisma: PrismaService) {}

//   async makePrismaAnswerReaction(data: Partial<AnswerReactionProps> = {}) {
//     const answerreaction = makeAnswerReaction(data);

//     await this.prisma.answerreaction.create({
//       data: PrismaAnswerReactionMapper.toPrisma(answerreaction),
//     });

//     return answerreaction;
//   }
// }
