import { inject } from "../domain/bondaries/registry";
import type { UserRepository } from "../domain/bondaries/user-repository";
import { User } from "../domain/entities/user";
import type { DbConnection } from "./postgres-connection";

export class PostgresUserRepository implements UserRepository {
  @inject("dbConnection")
  private connection!: DbConnection;

  private toDomain(data: any): User {
    const user = User.load({
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      avatarUrl: data.avatar_url,
      isAdmin: data.is_admin,
    });
    return user;
  }

  async getById(id: string): Promise<User | null> {
    const queryResult = await this.connection.query(
      "SELECT id, name, email, password, avatar_url, is_admin FROM users WHERE id = $1",
      [id]
    );
    if (queryResult.length === 0) {
      return null;
    }
    return this.toDomain(queryResult[0]);
  }

  async getByEmail(email: string): Promise<User | null> {
    const queryResult = await this.connection.query(
      "SELECT id, name, email, password, avatar_url, is_admin FROM users WHERE email = $1",
      [email]
    );
    if (queryResult.length === 0) {
      return null;
    }
    return this.toDomain(queryResult[0]);
  }

  async insert(user: User): Promise<void> {
    await this.connection.query(
      `INSERT INTO
       users(id, name, email, password, avatar_url, is_admin)
       VALUES($1, $2, $3, $4, $5, $6)`,
      [
        user.getId(),
        user.getName(),
        user.getEmail(),
        user.getPasswordHash(),
        user.getAvatarUrl(),
        user.isAdmin(),
      ]
    );
  }

  async update(user: User): Promise<void> {
    await this.connection.query(
      `UPDATE users SET name = $1, email = $2, password = $3, avatar_url = $4, is_admin = $5`,
      [
        user.getName(),
        user.getEmail(),
        user.getPasswordHash(),
        user.getAvatarUrl(),
        user.isAdmin(),
      ]
    );
  }
}
