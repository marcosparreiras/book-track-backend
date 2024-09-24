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

  async getById(commentId: string): Promise<Comment | null> {
    const comment = this.items.find((item) => item.getId() === commentId);
    return comment ?? null;
  }

  async insert(comment: Comment): Promise<void> {
    this.items.push(comment);
  }

  async delete(comment: Comment): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.getId() === comment.getId()
    );
    this.items.splice(index, 1);
  }
}
