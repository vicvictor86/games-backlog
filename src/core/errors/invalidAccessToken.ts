import { UseCaseError } from '@/core/errors/useCaseErrors';

export class InvalidAccessToken extends Error implements UseCaseError {
  constructor() {
    super('Invalid access token');
  }
}
