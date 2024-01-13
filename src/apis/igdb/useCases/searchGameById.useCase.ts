import { Either, right } from '@/core/either';
import { Injectable } from '@nestjs/common';
import { getRequestOptions } from '../utils/getRequestOptions';
import { getGameInfoById } from '../api/igdbConsumer';

interface SearchGameByIdUseCaseRequest {
  igdbId: string;
}

type SearchGameByIdUseCaseResponse = Either<null, {
  gameInfo: any;
}>;

@Injectable()
export class SearchGameByIdUseCase {
  async execute({
    igdbId,
  }: SearchGameByIdUseCaseRequest): Promise<SearchGameByIdUseCaseResponse> {
    const requestOptions = await getRequestOptions();

    const gameInfo = await getGameInfoById(igdbId, requestOptions);

    return right({ gameInfo });
  }
}
