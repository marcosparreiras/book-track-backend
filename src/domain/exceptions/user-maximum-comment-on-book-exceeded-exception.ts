import { DomainException } from "./domain-exception";

export class UserMaximumCommentOnBookExceededException extends DomainException {
  public constructor(user: string, book: string) {
    super(`User (${user}) maximum comment on book (${book}) exceed`);
  }
}
