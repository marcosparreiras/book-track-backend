import { InvalidNameException } from "../../exceptions/invalid-name-exception";

export class Name {
  private value: string;

  public toString(): string {
    return this.value;
  }

  public constructor(value: string) {
    const isInvalid = /.*\d.*/.test(value) || value.length < 3;
    if (isInvalid) {
      throw new InvalidNameException(value);
    }
    this.value = value;
  }
}
