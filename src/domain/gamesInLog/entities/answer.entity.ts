import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/uniqueEntityId';
import { Optional } from '@/core/types/optional';

export interface AnswerProps {
  ownerId: UniqueEntityId;
  reviewId: UniqueEntityId;
  content: string;

  createdAt: Date;
  updatedAt?: Date | null;
}

export class Answer extends Entity<AnswerProps> {
  get ownerId() { return this.props.ownerId; }

  get reviewId() { return this.props.reviewId; }

  get content() { return this.props.content; }

  set content(content: string) {
    this.props.content = content;
    this.touch();
  }

  get createdAt() { return this.props.createdAt; }

  get updatedAt() { return this.props.updatedAt; }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<AnswerProps, 'createdAt'>, id?: UniqueEntityId) {
    const user = new Answer({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    }, id);

    return user;
  }
}
