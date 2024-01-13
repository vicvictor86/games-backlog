import { envSchema } from '@/infra/env/env';
import 'dotenv/config';

const env = envSchema.parse(process.env);

export const getAuthToken = async () => {
  const body = new FormData();
  body.append('client_id', env.IGDB_CLIENT_ID);
  body.append('client_secret', env.IGDB_CLIENT_SECRET);
  body.append('grant_type', env.IGDB_GRANT_TYPE);

  const response = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    body,
  });

  const responseJson = await response.json();

  const data = {
    accessToken: responseJson.access_token,
    expiresIn: responseJson.expires_in,
    tokenType: responseJson.token_type,
  };

  return data;
};
