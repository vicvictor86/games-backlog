import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@/core/entities/uniqueEntityId';
import { GameInList, GameInListProps } from '@/domain/gameList/entities/gameInList.entity';

export function makeGameInList(override: Partial<GameInListProps> = {}, id?: UniqueEntityId) {
  const gameInList = GameInList.create(
    {
      gameInLogId: new UniqueEntityId(),
      igdbId: '1',
      listId: new UniqueEntityId(),
      createdAt: new Date(),
      ...override,
    },
    id,
  );

  return gameInList;
}

// @Injectable()
// export class GameInListFactory {
//   constructor(private prisma: PrismaService) {}

//   async makePrismaGameInList(data: Partial<GameInListProps> = {}) {
//     const gameinlist = makeGameInList(data);

//     await this.prisma.gameinlist.create({
//       data: PrismaGameInListMapper.toPrisma(gameinlist),
//     });

//     return gameinlist;
//   }
// }
