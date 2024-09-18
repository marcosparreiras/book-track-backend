export interface Bucket {
  uploadImage(file: Buffer, mimetype: string, key: string): Promise<string>;
}
