import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/uniqueEntityId';
import { Optional } from '@/core/types/optional';

export type CurrentStatus = 'PLAYED' | 'PLAYING' | 'FINISHED' | 'RETIRED' | 'SHELVED' | 'ABANDONED' | 'BACKLOG' | 'WISHLIST';

export type PlayedMedium = 'OWNED' | 'SUBSCRIPTION' | 'BORROWED' | 'WATCHED';

export interface GameInLogProps {
  ownerId: UniqueEntityId;
  gameIGDBId: string;
  currentStatus: CurrentStatus;
  platform: string;
  startedOn: Date;
  finishedOn: Date;
  wasPlatinum: boolean;
  wasReplayed: boolean;
  playedMedium: PlayedMedium;
  timePlayed: number;

  createdAt: Date;
  updatedAt?: Date | null;
}

export class GameInLog extends Entity<GameInLogProps> {
  get ownerId() { return this.props.ownerId; }

  get gameIGDBId() { return this.props.gameIGDBId; }

  get currentStatus() { return this.props.currentStatus; }

  set currentStatus(currentStatus: CurrentStatus) {
    this.props.currentStatus = currentStatus;
    this.touch();
  }

  get platform() { return this.props.platform; }

  set platform(platform: string) {
    this.props.platform = platform;
    this.touch();
  }

  get startedOn() { return this.props.startedOn; }

  get finishedOn() { return this.props.finishedOn; }

  get wasPlatinum() { return this.props.wasPlatinum; }

  get wasReplayed() { return this.props.wasReplayed; }

  get playedMedium() { return this.props.playedMedium; }

  get timePlayed() { return this.props.timePlayed; }

  get createdAt() { return this.props.createdAt; }

  get updatedAt() { return this.props.updatedAt; }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<GameInLogProps, 'createdAt'>, id?: UniqueEntityId) {
    const user = new GameInLog({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id);

    return user;
  }
}
