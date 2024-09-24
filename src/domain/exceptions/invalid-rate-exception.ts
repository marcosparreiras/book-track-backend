import { DomainException } from "./domain-exception";

export class InvalidRateException extends DomainException {
  public constructor(rate: number | string) {
    super(`Invalid rate (${rate})`);
  }
}
