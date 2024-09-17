import { DomainException } from "./domain-exception";

export class UserNotFoundException extends DomainException {
  public constructor(id: string) {
    super(`User not found (${id})`, 404);
  }
}
