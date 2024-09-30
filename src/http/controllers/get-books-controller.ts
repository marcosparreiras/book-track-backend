import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { GetBooksUseCase } from "../../domain/use-cases/get-books-use-case";

export async function getBooksController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestQuerySchema = z.object({
    page: z.coerce.number().default(1),
    pageSize: z.coerce.number().default(10),
    title: z.string().optional(),
  });
  try {
    const { page, pageSize, title } = requestQuerySchema.parse(request.query);
    const getBooksUseCase = new GetBooksUseCase();
    const output = await getBooksUseCase.execute({ page, pageSize, title });
    return response.status(200).json({
      page,
      pageSize,
      books: output.books,
    });
  } catch (error: unknown) {
    next(error);
  }
}
