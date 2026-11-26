// node --test scripts/test/*.test.mjs
//
// wc-registry.json maps every tag to the file that defines it, so the
// autoloader can load an element the moment content uses it. These tests hold
// what the registry build reads from a built (minified) file.
import { test } from "node:test";
import assert from "node:assert/strict";
import { definedTags } from "../registry-tags.mjs";

test("every string define in a file, in order", () => {
  const built =
    'customElements.define("extra-model",a);class b{}customElements.define("model-viewer",b);';
  assert.deepEqual(definedTags(built), ["extra-model", "model-viewer"]);
});

// haxtheweb/issues#3428: only the first getter was read, so
// hax-marketing-blocks.js (nine elements) registered hax-cast alone
test("every .tag getter in a file that defines through them", () => {
  const built =
    'class a{static get tag(){return"hax-cast"}}globalThis.customElements.define(a.tag,a);' +
    'class b{static get tag(){return"hax-stat-strip"}}globalThis.customElements.define(b.tag,b);' +
    'class c{static get tag(){return"hax-stat"}}globalThis.customElements.define(c.tag,c);';
  assert.deepEqual(definedTags(built), [
    "hax-cast",
    "hax-stat-strip",
    "hax-stat",
  ]);
});

test("every .is getter in a file that defines through them", () => {
  const built =
    'class a{static get is(){return"old-one"}}customElements.define(a.is,a);' +
    'class b{static get is(){return"old-two"}}customElements.define(b.is,b);';
  assert.deepEqual(definedTags(built), ["old-one", "old-two"]);
});

test("a single-element file keeps its one tag", () => {
  const built =
    'class a{static get tag(){return"video-player"}}customElements.define(a.tag,a);';
  assert.deepEqual(definedTags(built), ["video-player"]);
});

test("names that are not valid element names are left out", () => {
  const built =
    'class a{static get tag(){return"good-name"}}customElements.define(a.tag,a);' +
    'class b{static get tag(){return"Bad"}}customElements.define(b.tag,b);';
  assert.deepEqual(
    definedTags(built, (name) => /^[a-z][a-z0-9]*-[a-z0-9-]*$/.test(name)),
    ["good-name"],
  );
});

test("polymer legacy and files without elements", () => {
  assert.deepEqual(definedTags('Polymer({is:"legacy-el"});'), ["legacy-el"]);
  assert.deepEqual(definedTags("export const x = 1;"), []);
  // a define this file can't name statically registers nothing
  assert.deepEqual(definedTags("customElements.define(name,klass);"), []);
});
