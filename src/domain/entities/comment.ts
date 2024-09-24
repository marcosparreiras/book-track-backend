import { CommentRate } from "./value-objects/commentRate";
import { UUID } from "./value-objects/uuid";

interface CreateCommentDTO {
  userId: string;
  bookId: string;
  content: string;
  rate: number;
}

export class Comment {
  private id: UUID;
  private userId: UUID;
  private bookId: UUID;
  private content: string;
  private rate: CommentRate;

  public getId(): string {
    return this.id.toString();
  }

  public getUserId(): string {
    return this.userId.toString();
  }

  public getBookId(): string {
    return this.bookId.toString();
  }

  public getContent(): string {
    return this.content;
  }

  public getRate(): number {
    return this.rate.toNumber();
  }

  private constructor(
    id: UUID,
    userId: UUID,
    bookId: UUID,
    content: string,
    rate: CommentRate
  ) {
    this.id = id;
    this.userId = userId;
    this.bookId = bookId;
    this.content = content;
    this.rate = rate;
  }

  public static create(input: CreateCommentDTO): Comment {
    const id = UUID.generate();
    const userId = UUID.laod(input.userId);
    const bookId = UUID.laod(input.bookId);
    const rate = new CommentRate(input.rate);
    return new Comment(id, userId, bookId, input.content, rate);
  }
}
