import type { CommentRepository } from "../domain/bondaries/comment-repository";
import { inject } from "../domain/bondaries/registry";
import { Comment } from "../domain/entities/comment";
import type { DbConnection } from "./postgres-connection";

export class PostgresCommentRepository implements CommentRepository {
  @inject("dbConnetion")
  private connection!: DbConnection;

  private toDomain(data: any): Comment {
    return Comment.laod({
      bookId: data.book_id,
      userId: data.user_id,
      content: data.content,
      id: data.id,
      rate: data.rate,
    });
  }

  async getByUserIdAndBookId(
    userId: string,
    bookId: string
  ): Promise<Comment | null> {
    const queryResult = await this.connection.query(
      `
      SELECT id, user_id, book_id, content, rate FROM comments WHERE user_id = $1 AND book_id = $2
      `,
      [userId, bookId]
    );
    if (queryResult.length === 0) {
      return null;
    }
    return this.toDomain(queryResult[0]);
  }

  async getManyByBookId(bookId: string): Promise<Comment[]> {
    const queryResult = await this.connection.query(
      `
      SELECT id, user_id, book_id, content, rate FROM comments WHERE book_id = $1
      `,
      [bookId]
    );
    return queryResult.map(this.toDomain);
  }

  async getById(commentId: string): Promise<Comment | null> {
    const queryResult = await this.connection.query(
      `
      SELECT id, user_id, book_id, content, rate FROM comments WHERE id = $1
      `,
      [commentId]
    );
    if (queryResult.length === 0) {
      return null;
    }
    return this.toDomain(queryResult[0]);
  }

  async insert(comment: Comment): Promise<void> {
    await this.connection.query(
      `INSERT INTO comments(id, user_id, book_id, content, rate)
      VALUES($1, $2, $3, $4, $5)`,
      [
        comment.getId(),
        comment.getUserId(),
        comment.getBookId(),
        comment.getContent(),
        comment.getRate(),
      ]
    );
  }

  async delete(comment: Comment): Promise<void> {
    await this.connection.query(`DELETE FROM comments WHERE id = $1`, [
      comment.getId(),
    ]);
  }
}
