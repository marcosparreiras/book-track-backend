import type { CommentRepository } from "../domain/bondaries/comment-repository";
import { Registry } from "../domain/bondaries/registry";
import { Book } from "../domain/entities/book";
import { Comment } from "../domain/entities/comment";
import { User } from "../domain/entities/user";
import { PostgresCommentRepository } from "./postgres-comment-repository";
import { PgConnection } from "./postgres-connection";

describe("ProstgresCommentRepository", () => {
  const commentRepository: CommentRepository = new PostgresCommentRepository();
  const connectionString = "postgres://admin:admin@localhost:5432/booktrack";
  const dbConnection = new PgConnection(connectionString);
  const registry = Registry.getInstance();
  registry.register("dbConnetion", dbConnection);
  let bookId: string;
  let userId: string;

  beforeAll(async () => {
    const book = Book.create({
      author: "John Doe",
      description: "Some description",
      publishedAt: "2020-01-01",
      title: "Some Title",
    });
    const user = User.create({
      name: "John Doe",
      email: "johndoe@example.com",
      password: "123456",
    });
    await dbConnection.query(
      `
      INSERT INTO books(id, title, author, description, image_url, published_at)
      VALUES($1, $2, $3, $4, $5, $6)`,
      [
        book.getId(),
        book.getTitle(),
        book.getAuthor(),
        book.getDescription(),
        book.getImageUrl(),
        book.getPublishedAt(),
      ]
    );
    await dbConnection.query(
      `
      INSERT INTO users(id, name, email, password, avatar_url, is_admin) 
      VALUES($1, $2, $3, $4, $5, $6)`,
      [
        user.getId(),
        user.getName(),
        user.getEmail(),
        user.getPasswordHash(),
        user.getAvatarUrl(),
        user.isAdmin(),
      ]
    );
    bookId = book.getId();
    userId = user.getId();
  });

  beforeEach(async () => {
    await dbConnection.query("DELETE FROM comments");
  });

  afterAll(async () => {
    await dbConnection.query("DELETE FROM comments");
    await dbConnection.query("DELETE FROM users");
    await dbConnection.query("DELETE FROM books");
    await dbConnection.close();
  });

  it("Should be able to get comments by user and book id", async () => {
    const comment = Comment.create({
      bookId,
      userId,
      content: "some comment",
      rate: 4,
    });
    await dbConnection.query(
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
    const result = await commentRepository.getByUserIdAndBookId(userId, bookId);
    expect(result?.getId()).toEqual(comment.getId());
    expect(result?.getUserId()).toEqual(comment.getUserId());
    expect(result?.getBookId()).toEqual(comment.getBookId());
    expect(result?.getContent()).toEqual(comment.getContent());
    expect(result?.getRate()).toEqual(comment.getRate());
  });

  it("Should be able to get all comments by book id", async () => {
    const comments = [
      {
        bookId,
        userId,
        content: "some comment",
        rate: 4,
      },
      {
        bookId,
        userId,
        content: "another comment",
        rate: 2,
      },
      {
        bookId,
        userId,
        content: "last comment",
        rate: 5,
      },
    ].map((data) => Comment.create(data));
    for (let comment of comments) {
      await dbConnection.query(
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
    const result = await commentRepository.getManyByBookId(bookId);
    expect(result).toHaveLength(3);
  });

  it("Should be able to get a comment by it's id", async () => {
    const comment = Comment.create({
      bookId,
      userId,
      content: "some comment",
      rate: 4,
    });
    await dbConnection.query(
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
    const result = await commentRepository.getById(comment.getId());
    expect(result?.getId()).toEqual(comment.getId());
    expect(result?.getUserId()).toEqual(comment.getUserId());
    expect(result?.getBookId()).toEqual(comment.getBookId());
    expect(result?.getContent()).toEqual(comment.getContent());
    expect(result?.getRate()).toEqual(comment.getRate());
  });

  it("Should be able to insert a new comment", async () => {
    const comment = Comment.create({
      bookId,
      userId,
      content: "some comment",
      rate: 4,
    });
    await commentRepository.insert(comment);
    const queryResult = await dbConnection.query(
      `
      SELECT id, user_id, book_id, content, rate FROM comments WHERE id = $1
      `,
      [comment.getId()]
    );
    expect(queryResult[0].id).toEqual(comment.getId());
    expect(queryResult[0].user_id).toEqual(comment.getUserId());
    expect(queryResult[0].book_id).toEqual(comment.getBookId());
    expect(queryResult[0].content).toEqual(comment.getContent());
    expect(queryResult[0].rate).toEqual(comment.getRate());
  });

  it("Should be able to delete a comment", async () => {
    const comment = Comment.create({
      bookId,
      userId,
      content: "some comment",
      rate: 4,
    });
    await dbConnection.query(
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
    await commentRepository.delete(comment);
    const queryResult = await dbConnection.query(
      `
      SELECT id FROM comments WHERE id = $1
      `,
      [comment.getId()]
    );
    expect(queryResult).toHaveLength(0);
  });
});
