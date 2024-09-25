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

describe("GET /book/:bookId", () => {
  let userRepository: InMemoryUserRepository;
  let bookRepository: InMemoryBookRepository;
  let commentRepository: InMemoryCommentRepository;
  let bookId: string;

  beforeEach(() => {
    const registry = Registry.getInstance();
    userRepository = new InMemoryUserRepository();
    bookRepository = new InMemoryBookRepository();
    commentRepository = new InMemoryCommentRepository();
    registry.register("token", new JwtToken("secret"));
    registry.register("userRepository", userRepository);
    registry.register("bookRepository", bookRepository);
    registry.register("commentRepository", commentRepository);
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
    const comment = Comment.create({
      bookId: book.getId(),
      content: "Some fake comment",
      rate: 4,
      userId: user.getId(),
    });
    userRepository.items.push(user);
    bookRepository.items.push(book);
    commentRepository.items.push(comment);
    bookId = book.getId();
  });

  it("Should be able to delete a comment", async () => {
    const response = await request(app).get(`/book/${bookId}`);
    expect(response.status).toEqual(200);
    expect(response.body.book).toEqual(
      expect.objectContaining({
        id: bookId,
        title: expect.any(String),
        author: expect.any(String),
        description: expect.any(String),
        publishedAt: expect.any(String),
        imageUrl: null,
        comments: expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(String),
            content: expect.any(String),
            rate: expect.any(Number),
            userName: expect.any(String),
            userAvatar: null,
          }),
        ]),
      })
    );
  });
});
