// node --test scripts/test
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { TERSER_OPTIONS, listJs } from "../terser-build.mjs";

const require = createRequire(import.meta.url);
const { minify } = require("terser");
const script = fileURLToPath(new URL("../terser-build.mjs", import.meta.url));
const repo = path.dirname(path.dirname(script));

function fixture() {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "terser-build-"));
  const write = (rel, text) => {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), text);
  };
  write(
    "a.js",
    "export function add(first, second) {\n  return first + second;\n}\n",
  );
  write("sub/b.js", "const value = 1 + 2;\nexport default value;\n");
  write("sub/data.json", '{ "keep": true }\n');
  write("vendor/v.js", "export const untouched   =   1;\n");
  write(".hidden/h.js", "export const hidden   =   1;\n");
  return dir;
}

const run = (dir, ...args) =>
  execFileSync(
    process.execPath,
    [script, dir, "--exclude", path.join(dir, "vendor"), ...args],
    { cwd: repo, encoding: "utf8" },
  );

test("lists .js files only, skipping dot folders and excluded paths", () => {
  const dir = fixture();
  const found = listJs(dir, [path.join(dir, "vendor")])
    .map((f) => path.relative(dir, f).split(path.sep).join("/"))
    .sort();
  assert.deepEqual(found, ["a.js", "sub/b.js"]);
});

test("writes what terser.minify returns, and the same bytes from the cache", async () => {
  const dir = fixture();
  const source = fs.readFileSync(path.join(dir, "a.js"), "utf8");
  const expected = (await minify(source, { ...TERSER_OPTIONS })).code;
  const vendor = fs.readFileSync(path.join(dir, "vendor/v.js"), "utf8");

  run(dir, "--no-cache");
  assert.equal(fs.readFileSync(path.join(dir, "a.js"), "utf8"), expected);
  assert.equal(fs.readFileSync(path.join(dir, "vendor/v.js"), "utf8"), vendor);

  // same input again, through the cache both ways: stored, then read back
  for (const pass of ["store", "hit"]) {
    fs.writeFileSync(path.join(dir, "a.js"), source);
    const out = run(dir);
    assert.equal(
      fs.readFileSync(path.join(dir, "a.js"), "utf8"),
      expected,
      pass,
    );
    if (pass === "hit") {
      assert.match(out, /0 minified/);
    }
  }
});
