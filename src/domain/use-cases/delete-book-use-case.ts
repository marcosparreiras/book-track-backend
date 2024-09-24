import type { BookRepository } from "../bondaries/book-repository";
import { inject } from "../bondaries/registry";
import type { UserRepository } from "../bondaries/user-repository";
import { BookNotFoundException } from "../exceptions/book-not-found-exception";
import { NotAuthorizedException } from "../exceptions/not-authorized-exception";

type Input = {
  bookId: string;
  userId: string;
};

export class DeleteBookUseCase {
  @inject("bookRepository")
  private bookRepository!: BookRepository;

  @inject("userRepository")
  private userRepository!: UserRepository;

  public constructor() {}

  public async execute(input: Input): Promise<void> {
    const user = await this.userRepository.getById(input.userId);
    if (user === null || !user.isAdmin()) {
      throw new NotAuthorizedException();
    }
    const book = await this.bookRepository.getById(input.bookId);
    if (book === null) {
      throw new BookNotFoundException(input.bookId);
    }
    await this.bookRepository.delete(book);
    return;
  }
}
