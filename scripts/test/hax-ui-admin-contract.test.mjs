// node --test scripts/test/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  adminContractTargets,
  checkAdminSource,
  countFindings,
  stripComments,
} from "../lib/hax-ui-admin-contract.mjs";

const rules = (src, scope) => checkAdminSource(src, scope).map((f) => f.rule);

const FRAMED = `import { HaxUiAdminStyles } from "@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js";
import { HaxUiDialogFrame } from "@haxtheweb/d-d-d/lib/HaxUiDialogFrame.js";
open() {
  this.dispatchEvent(new CustomEvent("simple-modal-show", {
    detail: { title: "Settings", modal: true, showClose: true,
      styles: { ...HaxUiDialogFrame, "--simple-modal-width": "420px" } },
  }));
}`;

test("a framed dialog that builds on the layer passes", () => {
  assert.deepEqual(rules(FRAMED, { target: true }), []);
});

test("a target without the HAX UI layer is reported", () => {
  assert.deepEqual(rules("export class X {}", { target: true }), ["layer"]);
});

test("content type sizes, px sizes, SimpleColors and raw hex are reported on targets", () => {
  const src = `import "@haxtheweb/d-d-d/lib/HaxUiAdminStyles.js";
css\`
  h2 { font-size: var(--ddd-font-size-s); }
  p { font-size: 13px; color: var(--simple-colors-default-theme-blue-8); }
  b { color: #1e407c; border-color: var(--hax-ui-line, #e4e5e7); }
\``;
  assert.deepEqual(rules(src, { target: true }).sort(), [
    "content-type",
    "px-type",
    "raw-hex",
    "simple-colors",
  ]);
});

test("the same styles are not judged in a file that is only an opener", () => {
  assert.deepEqual(rules("p { font-size: 13px; }", { target: false }), []);
});

test("browser dialogs are reported, methods with the same name are not", () => {
  const src = `if (confirm("Sure?")) {}
const v = globalThis.prompt("Name");
this.confirm(x);
async confirm(e) { return 1; }`;
  const found = checkAdminSource(src).map((f) => f.key);
  assert.deepEqual(found, ["confirm", "prompt"]);
});

test("comments that name a browser dialog are ignored", () => {
  assert.deepEqual(
    rules("// replaces confirm() and prompt()\n/* alert(x) */"),
    [],
  );
});

test("a modal without the frame is reported", () => {
  const src = `this.dispatchEvent(new CustomEvent("simple-modal-show", {
    detail: { title: "X", styles: { "--simple-modal-width": "400px" } },
  }));`;
  assert.deepEqual(rules(src), ["modal-frame"]);
});

test("a titled modal: true dialog must keep its close button", () => {
  const src = `import { SITE_ADMIN_TITLEBAR_STYLES } from "./admin/site-admin-sections.js";
x.dispatchEvent(new CustomEvent("simple-modal-show", {
  detail: { title: "Builder", modal: true, styles: { ...SITE_ADMIN_TITLEBAR_STYLES } },
}));`;
  assert.deepEqual(rules(src), ["modal-close"]);
});

test("the confirm card needs no close button", () => {
  const src = `x.dispatchEvent(new CustomEvent("simple-modal-show", {
  detail: { title: "Delete?", modal: true, styles: SITE_ADMIN_CONFIRM_STYLES },
}));`;
  assert.deepEqual(rules(src), []);
});

test("a listener for simple-modal-show is not an opener", () => {
  assert.deepEqual(
    rules(`globalThis.addEventListener("simple-modal-show", this.x);`),
    [],
  );
});

test("a hand-drawn dialog must use the frame classes or the confirm card", () => {
  assert.deepEqual(rules("html`<dialog open><h2>Sure?</h2></dialog>`"), [
    "own-dialog",
  ]);
  assert.deepEqual(
    rules(
      'html`<web-dialog><div class="hax-ui-dialog-titlebar"></div></web-dialog>`',
    ),
    [],
  );
});

test("stripComments keeps strings and line numbers", () => {
  const out = stripComments('a // x\nb = "// not a comment";\n/* c\n d */e');
  assert.equal(out.split("\n").length, 4);
  assert.match(out, /"\/\/ not a comment"/);
  assert.doesNotMatch(out, /\bx\b/);
});

test("countFindings groups by rule and key", () => {
  assert.deepEqual(
    countFindings([
      { rule: "px-type", key: "13px" },
      { rule: "px-type", key: "13px" },
      { rule: "layer", key: "no HAX UI import" },
    ]),
    { "px-type": { "13px": 2 }, layer: { "no HAX UI import": 1 } },
  );
});

test("targets come from the admin contracts, not shared form-element ones", () => {
  const tags = adminContractTargets([
    {
      id: "contract-admin-dialog-frame",
      targetElements: ["b-dialog", "a-dialog"],
    },
    { id: "contract-admin-fieldset", targetElements: ["simple-fields"] },
    { id: "contract-site-menu", targetElements: ["site-menu"] },
  ]);
  assert.deepEqual(tags, ["a-dialog", "b-dialog"]);
});
