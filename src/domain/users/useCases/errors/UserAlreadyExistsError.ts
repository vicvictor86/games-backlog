import { UseCaseError } from '@/core/errors/useCaseErrors';

export class UserAlreadyExistsError extends Error implements UseCaseError {
  constructor(identifier: string) {
    super(`User "${identifier}" already exists`);
  }
}
