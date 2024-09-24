import request from "supertest";
import { InMemoryUserRepository } from "../../adapters/in-memory/in-memory-user-repository";
import { Registry } from "../../domain/bondaries/registry";
import { app } from "../app";
import { JwtToken } from "../../adapters/token";
import { InMemoryBookRepository } from "../../adapters/in-memory/in-memory-book-repository";
import { User } from "../../domain/entities/user";
import { Book } from "../../domain/entities/book";
import { InMemoryCommentRepository } from "../../adapters/in-memory/in-memory-comment-repository";

describe("POST /book/:bookId/comment", () => {
  let userRepository: InMemoryUserRepository;
  let bookRepository: InMemoryBookRepository;
  let bookId: string;

  beforeEach(() => {
    const registry = Registry.getInstance();
    userRepository = new InMemoryUserRepository();
    bookRepository = new InMemoryBookRepository();
    registry.register("token", new JwtToken("secret"));
    registry.register("userRepository", userRepository);
    registry.register("bookRepository", bookRepository);
    registry.register("commentRepository", new InMemoryCommentRepository());
    const user = User.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456",
    });
    const book = Book.create({
      author: "Janny Frank",
      description: "Some fake description",
      publishedAt: "2020-01-01",
      title: "Some Fake Title",
    });
    userRepository.items.push(user);
    bookRepository.items.push(book);
    bookId = book.getId();
  });

  it("Should be able to create an comment on a book", async () => {
    const email = "johndoe@example.com";
    const password = "123456";
    const {
      body: { token },
    } = await request(app).post("/session").send({ email, password });
    const response = await request(app)
      .post(`/book/${bookId}/comment`)
      .set({ Authorization: `Bearer ${token}` })
      .send({
        content: "Some fake comment",
        rate: 4,
      });
    expect(response.status).toEqual(201);
    expect(response.body.commentId).toEqual(expect.any(String));
  });
});
