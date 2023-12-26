import { AuthenticateBodySchema } from '../validation/authenticate.validation';

export class AuthenticateDTO implements AuthenticateBodySchema {
  email: string;

  password: string;
}
