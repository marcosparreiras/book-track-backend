import type { Bucket } from "../bondaries/bucket";
import type { BookRepository } from "../bondaries/book-repository";
import { inject } from "../bondaries/registry";
import { Book } from "../entities/book";
import { InvalidAvatarMimetypeException } from "../exceptions/invalid-avatar-mimetype";
import type { UserRepository } from "../bondaries/user-repository";
import { NotAuthorizedException } from "../exceptions/not-authorized-exception";

type Input = {
  userId: string;
  title: string;
  description: string;
  author: string;
  publishedAt: string;
  image: Buffer;
  mimetype: string;
};

type Output = {
  bookId: string;
};

export class RegisterBookUseCase {
  @inject("bookRepository")
  private bookRepository!: BookRepository;

  @inject("userRepository")
  private userRepository!: UserRepository;

  @inject("bucket")
  private bucket!: Bucket;

  public constructor() {}

  public async execute(input: Input): Promise<Output> {
    const user = await this.userRepository.getById(input.userId);
    if (user === null || !user.isAdmin()) {
      throw new NotAuthorizedException();
    }
    const isMimetypeValid = /^image\/(jpeg|jpg|png|webp)$/.test(input.mimetype);
    if (!isMimetypeValid) {
      throw new InvalidAvatarMimetypeException(input.mimetype);
    }
    const book = Book.create({
      title: input.title,
      description: input.description,
      author: input.author,
      publishedAt: input.publishedAt,
    });
    const imageUrl = await this.bucket.uploadImage(
      input.image,
      input.mimetype,
      book.getId()
    );
    book.setImageUrl(imageUrl);
    await this.bookRepository.insert(book);
    return {
      bookId: book.getId(),
    };
  }
}
