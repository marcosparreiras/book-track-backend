import { DomainException } from "./domain-exception";

export class CommentNotFoundException extends DomainException {
  public constructor(comment: string) {
    super(`Comment not foud (${comment})`);
  }
}
