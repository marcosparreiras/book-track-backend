import type { BookRepository } from "../../domain/bondaries/book-repository";
import type { Book } from "../../domain/entities/book";

export class InMemoryBookRepository implements BookRepository {
  public items: Book[] = [];

  async insert(book: Book): Promise<void> {
    this.items.push(book);
  }
}
