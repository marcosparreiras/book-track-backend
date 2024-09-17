import { InMemoryUserRepository } from "../../adapters/in-memory-user-repository";
import { User } from "../entities/user";
import { UserAlreadyExistsException } from "../exceptions/user-already-exists-exception";
import { Registry } from "../bondaries/registry";
import { RegisterUserUseCase } from "./register-user-use-case";

describe("RegisterUserUseCase", () => {
  let sut: RegisterUserUseCase;
  let userRepository: InMemoryUserRepository;

  beforeEach(() => {
    sut = new RegisterUserUseCase();
    userRepository = new InMemoryUserRepository();
    Registry.getInstance().register("userRepository", userRepository);
  });

  it("Should be able to create a commum user", async () => {
    const input = {
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    };
    const output = await sut.execute(input);
    expect(output.userId).toEqual(expect.any(String));
    const userOnRepository = userRepository.items.find(
      (user) => user.getId() === output.userId
    );
    expect(userOnRepository?.getName()).toEqual(input.name);
    expect(userOnRepository?.getEmail()).toEqual(input.email);
    expect(userOnRepository?.isAdmin()).toEqual(false);
  });

  it("Should not be able to create a user with duplicate email", async () => {
    const email = "johndoe@@example.com";
    userRepository.items.push(
      User.create({
        email,
        name: "Janny Russel",
        password: "654321",
      })
    );
    const input = {
      email,
      name: "John Doe",
      password: "123456",
    };
    await expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      UserAlreadyExistsException
    );
  });
});
