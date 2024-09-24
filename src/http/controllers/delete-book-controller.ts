import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { DeleteBookUseCase } from "../../domain/use-cases/delete-book-use-case";

export async function deleteBookController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestParamsSchema = z.object({
    bookId: z.string(),
  });
  try {
    const userId = request.userId;
    if (!userId) throw new Error();
    const { bookId } = requestParamsSchema.parse(request.params);
    const deleteBookUseCase = new DeleteBookUseCase();
    await deleteBookUseCase.execute({ bookId, userId });
    return response.status(204).json();
  } catch (error: unknown) {
    next(error);
  }
}
