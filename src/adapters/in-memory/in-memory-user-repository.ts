import type { User } from "../domain/entities/user";
import type { UserRepository } from "../domain/bondaries/user-repository";

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = [];

  async getById(id: string): Promise<User | null> {
    const user = this.items.find((item) => item.getId() === id);
    return user ?? null;
  }

  async getByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.getEmail() === email);
    return user ?? null;
  }

  async insert(user: User): Promise<void> {
    this.items.push(user);
  }

  async update(user: User): Promise<void> {
    const userIndex = this.items.findIndex(
      (item) => item.getId() === user.getId()
    );
    this.items[userIndex] = user;
  }
}
