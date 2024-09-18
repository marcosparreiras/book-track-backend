import { DomainException } from "./domain-exception";

export class InvalidEmailException extends DomainException {
  public constructor(email: string) {
    super(`Invalid email (${email})`);
  }
}
