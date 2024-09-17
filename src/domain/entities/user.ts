import { Email } from "./value-objects/email";
import { Name } from "./value-objects/name";
import { Password } from "./value-objects/password";
import { UUID } from "./value-objects/uuid";

type CreateUserDTO = {
  name: string;
  email: string;
  password: string;
};

export class User {
  private id: UUID;
  private name: Name;
  private email: Email;
  private password: Password;
  private avatarUrl: string | null;
  private _isAdmin: boolean;

  public getId(): string {
    return this.id.toString();
  }

  public getName(): string {
    return this.name.toString();
  }

  public getEmail(): string {
    return this.email.toString();
  }

  public getPasswordHash(): string {
    return this.password.getHash();
  }

  public getAvatarUrl(): string | null {
    return this.avatarUrl;
  }

  public isAdmin(): boolean {
    return this._isAdmin;
  }

  public verifyPassword(password: string): boolean {
    return this.password.compare(password);
  }

  private constructor(
    id: UUID,
    name: Name,
    email: Email,
    password: Password,
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
    const id = UUID.generate();
    const name = new Name(input.name);
    const email = new Email(input.email);
    const password = Password.createFromPlainText(input.password);
    const avatarUrl = null;
    const isAdmin = false;
    return new User(id, name, email, password, avatarUrl, isAdmin);
  }
}
