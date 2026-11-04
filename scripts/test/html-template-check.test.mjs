// node --test scripts/test/*.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  findHtmlTemplates,
  checkHtmlTemplate,
} from "../lib/html-templates.mjs";

async function check(source) {
  const [t] = findHtmlTemplates(source);
  return checkHtmlTemplate(t);
}

test("a block element inside <p> is reported", async () => {
  const r = await check("html`<p><div>x</div></p>`");
  assert.match(r.message, /different tree/);
});

test("<x-el/> swallowing its siblings is reported", async () => {
  const r = await check('html`<simple-icon icon="x"/><span>y</span>`');
  assert.ok(r);
});

test("nested buttons are reported", async () => {
  assert.ok(await check("html`<button><button>x</button></button>`"));
});

test("a stray end tag is reported on its own line", async () => {
  const r = await check("const a = 1;\nhtml`<div>\n  <b>x</b>\n</span></div>`");
  assert.match(r.message, /stray <\/span>/);
  assert.equal(r.line, 4);
});

test("valid markup passes: tables, implied </li>, void and svg elements", async () => {
  assert.equal(
    await check(
      'html`<table><tr><td>${1}</td></tr></table><ul><li>a<li>b</ul><input .value=${1}><img src=${2} /><svg><path d="M0"/><g></g></svg>`',
    ),
    null,
  );
  assert.equal(await check('svg`<path d="${1}"/><circle r="2"/>`'), null);
});

test("an expression in an unquoted value is not read as a self-closing tag", async () => {
  assert.equal(
    await check("html`<a href=https://github.com/${login}><b>x</b></a>`"),
    null,
  );
});

test("only html and svg tags are checked", () => {
  assert.equal(findHtmlTemplates("css`:host{}`; other`<p><div>`").length, 0);
});
