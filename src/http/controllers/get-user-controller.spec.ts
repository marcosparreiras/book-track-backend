import request from "supertest";
import { InMemoryUserRepository } from "../../adapters/in-memory-user-repository";
import { Registry } from "../../domain/bondaries/registry";
import { app } from "../app";

describe("GET /me", () => {
  beforeEach(() => {
    Registry.getInstance().register(
      "userRepository",
      new InMemoryUserRepository()
    );
  });

  it("Should be able to get the profile of an authenticated user", async () => {
    const name = "John Doe";
    const email = "johndoe@example.com";
    const password = "123456";
    const {
      body: { userId },
    } = await request(app).post("/users").send({ name, email, password });
    const {
      body: { token },
    } = await request(app).post("/session").send({ email, password });
    const response = await request(app)
      .get("/me")
      .set({ Authorization: `Bearer ${token}` });
    expect(response.status).toEqual(200);
    expect(response.body.name).toEqual(name);
    expect(response.body.email).toEqual(email);
    expect(response.body.avatarUrl).toEqual(null);
    expect(response.body.isAdmin).toEqual(false);
    expect(response.body.id).toEqual(userId);
  });
});
