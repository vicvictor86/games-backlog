import { DomainEvents } from '@/core/events/domainEvents';
import { Answer } from '@/domain/gamesInLog/entities/answer.entity';
import { AnswersRepository } from '@/domain/gamesInLog/repositories/answer.repository';

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  async findById(id: string): Promise<Answer | null> {
    const answer = this.items.find((item) => item.id.toString() === id);

    if (!answer) {
      return null;
    }

    return answer;
  }

  async fetchManyByOwnerId(ownerId: string): Promise<Answer[]> {
    const answers = this.items.filter((item) => item.ownerId.toString() === ownerId);

    return answers;
  }

  async fetchManyReviewId(reviewId: string): Promise<Answer[]> {
    const answers = this.items.filter((item) => item.reviewId.toString() === reviewId);

    return answers;
  }

  async create(answer: Answer) {
    this.items.push(answer);

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async save(answer: Answer) {
    const answerIndex = this.items.findIndex((item) => item.id.equals(answer.id));

    if (answerIndex < 0) {
      return;
    }

    this.items[answerIndex] = answer;

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer): Promise<void> {
    const answerIndex = this.items.findIndex((item) => item.id.equals(answer.id));

    if (answerIndex < 0) {
      return;
    }

    this.items.splice(answerIndex, 1);

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }
}
