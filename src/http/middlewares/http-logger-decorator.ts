import type { NextFunction, Request, Response } from "express";
import { Logger } from "../../domain/bondaries/logger";

export class HttpLogDTO {
  constructor(
    readonly method: string,
    readonly path: string,
    readonly status?: number,
    readonly message?: string
  ) {}

  public toString() {
    return JSON.stringify({
      method: this.method,
      path: this.path,
      status: this.status,
      message: this.message ?? null,
    });
  }
}

export function httpLoggerDecorator(
  controller: (
    request: Request,
    response: Response,
    next: NextFunction
  ) => Promise<Response<any, Record<string, any>> | undefined>
) {
  return async function (
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const result = await controller(request, response, next);
    const httpLoggerDTO = new HttpLogDTO(
      request.method,
      request.path,
      response.statusCode,
      "success"
    );
    Logger.getInstance().info(httpLoggerDTO);
    return result;
  };
}
