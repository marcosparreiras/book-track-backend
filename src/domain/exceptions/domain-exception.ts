export class DomainException extends Error {
  private status: number;

  public getMessage(): string {
    return this.message;
  }
  public getStatus(): number {
    return this.status;
  }

  public constructor(message: string, status?: number) {
    super(message);
    this.status = status ?? 400;
  }
}
