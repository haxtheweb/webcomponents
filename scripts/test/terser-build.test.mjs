// node --test scripts/test
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { isModuleSource, listJs, optionsFor } from "../terser-build.mjs";

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
  write("sub/c.mjs", "export const total   =   1 + 2;\n");
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
  assert.deepEqual(found, ["a.js", "sub/b.js", "sub/c.mjs"]);
});

test("writes what terser.minify returns, and the same bytes from the cache", async () => {
  const dir = fixture();
  const source = fs.readFileSync(path.join(dir, "a.js"), "utf8");
  const expected = (await minify(source, await optionsFor(source))).code;
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

test("tells modules from classic scripts", async () => {
  assert.equal(await isModuleSource('import "./a.js";\nconst a = 1;'), true);
  assert.equal(await isModuleSource("export const a = 1;"), true);
  assert.equal(await isModuleSource("const here = import.meta.url;"), true);
  assert.equal(await isModuleSource("var lib = (function () {})();"), false);
  // the words alone, in a string or a comment, do not make a module
  assert.equal(
    await isModuleSource('var note = "import or export"; // export later'),
    false,
  );
});

test("a classic script keeps its top-level names; a module does not have to", async () => {
  const dir = fixture();
  const classic =
    "var sharedLibrary = (function (root, factory) {\n  return factory(root);\n})(this, function (root) {\n  return { root: root };\n});\nconst alsoGlobal = 1;\n";
  fs.writeFileSync(path.join(dir, "classic.js"), classic);
  run(dir, "--no-cache");
  const out = fs.readFileSync(path.join(dir, "classic.js"), "utf8");
  assert.match(out, /\bsharedLibrary\b/);
  assert.match(out, /\balsoGlobal\b/);
  // no new short global declared at the top level
  assert.doesNotMatch(out, /^(?:var|let|const) [a-z](?:[,;=])/);
  // the module in the same folder is still minified as a module
  assert.doesNotMatch(
    fs.readFileSync(path.join(dir, "a.js"), "utf8"),
    /first|second/,
  );
});
