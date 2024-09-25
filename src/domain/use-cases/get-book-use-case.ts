import type { BookRepository } from "../bondaries/book-repository";
import type { CommentRepository } from "../bondaries/comment-repository";
import { inject } from "../bondaries/registry";
import type { UserRepository } from "../bondaries/user-repository";
import { BookNotFoundException } from "../exceptions/book-not-found-exception";

type Input = {
  bookId: string;
};

type Output = {
  book: {
    id: string;
    title: string;
    author: string;
    description: string;
    publishedAt: Date;
    imageUrl: string | null;
    comments: {
      id: string;
      content: string;
      rate: number;
      userName: string | null;
      userAvatar: string | null;
    }[];
  };
};

export class GetBookUseCase {
  @inject("bookRepository")
  private bookRepository!: BookRepository;

  @inject("commentRepository")
  private commentRepository!: CommentRepository;

  @inject("userRepository")
  private userRepository!: UserRepository;

  public constructor() {}

  public async execute(input: Input): Promise<Output> {
    const book = await this.bookRepository.getById(input.bookId);
    if (book === null) {
      throw new BookNotFoundException(input.bookId);
    }
    const comments = await this.commentRepository.getManyByBookId(input.bookId);
    const commentsWithUserData = await Promise.all(
      comments.map(async (comment) => {
        const user = await this.userRepository.getById(comment.getUserId());
        return {
          id: comment.getId(),
          content: comment.getContent(),
          rate: comment.getRate(),
          userName: user?.getName() ?? null,
          userAvatar: user?.getAvatarUrl() ?? null,
        };
      })
    );
    return {
      book: {
        id: book.getId(),
        title: book.getTitle(),
        author: book.getAuthor(),
        description: book.getDescription(),
        publishedAt: book.getPublishedAt(),
        imageUrl: book.getImageUrl(),
        comments: commentsWithUserData,
      },
    };
  }
}
