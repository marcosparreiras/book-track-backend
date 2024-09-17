import { InvalidEmailException } from "../../exceptions/invalid-email-exception";

export class Email {
  private value: string;

  public toString(): string {
    return this.value;
  }

  public constructor(value: string) {
    const isValid = /.*@.*\..*/.test(value);
    if (!isValid) {
      throw new InvalidEmailException(value);
    }
    this.value = value;
  }
}
