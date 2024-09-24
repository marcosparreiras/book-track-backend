import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { RegisterBookUseCase } from "../../domain/use-cases/register-book-use-case";

export async function registerBookController(
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
  try {
    const userId = request.userId;
    const file = request.file;
    if (!userId || !file) throw Error();
    const { title, author, description, publishedAt } = requestBodySchema.parse(
      request.body
    );
    const registerBookUseCase = new RegisterBookUseCase();
    const output = await registerBookUseCase.execute({
      userId,
      author,
      description,
      publishedAt,
      title,
      image: file.buffer,
      mimetype: file.mimetype,
    });
    return response.status(201).json({ bookId: output.bookId });
  } catch (error: unknown) {
    next(error);
  }
}
