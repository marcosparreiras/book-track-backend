import { DomainException } from "./domain-exception";

export class UserAlreadyExistsException extends DomainException {
  public constructor(email: string) {
    super(`User with email (${email}) already exists`);
  }
}
