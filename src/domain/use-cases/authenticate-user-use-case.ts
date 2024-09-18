import { inject } from "../bondaries/registry";
import type { UserRepository } from "../bondaries/user-repository";
import { InvalidCredentialsException } from "../exceptions/invalid-credentials-exception";

type Input = {
  email: string;
  password: string;
};

type Output = {
  userId: string;
};

export class AuthenticateUserUseCase {
  @inject("userRepository")
  private userRepository!: UserRepository;

  public constructor() {}

  public async execute(input: Input): Promise<Output> {
    const user = await this.userRepository.getByEmail(input.email);
    if (user === null) {
      throw new InvalidCredentialsException();
    }
    const isPasswordValid = user.verifyPassword(input.password);
    if (!isPasswordValid) {
      throw new InvalidCredentialsException();
    }
    return { userId: user.getId() };
  }
}
