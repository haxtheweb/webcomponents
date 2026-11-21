// node --test scripts/test/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const script = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "size-report.mjs",
);
const run = (root, ...args) =>
  spawnSync(process.execPath, [script, "--root", root, ...args], {
    encoding: "utf8",
  });
// text that does not compress away
const filler = (n, seed) => {
  let out = "";
  let x = seed;
  while (out.length < n) {
    x = (x * 1103515245 + 12345) % 2147483648;
    out += x.toString(36);
  }
  return `export const v${seed} = "${out}";\n`;
};

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "size-report-"));
  const write = (rel, text) => {
    const file = path.join(root, rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
  };
  write(
    "elements/a-b/package.json",
    '{"name":"@haxtheweb/a-b","main":"a-b.js"}',
  );
  write(
    "elements/c-d/package.json",
    '{"name":"@haxtheweb/c-d","main":"c-d.js"}',
  );
  write(
    "elements/a-b/a-b.js",
    'import "./lib/x.js";\nimport "@haxtheweb/c-d/c-d.js";\nimport "lit";\n',
  );
  write("elements/a-b/lib/x.js", filler(3000, 1));
  write("elements/c-d/c-d.js", filler(9000, 2));
  write("wc-registry.json", '{"a-b":"@haxtheweb/a-b/a-b.js"}');
  fs.mkdirSync(path.join(root, "scripts"));
  return { root, write };
}

test("own size counts the element's own files and not shared packages", () => {
  const { root } = fixture();
  const out = path.join(root, "sizes.json");
  assert.equal(run(root, "--json", out).status, 0);
  const sizes = JSON.parse(fs.readFileSync(out, "utf8"));
  const ab = sizes["elements/a-b/a-b.js"];
  assert.equal(ab.files, 3);
  assert.equal(ab.own.files, 2);
  assert.equal(
    ab.own.raw,
    fs.statSync(path.join(root, "elements/a-b/a-b.js")).size +
      fs.statSync(path.join(root, "elements/a-b/lib/x.js")).size,
  );
  fs.rmSync(root, { recursive: true, force: true });
});

test("a budget breach fails only the entry that grew, and can be raised", () => {
  const { root, write } = fixture();
  const base = path.join(root, "base.json");
  assert.equal(run(root, "--update-budgets").status, 0);
  assert.equal(run(root, "--json", base).status, 0);
  assert.equal(run(root, "--check-budgets").status, 0);

  write("elements/c-d/c-d.js", filler(9000, 2) + filler(9000, 3));
  const over = run(root, "--check-budgets", "--changed-from", base);
  assert.equal(over.status, 1);
  assert.match(over.stdout, /c-d\/c-d\.js.*over budget/);
  // a-b imports c-d but its own size did not change
  assert.doesNotMatch(over.stdout, /a-b\/a-b\.js/);
  assert.match(over.stdout, /--update-budgets elements\/c-d/);

  const before = JSON.parse(
    fs.readFileSync(path.join(root, "scripts/size-budgets.json"), "utf8"),
  ).budgets;
  assert.equal(run(root, "--update-budgets", "elements/c-d").status, 0);
  const after = JSON.parse(
    fs.readFileSync(path.join(root, "scripts/size-budgets.json"), "utf8"),
  ).budgets;
  assert.deepEqual(after["elements/a-b/a-b.js"], before["elements/a-b/a-b.js"]);
  assert.ok(
    after["elements/c-d/c-d.js"].raw > before["elements/c-d/c-d.js"].raw,
  );
  assert.equal(run(root, "--check-budgets", "--changed-from", base).status, 0);
  fs.rmSync(root, { recursive: true, force: true });
});

test("an entry with no budget is listed, not failed", () => {
  const { root, write } = fixture();
  assert.equal(run(root, "--update-budgets").status, 0);
  write(
    "elements/e-f/package.json",
    '{"name":"@haxtheweb/e-f","main":"e-f.js"}',
  );
  write("elements/e-f/e-f.js", filler(500, 4));
  const r = run(root, "--check-budgets");
  assert.equal(r.status, 0);
  assert.match(r.stdout, /No budget yet for 1 entry/);
  fs.rmSync(root, { recursive: true, force: true });
});
