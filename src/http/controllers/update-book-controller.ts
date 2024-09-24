import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { UpdateBookUseCase } from "../../domain/use-cases/update-book-use-case";

export async function updateBookController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestBodySchema = z.object({
    title: z.string(),
    author: z.string(),
    description: z.string(),
    publishedAt: z.string(),
  });
  const requestParamsSchema = z.object({
    bookId: z.string(),
  });
  try {
    const userId = request.userId;
    if (!userId) throw Error();
    const { title, author, description, publishedAt } = requestBodySchema.parse(
      request.body
    );
    const { bookId } = requestParamsSchema.parse(request.params);
    const updateBookUseCase = new UpdateBookUseCase();
    await updateBookUseCase.execute({
      author,
      bookId,
      description,
      publishedAt,
      title,
      userId,
    });
    return response.status(204).json();
  } catch (error: unknown) {
    next(error);
  }
}
