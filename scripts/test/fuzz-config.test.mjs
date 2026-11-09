import test from "node:test";
import assert from "node:assert/strict";
import { fuzzConfig } from "../test-setup/fuzz-config.mjs";
import { fuzzEnvScript } from "../test-setup/fuzz-env.mjs";

test("defaults to the fixed seed and 300 runs", () => {
  assert.deepEqual(fuzzConfig({ defaultSeed: 42, env: {} }), {
    numRuns: 300,
    seed: 42,
  });
});

test("HAX_FUZZ_SEED=random drops the seed so fast-check draws one", () => {
  const env = { HAX_FUZZ_SEED: "random", HAX_FUZZ_RUNS: "4000" };
  assert.deepEqual(fuzzConfig({ defaultSeed: 42, env }), { numRuns: 4000 });
});

test("seed and path replay a reported failure", () => {
  const env = { HAX_FUZZ_SEED: "-123", HAX_FUZZ_PATH: "4:0:2" };
  assert.deepEqual(fuzzConfig({ defaultSeed: 42, env }), {
    numRuns: 300,
    seed: -123,
    path: "4:0:2",
  });
});

test("legacy prefixes are honored, HAX_ wins over them", () => {
  assert.equal(
    fuzzConfig({
      defaultSeed: 42,
      aliases: ["LEGACY"],
      env: { LEGACY_FUZZ_SEED: "7" },
    }).seed,
    7,
  );
  assert.equal(
    fuzzConfig({
      defaultSeed: 42,
      aliases: ["LEGACY"],
      env: { LEGACY_FUZZ_SEED: "7", HAX_FUZZ_SEED: "8" },
    }).seed,
    8,
  );
});

test("bad values fail loudly instead of silently changing the run", () => {
  const bad = [
    { HAX_FUZZ_SEED: "abc" },
    { HAX_FUZZ_RUNS: "0" },
    { HAX_FUZZ_PATH: "1;rm" },
  ];
  for (const env of bad) {
    assert.throws(() => fuzzConfig({ defaultSeed: 42, env }), RangeError);
  }
  assert.throws(() => fuzzConfig({ env: {} }), TypeError);
});

test("fuzzEnvScript only forwards HAX_FUZZ_* and escapes markup", () => {
  const out = fuzzEnvScript({
    HAX_FUZZ_SEED: "</script><script>alert(1)</script>",
    HAX_FUZZ_RUNS: "50",
    SECRET_TOKEN: "nope",
  });
  assert.ok(!out.includes("</script>"));
  assert.ok(!out.includes("SECRET_TOKEN"));
  assert.ok(out.includes('"HAX_FUZZ_RUNS":"50"'));
  assert.equal(fuzzEnvScript({}), "{}");
});
