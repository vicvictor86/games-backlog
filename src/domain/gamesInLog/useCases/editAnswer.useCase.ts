import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@/core/either';
import { UsersRepository } from '@/domain/users/repositories/users.repository';
import { ResourceNotFoundError } from '@/core/errors/resourceNotFound';
import { NotAllowedError } from '@/core/errors/notAllowedErrors';
import { AnswersRepository } from '../repositories/answer.repository';

interface EditAnswerUseCaseRequest {
  userId: string;
  answerId: string;
  content: string;
}

type EditAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, {
}>;

@Injectable()
export class EditAnswerUseCase {
  constructor(
    private answersRepository: AnswersRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    answerId,
    content,
    userId,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      return left(new ResourceNotFoundError());
    }

    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (!answer.ownerId.equals(user.id)) {
      return left(new NotAllowedError());
    }

    answer.content = content || answer.content;

    await this.answersRepository.save(answer);

    return right({});
  }
}
