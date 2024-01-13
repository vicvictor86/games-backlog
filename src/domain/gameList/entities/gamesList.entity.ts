import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/uniqueEntityId';
import { Optional } from '@/core/types/optional';

export type Visibility = 'PUBLIC' | 'PRIVATE' | 'FRIENDS_ONLY';

export interface GamesListProps {
  ownerId: UniqueEntityId;
  name: string;
  description: string;
  visibility: Visibility;

  createdAt: Date;
  updatedAt?: Date | null;
}

export class GamesList extends Entity<GamesListProps> {
  get ownerId() { return this.props.ownerId; }

  get name() { return this.props.name; }

  set name(name: string) { this.props.name = name; this.touch(); }

  get description() { return this.props.description; }

  set description(description: string) { this.props.description = description; this.touch(); }

  get visibility() { return this.props.visibility; }

  set visibility(visibility: Visibility) { this.props.visibility = visibility; this.touch(); }

  get createdAt() { return this.props.createdAt; }

  get updatedAt() { return this.props.updatedAt; }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<GamesListProps, 'createdAt'>, id?: UniqueEntityId) {
    const gamesList = new GamesList({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id);

    return gamesList;
  }
}
