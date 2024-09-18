import { InMemoryBucket } from "../../adapters/in-memory-bucket";
import { InMemoryUserRepository } from "../../adapters/in-memory-user-repository";
import { Registry } from "../bondaries/registry";
import { User } from "../entities/user";
import { InvalidAvatarMimetypeException } from "../exceptions/invalid-avatar-mimetype";
import { UserNotFoundException } from "../exceptions/user-not-found-exception";
import { UpdateUserAvatarUseCase } from "./update-user-avatar-use-case";

describe("UpdateUserAvatarUseCase", () => {
  let sut: UpdateUserAvatarUseCase;
  let userRepository: InMemoryUserRepository;
  let bucket: InMemoryBucket;

  beforeEach(() => {
    sut = new UpdateUserAvatarUseCase();
    userRepository = new InMemoryUserRepository();
    bucket = new InMemoryBucket();
    Registry.getInstance().register("userRepository", userRepository);
    Registry.getInstance().register("bucket", bucket);
  });

  it.each(["png", "jpg", "jpeg", "webp"])(
    "Should be able to update user avatar",
    async (imageFormat) => {
      const user = User.create({
        name: "John Doe",
        email: "johndoe@example.com",
        password: "123456",
      });
      userRepository.items.push(user);
      const input = {
        userId: user.getId(),
        avatar: Buffer.from("Fake avatar image"),
        mimetype: "image/" + imageFormat,
      };
      await sut.execute(input);
      expect(user.getAvatarUrl()).toEqual(expect.any(String));
    }
  );

  it("Should not be able to update an avatar to an invalid mimetype", async () => {
    const user = User.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });
    userRepository.items.push(user);
    const input = {
      userId: user.getId(),
      avatar: Buffer.from("Fake avatar image"),
      mimetype: "image/gif",
    };
    await expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      InvalidAvatarMimetypeException
    );
  });

  it("Should not be able to update an avatar of unexistent user", async () => {
    const input = {
      userId: "unexistent-id",
      avatar: Buffer.from("Fake avatar image"),
      mimetype: "image/png",
    };
    await expect(sut.execute(input)).rejects.toBeInstanceOf(
      UserNotFoundException
    );
  });
});
