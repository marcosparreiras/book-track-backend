import { InMemoryBookRepository } from "../../adapters/in-memory/in-memory-book-repository";
import { Registry } from "../bondaries/registry";
import { Book } from "../entities/book";
import { InvalidPageParametersException } from "../exceptions/invalid-page-parameters-exception";
import { GetBooksUseCase } from "./get-books-use-case";

describe("GetBooksUseCase", () => {
  let sut: GetBooksUseCase;
  let bookRepository: InMemoryBookRepository;

  beforeEach(() => {
    sut = new GetBooksUseCase();
    bookRepository = new InMemoryBookRepository();
    const registry = Registry.getInstance();
    registry.register("bookRepository", bookRepository);
  });

  it("Should be able to get books by page and set the page size", async () => {
    const books = [
      {
        title: "Book 00",
        author: "Author AA",
        description: "Description 00",
        publishedAt: "2020-01-01",
      },
      {
        title: "Book 01",
        author: "Author AA",
        description: "Description 01",
        publishedAt: "2020-01-01",
      },
      {
        title: "Book 02",
        author: "Author BB",
        description: "Description 02",
        publishedAt: "2020-01-01",
      },
      {
        title: "Book 03",
        author: "Author BB",
        description: "Description 03",
        publishedAt: "2020-01-01",
      },
      {
        title: "Book 04",
        author: "Author CC",
        description: "Description 04",
        publishedAt: "2020-01-01",
      },
    ].map((data) => Book.create(data));
    bookRepository.items.push(...books);
    const page01 = await sut.execute({ pageSize: 3, page: 1 });
    const page02 = await sut.execute({ pageSize: 3, page: 2 });
    expect(page01.books).toHaveLength(3);
    expect(page02.books).toHaveLength(2);
    expect(page01.books[0]).toBeInstanceOf(Book);
  });

  it.only("Should be able to search books by title", async () => {
    const books = [
      {
        title: "Book a00 ",
        author: "Author AA",
        description: "Description 00",
        publishedAt: "2020-01-01",
      },
      {
        title: "Book a01",
        author: "Author AA",
        description: "Description 01",
        publishedAt: "2020-01-01",
      },
      {
        title: "Book 02",
        author: "Author BB",
        description: "Description 02",
        publishedAt: "2020-01-01",
      },
      {
        title: "Book 03",
        author: "Author BB",
        description: "Description 03",
        publishedAt: "2020-01-01",
      },
      {
        title: "Book 04",
        author: "Author CC",
        description: "Description 04",
        publishedAt: "2020-01-01",
      },
    ].map((data) => Book.create(data));
    bookRepository.items.push(...books);
    const search01 = await sut.execute({
      pageSize: books.length,
      page: 1,
      title: "boo",
    });
    const search02 = await sut.execute({
      pageSize: books.length,
      page: 1,
      title: "A0",
    });
    expect(search01.books).toHaveLength(books.length);
    expect(search02.books).toHaveLength(2);
    expect(search02.books[0].title).toContain("a0");
    expect(search01.books[0]).toEqual(
      expect.objectContaining({
        author: expect.any(String),
        description: expect.any(String),
        id: expect.any(String),
        imageUrl: null,
        publishedAt: expect.any(Date),
        title: expect.any(String),
      })
    );
  });

  it("Should not be able to set a page size less then 1", async () => {
    const input = {
      pageSize: 0,
      page: 1,
    };
    await expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      InvalidPageParametersException
    );
  });

  it("Should not be able to searh for pages less then 1", async () => {
    const input = {
      pageSize: 4,
      page: 0,
    };
    await expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      InvalidPageParametersException
    );
  });
});
