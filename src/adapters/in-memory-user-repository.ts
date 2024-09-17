import type { User } from "../domain/entities/user";
import type { UserRepository } from "../domain/repository/user-repository";

export class InMemoryUserRepository implements UserRepository {
  public items: User[] = [];

  async getByEmail(email: string): Promise<User | null> {
    const user = this.items.find((item) => item.getEmail() === email);
    return user ?? null;
  }

  async insert(user: User): Promise<void> {
    this.items.push(user);
  }
}
