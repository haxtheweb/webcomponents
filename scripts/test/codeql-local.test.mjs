import test from "node:test";
import assert from "node:assert/strict";
import { ramMegabytes, scanTargets } from "../codeql-local.mjs";

test("changed elements scan their whole folder, once", () => {
  assert.deepEqual(
    scanTargets([
      "elements/utils/utils.js",
      "elements/utils/lib/url.js",
      "elements/d-d-d/d-d-d.js",
    ]),
    ["elements/utils", "elements/d-d-d"],
  );
});

test("files outside elements/ scan their own folder", () => {
  assert.deepEqual(
    scanTargets(["scripts/test-setup/fuzz-env.mjs", "scripts/precheck.mjs"]),
    ["scripts/test-setup", "scripts"],
  );
});

test("a root-level file scans only itself, never the whole repo", () => {
  const targets = scanTargets(["web-test-runner.config.mjs", "gulpfile.mjs"]);
  assert.deepEqual(targets, ["web-test-runner.config.mjs", "gulpfile.mjs"]);
  assert.ok(!targets.includes("."));
});

test("ram defaults to 60% of memory, clamped to 2048-8192 MB", () => {
  const gb = 1024 * 1024 * 1024;
  assert.equal(ramMegabytes({}, 8 * gb), 4915);
  assert.equal(ramMegabytes({}, 2 * gb), 2048);
  assert.equal(ramMegabytes({}, 64 * gb), 8192);
});

test("CODEQL_RAM overrides, ignoring junk", () => {
  const gb = 1024 * 1024 * 1024;
  assert.equal(ramMegabytes({ CODEQL_RAM: "3000" }, 64 * gb), 3000);
  assert.equal(ramMegabytes({ CODEQL_RAM: "lots" }, 8 * gb), 4915);
  assert.equal(ramMegabytes({ CODEQL_RAM: "0" }, 8 * gb), 4915);
});
