import { InMemoryCommentRepository } from "../../adapters/in-memory/in-memory-comment-repository";
import { Registry } from "../bondaries/registry";
import { Comment } from "../entities/comment";
import { CommentNotFoundException } from "../exceptions/comment-not-found-exception";
import { NotAuthorizedException } from "../exceptions/not-authorized-exception";
import { DeleteCommentUseCase } from "./delete-comment-use-case";

describe("DeleteCommentUseCase", () => {
  let sut: DeleteCommentUseCase;
  let commentRepository: InMemoryCommentRepository;

  beforeEach(() => {
    sut = new DeleteCommentUseCase();
    commentRepository = new InMemoryCommentRepository();
    const registry = Registry.getInstance();
    registry.register("commentRepository", commentRepository);
  });

  it("Should be able to delete a user comment with a user credentials", async () => {
    const comment = Comment.create({
      bookId: "BOOK-ID",
      userId: "USER-ID",
      content: "Some fake content",
      rate: 4,
    });
    commentRepository.items.push(comment);
    const input = {
      userId: comment.getUserId(),
      commentId: comment.getId(),
    };
    await sut.execute(input);
    expect(commentRepository.items).toHaveLength(0);
  });

  it("Should not be able to delete another user comment with a user credentials", async () => {
    const comment = Comment.create({
      bookId: "BOOK-ID",
      userId: "USER-ID",
      content: "Some fake content",
      rate: 4,
    });
    commentRepository.items.push(comment);
    const input = {
      userId: "ANOTHER-USER-ID",
      commentId: comment.getId(),
    };
    await expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      NotAuthorizedException
    );
    expect(commentRepository.items).toHaveLength(1);
  });

  it("Should not be able to delete an unexistent comment", async () => {
    const input = {
      userId: "USER-ID",
      commentId: "COMMENT-ID",
    };
    await expect(() => sut.execute(input)).rejects.toBeInstanceOf(
      CommentNotFoundException
    );
  });
});
