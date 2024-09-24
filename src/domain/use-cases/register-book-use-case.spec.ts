import { InMemoryBookRepository } from "../../adapters/in-memory/in-memory-book-repository";
import { InMemoryBucket } from "../../adapters/in-memory/in-memory-bucket";
import { InMemoryUserRepository } from "../../adapters/in-memory/in-memory-user-repository";
import { Registry } from "../bondaries/registry";
import { User } from "../entities/user";
import { NotAuthorizedException } from "../exceptions/not-authorized-exception";
import { RegisterBookUseCase } from "./register-book-use-case";

describe("RegisterBookUseCase", () => {
  let sut: RegisterBookUseCase;
  let bookRepository: InMemoryBookRepository;
  let userRepository: InMemoryUserRepository;
  let bucket: InMemoryBucket;

  beforeEach(() => {
    sut = new RegisterBookUseCase();
    bookRepository = new InMemoryBookRepository();
    userRepository = new InMemoryUserRepository();
    bucket = new InMemoryBucket();
    const registry = Registry.getInstance();
    registry.register("bookRepository", bookRepository);
    registry.register("userRepository", userRepository);
    registry.register("bucket", bucket);
  });

  it("Should be able to register a new book with admin credentials", async () => {
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
    userRepository.items.push(admin);
    const input = {
      userId: admin.getId(),
      title: "Pattern of Enterprise Application Architecture",
      description: "Some fake book description",
      author: "John Doe",
      publishedAt: "2001-01-01",
      image: Buffer.from("Some fake image"),
      mimetype: "image/png",
    };
    const output = await sut.execute(input);
    expect(output.bookId).toEqual(expect.any(String));
    expect(bookRepository.items).toHaveLength(1);
    const bookOnRepository = bookRepository.items.find(
      (item) => item.getId() === output.bookId
    );
    expect(bookOnRepository?.getTitle()).toEqual(input.title);
    expect(bookOnRepository?.getAuthor()).toEqual(input.author);
    expect(bookOnRepository?.getDescription()).toEqual(input.description);
  });

  it("Should be able to save the book image in a bucket with admin credentials", async () => {
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
    userRepository.items.push(admin);
    const input = {
      userId: admin.getId(),
      title: "Pattern of Enterprise Application Architecture",
      description: "Some fake book description",
      author: "John Doe",
      publishedAt: "2001-01-01",
      image: Buffer.from("Some fake image"),
      mimetype: "image/png",
    };
    const output = await sut.execute(input);
    expect(bucket.images[output.bookId]).toBeDefined();
    const bookOnRepository = bookRepository.items.find(
      (item) => item.getId() === output.bookId
    );
    expect(bookOnRepository?.getImageUrl()).toEqual(expect.any(String));
  });

  it("Should not be able to register a book without admin credentials", async () => {
    const user = User.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456",
    });
    userRepository.items.push(user);
    const input = {
      userId: user.getId(),
      title: "Pattern of Enterprise Application Architecture",
      description: "Some fake book description",
      author: "John Doe",
      publishedAt: "2001-01-01",
      image: Buffer.from("Some fake image"),
      mimetype: "image/png",
    };
    await expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      NotAuthorizedException
    );
  });
});
