import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { getRequestOptions } from '../utils/getRequestOptions';
import { getGameInfoByName } from '../api/igdbConsumer';

interface SearchGameByNameUseCaseRequest {
  name: string;
  limit: number;
}

type SearchGameByNameUseCaseResponse = Either<null, {
  gameInfo: any;
}>;

@Injectable()
export class SearchGameByNameUseCase {
  async execute({
    name,
    limit,
  }: SearchGameByNameUseCaseRequest): Promise<SearchGameByNameUseCaseResponse> {
    const requestOptions = await getRequestOptions();

    const gameInfo = await getGameInfoByName(name, requestOptions, limit);

    return right({ gameInfo });
  }
}
