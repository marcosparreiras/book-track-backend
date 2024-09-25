import type { NextFunction, Request, Response } from "express";
import { DeleteCommentUseCase } from "../../domain/use-cases/delete-comment-use-case";
import { z } from "zod";

export async function deleteCommentController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestParamsSchema = z.object({
    commentId: z.string(),
  });
  try {
    const userId = request.userId;
    if (!userId) throw new Error();
    const { commentId } = requestParamsSchema.parse(request.params);
    const deleteCommentUseCase = new DeleteCommentUseCase();
    await deleteCommentUseCase.execute({ commentId, userId });
    return response.status(204).json();
  } catch (error: unknown) {
    next(error);
  }
}
