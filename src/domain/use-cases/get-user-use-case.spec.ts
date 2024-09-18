import { InMemoryUserRepository } from "../../adapters/in-memory/in-memory-user-repository";
import { Registry } from "../bondaries/registry";
import { User } from "../entities/user";
import { UserNotFoundException } from "../exceptions/user-not-found-exception";
import { GetUserUseCase } from "./get-user-use-case";

describe("GetUserUseCase", () => {
  let userRepository: InMemoryUserRepository;
  let sut: GetUserUseCase;

  beforeEach(() => {
    sut = new GetUserUseCase();
    userRepository = new InMemoryUserRepository();
    Registry.getInstance().register("userRepository", userRepository);
  });

  it("Should be able to get a user by it's id", async () => {
    const user = User.create({
      email: "johndoe@example.com",
      name: "John Doe",
      password: "123456",
    });
    userRepository.items.push(user);
    const input = {
      userId: user.getId(),
    };
    const output = await sut.execute(input);
    expect(output.email).toEqual(user.getEmail());
    expect(output.name).toEqual(user.getName());
    expect(output.avatarUrl).toEqual(user.getAvatarUrl());
    expect(output.isAdmin).toEqual(user.isAdmin());
    expect(output.id).toEqual(user.getId());
  });

  it("Should not be able to get an unexistent user", async () => {
    const input = {
      userId: "SOME-FAKE-ID",
    };
    await expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      UserNotFoundException
    );
  });
});
