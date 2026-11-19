// Tests for scripts/eslint-rules/html-sinks.mjs.
// Run: node --test scripts/test/eslint-html-sinks.test.mjs (yarn test:scripts)
import { test } from "node:test";
import { RuleTester } from "eslint";
import plugin from "../eslint-rules/html-sinks.mjs";

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

const rule = plugin.rules["unsanitized-html-sink"];
const error = { messageId: "sink" };

test("unsanitized-html-sink", () => {
  tester.run("unsanitized-html-sink", rule, {
    valid: [
      `el.innerHTML = "";`,
      `el.innerHTML = "<b>fixed</b>";`,
      "el.innerHTML = `<b>fixed</b>`;",
      `el.innerHTML = sanitizeHTMLString(this.label);`,
      `el.innerHTML = this.ok ? sanitizeHTMLString(this.label) : "";`,
      `el.innerHTML = sanitizeHTMLString(a) || "";`,
      `el.textContent = this.label;`,
      `el.insertAdjacentHTML("beforeend", "<hr>");`,
      `el.insertAdjacentHTML("beforeend", sanitizeHTMLString(x));`,
      `range.createContextualFragment(sanitizeHTMLString(x));`,
      `unsafeHTML(sanitizeHTMLString(this.body));`,
      "html`<div .innerHTML=\"${sanitizeHTMLString(this.mood)}\"></div>`;",
      "html`<div title=\"${this.mood}\">${this.mood}</div>`;",
      "css`.innerHTML=${x}`;",
      `el.value = x;`,
    ],
    invalid: [
      { code: `el.innerHTML = this.label;`, errors: [error] },
      { code: `el.outerHTML = data;`, errors: [error] },
      { code: `el.innerHTML += item;`, errors: [error] },
      { code: "el.innerHTML = `<b>${this.label}</b>`;", errors: [error] },
      { code: `el.innerHTML = this.ok ? this.label : "";`, errors: [error] },
      { code: `el.insertAdjacentHTML("beforeend", x);`, errors: [error] },
      { code: `range.createContextualFragment(x);`, errors: [error] },
      { code: `document.write(x);`, errors: [error] },
      { code: `unsafeHTML(this.body);`, errors: [error] },
      { code: "html`<div .innerHTML=\"${this.mood}\"></div>`;", errors: [error] },
      { code: "html`<div .innerHTML=${this.mood}></div>`;", errors: [error] },
    ],
  });
});
