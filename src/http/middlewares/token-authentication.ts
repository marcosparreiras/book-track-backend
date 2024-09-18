import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import { Token } from "../auth/token";

export function tokenAuthenticationMiddlware(
  request: Request,
  _response: Response,
  next: NextFunction
) {
  const requestHeadersSchema = z.object({
    authorization: z.string(),
  });
  try {
    const { authorization } = requestHeadersSchema.parse(request.headers);
    const token = authorization.split(" ")[1];
    const { userId } = Token.verify(token);
    request.userId = userId;
    next();
  } catch (error: unknown) {
    next(error);
  }
}
