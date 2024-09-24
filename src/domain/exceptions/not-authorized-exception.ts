import { DomainException } from "./domain-exception";

export class NotAuthorizedException extends DomainException {
  constructor() {
    super("Not authorized", 403);
  }
}
