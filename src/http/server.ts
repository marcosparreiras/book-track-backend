import { Registry } from "../domain/bondaries/registry";
import { InMemoryUserRepository } from "../adapters/in-memory-user-repository";
import { InMemoryBucket } from "../adapters/in-memory-bucket";
import { app } from "./app";

Registry.getInstance().register("userRepository", new InMemoryUserRepository());
Registry.getInstance().register("bucket", new InMemoryBucket());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Http server is running on port ${PORT}`);
});
