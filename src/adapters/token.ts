import jwt from "jsonwebtoken";
import { DomainException } from "../domain/exceptions/domain-exception";

type Payload = {
  userId: string;
};

interface Token {
  sign(payload: Payload): string;
  verify(token: string): Payload;
}

export class JwtToken implements Token {
  private secret: string;

  public constructor(secret: string) {
    this.secret = secret;
  }

  public sign(payload: Payload): string {
    const token = jwt.sign(payload, this.secret, { expiresIn: 60 * 60 * 24 });
    return token;
  }

  public verify(token: string): Payload {
    try {
      const payload = jwt.verify(token, this.secret);
      const payloadIsInvalid =
        typeof payload === "string" || typeof payload.userId !== "string";
      if (payloadIsInvalid) {
        throw new Error();
      }
      return { userId: payload.userId };
    } catch {
      throw new DomainException("Invalid token", 403);
    }
  }
}
