// node --test scripts/test/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  auditBundled,
  buildManifest,
  bundledThirdParty,
  compareWithBuild,
  compareWithSource,
  lockVersions,
  patchedPackage,
  renderSummary,
  shippableSource,
  splitAssetPath,
  stableStringify,
} from "../ubiquity-manifest.mjs";

const script = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../ubiquity-manifest.mjs",
);

function put(root, rel, text) {
  fs.mkdirSync(path.dirname(path.join(root, rel)), { recursive: true });
  fs.writeFileSync(path.join(root, rel), text);
}

function git(root, ...args) {
  const res = spawnSync("git", args, { cwd: root, encoding: "utf8" });
  assert.equal(res.status, 0, res.stderr);
}

// a tiny monorepo and the build ubiquity would make from it
function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "ubiquity-manifest-"));
  put(root, ".version", "1.2.3\n");
  put(root, "polymer.json", "{}\n");
  put(root, "gulpfile.mjs", "// gulp\n");
  put(root, "dist/build.js", "import './x.js'\n");
  put(
    root,
    "elements/my-el/package.json",
    '{"name":"@haxtheweb/my-el","version":"1.2.3"}',
  );
  put(root, "elements/my-el/my-el.js", "export class MyEl {}\n");
  put(root, "elements/my-el/lib/util.js", "export const u = 1\n");
  put(root, "elements/my-el/demo/index.html", "<my-el></my-el>\n");
  put(
    root,
    "node_modules/lit/package.json",
    '{"name":"lit","version":"3.0.0"}',
  );
  put(root, "patches/lit+3.0.0.patch", "--- a\n+++ b\n");
  put(
    root,
    "yarn.lock",
    '# yarn lockfile v1\n\n"lit@^3.0.0", lit@^3.0.1:\n  version "3.0.0"\n  resolved "x"\n\n"@a/b@^1.0.0":\n  version "1.0.0"\n',
  );
  const build = path.join(root, "build");
  put(build, "polymer.json", '{"built":true}\n');
  put(build, "es6/dist/build.js", "import './x.js'\n");
  put(
    build,
    "es6/node_modules/@haxtheweb/my-el/my-el.js",
    "export class MyEl{}",
  );
  put(
    build,
    "es6/node_modules/@haxtheweb/my-el/lib/util.js",
    "export const u=1",
  );
  put(build, "es6/node_modules/lit/index.js", "export {}");
  git(root, "init", "-q");
  git(root, "add", "-A", ":!build", ":!node_modules");
  git(
    root,
    "-c",
    "user.email=t@example.com",
    "-c",
    "user.name=t",
    "commit",
    "-qm",
    "fixture",
  );
  return { root, build };
}

test("asset paths split into package and inner path", () => {
  assert.deepEqual(splitAssetPath("es6/node_modules/@haxtheweb/x/lib/a.js"), {
    key: "@haxtheweb/x",
    name: "@haxtheweb/x",
    inner: "lib/a.js",
  });
  assert.deepEqual(splitAssetPath("es6/node_modules/lit/index.js"), {
    key: "lit",
    name: "lit",
    inner: "index.js",
  });
  assert.deepEqual(
    splitAssetPath("es6/node_modules/a/node_modules/@s/b/c.js"),
    { key: "a/node_modules/@s/b", name: "@s/b", inner: "c.js" },
  );
  assert.equal(splitAssetPath("es6/dist/build.js"), null);
});

test("yarn.lock versions, patch names and shipping rules", () => {
  const lock = lockVersions(
    '"lit@^3.0.0", lit@^3.1.0:\n  version "3.1.0"\n\n"@a/b@npm:^1":\n  version "1.0.0"\n\nlit@^2:\n  version "2.8.0"\n',
  );
  assert.deepEqual([...lock.get("lit")].sort(), ["2.8.0", "3.1.0"]);
  assert.deepEqual([...lock.get("@a/b")], ["1.0.0"]);
  assert.equal(
    patchedPackage("@google+model-viewer+3.2.1.patch"),
    "@google/model-viewer",
  );
  assert.equal(patchedPackage("wd++request+2.88.0.patch"), "request");
  assert.equal(shippableSource("x", "x.js"), true);
  assert.equal(shippableSource("x", "lib/a/b.svg"), true);
  assert.equal(shippableSource("x", "locales/x.es.json"), true);
  assert.equal(shippableSource("x", "x.stories.js"), false);
  assert.equal(shippableSource("x", "test/x.test.js"), false);
  assert.equal(shippableSource("x", "demo/index.html"), false);
  assert.equal(shippableSource("haxcms-elements", "demo/index.html"), true);
});

test("stable output is sorted and one line per asset", () => {
  assert.equal(
    stableStringify({ b: { y: ["1", "2"] }, a: 1 }),
    '{\n  "a": 1,\n  "b": {\n    "y": ["1", "2"]\n  }\n}',
  );
});

test("a manifest matches the tree and build it was written from", () => {
  const { root, build } = fixture();
  const m = buildManifest({ root, build });
  const again = buildManifest({ root, build });
  assert.equal(stableStringify(m), stableStringify(again));
  assert.equal(m.source.version, "1.2.3");
  assert.match(m.source.commit, /^[0-9a-f]{40}$/);
  const el = m.packages["@haxtheweb/my-el"];
  assert.equal(el.source, "elements/my-el");
  assert.equal(el.version, "1.2.3");
  assert.equal(el.files["my-el.js"].length, 2);
  assert.equal(m.packages.lit.version, "3.0.0");
  assert.ok(m.packages.lit.patch);
  assert.equal(m.packages.lit.source, undefined);
  assert.deepEqual(bundledThirdParty(m), { lit: ["3.0.0"] });

  const src = compareWithSource(m, { root });
  assert.deepEqual(src.stale, []);
  assert.deepEqual(src.thirdParty, []);
  assert.deepEqual(src.looseChanged, []);
  assert.deepEqual(src.toolchainChanged, []);
  assert.deepEqual(compareWithBuild(m, build), {
    modified: [],
    missing: [],
    unexpected: [],
  });
  assert.match(
    renderSummary({ manifest: m, source: src, build: null, audit: [] }),
    /Compiled assets match webcomponents master/,
  );
});

test("source changes on master show up as stale assets", () => {
  const { root, build } = fixture();
  const m = buildManifest({ root, build });
  put(root, "elements/my-el/my-el.js", "export class MyEl { changed() {} }\n");
  fs.rmSync(path.join(root, "elements/my-el/lib/util.js"));
  put(root, "elements/my-el/lib/new.js", "export const n = 1\n");
  put(root, "patches/lit+3.0.0.patch", "--- a\n+++ c\n");
  put(root, "gulpfile.mjs", "// gulp 2\n");
  put(
    root,
    "elements/other-el/package.json",
    '{"name":"@haxtheweb/other-el","version":"1.2.3"}',
  );
  put(root, "yarn.lock", 'lit@^3.0.0:\n  version "3.1.0"\n');
  git(root, "add", "-A", ":!build", ":!node_modules");
  const src = compareWithSource(m, { root });
  assert.deepEqual(src.stale, [
    {
      package: "@haxtheweb/my-el",
      changed: ["my-el.js"],
      removed: ["lib/util.js"],
      added: ["lib/new.js"],
    },
  ]);
  assert.deepEqual(src.newPackages, ["@haxtheweb/other-el"]);
  assert.deepEqual(src.thirdParty, [
    { package: "lit", shipped: "3.0.0", master: ["3.1.0"], patchChanged: true },
  ]);
  assert.deepEqual(src.toolchainChanged, ["gulpfile.mjs"]);
  const md = renderSummary({
    manifest: m,
    source: src,
    build: null,
    audit: [],
  });
  assert.match(md, /Stale assets \(3 files in 1 packages\)/);
  assert.match(
    md,
    /`@haxtheweb\/my-el`: changed `my-el.js`; removed `lib\/util.js`; new `lib\/new.js`/,
  );
});

test("edits to the committed build are reported", () => {
  const { root, build } = fixture();
  const m = buildManifest({ root, build });
  fs.rmSync(path.join(build, "es6/node_modules/lit/index.js"));
  put(build, "es6/dist/build.js", "tampered");
  put(build, "es6/extra.js", "x");
  assert.deepEqual(compareWithBuild(m, build), {
    modified: ["es6/dist/build.js"],
    missing: ["es6/node_modules/lit/index.js"],
    unexpected: ["es6/extra.js"],
  });
});

test("audit reports advisories and retries before giving up", async () => {
  let calls = 0;
  const found = await auditBundled(
    { lit: ["3.0.0"] },
    {
      fetchImpl: async (url, opts) => {
        calls++;
        assert.deepEqual(JSON.parse(opts.body), { lit: ["3.0.0"] });
        return {
          ok: true,
          json: async () => ({
            lit: [
              {
                title: "XSS",
                severity: "high",
                url: "https://github.com/advisories/GHSA-x",
                vulnerable_versions: "<3.0.1",
              },
            ],
          }),
        };
      },
    },
  );
  assert.equal(calls, 1);
  assert.deepEqual(found, [
    {
      package: "lit",
      version: "3.0.0",
      title: "XSS",
      severity: "high",
      url: "https://github.com/advisories/GHSA-x",
      vulnerable: "<3.0.1",
    },
  ]);
  calls = 0;
  await assert.rejects(
    auditBundled(
      { lit: ["3.0.0"] },
      {
        fetchImpl: async () => {
          calls++;
          return { ok: false, status: 503 };
        },
      },
    ),
    /503/,
  );
  assert.equal(calls, 3);
  assert.deepEqual(await auditBundled({}), []);
});

test("check passes and says so when there is no manifest yet", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "ubiquity-check-"));
  const summary = path.join(dir, "summary.md");
  const res = spawnSync(
    process.execPath,
    [
      script,
      "check",
      "--manifest",
      path.join(dir, "nope.json"),
      "--summary",
      summary,
    ],
    { encoding: "utf8" },
  );
  assert.equal(res.status, 0, res.stderr);
  assert.match(fs.readFileSync(summary, "utf8"), /No manifest yet/);
});
