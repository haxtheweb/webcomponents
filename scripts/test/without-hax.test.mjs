// node --test scripts/test/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  areaOfUrl,
  importFindings,
  normalizeError,
  pasteHtml,
} from "../lib/without-hax.mjs";

// a tiny monorepo: elements/<pkg>/... with the files given
function fixture(files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "without-hax-"));
  for (const [rel, body] of Object.entries(files)) {
    const file = path.join(root, "elements", rel);
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, body);
  }
  return root;
}

const rel = (root, chain) => chain.map((f) => path.relative(root, f));

test("a static import that reaches HAXcms through a helper is hard", () => {
  const root = fixture({
    "my-el/my-el.js": 'import "./lib/helper.js";\nexport class MyEl {}',
    "my-el/lib/helper.js":
      'import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";',
    "haxcms-elements/lib/core/haxcms-site-store.js": "export const store = {};",
  });
  const { hard, lazy } = importFindings(
    root,
    path.join(root, "elements/my-el/my-el.js"),
  );
  assert.deepEqual(Object.keys(hard), ["haxcms"]);
  assert.deepEqual(
    rel(
      root,
      hard.haxcms.map((f) => path.join(root, f)),
    ),
    [
      "elements/my-el/my-el.js",
      "elements/my-el/lib/helper.js",
      "elements/haxcms-elements/lib/core/haxcms-site-store.js",
    ],
  );
  assert.deepEqual(lazy, {});
});

test("import() of the editor is lazy, not hard", () => {
  const root = fixture({
    "my-el/my-el.js":
      'export async function edit() { await import("@haxtheweb/hax-body/lib/hax-store.js"); }',
    "hax-body/lib/hax-store.js": "export const HAXStore = {};",
  });
  const { hard, lazy } = importFindings(
    root,
    path.join(root, "elements/my-el/my-el.js"),
  );
  assert.deepEqual(hard, {});
  assert.deepEqual(Object.keys(lazy), ["editor"]);
});

test("commented-out imports, schema helpers and third-party packages pass", () => {
  const root = fixture({
    "my-el/my-el.js": [
      '// import "@haxtheweb/hax-body/lib/hax-store.js";',
      '/* import "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js"; */',
      'import { HAXFields } from "@haxtheweb/hax-body-behaviors/lib/HAXFields.js";',
      'import { LitElement } from "lit";',
    ].join("\n"),
    "hax-body-behaviors/lib/HAXFields.js": "export const HAXFields = {};",
    "hax-body/lib/hax-store.js": "",
    "haxcms-elements/lib/core/haxcms-site-store.js": "",
  });
  assert.deepEqual(
    importFindings(root, path.join(root, "elements/my-el/my-el.js")),
    { hard: {}, lazy: {} },
  );
});

test("an area reached both eagerly and lazily is reported once, as hard", () => {
  const root = fixture({
    "my-el/my-el.js": [
      'import "@haxtheweb/super-daemon/super-daemon.js";',
      'export const later = () => import("@haxtheweb/hax-body/lib/hax-store.js");',
      'export const also = () => import("@haxtheweb/super-daemon/super-daemon.js");',
    ].join("\n"),
    "super-daemon/super-daemon.js": "",
    "hax-body/lib/hax-store.js": "",
  });
  const { hard, lazy } = importFindings(
    root,
    path.join(root, "elements/my-el/my-el.js"),
  );
  assert.deepEqual(Object.keys(hard), ["editor"]);
  assert.deepEqual(lazy, {});
});

test("import cycles terminate", () => {
  const root = fixture({
    "my-el/a.js": 'import "./b.js";',
    "my-el/b.js": 'import "./a.js";\nexport * from "./a.js";',
  });
  assert.deepEqual(
    importFindings(root, path.join(root, "elements/my-el/a.js")),
    { hard: {}, lazy: {} },
  );
});

test("request URLs map to the editor or HAXcms by package", () => {
  assert.equal(
    areaOfUrl("http://127.0.0.1:8767/elements/hax-body/lib/hax-store.js"),
    "editor",
  );
  assert.equal(
    areaOfUrl(
      "http://127.0.0.1:8767/node_modules/@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js?v=1",
    ),
    "haxcms",
  );
  assert.equal(
    areaOfUrl(
      "http://127.0.0.1:8767/elements/hax-body-behaviors/lib/HAXFields.js",
    ),
    null,
  );
  assert.equal(
    areaOfUrl("http://127.0.0.1:8767/elements/video-player/video-player.js"),
    null,
  );
});

test("errors are one stable line without origin, line or column", () => {
  const origin = "http://127.0.0.1:8767";
  assert.equal(
    normalizeError(
      `TypeError: x is undefined\n    at ${origin}/elements/a/a.js:12:34`,
      origin,
    ),
    "TypeError: x is undefined",
  );
  assert.equal(
    normalizeError(`Failed at ${origin}/elements/a/a.js:12:34`, origin),
    "Failed at /elements/a/a.js",
  );
});

test("the pasted page has only the magic script setup and the content", () => {
  const html = pasteHtml('<video-player source="x"></video-player>');
  assert.match(html, /wc-autoload\/wc-autoload\.js/);
  assert.match(html, /WCAutoloadRegistryFile = "\/wc-registry\.json"/);
  assert.match(html, /<video-player source="x"><\/video-player>/);
  assert.doesNotMatch(html, /hax-body|haxcms-elements/);
});
