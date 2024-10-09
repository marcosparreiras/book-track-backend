import type { NextFunction, Request, Response } from "express";
import { DomainException } from "../../domain/exceptions/domain-exception";
import { ZodError } from "zod";
import { Logger } from "../../domain/bondaries/logger";
import { HttpLogDTO } from "./http-logger-decorator";

export function errorHandlerMiddleware(
  error: Error,
  request: Request,
  response: Response,
  _next: NextFunction
) {
  let message: string;
  let status: number;
  if (error instanceof DomainException) {
    message = error.getMessage();
    status = error.getStatus();
  } else if (error instanceof ZodError) {
    message = JSON.stringify(error.flatten().fieldErrors);
    status = 400;
  } else {
    message = "Internal server error";
    status = 500;
  }
  const logger = Logger.getInstance();
  const httpLoggerDTO = new HttpLogDTO(
    request.method,
    request.path,
    status,
    message
  );
  logger.info(httpLoggerDTO);
  if (status === 500) {
    logger.warn(JSON.stringify(error));
  }
  return response.status(status).json({ message: message });
}
