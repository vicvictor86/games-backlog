import { z } from 'zod';
import { ZodValidationPipe } from '../../shared/pipes/zodValidationPipe';

const authenticateBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const authenticateBodyValidationPipe = new ZodValidationPipe(authenticateBodySchema);

export type AuthenticateBodySchema = z.infer<typeof authenticateBodySchema>;
