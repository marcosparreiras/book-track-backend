import type { Comment } from "../entities/comment";

export interface CommentRepository {
  getByUserIdAndBookId(userId: string, bookId: string): Promise<Comment | null>;
  getById(commentId: string): Promise<Comment | null>;
  insert(comment: Comment): Promise<void>;
  delete(comment: Comment): Promise<void>;
}
