import { inject } from "../bondaries/registry";
import type { UserRepository } from "../bondaries/user-repository";

type Input = {
  email: string;
  password: string;
};

type Output = {
  isAuthenticate: boolean;
};

export class AuthenticateUserUseCase {
  @inject("userRepository")
  private userRepository!: UserRepository;

  public constructor() {}

  public async execute(input: Input): Promise<Output> {
    const user = await this.userRepository.getByEmail(input.email);
    if (user === null) {
      return { isAuthenticate: false };
    }
    const isPasswordValid = user.verifyPassword(input.password);
    if (!isPasswordValid) {
      return { isAuthenticate: false };
    }
    return { isAuthenticate: true };
  }
}
