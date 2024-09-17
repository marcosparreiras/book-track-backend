import { User } from "../entities/user";
import { UserAlreadyExistsException } from "../exceptions/user-already-exists-exception";
import type { UserRepository } from "../repository/user-repository";

type Input = {
  name: string;
  email: string;
  password: string;
};

type Output = {
  userId: string;
};

export class RegisterUserUseCase {
  public constructor(private userRepository: UserRepository) {}

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
