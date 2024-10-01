import type { BookRepository } from "../domain/bondaries/book-repository";
import { Registry } from "../domain/bondaries/registry";
import { Book } from "../domain/entities/book";
import { PostgresBookRepository } from "./postgres-book-repository";
import { PgConnection } from "./postgres-connection";

describe("PostgresBookRespository", () => {
  const connectionString = "postgres://admin:admin@localhost:5432/booktrack";
  const dbConnection = new PgConnection(connectionString);
  const bookRepository: BookRepository = new PostgresBookRepository();
  const registry = Registry.getInstance();
  registry.register("dbConnection", dbConnection);

  beforeEach(async () => {
    await dbConnection.query("DELETE FROM books");
  });

  afterAll(async () => {
    await dbConnection.query("DELETE FROM books");
    await dbConnection.close();
  });

  it("Should be able to get a book by id", async () => {
    const book = Book.create({
      author: "John Doe",
      description: "Some description",
      publishedAt: "2020-01-01",
      title: "Some Title",
    });
    await dbConnection.query(
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
    const result = await bookRepository.getById(book.getId());
    expect(result).toBeInstanceOf(Book);
    expect(result?.getId()).toEqual(book.getId());
    expect(result?.getTitle()).toEqual(book.getTitle());
    expect(result?.getAuthor()).toEqual(book.getAuthor());
    expect(result?.getDescription()).toEqual(book.getDescription());
    expect(result?.getImageUrl()).toEqual(book.getImageUrl());
    expect(result?.getPublishedAt()).toEqual(book.getPublishedAt());
  });

  it("Should be able to get a book by page and title filter", async () => {
    const books = [
      {
        author: "John Doe",
        description: "Some description",
        publishedAt: "2020-01-01",
        title: "Some Title",
      },
      {
        author: "Janny Doe",
        description: "Some description",
        publishedAt: "2020-01-01",
        title: "Some Title",
      },
      {
        author: "Frank Brow",
        description: "Some description",
        publishedAt: "2020-01-01",
        title: "Some Title",
      },
      {
        author: "Robbert Yellow",
        description: "Some description",
        publishedAt: "2020-01-01",
        title: "Super Title",
      },
    ].map((data) => Book.create(data));
    for (let book of books) {
      await dbConnection.query(
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
    const result = await bookRepository.getMany({
      pageSettings: {
        page: 2,
        pageSize: 2,
      },
      filter: {
        title: "some",
      },
    });
    expect(result).toHaveLength(1);
    expect(result[0].getTitle()).toEqual("Some Title");
  });

  it("Should be able to insert a new book", async () => {
    const book = Book.create({
      author: "John Doe",
      description: "Some description",
      publishedAt: "2020-01-01",
      title: "Some Title",
    });
    await bookRepository.insert(book);
    const queryResult = await dbConnection.query(
      "SELECT id, title, author, description, image_url, published_at FROM books WHERE id = $1",
      [book.getId()]
    );
    expect(queryResult[0].id).toEqual(book.getId());
    expect(queryResult[0].title).toEqual(book.getTitle());
    expect(queryResult[0].author).toEqual(book.getAuthor());
    expect(queryResult[0].description).toEqual(book.getDescription());
    expect(queryResult[0].image_url).toEqual(book.getImageUrl());
    expect(queryResult[0].published_at).toEqual(book.getPublishedAt());
  });

  it("Should be able to update a book", async () => {
    const book = Book.create({
      author: "John Doe",
      description: "Some description",
      publishedAt: "2020-01-01",
      title: "Some Title",
    });
    await dbConnection.query(
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
    book.setAuthor("Janny Doe");
    book.setDescription("New description");
    book.setImageUrl("http://somenewurl.com/image");
    book.setPublishedAt("2020-01-02");
    book.setTitle("New Title");
    bookRepository.update(book);
    const queryResult = await dbConnection.query(
      "SELECT id, title, author, description, image_url, published_at FROM books WHERE id = $1",
      [book.getId()]
    );
    expect(queryResult[0].id).toEqual(book.getId());
    expect(queryResult[0].title).toEqual(book.getTitle());
    expect(queryResult[0].author).toEqual(book.getAuthor());
    expect(queryResult[0].description).toEqual(book.getDescription());
    expect(queryResult[0].image_url).toEqual(book.getImageUrl());
    expect(queryResult[0].published_at).toEqual(book.getPublishedAt());
  });

  it("Should be able to delete a book", async () => {
    const book = Book.create({
      author: "John Doe",
      description: "Some description",
      publishedAt: "2020-01-01",
      title: "Some Super Title",
    });
    await dbConnection.query(
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
    await bookRepository.delete(book);
    const queryResult = await dbConnection.query(
      "SELECT id, title, author, description, image_url, published_at FROM books WHERE id = $1",
      [book.getId()]
    );
    expect(queryResult).toHaveLength(0);
  });
});
