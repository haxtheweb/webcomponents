// web-test-runner config for mutation testing outline-designer
// (stryker.outline-designer.config.mjs). It is the repo config with three
// changes:
// - the page gets the id of the mutant Stryker switched on, so the
//   instrumented outline-designer.js in the browser runs that mutant
//   (Stryker's command runner only sets it in the runner's environment)
// - the seeded random edits in outline-designer-integrity are left out:
//   they take most of that file's time and every mutant runs the suite
// - no coverage, one browser page per test file
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import baseConfig from "../../web-test-runner.config.mjs";

const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

// Stryker mutant ids are numbers; anything else is ignored
const rawMutant = process.env.__STRYKER_ACTIVE_MUTANT__;
const activeMutant =
  typeof rawMutant === "string" && /^[0-9]{1,9}$/.test(rawMutant)
    ? rawMutant
    : "";

const mutantScript = activeMutant
  ? `<script>window.process = window.process || {}; window.process.env = Object.assign({}, window.process.env, { __STRYKER_ACTIVE_MUTANT__: "${activeMutant}" });</script>`
  : "";

// wrap mocha's global it() so the seeded random edits are registered with no
// body, which mocha reports as pending (a mocha grep would leave them as
// failures in web-test-runner's results)
const skipScript = `<script>(function () {
  var skip = /seeded|random edits/;
  var current;
  Object.defineProperty(window, "it", {
    configurable: true,
    get: function () { return current; },
    set: function (fn) {
      if (typeof fn !== "function") { current = fn; return; }
      var wrapped = function (title) {
        if (skip.test(String(title))) {
          return fn.call(this, title);
        }
        return fn.apply(this, arguments);
      };
      current = wrapped;
    }
  });
})();</script>`;

export default {
  ...baseConfig,
  rootDir: root,
  nodeResolve: true,
  coverage: false,
  concurrency: 2,
  testFramework: {
    config: {
      timeout: 10000,
    },
  },
  testRunnerHtml: (testFramework, config) =>
    baseConfig
      .testRunnerHtml(testFramework, config)
      .replace(
        '<script type="module"',
        `${mutantScript}${skipScript}<script type="module"`,
      ),
};
