import type { BookRepository } from "../domain/bondaries/book-repository";
import { inject } from "../domain/bondaries/registry";
import { Book } from "../domain/entities/book";
import type { DbConnection } from "./postgres-connection";

export class PostgresBookRepository implements BookRepository {
  @inject("dbConnection")
  private connection!: DbConnection;

  private toDomain(data: any): Book {
    return Book.load({
      author: data.author,
      description: data.description,
      id: data.id,
      imageUrl: data.image_url,
      publishedAt: data.published_at,
      title: data.title,
    });
  }

  async getMany(settings: {
    pageSettings: { pageSize: number; page: number };
    filter: { title?: string };
  }): Promise<Book[]> {
    let queryResults: any[];
    const { title } = settings.filter;
    const { page, pageSize } = settings.pageSettings;
    if (title) {
      queryResults = await this.connection.query(
        `SELECT id, title, author, description, image_url, published_at 
         FROM books 
         WHERE title ILIKE '%' || $1 || '%' 
         LIMIT $2 OFFSET $3`,
        [title, pageSize, pageSize * (page - 1)]
      );
    } else {
      queryResults = await this.connection.query(
        `SELECT id, title, author, description, image_url, published_at
         FROM books
         LIMIT $1 OFFSET $2`,
        [pageSize, pageSize * (page - 1)]
      );
      console.log(queryResults);
    }
    return queryResults.map(this.toDomain);
  }

  async getById(id: string): Promise<Book | null> {
    const queryResult = await this.connection.query(
      "SELECT id, title, author, description, image_url, published_at FROM books WHERE id = $1",
      [id]
    );
    if (queryResult.length === 0) {
      return null;
    }
    return this.toDomain(queryResult[0]);
  }

  async insert(book: Book): Promise<void> {
    await this.connection.query(
      `INSERT INTO
       books(id, title, author, description, image_url, published_at)
       VALUES($1, $2, $3, $4, $5, $6)`,
      [
        book.getId(),
        book.getTitle(),
        book.getAuthor(),
        book.getDescription(),
        book.getImageUrl(),
        book.getPublishedAt(),
      ]
    );
  }

  async delete(book: Book): Promise<void> {
    await this.connection.query("DELETE FROM books WHERE id = $1", [
      book.getId(),
    ]);
  }

  async update(book: Book): Promise<void> {
    await this.connection.query(
      `UPDATE books
       SET title = $1, author = $2, description = $3, image_url = $4, published_at = $5
       WHERE id = $6`,
      [
        book.getTitle(),
        book.getAuthor(),
        book.getDescription(),
        book.getImageUrl(),
        book.getPublishedAt(),
        book.getId(),
      ]
    );
  }
}
