import type { BookRepository } from "../bondaries/book-repository";
import type { CommentRepository } from "../bondaries/comment-repository";
import { inject } from "../bondaries/registry";
import type { UserRepository } from "../bondaries/user-repository";
import { Comment } from "../entities/comment";
import { BookNotFoundException } from "../exceptions/book-not-found-exception";
import { UserMaximumCommentOnBookExceededException } from "../exceptions/user-maximum-comment-on-book-exceeded-exception";
import { UserNotFoundException } from "../exceptions/user-not-found-exception";

type Input = {
  userId: string;
  bookId: string;
  content: string;
  rate: number;
};

type Output = {
  commentId: string;
};

export class CommentUseCase {
  @inject("commentRepository")
  private commentRepository!: CommentRepository;

  @inject("userRepository")
  private userRepository!: UserRepository;

  @inject("bookRepository")
  private bookRepository!: BookRepository;

  public constructor() {}

  public async execute(input: Input): Promise<Output> {
    const [user, book] = await Promise.all([
      this.userRepository.getById(input.userId),
      this.bookRepository.getById(input.bookId),
    ]);
    if (book === null) {
      throw new BookNotFoundException(input.bookId);
    }
    if (user === null) {
      throw new UserNotFoundException(input.userId);
    }
    const isUserUnableToComment =
      await this.commentRepository.getByUserIdAndBookId(
        input.userId,
        input.bookId
      );
    if (isUserUnableToComment) {
      throw new UserMaximumCommentOnBookExceededException(
        input.userId,
        input.bookId
      );
    }
    const comment = Comment.create({
      userId: input.userId,
      bookId: input.bookId,
      content: input.content,
      rate: input.rate,
    });
    await this.commentRepository.insert(comment);
    return {
      commentId: comment.getId(),
    };
  }
}
