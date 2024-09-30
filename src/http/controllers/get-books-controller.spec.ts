import request from "supertest";
import { InMemoryUserRepository } from "../../adapters/in-memory/in-memory-user-repository";
import { Registry } from "../../domain/bondaries/registry";
import { app } from "../app";
import { JwtToken } from "../../adapters/token";
import { InMemoryBookRepository } from "../../adapters/in-memory/in-memory-book-repository";
import { User } from "../../domain/entities/user";
import { Book } from "../../domain/entities/book";
import { InMemoryCommentRepository } from "../../adapters/in-memory/in-memory-comment-repository";
import { Comment } from "../../domain/entities/comment";

describe("GET /book", () => {
  let bookRepository: InMemoryBookRepository;

  beforeEach(() => {
    const registry = Registry.getInstance();
    bookRepository = new InMemoryBookRepository();
    registry.register("bookRepository", bookRepository);
    const books = [
      {
        author: "Janny Frank",
        description: "Some fake description",
        publishedAt: "2020-01-01",
        title: "Some Fake Title a00",
      },
      {
        author: "Janny Frank",
        description: "Some fake description",
        publishedAt: "2020-01-01",
        title: "Some Fake Title a01",
      },
      {
        author: "Tom Jammy",
        description: "Some fake description",
        publishedAt: "2020-01-01",
        title: "Some Fake Title 02",
      },
      {
        author: "Robbert Doe",
        description: "Some fake description",
        publishedAt: "2020-01-01",
        title: "Some Fake Title 03",
      },
      {
        author: "John Doe",
        description: "Some fake description",
        publishedAt: "2020-01-01",
        title: "Some Fake Title 04",
      },
    ].map((data) => Book.create(data));
    bookRepository.items.push(...books);
  });

  it("Should be able to get books by page", async () => {
    const response = await request(app).get(`/book?page=2&pageSize=3`);
    expect(response.status).toEqual(200);
    expect(response.body.page).toEqual(2);
    expect(response.body.pageSize).toEqual(3);
    expect(response.body.books).toHaveLength(2);
    expect(response.body.books[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: expect.any(String),
        author: expect.any(String),
        description: expect.any(String),
        publishedAt: expect.any(String),
        imageUrl: null,
      })
    );
  });

  it("Should be able to serch books by title", async () => {
    const response = await request(app).get(`/book?title=A0`);
    expect(response.status).toEqual(200);
    expect(response.body.page).toEqual(1);
    expect(response.body.pageSize).toEqual(10);
    expect(response.body.books).toHaveLength(2);
    expect(response.body.books[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: expect.any(String),
        author: expect.any(String),
        description: expect.any(String),
        publishedAt: expect.any(String),
        imageUrl: null,
      })
    );
  });
});
