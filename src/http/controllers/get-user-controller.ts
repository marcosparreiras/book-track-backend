import { z } from "zod";
import type { NextFunction, Request, Response } from "express";
import { GetUserUseCase } from "../../domain/use-cases/get-user-use-case";
import { Token } from "../auth/token";

export async function getUserController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const requestHeadersSchema = z.object({
    authorization: z.string(),
  });
  try {
    const { authorization } = requestHeadersSchema.parse(request.headers);
    const token = authorization.split(" ")[1];
    const { userId } = Token.verify(token);
    const getUserUseCase = new GetUserUseCase();
    const userDTO = await getUserUseCase.execute({ userId });
    return response.status(200).json(userDTO);
  } catch (error: unknown) {
    next(error);
  }
}
