import type { NextFunction, Request, Response } from "express";
import { GetUserUseCase } from "../../domain/use-cases/get-user-use-case";

export async function getUserController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const userId = request.userId;
    if (!userId) throw new Error();
    const getUserUseCase = new GetUserUseCase();
    const userDTO = await getUserUseCase.execute({ userId });
    return response.status(200).json(userDTO);
  } catch (error: unknown) {
    next(error);
  }
}
