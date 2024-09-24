import type { BookRepository } from "../../domain/bondaries/book-repository";
import type { Book } from "../../domain/entities/book";

export class InMemoryBookRepository implements BookRepository {
  public items: Book[] = [];

  async getById(id: string): Promise<Book | null> {
    const book = this.items.find((item) => item.getId() === id);
    return book ?? null;
  }

  async insert(book: Book): Promise<void> {
    this.items.push(book);
  }

  async update(book: Book): Promise<void> {
    const index = this.items.findIndex((item) => item.getId() === book.getId());
    this.items[index] = book;
  }
}
