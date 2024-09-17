import { User } from "../entities/user";
import { UserAlreadyExistsException } from "../exceptions/user-already-exists-exception";
import { inject } from "../bondaries/registry";
import type { UserRepository } from "../bondaries/user-repository";

type Input = {
  name: string;
  email: string;
  password: string;
};

type Output = {
  userId: string;
};

export class RegisterUserUseCase {
  @inject("userRepository")
  private userRepository!: UserRepository;

  public constructor() {}

  public async execute(input: Input): Promise<Output> {
    const userExists = await this.userRepository.getByEmail(input.email);
    if (userExists !== null) {
      throw new UserAlreadyExistsException(input.email);
    }
    const user = User.create({
      name: input.name,
      email: input.email,
      password: input.password,
    });
    await this.userRepository.insert(user);
    return { userId: user.getId() };
  }
}
