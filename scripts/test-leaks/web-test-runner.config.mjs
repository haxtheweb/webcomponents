// yarn test:leaks: the catalog leak suite (haxtheweb/issues#3246). The repo
// config plus room for a whole catalog shard per page.
import base from "../../web-test-runner.config.mjs";

export default {
  ...base,
  rootDir: ".",
  concurrency: 2,
  testsFinishTimeout: 15 * 60 * 1000,
};
