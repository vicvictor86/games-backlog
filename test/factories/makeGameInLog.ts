import { Injectable } from '@nestjs/common';
import { UniqueEntityId } from '@/core/entities/uniqueEntityId';
import { GameInLog, GameInLogProps } from '@/domain/gamesInLog/entities/gameInLog.entity';

export function makeGameInLog(override: Partial<GameInLogProps> = {}, id?: UniqueEntityId) {
  const gameInLog = GameInLog.create(
    {
      ownerId: new UniqueEntityId(),
      gameIGDBId: '1',
      currentStatus: 'PLAYING',
      platform: 'PS4',
      playedMedium: 'OWNED',
      timePlayed: 100,
      wasPlatinum: false,
      wasReplayed: false,
      startedOn: new Date(),
      finishedOn: new Date(),
      createdAt: new Date(),
      ...override,
    },
    id,
  );

  return gameInLog;
}

// @Injectable()
// export class GameInLogFactory {
//   constructor(private prisma: PrismaService) {}

//   async makePrismaGameInLog(data: Partial<GameInLogProps> = {}) {
//     const gameinlog = makeGameInLog(data);

//     await this.prisma.gameinlog.create({
//       data: PrismaGameInLogMapper.toPrisma(gameinlog),
//     });

//     return gameinlog;
//   }
// }
