// shard 1 of 8: see catalog-runner.js
import { runCatalogShard } from "./catalog-runner.js";

await runCatalogShard(0, 8);
