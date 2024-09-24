import { DomainException } from "./domain-exception";

export class BookNotFoundException extends DomainException {
  public constructor(book: string) {
    super(`Book not found (${book})`);
  }
}
