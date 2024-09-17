import bcrypt from "bcryptjs";

export class Password {
  private hash: string;

  public getHash(): string {
    return this.hash;
  }

  public compare(plainText: string): boolean {
    return bcrypt.compareSync(plainText, this.hash);
  }

  private constructor(hash: string) {
    this.hash = hash;
  }

  public static createFromPlainText(plainText: string): Password {
    const hash = bcrypt.hashSync(plainText, 8);
    return new Password(hash);
  }

  public static load(hash: string): Password {
    return new Password(hash);
  }
}
