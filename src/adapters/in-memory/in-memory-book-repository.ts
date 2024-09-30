import type { BookRepository } from "../../domain/bondaries/book-repository";
import type { Book } from "../../domain/entities/book";

export class InMemoryBookRepository implements BookRepository {
  public items: Book[] = [];

  async getMany(settings: {
    pageSettings: { pageSize: number; page: number };
    filter: { title?: string };
  }): Promise<Book[]> {
    const { title } = settings.filter;
    const { page, pageSize } = settings.pageSettings;
    let books: Book[] = this.items;
    if (title) {
      books = books.filter((item) =>
        item.getTitle().toLowerCase().includes(title.toLowerCase())
      );
    }
    books = books.slice(pageSize * (page - 1), page * pageSize);
    return books;
  }

  async getById(id: string): Promise<Book | null> {
    const book = this.items.find((item) => item.getId() === id);
    return book ?? null;
  }

  async delete(book: Book): Promise<void> {
    const index = this.items.findIndex((item) => item.getId() === book.getId());
    this.items.splice(index, 1);
  }

  async insert(book: Book): Promise<void> {
    this.items.push(book);
  }

  async update(book: Book): Promise<void> {
    const index = this.items.findIndex((item) => item.getId() === book.getId());
    this.items[index] = book;
  }
}
