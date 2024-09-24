import request from "supertest";
import { InMemoryUserRepository } from "../../adapters/in-memory/in-memory-user-repository";
import { Registry } from "../../domain/bondaries/registry";
import { app } from "../app";
import { JwtToken } from "../../adapters/token";
import { InMemoryBookRepository } from "../../adapters/in-memory/in-memory-book-repository";
import { InMemoryBucket } from "../../adapters/in-memory/in-memory-bucket";
import { User } from "../../domain/entities/user";

describe("POST /book", () => {
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    const registry = Registry.getInstance();
    userRepository = new InMemoryUserRepository();
    registry.register("token", new JwtToken("secret"));
    registry.register("userRepository", userRepository);
    registry.register("bookRepository", new InMemoryBookRepository());
    registry.register("bucket", new InMemoryBucket());
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
    userRepository.items.push(admin, user);
  });

  it("Should be able to register a book with admin credentials", async () => {
    const email = "johndoe@example.com";
    const password = "123456";
    const {
      body: { token },
    } = await request(app).post("/session").send({ email, password });
    const response = await request(app)
      .post("/book")
      .set({ Authorization: `Bearer ${token}` })
      .attach("bookImage", "assets/test-avatar.png")
      .field("title", "Patterns of Enterprise Application Architecture")
      .field("author", "John Doe")
      .field("description", "Some fake book description")
      .field("publishedAt", "2020-01-01");
    expect(response.status).toEqual(201);
    expect(response.body.bookId).toEqual(expect.any(String));
  });

  it("Should not be able to create a book with a normal user credentials", async () => {
    const email = "jannydoe@example.com";
    const password = "123456";
    const {
      body: { token },
    } = await request(app).post("/session").send({ email, password });
    const response = await request(app)
      .post("/book")
      .set({ Authorization: `Bearer ${token}` })
      .attach("bookImage", "assets/test-avatar.png")
      .field("title", "Patterns of Enterprise Application Architecture")
      .field("author", "John Doe")
      .field("description", "Some fake book description")
      .field("publishedAt", "2020-01-01");
    expect(response.status).toEqual(403);
    expect(response.body.message).toEqual(expect.any(String));
  });
});
