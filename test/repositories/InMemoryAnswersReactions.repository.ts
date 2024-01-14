import { DomainEvents } from '@/core/events/domainEvents';
import { AnswerReaction } from '@/domain/gamesInLog/entities/answerReaction.entity';
import { AnswersReactionsRepository } from '@/domain/gamesInLog/repositories/reviewsReactions.repository copy';

export class InMemoryAnswersReactionsRepository implements AnswersReactionsRepository {
  public items: AnswerReaction[] = [];

  async findById(id: string): Promise<AnswerReaction | null> {
    const answerReaction = this.items.find((item) => item.id.toString() === id);

    if (!answerReaction) {
      return null;
    }

    return answerReaction;
  }

  async findByAnswerIdAndReactOwnerId(answerId: string, reactOwnerId: string): Promise<AnswerReaction | null> {
    const answerReaction = this.items.find((item) => item.answerId.toString() === answerId && item.reactOwnerId.toString() === reactOwnerId);

    if (!answerReaction) {
      return null;
    }

    return answerReaction;
  }

  async fetchManyByAnswerId(answerId: string): Promise<AnswerReaction[]> {
    const answerReaction = this.items.filter((item) => item.answerId.toString() === answerId);

    return answerReaction;
  }

  async create(answerReaction: AnswerReaction) {
    this.items.push(answerReaction);

    DomainEvents.dispatchEventsForAggregate(answerReaction.id);
  }

  async save(answerReaction: AnswerReaction) {
    const answerReactionIndex = this.items.findIndex((item) => item.id.equals(answerReaction.id));

    if (answerReactionIndex < 0) {
      return;
    }

    this.items[answerReactionIndex] = answerReaction;

    DomainEvents.dispatchEventsForAggregate(answerReaction.id);
  }

  async delete(answerReaction: AnswerReaction): Promise<void> {
    const answerReactionIndex = this.items.findIndex((item) => item.id.equals(answerReaction.id));

    if (answerReactionIndex < 0) {
      return;
    }

    this.items.splice(answerReactionIndex, 1);

    DomainEvents.dispatchEventsForAggregate(answerReaction.id);
  }
}
