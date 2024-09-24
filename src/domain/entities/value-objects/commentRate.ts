import { InvalidRateException } from "../../exceptions/invalid-rate-exception";

export class CommentRate {
  private value: number;

  public toNumber(): number {
    return this.value;
  }

  public constructor(value: number) {
    const isValid = value >= 0 && value <= 5 && Number.isInteger(value);
    if (!isValid) {
      throw new InvalidRateException(value);
    }
    this.value = value;
  }
}
