import jwt from "jsonwebtoken";
import { DomainException } from "../../domain/exceptions/domain-exception";

type Payload = {
  userId: string;
};

export class Token {
  private static secret: string = "secret";

  static sign(payload: Payload) {
    const token = jwt.sign(payload, this.secret, { expiresIn: 60 * 60 * 24 });
    return token;
  }

  static verify(token: string): Payload {
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
