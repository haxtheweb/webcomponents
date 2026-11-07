// Tests for scripts/eslint-rules/leak-patterns.mjs (haxtheweb/issues#3246).
// Run: node --test scripts/test/eslint-leak-patterns.test.mjs (yarn test:scripts)
import { test } from "node:test";
import { RuleTester } from "eslint";
import plugin from "../eslint-rules/leak-patterns.mjs";

const tester = new RuleTester({
  languageOptions: { ecmaVersion: "latest", sourceType: "module" },
});

// Without mocha-style globals, RuleTester.run asserts synchronously and
// throws on the first mismatch, so each run sits inside one node:test test.
RuleTester.describe = function (name, fn) {
  fn();
};
RuleTester.it = function (name, fn) {
  fn();
};

test("autorun-in-constructor", () => {
  tester.run("autorun-in-constructor", plugin.rules["autorun-in-constructor"], {
    valid: [
      `class A extends HTMLElement {
      connectedCallback() { this.__d = [autorun(() => {}), reaction(() => 1, () => {})]; }
    }`,
      `function setup() { autorun(() => {}); }`,
      `class A { constructor() { this.run = () => null; } }`,
    ],
    invalid: [
      {
        code: `class A extends HTMLElement { constructor() { super(); autorun((r) => { this.x = 1; }); } }`,
        errors: [{ messageId: "constructor", data: { name: "autorun" } }],
      },
      {
        code: `class A { constructor() { this.__disposer = []; this.__disposer.push(mobx.reaction(() => 1, () => {})); } }`,
        errors: [{ messageId: "constructor", data: { name: "reaction" } }],
      },
      {
        // deferred, but still created once per construction
        code: `class A { constructor() { setTimeout(() => { autorun(() => {}); }, 0); } }`,
        errors: [{ messageId: "constructor" }],
      },
    ],
  });
});

test("disposer-without-disconnect", () => {
  tester.run(
    "disposer-without-disconnect",
    plugin.rules["disposer-without-disconnect"],
    {
      valid: [
        `class A {
        connectedCallback() { this.__disposer.push(autorun(() => {})); }
        disconnectedCallback() { for (const d of this.__disposer) d.dispose(); }
      }`,
        `class A { connectedCallback() { this.items.push(1); } }`,
      ],
      invalid: [
        {
          code: `class Leaky { connectedCallback() { this.__disposer.push(autorun(() => {})); } }`,
          errors: [{ messageId: "missing", data: { name: "Leaky" } }],
        },
        {
          // a disconnectedCallback that never touches the disposers
          code: `class Leaky {
          connectedCallback() { this.__disposer.push(autorun(() => {})); }
          disconnectedCallback() { super.disconnectedCallback(); }
        }`,
          errors: [{ messageId: "missing" }],
        },
      ],
    },
  );
});

test("responsive-element-unregister", () => {
  tester.run(
    "responsive-element-unregister",
    plugin.rules["responsive-element-unregister"],
    {
      valid: [
        `class A {
        connectedCallback() { registerResponsiveElement(this, {}); }
        disconnectedCallback() { unregisterResponsiveElement(this); }
      }`,
        `class A { connectedCallback() { this.dispatchEvent(new CustomEvent("other-event")); } }`,
      ],
      invalid: [
        {
          code: `class Grid {
          connectedCallback() {
            globalThis.dispatchEvent(new CustomEvent("responsive-element", { detail: { element: this } }));
          }
        }`,
          errors: [{ messageId: "missing", data: { name: "Grid" } }],
        },
        {
          code: `class Grid {
          connectedCallback() { registerResponsiveElement(this, {}); }
          disconnectedCallback() {}
        }`,
          errors: [{ messageId: "missing" }],
        },
      ],
    },
  );
});

test("live-document-parse", () => {
  tester.run("live-document-parse", plugin.rules["live-document-parse"], {
    valid: [
      // inert document
      `const doc = document.implementation.createHTMLDocument("");
     const div = doc.createElement("div"); div.innerHTML = html; read(div.innerHTML);`,
      // template parses into an inert fragment
      `const t = document.createElement("template"); t.innerHTML = html; read(t.innerHTML);`,
      // the element is inserted, so parsing in the live document is the point
      `const div = globalThis.document.createElement("div"); div.innerHTML = html; host.appendChild(div);`,
      // passed somewhere unknown: not reported
      `const div = document.createElement("div"); div.innerHTML = html; consume(div);`,
      `const range = doc.createRange(); range.createContextualFragment(html);`,
    ],
    invalid: [
      {
        code: `function f(html) {
        const div = globalThis.document.createElement("div");
        div.innerHTML = html;
        return div.innerHTML;
      }`,
        errors: [{ messageId: "scratch", data: { name: "div" } }],
      },
      {
        code: `const wrap = document.createElement("div"); wrap.innerHTML = s; const n = wrap.querySelectorAll("p").length; wrap.remove();`,
        errors: [{ messageId: "scratch" }],
      },
      {
        code: `const frag = globalThis.document.createRange().createContextualFragment(html);`,
        errors: [{ messageId: "fragment" }],
      },
    ],
  });
});
