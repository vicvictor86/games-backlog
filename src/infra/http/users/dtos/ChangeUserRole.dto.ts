import { Role } from '@prisma/client';
import { ChangeUserRoleBodySchema } from '../validation/changeUserRole.validation';

export class ChangeUserRoleDTO implements ChangeUserRoleBodySchema {
  role: Role;

  userId: string;

  userToChangeRoleId: string;
}
