import type { Book } from "../entities/book";

export interface BookRepository {
  getById(id: string): Promise<Book | null>;
  insert(book: Book): Promise<void>;
  update(book: Book): Promise<void>;
}
