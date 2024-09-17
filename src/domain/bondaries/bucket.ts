export interface Bucket {
  uploadImage(file: Buffer, key: string): Promise<string>;
}
