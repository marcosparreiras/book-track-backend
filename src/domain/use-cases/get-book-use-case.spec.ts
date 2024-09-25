import { InMemoryBookRepository } from "../../adapters/in-memory/in-memory-book-repository";
import { InMemoryCommentRepository } from "../../adapters/in-memory/in-memory-comment-repository";
import { InMemoryUserRepository } from "../../adapters/in-memory/in-memory-user-repository";
import { Registry } from "../bondaries/registry";
import { Book } from "../entities/book";
import { Comment } from "../entities/comment";
import { User } from "../entities/user";
import { BookNotFoundException } from "../exceptions/book-not-found-exception";
import { GetBookUseCase } from "./get-book-use-case";

describe("GetBookUseCase", () => {
  let sut: GetBookUseCase;
  let bookRespository: InMemoryBookRepository;
  let commentRepository: InMemoryCommentRepository;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    sut = new GetBookUseCase();
    bookRespository = new InMemoryBookRepository();
    commentRepository = new InMemoryCommentRepository();
    userRepository = new InMemoryUserRepository();
    const registry = Registry.getInstance();
    registry.register("bookRepository", bookRespository);
    registry.register("commentRepository", commentRepository);
    registry.register("userRepository", userRepository);
  });

  it("Should be able to get a book data enriched with comment with user data", async () => {
    const user = User.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456",
    });
    const book = Book.create({
      author: "Janny Frank",
      description: "Some fake description",
      publishedAt: "2020-01-01",
      title: "Some Fake Book",
    });
    const comment = Comment.create({
      bookId: book.getId(),
      content: "Some fake comment",
      rate: 3,
      userId: user.getId(),
    });
    userRepository.items.push(user);
    bookRespository.items.push(book);
    commentRepository.items.push(comment);
    const input = {
      bookId: book.getId(),
    };
    const output = await sut.execute(input);
    expect(output.book).toEqual(
      expect.objectContaining({
        id: book.getId(),
        title: book.getTitle(),
        author: book.getAuthor(),
        description: book.getDescription(),
        publishedAt: book.getPublishedAt(),
        imageUrl: book.getImageUrl(),
        comments: expect.arrayContaining([
          expect.objectContaining({
            id: comment.getId(),
            content: comment.getContent(),
            rate: comment.getRate(),
            userName: user.getName(),
            userAvatar: user.getAvatarUrl(),
          }),
        ]),
      })
    );
  });

  it("Should not be able to get an unexistent book", async () => {
    const input = {
      bookId: "UNEXISTENT-BOOK-ID",
    };
    await expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      BookNotFoundException
    );
  });
});
