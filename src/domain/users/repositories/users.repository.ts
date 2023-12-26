import { User } from '../entities/user.entity';

export abstract class UsersRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract findByUsername(username: string): Promise<User | null>;
  abstract isAdmin(userId: string): Promise<boolean>;
  abstract create(user: User): Promise<void>;
  abstract save(user: User): Promise<void>;
}
