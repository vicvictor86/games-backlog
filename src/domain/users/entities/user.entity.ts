import { Entity } from '@/core/entities/entity';
import { UniqueEntityId } from '@/core/entities/uniqueEntityId';
import { Optional } from '@/core/types/optional';

export type Role = 'ADMIN' | 'CLIENT' | 'PREMIUM';

export interface UserProps {
  name: string;
  username : string;
  email: string;
  password: string;
  birthDate: Date;
  bio?: string | null;
  twitter?: string | null;
  facebook?: string | null;
  emailConfirmed: boolean;
  role : Role;

  createdAt: Date;
  updatedAt?: Date | null;
}

export class User extends Entity<UserProps> {
  get name() { return this.props.name; }

  get username() { return this.props.username; }

  get email() { return this.props.email; }

  get password() { return this.props.password; }

  get birthDate() { return this.props.birthDate; }

  get bio() { return this.props.bio; }

  set bio(bio: string | null | undefined) {
    this.props.bio = bio;
    this.touch();
  }

  get twitter() { return this.props.twitter; }

  set twitter(twitter: string | null | undefined) {
    this.props.twitter = twitter;
    this.touch();
  }

  get facebook() { return this.props.facebook; }

  set facebook(facebook: string | null | undefined) {
    this.props.facebook = facebook;
    this.touch();
  }

  get emailConfirmed() { return this.props.emailConfirmed; }

  set emailConfirmed(emailConfirmed: boolean) {
    this.props.emailConfirmed = emailConfirmed;
    this.touch();
  }

  get role() { return this.props.role; }

  set role(role: Role) {
    this.props.role = role;
    this.touch();
  }

  get createdAt() { return this.props.createdAt; }

  get updatedAt() { return this.props.updatedAt; }

  private touch() {
    this.props.updatedAt = new Date();
  }

  static create(props: Optional<UserProps, 'createdAt' | 'emailConfirmed'>, id?: UniqueEntityId) {
    const user = new User({
      ...props,
      createdAt: props.createdAt ?? new Date(),
      emailConfirmed: props.emailConfirmed ?? false,
    }, id);

    return user;
  }
}
