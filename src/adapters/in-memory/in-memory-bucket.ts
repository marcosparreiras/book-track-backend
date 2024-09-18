import type { Bucket } from "../../domain/bondaries/bucket";

export class InMemoryBucket implements Bucket {
  public images: Record<string, any> = {};

  async uploadImage(
    file: Buffer,
    mimetype: string,
    key: string
  ): Promise<string> {
    this.images[key] = { file, mimetype };
    return `http://fake-domain/images/${key}`;
  }
}
