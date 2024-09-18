import { inject } from "../bondaries/registry";
import type { UserRepository } from "../bondaries/user-repository";
import { UserNotFoundException } from "../exceptions/user-not-found-exception";

type Input = {
  userId: string;
};

type Output = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  isAdmin: boolean;
};

export class GetUserUseCase {
  @inject("userRepository")
  private userRepository!: UserRepository;

  public constructor() {}

  public async execute(input: Input): Promise<Output> {
    const user = await this.userRepository.getById(input.userId);
    if (user === null) {
      throw new UserNotFoundException(input.userId);
    }
    return {
      id: user.getId(),
      email: user.getEmail(),
      name: user.getName(),
      isAdmin: user.isAdmin(),
      avatarUrl: user.getAvatarUrl(),
    };
  }
}
