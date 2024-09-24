import { InMemoryBookRepository } from "../../adapters/in-memory/in-memory-book-repository";
import { InMemoryUserRepository } from "../../adapters/in-memory/in-memory-user-repository";
import { Registry } from "../bondaries/registry";
import { Book } from "../entities/book";
import { User } from "../entities/user";
import { BookNotFoundException } from "../exceptions/book-not-found-exception";
import { NotAuthorizedException } from "../exceptions/not-authorized-exception";
import { UpdateBookUseCase } from "./update-book-use-case";

describe("UpdateBookUseCase", () => {
  let sut: UpdateBookUseCase;
  let bookRespository: InMemoryBookRepository;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    sut = new UpdateBookUseCase();
    bookRespository = new InMemoryBookRepository();
    userRepository = new InMemoryUserRepository();
    const registry = Registry.getInstance();
    registry.register("bookRepository", bookRespository);
    registry.register("userRepository", userRepository);
  });

  it("Should be able to update a book data", async () => {
    const admin = User.create({
      email: "johndeo@example.com",
      name: "John Doe",
      password: "123456",
    });
    Object.defineProperty(admin, "_isAdmin", {
      get() {
        return true;
      },
    });
    const book = Book.create({
      author: "Janny Doe",
      description: "Some Fake Description",
      publishedAt: "2020-01-01",
      title: "Some Fake Title",
    });
    userRepository.items.push(admin);
    bookRespository.items.push(book);
    const input = {
      bookId: book.getId(),
      title: "Patterns of Enterprise Application Architecture",
      author: "Janny Doe Albert",
      description: "Some fake book description",
      publishedAt: "2021-01-01",
      userId: admin.getId(),
    };
    await sut.execute(input);
    expect(bookRespository.items).toHaveLength(1);
    expect(book.getAuthor()).toEqual(input.author);
    expect(book.getTitle()).toEqual(input.title);
    expect(book.getDescription()).toEqual(input.description);
    expect(book.getPublishedAt().toISOString()).toEqual(
      new Date(input.publishedAt).toISOString()
    );
  });

  it("Should not be able to update a book with normal user credentials", async () => {
    const user = User.create({
      email: "johndeo@example.com",
      name: "John Doe",
      password: "123456",
    });
    const book = Book.create({
      author: "Janny Doe",
      description: "Some Fake Description",
      publishedAt: "2020-01-01",
      title: "Some Fake Title",
    });
    userRepository.items.push(user);
    bookRespository.items.push(book);
    const input = {
      bookId: book.getId(),
      title: "Patterns of Enterprise Application Architecture",
      author: "Janny Doe Albert",
      description: "Some fake book description",
      publishedAt: "2021-01-01",
      userId: user.getId(),
    };
    await expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      NotAuthorizedException
    );
  });

  it("Should not be able to update an unexistent book even with admin credentials", async () => {
    const admin = User.create({
      email: "johndeo@example.com",
      name: "John Doe",
      password: "123456",
    });
    Object.defineProperty(admin, "_isAdmin", {
      get() {
        return true;
      },
    });
    userRepository.items.push(admin);
    const input = {
      bookId: "UNEXISTENT-BOOK-ID",
      title: "Patterns of Enterprise Application Architecture",
      author: "Janny Doe Albert",
      description: "Some fake book description",
      publishedAt: "2021-01-01",
      userId: admin.getId(),
    };
    await expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      BookNotFoundException
    );
  });
});
