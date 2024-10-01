import { Registry } from "../domain/bondaries/registry";
import type { UserRepository } from "../domain/bondaries/user-repository";
import { User } from "../domain/entities/user";
import { PgConnection } from "./postgres-connection";
import { PostgresUserRepository } from "./postgres-user-repository";

describe("PostgresUserRepository", () => {
  const connectionString = "postgres://admin:admin@localhost:5432/booktrack";
  const dbConnection = new PgConnection(connectionString);
  const userRepository: UserRepository = new PostgresUserRepository();
  const registry = Registry.getInstance();
  registry.register("dbConnection", dbConnection);

  beforeEach(async () => {
    await dbConnection.query("DELETE FROM users");
  });

  afterAll(async () => {
    await dbConnection.query("DELETE FROM users");
    await dbConnection.close();
  });

  it("Should be able to get a user by id", async () => {
    const user = User.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });
    await dbConnection.query(
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
    const result = await userRepository.getById(user.getId());
    expect(result).toBeInstanceOf(User);
    expect(result?.getId()).toEqual(user.getId());
    expect(result?.getName()).toEqual(user.getName());
    expect(result?.getEmail()).toEqual(user.getEmail());
    expect(result?.getPasswordHash()).toEqual(user.getPasswordHash());
    expect(result?.getAvatarUrl()).toEqual(user.getAvatarUrl());
    expect(result?.isAdmin()).toEqual(user.isAdmin());
  });

  it("Should be able to get a user by email", async () => {
    const user = User.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });
    await dbConnection.query(
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
    const result = await userRepository.getByEmail(user.getEmail());
    expect(result).toBeInstanceOf(User);
    expect(result?.getId()).toEqual(user.getId());
    expect(result?.getName()).toEqual(user.getName());
    expect(result?.getEmail()).toEqual(user.getEmail());
    expect(result?.getPasswordHash()).toEqual(user.getPasswordHash());
    expect(result?.getAvatarUrl()).toEqual(user.getAvatarUrl());
    expect(result?.isAdmin()).toEqual(user.isAdmin());
  });

  it("Should be able to insert a new user", async () => {
    const user = User.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });
    await userRepository.insert(user);
    const queryResult = await dbConnection.query(
      "SELECT id, name, email, password, avatar_url, is_admin FROM users WHERE id = $1",
      [user.getId()]
    );
    expect(queryResult).toHaveLength(1);
    expect(queryResult[0]?.id).toEqual(user.getId());
    expect(queryResult[0]?.name).toEqual(user.getName());
    expect(queryResult[0]?.email).toEqual(user.getEmail());
    expect(queryResult[0]?.password).toEqual(user.getPasswordHash());
    expect(queryResult[0]?.avatar_url).toEqual(user.getAvatarUrl());
    expect(queryResult[0]?.is_admin).toEqual(user.isAdmin());
  });

  it("Should be able to update a user", async () => {
    const user = User.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });
    await dbConnection.query(
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
    user.setAvatarUrl("https://github.com/marcosparreiras.png");
    userRepository.update(user);
    const queryResult = await dbConnection.query(
      "SELECT id, name, email, password, avatar_url, is_admin FROM users WHERE id = $1",
      [user.getId()]
    );
    expect(queryResult).toHaveLength(1);
    expect(queryResult[0]?.id).toEqual(user.getId());
    expect(queryResult[0]?.name).toEqual(user.getName());
    expect(queryResult[0]?.email).toEqual(user.getEmail());
    expect(queryResult[0]?.password).toEqual(user.getPasswordHash());
    expect(queryResult[0]?.avatar_url).toEqual(user.getAvatarUrl());
    expect(queryResult[0]?.is_admin).toEqual(user.isAdmin());
  });
});
