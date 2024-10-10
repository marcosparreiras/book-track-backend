import { Registry } from "./domain/bondaries/registry";
import { app } from "./http/app";
import { z } from "zod";
import { JwtToken } from "./adapters/token";
import { PgConnection } from "./adapters/postgres-connection";
import { PostgresBookRepository } from "./adapters/postgres-book-repository";
import { PostgresUserRepository } from "./adapters/postgres-user-repository";
import { PostgresCommentRepository } from "./adapters/postgres-comment-repository";
import { S3Bucket } from "./adapters/s3-bucket";
import { Logger } from "./domain/bondaries/logger";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().default("secret"),
  DATABASE_URL: z
    .string()
    .default("postgres://admin:admin@localhost:5432/booktrack"),
  BUCKET_NAME: z.string().default("marcos-booktrak-demo"),
  BUCKET_REGION: z.string().default("us-east-1"),
  LOGGER_MODE: z.enum(["production", "development"]).default("development"),
});
const env = envSchema.parse(process.env);

const registry = Registry.getInstance();
registry.register("dbConnection", new PgConnection(env.DATABASE_URL));
registry.register("userRepository", new PostgresUserRepository());
registry.register("bookRepository", new PostgresBookRepository());
registry.register("commentRepository", new PostgresCommentRepository());
registry.register("bucket", new S3Bucket(env.BUCKET_NAME, env.BUCKET_REGION));
registry.register("token", new JwtToken(env.JWT_SECRET));
const logger = Logger.getInstance();
logger.setMode(env.LOGGER_MODE);

app.listen(env.PORT, () => {
  logger.info(`Http server is running on port ${env.PORT} 🌱`);
});
