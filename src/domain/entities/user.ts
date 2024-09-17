import { randomUUID } from "crypto";

type CreateUserDTO = {
  name: string;
  email: string;
  password: string;
};

export class User {
  private id: string;
  private name: string;
  private email: string;
  private password: string;
  private avatarUrl: string | null;
  private _isAdmin: boolean;

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public isAdmin(): boolean {
    return this._isAdmin;
  }

  private constructor(
    id: string,
    name: string,
    email: string,
    password: string,
    avatarUrl: string | null,
    isAdmin: boolean
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.avatarUrl = avatarUrl;
    this._isAdmin = isAdmin;
  }

  public static create(input: CreateUserDTO): User {
    const id = randomUUID();
    const avatarUrl = null;
    const isAdmin = false;
    return new User(
      id,
      input.name,
      input.email,
      input.password,
      avatarUrl,
      isAdmin
    );
  }
}
