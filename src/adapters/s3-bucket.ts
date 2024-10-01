import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import type { Bucket } from "../domain/bondaries/bucket";

export class S3Bucket implements Bucket {
  private client: S3Client;
  private bucket: string;
  private bucketRegion: string;

  public constructor(
    bucketName: string,
    bucketRegion: string,
    config?: {
      region: string;
      accessKey: string;
      secretKey: string;
    }
  ) {
    if (config) {
      this.client = new S3Client({
        region: config.region,
        credentials: {
          accessKeyId: config.accessKey,
          secretAccessKey: config.secretKey,
        },
      });
    } else {
      this.client = new S3Client();
    }
    this.bucket = bucketName;
    this.bucketRegion = bucketRegion;
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
    return `https://${this.bucket}.s3.${this.bucketRegion}.amazonaws.com/${key}`;
  }
}
