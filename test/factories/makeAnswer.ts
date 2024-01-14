import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@/core/entities/uniqueEntityId';
import { Answer, AnswerProps } from '@/domain/gamesInLog/entities/answer.entity';
import { faker } from '@faker-js/faker';

export function makeAnswer(override: Partial<AnswerProps> = {}, id?: UniqueEntityId) {
  const answer = Answer.create(
    {
      ownerId: new UniqueEntityId(),
      reviewId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return answer;
}

// @Injectable()
// export class AnswerFactory {
//   constructor(private prisma: PrismaService) {}

//   async makePrismaAnswer(data: Partial<AnswerProps> = {}) {
//     const answer = makeAnswer(data);

//     await this.prisma.answer.create({
//       data: PrismaAnswerMapper.toPrisma(answer),
//     });

//     return answer;
//   }
// }
