import { randomUUID } from "node:crypto";

export class UUID {
  private value: string;

  public toString(): string {
    return this.value;
  }

  private constructor(value: string) {
    this.value = value;
  }

  public static generate(): UUID {
    const id = randomUUID();
    return new UUID(id);
  }

  public static laod(value: string): UUID {
    return new UUID(value);
  }
}
