import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/uniqueEntityId';
import { Optional } from '@/core/types/optional';

export interface GameInListProps {
  listId: UniqueEntityId;
  gameInLogId: UniqueEntityId;
  igdbId: string;

  createdAt: Date;
  updatedAt?: Date | null;
}

export class GameInList extends Entity<GameInListProps> {
  get listId() { return this.props.listId; }

  get gameInLogId() { return this.props.gameInLogId; }

  get igdbId() { return this.props.igdbId; }

  get createdAt() { return this.props.createdAt; }

  get updatedAt() { return this.props.updatedAt; }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<GameInListProps, 'createdAt'>, id?: UniqueEntityId) {
    const gamesList = new GameInList({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id);

    return gamesList;
  }
}
