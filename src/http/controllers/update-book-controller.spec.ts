import request from "supertest";
import { InMemoryUserRepository } from "../../adapters/in-memory/in-memory-user-repository";
import { Registry } from "../../domain/bondaries/registry";
import { app } from "../app";
import { JwtToken } from "../../adapters/token";
import { InMemoryBookRepository } from "../../adapters/in-memory/in-memory-book-repository";
import { User } from "../../domain/entities/user";
import { Book } from "../../domain/entities/book";

describe("PUT /book/:bookId", () => {
  let bookRepository: InMemoryBookRepository;
  let userRepository: InMemoryUserRepository;
  let bookId: string;

  beforeEach(() => {
    const registry = Registry.getInstance();
    bookRepository = new InMemoryBookRepository();
    userRepository = new InMemoryUserRepository();
    registry.register("token", new JwtToken("secret"));
    registry.register("userRepository", userRepository);
    registry.register("bookRepository", bookRepository);
    const admin = User.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456",
    });
    const user = User.create({
      email: "jannydoe@example.com",
      name: "Janny Doe",
      password: "123456",
    });
    Object.defineProperty(admin, "_isAdmin", {
      get() {
        return true;
      },
    });
    const book = Book.create({
      author: "John Doe",
      description: "Some fake description",
      publishedAt: "2020-01-01",
      title: "Some Fake Title",
    });
    userRepository.items.push(admin, user);
    bookRepository.items.push(book);
    bookId = book.getId();
  });

  it("Should be able to update a book data with admin credentials", async () => {
    const email = "johndoe@example.com";
    const password = "123456";
    const {
      body: { token },
    } = await request(app).post("/session").send({ email, password });
    const response = await request(app)
      .put(`/book/${bookId}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        title: "Patterns of Enterprise Application Architecture",
        author: "Martin Follwer",
        description: "Some Fake Description",
        publishedAt: "2020-01-01",
      });
    expect(response.status).toEqual(204);
  });

  it("Should not be able to update a book with normal user credentials", async () => {
    const email = "jannydoe@example.com";
    const password = "123456";
    const {
      body: { token },
    } = await request(app).post("/session").send({ email, password });
    const response = await request(app)
      .put(`/book/${bookId}`)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        title: "Patterns of Enterprise Application Architecture",
        author: "Martin Follwer",
        description: "Some Fake Description",
        publishedAt: "2020-01-01",
      });
    expect(response.status).toEqual(403);
  });
});
