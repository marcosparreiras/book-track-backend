import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { GetBookUseCase } from "../../domain/use-cases/get-book-use-case";

export async function getBookController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestParamsSchema = z.object({
    bookId: z.string(),
  });
  try {
    const { bookId } = requestParamsSchema.parse(request.params);
    const getBookUseCase = new GetBookUseCase();
    const output = await getBookUseCase.execute({ bookId });
    return response.status(200).json({ book: output.book });
  } catch (error: unknown) {
    next(error);
  }
}
