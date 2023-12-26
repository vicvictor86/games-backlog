import { z } from 'zod';
import { ZodValidationPipe } from '../../shared/pipes/zodValidationPipe';

const confirmAccountEmailBodySchema = z.object({
  email: z.string().email(),
  accessToken: z.string(),
});

export const confirmAccountEmailBodyValidationPipe = new ZodValidationPipe(confirmAccountEmailBodySchema);

export type ConfirmAccountEmailBodySchema = z.infer<typeof confirmAccountEmailBodySchema>;
