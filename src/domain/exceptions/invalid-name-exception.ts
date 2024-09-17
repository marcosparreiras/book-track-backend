import { DomainException } from "./domain-exception";

export class InvalidNameException extends DomainException {
  public constructor(name: string) {
    super("Invalid name (${name})");
  }
}
