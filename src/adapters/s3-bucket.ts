import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import type { Bucket } from "../domain/bondaries/bucket";

export class S3Bucket implements Bucket {
  private client: S3Client;
  private bucket: string;
  private region: string;

  public constructor(
    region: string,
    accessKey: string,
    secretKey: string,
    bucketName: string
  ) {
    this.client = new S3Client({
      region,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
    });
    this.bucket = bucketName;
    this.region = region;
  }

  async uploadImage(
    file: Buffer,
    mimetype: string,
    key: string
  ): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      Body: file,
      ContentType: mimetype,
    });
    await this.client.send(command);
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${key}`;
  }
}
