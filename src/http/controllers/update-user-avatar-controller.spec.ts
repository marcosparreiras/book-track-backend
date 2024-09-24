import request from "supertest";
import { app } from "../app";
import { Registry } from "../../domain/bondaries/registry";
import { InMemoryUserRepository } from "../../adapters/in-memory/in-memory-user-repository";
import { InMemoryBucket } from "../../adapters/in-memory/in-memory-bucket";
import { JwtToken } from "../../adapters/token";

describe("PATCH /me/avatar", () => {
  beforeEach(() => {
    const registry = Registry.getInstance();
    registry.register("token", new JwtToken("secret"));
    registry.register("userRepository", new InMemoryUserRepository());
    Registry.getInstance().register("bucket", new InMemoryBucket());
  });

  it("Should be able to update an avatar of an authenticated user", async () => {
    const name = "John Doe";
    const email = "johndoe@example.com";
    const password = "123456";
    await request(app).post("/users").send({ name, email, password });
    const loginResponse = await request(app)
      .post("/session")
      .send({ email, password });
    const token = loginResponse.body.token;
    const upldateAvatarResponse = await request(app)
      .patch("/me/avatar")
      .set({ authorization: `Bearer ${token}` })
      .attach("avatar", "assets/test-avatar.png");
    expect(upldateAvatarResponse.status).toEqual(204);
    const getProfileResponse = await request(app)
      .get("/me")
      .set({ authorization: `Bearer ${token}` });
    expect(getProfileResponse.body.avatarUrl).toEqual(expect.any(String));
  });
});
