import { z } from 'zod';

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string(),
  JWT_PUBLIC_KEY: z.string(),
  PORT: z.coerce.number().optional().default(3333),
  REDIS_HOST: z.string().optional().default('127.0.0.1'),
  REDIS_PORT: z.coerce.number().optional().default(6379),
  REDIS_DB: z.coerce.number().optional().default(0),
  EMAIL_HOST: z.string().optional().default('smtp.forwardemail.net'),
  EMAIL_PORT: z.coerce.number().optional().default(2525),
  EMAIL_USER: z.string().optional().default(''),
  EMAIL_PASSWORD: z.string().optional().default(''),
  SECURE: z.string().optional().default('false'),

  IGDB_BASE_URL: z.string().optional().default('https://api.igdb.com/v4'),
  IGDB_CLIENT_ID: z.string().optional().default(''),
  IGDB_CLIENT_SECRET: z.string().optional().default(''),
  IGDB_GRANT_TYPE: z.string().optional().default('client_credentials'),
});

export type Env = z.infer<typeof envSchema>;
