import type { User } from "../entities/user";

export interface UserRepository {
  getById(id: string): Promise<User | null>;
  getByEmail(email: string): Promise<User | null>;
  insert(user: User): Promise<void>;
  update(user: User): Promise<void>;
}
