import { AnswerReaction } from '../entities/answerReaction.entity';

export abstract class AnswersReactionsRepository {
  abstract findById(id: string): Promise<AnswerReaction | null>;
  abstract findByAnswerIdAndReactOwnerId(answerId: string, reactOwnerId: string): Promise<AnswerReaction | null>;
  abstract fetchManyByAnswerId(answerId: string): Promise<AnswerReaction[]>;
  abstract create(answerReaction: AnswerReaction): Promise<void>;
  abstract save(answerReaction: AnswerReaction): Promise<void>;
  abstract delete(answerReaction: AnswerReaction): Promise<void>;
}
