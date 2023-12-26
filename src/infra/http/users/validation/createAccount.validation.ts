import { z } from 'zod';
import { ZodValidationPipe } from '../../shared/pipes/zodValidationPipe';

const createAccountBodySchema = z.object({
  name: z.string(),
  username: z.string(),
  email: z.string().email().toLowerCase(),
  password: z.string().min(6),
  birthDate: z.coerce.date(),
  bio: z.string().max(255).optional().nullable(),
  twitter: z.string().max(255).optional().nullable(),
  facebook: z.string().max(255).optional().nullable(),
});

export const createAccountBodyValidationPipe = new ZodValidationPipe(createAccountBodySchema);

export type CreateAccountBodySchema = z.infer<typeof createAccountBodySchema>;
