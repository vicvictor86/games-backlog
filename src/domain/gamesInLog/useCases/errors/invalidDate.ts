import { UseCaseError } from '@/core/errors/useCaseErrors';

export class InvalidDate extends Error implements UseCaseError {
  constructor() {
    super('Invalid date');
  }
}
