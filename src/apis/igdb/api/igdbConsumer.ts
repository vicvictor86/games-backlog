import apicalypse, { ApicalypseConfig } from 'apicalypse';
import 'dotenv/config';
import { envSchema } from '@/infra/env/env';

const env = envSchema.parse(process.env);

const gameFieldsToSearch = [
  'name', 'slug', 'cover.url', 'artworks.url', 'category', 'genres.name',
  'involved_companies.company.name', 'involved_companies.developer', 'involved_companies.publisher',
  'platforms.name', 'first_release_date', 'similar_games.name', 'summary', 'themes.name',
];

export async function getGameInfoByName(gameName: string, requestOptions: ApicalypseConfig, limit: number = 1): Promise<any> {
  const response = apicalypse(requestOptions);

  const apiResponse = await response
    .fields(gameFieldsToSearch)
    .search(gameName)
    .limit(limit)
    .request(`${env.IGDB_BASE_URL}/games`);

  return apiResponse.data[0];
}

export async function getGameInfoById(igdbId: string, requestOptions: ApicalypseConfig): Promise<any> {
  const response = apicalypse(requestOptions);

  const apiResponse = await response
    .fields(gameFieldsToSearch)
    .where(`id = ${igdbId}`)
    .limit(1)
    .request(`${env.IGDB_BASE_URL}/games`);

  return apiResponse.data[0];
}
