import type { Bucket } from "../bondaries/bucket";
import { inject } from "../bondaries/registry";
import type { UserRepository } from "../bondaries/user-repository";
import { InvalidAvatarMimetypeException } from "../exceptions/invalid-avatar-mimetype";
import { UserNotFoundException } from "../exceptions/user-not-found-exception";

type Input = {
  userId: string;
  avatar: Buffer;
  mimetype: string;
};

export class UpdateUserAvatarUseCase {
  @inject("bucket")
  private bucket!: Bucket;

  @inject("userRepository")
  private userRepository!: UserRepository;

  public constructor() {}

  public async execute(input: Input): Promise<void> {
    const isMimetypeValid = /^image\/(jpeg|jpg|png|webp)$/.test(input.mimetype);
    if (!isMimetypeValid) {
      throw new InvalidAvatarMimetypeException(input.mimetype);
    }
    const user = await this.userRepository.getById(input.userId);
    if (user === null) {
      throw new UserNotFoundException(input.userId);
    }
    const avatarUrl = await this.bucket.uploadImage(
      input.avatar,
      input.mimetype,
      user.getId()
    );
    user.setAvatarUrl(avatarUrl);
    await this.userRepository.update(user);
    return;
  }
}
