import { InMemoryBookRepository } from "../../adapters/in-memory/in-memory-book-repository";
import { InMemoryCommentRepository } from "../../adapters/in-memory/in-memory-comment-repository";
import { InMemoryUserRepository } from "../../adapters/in-memory/in-memory-user-repository";
import { Registry } from "../bondaries/registry";
import { Book } from "../entities/book";
import { Comment } from "../entities/comment";
import { User } from "../entities/user";
import { BookNotFoundException } from "../exceptions/book-not-found-exception";
import { UserMaximumCommentOnBookExceededException } from "../exceptions/user-maximum-comment-on-book-exceeded-exception";
import { UserNotFoundException } from "../exceptions/user-not-found-exception";
import { CommentUseCase } from "./comment-use-case";

describe("CommentUseCase", () => {
  let sut: CommentUseCase;
  let commentRepository: InMemoryCommentRepository;
  let userRepository: InMemoryUserRepository;
  let bookRepository: InMemoryBookRepository;

  beforeEach(() => {
    sut = new CommentUseCase();
    commentRepository = new InMemoryCommentRepository();
    userRepository = new InMemoryUserRepository();
    bookRepository = new InMemoryBookRepository();
    const registry = Registry.getInstance();
    registry.register("commentRepository", commentRepository);
    registry.register("userRepository", userRepository);
    registry.register("bookRepository", bookRepository);
  });

  it("Should be able to create a user comment on a book", async () => {
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
    const input = {
      userId: user.getId(),
      bookId: book.getId(),
      content: "Some comment",
      rate: 4,
    };
    const output = await sut.execute(input);
    expect(output.commentId).toEqual(expect.any(String));
    expect(commentRepository.items).toHaveLength(1);
    const commentOnRepository = commentRepository.items.find(
      (item) => item.getId() === output.commentId
    );
    expect(commentOnRepository?.getContent()).toEqual(input.content);
    expect(commentOnRepository?.getRate()).toEqual(input.rate);
    expect(commentOnRepository?.getUserId()).toEqual(input.userId);
    expect(commentOnRepository?.getBookId()).toEqual(input.bookId);
  });

  it("Should not be able to create more than one user comment on a book", async () => {
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
      userId: user.getId(),
      bookId: book.getId(),
      content: "Some fake comment!!",
      rate: 2,
    });
    userRepository.items.push(user);
    bookRepository.items.push(book);
    commentRepository.items.push(comment);
    const input = {
      userId: user.getId(),
      bookId: book.getId(),
      content: "Some comment",
      rate: 4,
    };
    await expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      UserMaximumCommentOnBookExceededException
    );
  });

  it("Should not be able to create an unexistent user comment on a book", async () => {
    const user = User.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456",
    });
    userRepository.items.push(user);
    const input = {
      userId: user.getId(),
      bookId: "UNEXISTENT-BOOK-ID",
      content: "Some comment",
      rate: 4,
    };
    await expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      BookNotFoundException
    );
  });

  it("Should not be able to create an user comment on an unexistent book", async () => {
    const book = Book.create({
      author: "Janny Frank",
      description: "Some fake description",
      publishedAt: "2020-01-01",
      title: "Some Fake Title",
    });
    bookRepository.items.push(book);
    const input = {
      userId: "UNEXISTENT-USER-ID",
      bookId: book.getId(),
      content: "Some comment",
      rate: 4,
    };
    await expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      UserNotFoundException
    );
  });
});
