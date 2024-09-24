import type { CommentRepository } from "../../domain/bondaries/comment-repository";
import type { Comment } from "../../domain/entities/comment";

export class InMemoryCommentRepository implements CommentRepository {
  public items: Comment[] = [];

  async getByUserIdAndBookId(
    userId: string,
    bookId: string
  ): Promise<Comment | null> {
    const comment = this.items.find(
      (item) => item.getBookId() === bookId && item.getUserId() === userId
    );
    return comment ?? null;
  }

  async insert(comment: Comment): Promise<void> {
    this.items.push(comment);
  }
}
