import request from "supertest";
import { app } from "../app";
import { Registry } from "../../domain/bondaries/registry";
import { InMemoryUserRepository } from "../../adapters/in-memory-user-repository";

describe("POST /register", () => {
  beforeEach(() => {
    Registry.getInstance().register(
      "userRepository",
      new InMemoryUserRepository()
    );
  });

  it("Should be able to register a user", async () => {
    const requestBody = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    };
    const response = await request(app).post("/register").send(requestBody);
    expect(response.status).toEqual(201);
    expect(response.body.userId).toEqual(expect.any(String));
  });

  it("Should not be able to register a user with invalid request data", async () => {
    const requestBody = {
      nome: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    };
    const response = await request(app).post("/register").send(requestBody);
    expect(response.status).toEqual(400);
    expect(response.body.message).toBeDefined();
  });
});
