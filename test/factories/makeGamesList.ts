import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@/core/entities/uniqueEntityId';
import { GamesList, GamesListProps } from '@/domain/gameList/entities/gamesList.entity';
import { faker } from '@faker-js/faker';

export function makeGamesList(override: Partial<GamesListProps> = {}, id?: UniqueEntityId) {
  const gamesList = GamesList.create(
    {
      ownerId: new UniqueEntityId(),
      description: faker.lorem.text(),
      name: faker.lorem.slug(),
      visibility: 'PUBLIC',
      ...override,
    },
    id,
  );

  return gamesList;
}

// @Injectable()
// export class GamesListFactory {
//   constructor(private prisma: PrismaService) {}

//   async makePrismaGamesList(data: Partial<GamesListProps> = {}) {
//     const gameslist = makeGamesList(data);

//     await this.prisma.gameslist.create({
//       data: PrismaGamesListMapper.toPrisma(gameslist),
//     });

//     return gameslist;
//   }
// }
