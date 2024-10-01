"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/adapters/s3-bucket.ts
var s3_bucket_exports = {};
__export(s3_bucket_exports, {
  S3Bucket: () => S3Bucket
});
module.exports = __toCommonJS(s3_bucket_exports);
var import_client_s3 = require("@aws-sdk/client-s3");
var S3Bucket = class {
  constructor(bucketName, bucketRegion, config) {
    if (config) {
      this.client = new import_client_s3.S3Client({
        region: config.region,
        credentials: {
          accessKeyId: config.accessKey,
          secretAccessKey: config.secretKey
        }
      });
    } else {
      this.client = new import_client_s3.S3Client();
    }
    this.bucket = bucketName;
    this.bucketRegion = bucketRegion;
  }
  uploadImage(file, mimetype, key) {
    return __async(this, null, function* () {
      const command = new import_client_s3.PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: file,
        ContentType: mimetype
      });
      yield this.client.send(command);
      return `https://${this.bucket}.s3.${this.bucketRegion}.amazonaws.com/${key}`;
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  S3Bucket
});
