import { CreateAccountBodySchema } from '../validation/createAccount.validation';

export class CreateAccountDTO implements CreateAccountBodySchema {
  name: string;

  email: string;

  username: string;

  password: string;

  birthDate: Date;

  bio?: string | null;

  facebook?: string | null;

  twitter?: string | null;
}
