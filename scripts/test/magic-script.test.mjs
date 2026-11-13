// node --test scripts/test/*.test.mjs
//
// The magic script (build.js) and its HAXcms companion (build-haxcms.js) are
// served by the CDNs and copied into every site, so pages published years ago
// run whatever these files do today. These tests hold the behavior those
// pages rely on, and the timeout that moves on from a CDN that never answers.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const BUILD = fs.readFileSync(path.join(root, "build.js"), "utf8");
const BUILD_HAXCMS = fs.readFileSync(path.join(root, "build-haxcms.js"), "utf8");

const ENTRY = "build/es6/node_modules/@haxtheweb/wc-autoload/wc-autoload.js";
const HAX_CLOUD = "https://cdn.hax.cloud/cdn/";
const PSU = "https://cdn.webcomponents.psu.edu/cdn/";

// A page with just enough DOM for the loaders: elements record what was
// inserted, and timers are held so a test decides when time passes.
function page(globals = {}) {
  const inserted = [];
  const timers = [];
  const logs = { warn: [], error: [] };
  const defined = new Map();
  const make = (tag) => ({ tag, onload: null, onerror: null });
  const parentNode = {
    insertBefore(el) {
      inserted.push(el);
    },
  };
  const firstScript = { tag: "script", parentNode };
  const firstLink = { tag: "link", parentNode };
  const document = {
    currentScript: firstScript,
    location: "https://example.org/",
    createElement: make,
    getElementsByTagName: (tag) => [tag === "link" ? firstLink : firstScript],
  };
  const sandbox = {
    document,
    console: {
      warn: (m) => logs.warn.push(String(m)),
      error: (m) => logs.error.push(String(m)),
    },
    HTMLScriptElement: { prototype: { noModule: false } },
    customElements: {
      define(name, cl) {
        if (defined.has(name)) {
          throw new Error(name + " already defined");
        }
        defined.set(name, cl);
      },
      get: (name) => defined.get(name),
    },
    setTimeout(fn, ms) {
      const timer = { fn, ms, cleared: false };
      timers.push(timer);
      return timer;
    },
    clearTimeout(timer) {
      if (timer) {
        timer.cleared = true;
      }
    },
    ...globals,
  };
  sandbox.globalThis = sandbox;
  vm.createContext(sandbox);
  return {
    sandbox,
    inserted,
    timers,
    logs,
    defined,
    run: (code) => vm.runInContext(code, sandbox),
    scripts: () => inserted.filter((el) => el.tag === "script"),
    links: () => inserted.filter((el) => el.tag === "link"),
    // let every pending timer fire, as if its delay had passed
    expire() {
      for (const timer of timers.splice(0)) {
        if (!timer.cleared) {
          timer.fn();
        }
      }
    },
  };
}

test("build.js loads wc-autoload from the page's CDN and sets the registry file", () => {
  const p = page({ __appCDN: HAX_CLOUD });
  p.run(BUILD);
  assert.deepEqual(
    p.scripts().map((s) => [s.src, s.type]),
    [[HAX_CLOUD + ENTRY, "module"]],
  );
  assert.equal(p.sandbox.WCAutoloadRegistryFile, HAX_CLOUD + "wc-registry.json");
  assert.equal(p.sandbox.process.env.NODE_ENV, "production");
});

test("build.js defaults to ./ and honors WCGlobalCDNPath and the registry file name", () => {
  const local = page();
  local.run(BUILD);
  assert.equal(local.scripts()[0].src, "./" + ENTRY);
  const custom = page({
    WCGlobalCDNPath: "https://example.org/cdn/",
    WCGlobalRegistryFileName: "my-registry.json",
  });
  custom.run(BUILD);
  assert.equal(custom.scripts()[0].src, "https://example.org/cdn/" + ENTRY);
  assert.equal(
    custom.sandbox.WCAutoloadRegistryFile,
    "https://example.org/cdn/my-registry.json",
  );
});

test("a load that succeeds changes nothing else on the page", () => {
  const p = page({ __appCDN: "./" });
  const define = p.sandbox.customElements.define;
  p.run(BUILD);
  p.scripts()[0].onload();
  p.expire();
  assert.equal(p.scripts().length, 1);
  assert.equal(p.sandbox.__appCDN, "./");
  assert.equal(p.sandbox.customElements.define, define);
  assert.deepEqual(p.logs, { warn: [], error: [] });
});

test("an error walks ./ -> cdn.hax.cloud -> PSU -> gives up, as before", () => {
  const p = page({ __appCDN: "./" });
  p.run(BUILD);
  p.scripts()[0].onerror({});
  assert.equal(p.sandbox.__appCDN, HAX_CLOUD);
  assert.equal(p.scripts()[1].src, HAX_CLOUD + ENTRY);
  assert.equal(p.sandbox.WCAutoloadRegistryFile, HAX_CLOUD + "wc-registry.json");
  p.scripts()[1].onerror({});
  assert.equal(p.sandbox.__appCDN, PSU);
  assert.equal(p.scripts()[2].src, PSU + ENTRY);
  assert.equal(p.sandbox.WCAutoloadRegistryFile, PSU + "wc-registry.json");
  p.scripts()[2].onerror({});
  assert.equal(p.scripts().length, 3);
  assert.equal(p.sandbox.__appCDN, "./");
  assert.equal(p.logs.warn.length, 2);
  assert.match(p.logs.error[0], /all alternative CDNs failed/);
});

test("__appCDNBlockFallback stops both the error and the timeout fallback", () => {
  const onError = page({ __appCDN: "./", __appCDNBlockFallback: true });
  onError.run(BUILD);
  onError.scripts()[0].onerror({});
  assert.equal(onError.scripts().length, 1);
  assert.equal(onError.sandbox.__appCDN, "./");
  const onTimeout = page({ __appCDN: "./", __appCDNBlockFallback: true });
  onTimeout.run(BUILD);
  onTimeout.expire();
  assert.equal(onTimeout.scripts().length, 1);
  assert.equal(onTimeout.sandbox.__appCDN, "./");
});

test("a CDN that never answers is left after 10 seconds", () => {
  const p = page({ __appCDN: HAX_CLOUD });
  p.run(BUILD);
  assert.equal(p.timers[0].ms, 10000);
  p.expire();
  assert.equal(p.sandbox.__appCDN, PSU);
  assert.equal(p.scripts()[1].src, PSU + ENTRY);
  assert.equal(p.sandbox.WCAutoloadRegistryFile, PSU + "wc-registry.json");
  // the first CDN erroring late must not skip a tier
  p.scripts()[0].onerror({});
  assert.equal(p.scripts().length, 2);
  assert.equal(p.sandbox.__appCDN, PSU);
});

test("WCGlobalCDNTimeout sets the wait", () => {
  const p = page({ __appCDN: "./", WCGlobalCDNTimeout: 2500 });
  p.run(BUILD);
  assert.equal(p.timers[0].ms, 2500);
});

test("after a timeout, the slow CDN finishing late cannot register an element twice", () => {
  const p = page({ __appCDN: "./" });
  p.run(BUILD);
  p.expire();
  class First {}
  class Second {}
  p.sandbox.customElements.define("wc-autoload", First);
  assert.doesNotThrow(() => p.sandbox.customElements.define("wc-autoload", Second));
  assert.equal(p.defined.get("wc-autoload"), First);
});

test("a timeout with no next CDN leaves a slow page alone", () => {
  // a custom CDN base, and a page that set no __appCDN at all
  for (const globals of [
    { __appCDN: "https://example.org/cdn/" },
    { WCGlobalCDNPath: "https://example.org/cdn/" },
    {},
  ]) {
    const p = page(globals);
    const define = p.sandbox.customElements.define;
    p.run(BUILD);
    const registry = p.sandbox.WCAutoloadRegistryFile;
    const cdn = p.sandbox.__appCDN;
    p.expire();
    assert.equal(p.scripts().length, 1);
    assert.equal(p.sandbox.WCAutoloadRegistryFile, registry);
    assert.equal(p.sandbox.__appCDN, cdn);
    assert.equal(p.sandbox.customElements.define, define);
    assert.deepEqual(p.logs, { warn: [], error: [] });
    // it can still finish, or still fail the way it always did
    p.scripts()[0].onload();
  }
});

test("the PSU mirror timing out is the end of the chain, not a reset", () => {
  const p = page({ __appCDN: HAX_CLOUD });
  p.run(BUILD);
  p.expire(); // hax.cloud -> PSU
  p.expire(); // PSU has no next tier
  assert.equal(p.scripts().length, 2);
  assert.equal(p.sandbox.__appCDN, PSU);
  assert.equal(p.logs.error.length, 0);
});

test("build-haxcms.js loads the custom build and base.css, and no theme.css", () => {
  const p = page({ __appCDN: HAX_CLOUD });
  p.run(BUILD_HAXCMS);
  assert.deepEqual(
    p.scripts().map((s) => [s.src, s.type]),
    [["./custom/build/custom.es6.js", "module"]],
  );
  assert.deepEqual(
    p.links().map((l) => [l.rel, l.href]),
    [
      [
        "stylesheet",
        HAX_CLOUD + "build/es6/node_modules/@haxtheweb/haxcms-elements/lib/base.css",
      ],
    ],
  );
  assert.ok(!BUILD_HAXCMS.includes("theme.css"));
});

test("build-haxcms.js skips the custom build when __appCustomEnv is set", () => {
  const p = page({ __appCDN: "./", __appCustomEnv: true });
  p.run(BUILD_HAXCMS);
  assert.equal(p.scripts().length, 0);
  assert.equal(p.links().length, 1);
});

test("build-haxcms.js still falls back for base.css on an error", () => {
  const p = page({ __appCDN: "./" });
  p.run(BUILD_HAXCMS);
  p.links()[0].onerror({});
  assert.equal(
    p.links()[1].href,
    HAX_CLOUD + "build/es6/node_modules/@haxtheweb/haxcms-elements/lib/base.css",
  );
});

test("build-haxcms.js keeps a second define of one tag from throwing", () => {
  const p = page({ __appCDN: "./" });
  p.run(BUILD_HAXCMS);
  class A {}
  p.sandbox.customElements.define("x-a", A);
  assert.doesNotThrow(() => p.sandbox.customElements.define("x-a", class B {}));
  assert.equal(p.defined.get("x-a"), A);
});

test("the demo copy of build-haxcms.js matches: custom build, no theme.css", () => {
  const demo = fs.readFileSync(
    path.join(root, "elements/haxcms-elements/demo/build-haxcms.js"),
    "utf8",
  );
  const p = page({ __appCDN: "./" });
  p.run(demo);
  assert.deepEqual(
    p.scripts().map((s) => s.src),
    ["./custom/build/custom.es6.js"],
  );
  assert.equal(p.links().length, 1);
  assert.ok(!demo.includes("theme.css"));
});
