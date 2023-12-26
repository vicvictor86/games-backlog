import { z } from 'zod';
import { ZodValidationPipe } from '../../shared/pipes/zodValidationPipe';

const changeUserRoleBodySchema = z.object({
  userToChangeRoleId: z.string(),
  role: z.string(),
});

export const changeUserRoleBodyValidationPipe = new ZodValidationPipe(changeUserRoleBodySchema);

export type ChangeUserRoleBodySchema = z.infer<typeof changeUserRoleBodySchema>;
