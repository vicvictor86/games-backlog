import { DomainEvents } from '@/core/events/domainEvents';
import { User } from '@/domain/users/entities/user.entity';
import { UsersRepository } from '@/domain/users/repositories/users.repository';

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = [];

  async findById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.id.toString() === id);

    if (!user) {
      return null;
    }

    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = this.items.find((item) => item.username === username);

    if (!user) {
      return null;
    }

    return user;
  }

  async isAdmin(userId: string): Promise<boolean> {
    const user = this.items.find((item) => item.id.toString() === userId);

    if (!user) {
      return false;
    }

    return user.role === 'ADMIN';
  }

  async isPremium(userId: string): Promise<boolean> {
    const user = this.items.find((item) => item.id.toString() === userId);

    if (!user) {
      return false;
    }

    return user.role === 'PREMIUM';
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.email === email);

    if (!user) {
      return null;
    }

    return user;
  }

  async create(user: User) {
    this.items.push(user);

    DomainEvents.dispatchEventsForAggregate(user.id);
  }

  async save(user: User) {
    const userIndex = this.items.findIndex((item) => item.id.equals(user.id));

    if (userIndex < 0) {
      return;
    }

    this.items[userIndex] = user;

    DomainEvents.dispatchEventsForAggregate(user.id);
  }
}
