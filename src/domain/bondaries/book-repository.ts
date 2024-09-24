import type { Book } from "../entities/book";

export interface BookRepository {
  insert(book: Book): Promise<void>;
}
