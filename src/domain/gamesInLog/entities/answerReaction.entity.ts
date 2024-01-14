import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/uniqueEntityId';
import { Optional } from '@/core/types/optional';

export type AnswerReactionsType = 'LIKE' | 'DISAGREE' | 'LOVE' | 'FUNNY';

export interface AnswerReactionProps {
  answerId: UniqueEntityId;
  reactOwnerId: UniqueEntityId;
  answerReaction: AnswerReactionsType;

  createdAt: Date;
}

export class AnswerReaction extends Entity<AnswerReactionProps> {
  get answerId() { return this.props.answerId; }

  get reactOwnerId() { return this.props.reactOwnerId; }

  get answerReaction() { return this.props.answerReaction; }

  set answerReaction(answerReaction: AnswerReactionsType) {
    this.props.answerReaction = answerReaction;
    this.touch();
  }

  get createdAt() { return this.props.createdAt; }

  private touch() {
    this.props.createdAt = new Date();
  }

  static create(props: Optional<AnswerReactionProps, 'createdAt'>, id?: UniqueEntityId) {
    const user = new AnswerReaction({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id);

    return user;
  }
}
