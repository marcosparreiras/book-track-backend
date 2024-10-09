interface ILogger {
  trace(log: string | object): void;
  info(log: string | object): void;
  warn(log: string | object): void;
  fatal(log: string | object): void;
}

export class Logger implements ILogger {
  private static instance: Logger;
  private mode: "production" | "development";

  private constructor() {
    this.mode = "development";
  }

  public static getInstance(): Logger {
    if (!this.instance) {
      this.instance = new Logger();
    }
    return this.instance;
  }

  public setMode(mode: "production" | "development") {
    this.mode = mode;
  }

  public trace(log: string | object): void {
    if (this.mode === "development") {
      console.log(`<<TRACE>>: ${log}`);
    }
  }

  public info(log: string | object): void {
    console.log(`<<INFO>>: ${log}`);
  }

  public warn(log: string | object): void {
    console.log(`<<WARN>>: ${log}`);
  }

  public fatal(log: string | object): void {
    console.log(`<<FATAL>>: ${log}`);
  }
}
