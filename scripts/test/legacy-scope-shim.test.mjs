// node --test scripts/test/legacy-scope-shim.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { writeShim } from "../legacy-scope-shim.mjs";

/** a throwaway es6/node_modules tree; .js files load as ES modules */
function tree() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "legacy-scope-"));
  const modules = path.join(root, "es6", "node_modules");
  const put = (rel, text) => {
    const f = path.join(modules, rel);
    fs.mkdirSync(path.dirname(f), { recursive: true });
    fs.writeFileSync(f, text);
  };
  fs.writeFileSync(path.join(root, "package.json"), '{"type":"module"}');
  put(
    "@haxtheweb/demo-el/demo-el.js",
    "export class DemoEl {}\nexport default DemoEl;\nglobalThis.__demoLoads = (globalThis.__demoLoads || 0) + 1;\n",
  );
  // minified forms, as terser writes them in a ubiquity build
  put("@haxtheweb/demo-el/lib/named.js", 'export{a as helper};const a=()=>"named";');
  put("@haxtheweb/demo-el/lib/min-default.js", "const t=1;export{t as default};");
  put("@haxtheweb/demo-el/lib/icon.svg", "<svg></svg>");
  // the full copy ubiquity already makes for old site boilerplate
  put("@lrnwebcomponents/wc-autoload/wc-autoload.js", "export const copy = true;\n");
  put("@haxtheweb/wc-autoload/wc-autoload.js", "export const real = true;\n");
  return modules;
}

test("writes a re-export stub for every module and keeps existing copies", () => {
  const modules = tree();
  const result = writeShim(
    path.join(modules, "@haxtheweb"),
    path.join(modules, "@lrnwebcomponents"),
  );
  assert.deepEqual(result, { written: 3, kept: 1 });
  const read = (rel) =>
    fs.readFileSync(path.join(modules, "@lrnwebcomponents", rel), "utf8");
  assert.equal(
    read("demo-el/demo-el.js"),
    'export * from "../../@haxtheweb/demo-el/demo-el.js";\nexport { default } from "../../@haxtheweb/demo-el/demo-el.js";\n',
  );
  assert.equal(
    read("demo-el/lib/named.js"),
    'export * from "../../../@haxtheweb/demo-el/lib/named.js";\n',
  );
  assert.match(read("demo-el/lib/min-default.js"), /export \{ default \} from/);
  assert.equal(read("wc-autoload/wc-autoload.js"), "export const copy = true;\n");
  assert.equal(
    fs.existsSync(path.join(modules, "@lrnwebcomponents/demo-el/lib/icon.svg")),
    false,
  );
});

test("old and new paths share one module instance", async () => {
  const modules = tree();
  writeShim(
    path.join(modules, "@haxtheweb"),
    path.join(modules, "@lrnwebcomponents"),
  );
  const real = await import(
    pathToFileURL(path.join(modules, "@haxtheweb/demo-el/demo-el.js")).href
  );
  const legacy = await import(
    pathToFileURL(path.join(modules, "@lrnwebcomponents/demo-el/demo-el.js")).href
  );
  assert.equal(legacy.DemoEl, real.DemoEl);
  assert.equal(legacy.default, real.default);
  assert.equal(globalThis.__demoLoads, 1);
  const named = await import(
    pathToFileURL(path.join(modules, "@lrnwebcomponents/demo-el/lib/named.js")).href
  );
  assert.equal(named.helper(), "named");
});

test("running it again changes nothing", () => {
  const modules = tree();
  const from = path.join(modules, "@haxtheweb");
  const to = path.join(modules, "@lrnwebcomponents");
  writeShim(from, to);
  assert.deepEqual(writeShim(from, to), { written: 0, kept: 4 });
});
