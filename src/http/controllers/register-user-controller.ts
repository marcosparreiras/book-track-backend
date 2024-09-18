import type { NextFunction, Request, Response } from "express";
import { RegisterUserUseCase } from "../../domain/use-cases/register-user-use-case";
import { z } from "zod";

export async function registerUserController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestBodySchema = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
  });

  try {
    const { name, email, password } = requestBodySchema.parse(request.body);
    const registerUserUseCase = new RegisterUserUseCase();
    const { userId } = await registerUserUseCase.execute({
      name,
      email,
      password,
    });
    return response.status(201).send({ userId });
  } catch (error: unknown) {
    next(error);
  }
}
