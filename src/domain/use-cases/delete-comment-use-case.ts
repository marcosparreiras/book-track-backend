import type { CommentRepository } from "../bondaries/comment-repository";
import { inject } from "../bondaries/registry";
import { CommentNotFoundException } from "../exceptions/comment-not-found-exception";
import { NotAuthorizedException } from "../exceptions/not-authorized-exception";

type Input = {
  userId: string;
  commentId: string;
};

export class DeleteCommentUseCase {
  @inject("commentRepository")
  private commentRepository!: CommentRepository;

  public constructor() {}

  public async execute(input: Input): Promise<void> {
    const comment = await this.commentRepository.getById(input.commentId);
    if (comment === null) {
      throw new CommentNotFoundException(input.commentId);
    }
    if (comment.getUserId() !== input.userId) {
      throw new NotAuthorizedException();
    }
    await this.commentRepository.delete(comment);
    return;
  }
}
