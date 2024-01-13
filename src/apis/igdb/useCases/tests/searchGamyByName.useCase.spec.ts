// import fs from 'fs';
import { SearchGameByNameUseCase } from '../searchGameByName.useCase';

let sut: SearchGameByNameUseCase;

describe('Search Game By Name Use Case', () => {
  beforeEach(() => {
    sut = new SearchGameByNameUseCase();
  });

  it('should be able to search a game by name', async () => {
    const result = await sut.execute({
      name: 'Halo',
      limit: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual(expect.objectContaining({
      gameInfo: expect.objectContaining({
        id: expect.any(Number),
        category: expect.any(Number),
        name: expect.any(String),
        slug: expect.any(String),
      }),
    }));

    // fs.writeFile('src/apis/igdb/useCases/tests/searchGameByName.useCase.spec.json', JSON.stringify(result.value), () => {});
  });
});
