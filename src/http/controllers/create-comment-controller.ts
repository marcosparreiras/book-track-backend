import { type NextFunction, type Request, type Response } from "express";
import { z } from "zod";
import { CommentUseCase } from "../../domain/use-cases/comment-use-case";

export async function createCommentController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestParamsSchema = z.object({
    bookId: z.string(),
  });
  const requestBodySchema = z.object({
    content: z.string(),
    rate: z.coerce.number(),
  });
  try {
    const userId = request.userId;
    if (!userId) throw new Error();
    const { bookId } = requestParamsSchema.parse(request.params);
    const { content, rate } = requestBodySchema.parse(request.body);
    const commentUseCase = new CommentUseCase();
    const output = await commentUseCase.execute({
      bookId,
      content,
      rate,
      userId,
    });
    return response.status(201).json({ commentId: output.commentId });
  } catch (error: unknown) {
    next(error);
  }
}
