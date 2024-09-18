import { DomainException } from "./domain-exception";

export class InvalidCredentialsException extends DomainException {
  public constructor() {
    super("Invalid credentials", 401);
  }
}
