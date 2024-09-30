import { DomainException } from "./domain-exception";

export class InvalidPageParametersException extends DomainException {
  public constructor() {
    super("Invalid page parameters");
  }
}
