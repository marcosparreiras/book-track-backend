import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AuthenticateUserUseCase } from "../../domain/use-cases/authenticate-user-use-case";
import { Token } from "../auth/token";

export async function authenticateUserController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestBodySchema = z.object({
    email: z.string(),
    password: z.string(),
  });
  try {
    const { email, password } = requestBodySchema.parse(request.body);
    const authenticateUserUseCase = new AuthenticateUserUseCase();
    const { userId } = await authenticateUserUseCase.execute({
      email,
      password,
    });
    const token = Token.sign({ userId });
    return response.status(201).json({ token });
  } catch (error: unknown) {
    next(error);
  }
}
