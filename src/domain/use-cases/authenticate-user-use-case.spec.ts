import { InMemoryUserRepository } from "../../adapters/in-memory-user-repository";
import { Registry } from "../bondaries/registry";
import { User } from "../entities/user";
import { InvalidCredentialsException } from "../exceptions/invalid-credentials-exception";
import { AuthenticateUserUseCase } from "./authenticate-user-use-case";

describe("AuthenticateUserUseCase", () => {
  let userRepository: InMemoryUserRepository;
  let sut: AuthenticateUserUseCase;

  beforeEach(() => {
    sut = new AuthenticateUserUseCase();
    userRepository = new InMemoryUserRepository();
    Registry.getInstance().register("userRepository", userRepository);
  });

  it("Should be able to authenticate a user with a valid email and password", async () => {
    const password = "123456";
    const user = User.create({
      password,
      email: "johndoe@example.com",
      name: "John Doe",
    });
    userRepository.items.push(user);
    const input = {
      password,
      email: user.getEmail(),
    };
    const output = await sut.execute(input);
    expect(output.userId).toEqual(expect.any(String));
  });

  it("Should not authenticate an existent user with invalid password", async () => {
    const user = User.create({
      password: "123456",
      email: "johndoe@example.com",
      name: "John Doe",
    });
    userRepository.items.push(user);
    const input = {
      password: "654321",
      email: user.getEmail(),
    };
    await expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      InvalidCredentialsException
    );
  });

  it("Should not authenticate an unexistent user", async () => {
    const input = {
      email: "johndoe@example.com",
      password: "123456",
    };
    await expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      InvalidCredentialsException
    );
  });
});
