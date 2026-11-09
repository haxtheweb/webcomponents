// Shared fast-check parameters for HAX property-based (fuzz) tests.
// Convention: https://github.com/haxtheweb/issues/issues/3272
//
//   yarn test            fixed default seed: the same inputs on every run, so
//                        a red fuzz test means the change under test broke it
//   yarn test:fuzz       (monorepo root) HAX_FUZZ_SEED=random and many more
//                        runs, to hunt for new bugs; a failure prints
//                        { seed, path } and the shrunk counterexample
//   HAX_FUZZ_SEED=<seed> HAX_FUZZ_PATH=<path> yarn test
//                        replays exactly that failure
//
// Browser tests can't read process.env directly, so web-test-runner.config.mjs
// copies the HAX_FUZZ_* variables into the test page's window.process.env.
//
// When a hunt finds something, fix it and pin the counterexample (fast-check
// `examples`, or a plain example-based test) so the default run guards it.
//
// ESM twin of the CommonJS test/_helpers/fuzz-config.cjs in haxtheweb/create
// and haxtheweb/haxcms-nodejs; keep the copies in step when changing it.

function readEnv(env, name, aliases) {
  const keys = [name].concat(aliases);
  for (let i = 0; i < keys.length; i++) {
    const value = env[keys[i]];
    if (value !== undefined && value !== null && value !== "") {
      return { key: keys[i], value: String(value) };
    }
  }
  return null;
}

/**
 * Build fast-check assert parameters from HAX_FUZZ_* environment variables.
 *
 * @param {object} options
 * @param {number} options.defaultSeed seed used when HAX_FUZZ_SEED is unset
 * @param {number} [options.defaultRuns=300] runs when HAX_FUZZ_RUNS is unset
 * @param {string[]} [options.aliases=[]] legacy env prefixes, e.g. ["HAXCMS"]
 * @param {object} [options.env] variables to read; defaults to process.env
 * @returns {{numRuns: number, seed?: number, path?: string}}
 */
export function fuzzConfig(options) {
  const opts = options || {};
  const defaultSeed = opts.defaultSeed;
  const defaultRuns = opts.defaultRuns === undefined ? 300 : opts.defaultRuns;
  const aliases = opts.aliases || [];
  const proc = globalThis.process;
  const env = opts.env || (proc && proc.env ? proc.env : {});

  if (!Number.isInteger(defaultSeed)) {
    throw new TypeError("fuzzConfig: defaultSeed must be an integer");
  }
  const alias = (suffix) => aliases.map((prefix) => `${prefix}_FUZZ_${suffix}`);

  const config = { numRuns: defaultRuns, seed: defaultSeed };

  const runs = readEnv(env, "HAX_FUZZ_RUNS", alias("RUNS"));
  if (runs) {
    const numRuns = Number(runs.value);
    if (!Number.isInteger(numRuns) || numRuns < 1) {
      throw new RangeError(
        `${runs.key} must be a positive integer, got "${runs.value}"`,
      );
    }
    config.numRuns = numRuns;
  }

  const seed = readEnv(env, "HAX_FUZZ_SEED", alias("SEED"));
  if (seed) {
    if (seed.value === "random") {
      delete config.seed;
    } else {
      const parsed = Number(seed.value);
      if (!Number.isInteger(parsed)) {
        throw new RangeError(
          `${seed.key} must be an integer or "random", got "${seed.value}"`,
        );
      }
      config.seed = parsed;
    }
  }

  const path = readEnv(env, "HAX_FUZZ_PATH", alias("PATH"));
  if (path) {
    if (!/^\d+(:\d+)*$/.test(path.value)) {
      throw new RangeError(
        `${path.key} must look like "12:0:3", got "${path.value}"`,
      );
    }
    config.path = path.value;
  }

  return config;
}
