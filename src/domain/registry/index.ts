export class Registry {
  private container: Record<string, any>;
  private static instance?: Registry;

  private constructor() {
    this.container = {};
  }

  public static getInstance() {
    if (!this.instance) {
      this.instance = new Registry();
    }
    return this.instance;
  }

  public register(key: string, value: any): void {
    this.container[key] = value;
  }

  public inject(key: string): any {
    return this.container[key];
  }
}

// Property Decoreator Factory
export function inject(key: string) {
  return function (target: any, propertyKey: string): void {
    Object.defineProperty(target, propertyKey, {
      get() {
        return Registry.getInstance().inject(key);
      },
    });
  };
}
