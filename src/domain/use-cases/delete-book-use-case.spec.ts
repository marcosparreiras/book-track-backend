import { InMemoryBookRepository } from "../../adapters/in-memory/in-memory-book-repository";
import { InMemoryUserRepository } from "../../adapters/in-memory/in-memory-user-repository";
import { Registry } from "../bondaries/registry";
import { Book } from "../entities/book";
import { User } from "../entities/user";
import { BookNotFoundException } from "../exceptions/book-not-found-exception";
import { NotAuthorizedException } from "../exceptions/not-authorized-exception";
import { DeleteBookUseCase } from "./delete-book-use-case";

describe("DeleteBookUseCase", () => {
  let sut: DeleteBookUseCase;
  let bookRepository: InMemoryBookRepository;
  let userRespotiroy: InMemoryUserRepository;

  beforeEach(() => {
    sut = new DeleteBookUseCase();
    bookRepository = new InMemoryBookRepository();
    userRespotiroy = new InMemoryUserRepository();
    const registry = Registry.getInstance();
    registry.register("bookRepository", bookRepository);
    registry.register("userRepository", userRespotiroy);
  });

  it("Should be able to delete a book with admin credentials", async () => {
    const admin = User.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456",
    });
    Object.defineProperty(admin, "_isAdmin", {
      get() {
        return true;
      },
    });
    const book = Book.create({
      author: "Janny Zeff",
      description: "Some fake description",
      publishedAt: "2020-01-01",
      title: "Some Fake Title",
    });
    userRespotiroy.items.push(admin);
    bookRepository.items.push(book);
    const input = {
      bookId: book.getId(),
      userId: admin.getId(),
    };
    await sut.execute(input);
    expect(bookRepository.items).toHaveLength(0);
  });

  it("Should not be able to delete an unexistent book even with admin credentials", async () => {
    const admin = User.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456",
    });
    Object.defineProperty(admin, "_isAdmin", {
      get() {
        return true;
      },
    });
    userRespotiroy.items.push(admin);
    const input = {
      bookId: "UNEXISTENT-BOOK-ID",
      userId: admin.getId(),
    };
    await expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      BookNotFoundException
    );
  });

  it("Should not be able to delete a book with a normal user credential", async () => {
    const user = User.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456",
    });
    const book = Book.create({
      author: "Janny Zeff",
      description: "Some fake description",
      publishedAt: "2020-01-01",
      title: "Some Fake Title",
    });
    userRespotiroy.items.push(user);
    bookRepository.items.push(book);
    const input = {
      bookId: book.getId(),
      userId: user.getId(),
    };
    await expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      NotAuthorizedException
    );
    expect(bookRepository.items).toHaveLength(1);
  });
});
