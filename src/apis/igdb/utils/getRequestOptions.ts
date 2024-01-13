import { ApicalypseConfig } from 'apicalypse';
import { envSchema } from '@/infra/env/env';
import { getAuthToken } from './getAuthToken';
import 'dotenv/config';

const env = envSchema.parse(process.env);

export async function getRequestOptions(): Promise<ApicalypseConfig> {
  const token = await getAuthToken();

  const { accessToken } = token;

  const requestOptions: ApicalypseConfig = {
    baseURL: env.IGDB_BASE_URL,
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Client-ID': env.IGDB_CLIENT_ID,
      Authorization: `Bearer ${accessToken}`,
    },
  };

  return requestOptions;
}
