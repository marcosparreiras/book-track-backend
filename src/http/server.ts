import { Registry } from "../domain/bondaries/registry";
import { InMemoryUserRepository } from "../adapters/in-memory/in-memory-user-repository";
import { InMemoryBucket } from "../adapters/in-memory/in-memory-bucket";
import { app } from "./app";
import { z } from "zod";
import { JwtToken } from "../adapters/token";

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  JWT_SECRET: z.string().default("secret"),
});
const env = envSchema.parse(process.env);

const registry = Registry.getInstance();
registry.register("userRepository", new InMemoryUserRepository());
registry.register("bucket", new InMemoryBucket());
registry.register("token", new JwtToken(env.JWT_SECRET));

app.listen(env.PORT, () => {
  console.log(`Http server is running on port ${env.PORT}`);
});
