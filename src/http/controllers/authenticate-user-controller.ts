import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { AuthenticateUserUseCase } from "../../domain/use-cases/authenticate-user-use-case";
import { Registry } from "../../domain/bondaries/registry";

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
    const token = Registry.getInstance().inject("token").sign({ userId });
    return response.status(201).json({ token });
  } catch (error: unknown) {
    next(error);
  }
}
