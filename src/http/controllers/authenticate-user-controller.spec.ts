import request from "supertest";
import { app } from "../app";
import { Registry } from "../../domain/bondaries/registry";
import { InMemoryUserRepository } from "../../adapters/in-memory/in-memory-user-repository";
import { Token } from "../../adapters/token";

describe("POST /session", () => {
  beforeEach(() => {
    Registry.getInstance().register("token", new Token("secret"));
    Registry.getInstance().register(
      "userRepository",
      new InMemoryUserRepository()
    );
  });

  it("Should be able to create a session with user credentials", async () => {
    const name = "John Doe";
    const email = "johndoe@example.com";
    const password = "123456";
    await request(app).post("/users").send({ name, email, password });
    const response = await request(app)
      .post("/session")
      .send({ email, password });
    expect(response.status).toEqual(201);
    expect(response.body.token).toEqual(expect.any(String));
  });

  it("Should not be able to create a session with invalid credentials", async () => {
    const requestBody = {
      email: "johndoe@example.com",
      password: "123456",
    };
    const response = await request(app).post("/session").send(requestBody);
    expect(response.status).toEqual(401);
    expect(response.body.message).toBeDefined();
  });
});
