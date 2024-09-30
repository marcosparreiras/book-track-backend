import type { Book } from "../entities/book";

type Settings = {
  pageSettings: {
    pageSize: number;
    page: number;
  };
  filter: {
    title?: string;
  };
};

export interface BookRepository {
  getMany(settings: Settings): Promise<Book[]>;
  getById(id: string): Promise<Book | null>;
  insert(book: Book): Promise<void>;
  delete(book: Book): Promise<void>;
  update(book: Book): Promise<void>;
}
