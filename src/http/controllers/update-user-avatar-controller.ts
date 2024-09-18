import type { NextFunction, Request, Response } from "express";
import { UpdateUserAvatarUseCase } from "../../domain/use-cases/update-user-avatar-use-case";

export async function updateUserAvatarController(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const userId = request.userId;
    const file = request.file;
    if (!userId || !file) throw new Error();
    const updateUserAvatarUseCase = new UpdateUserAvatarUseCase();
    await updateUserAvatarUseCase.execute({
      userId,
      avatar: file.buffer,
      mimetype: file.mimetype,
    });
    return response.status(204).json();
  } catch (error: unknown) {
    next(error);
  }
}
