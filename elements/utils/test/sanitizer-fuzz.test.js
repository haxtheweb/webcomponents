/**
 * Property-based (fuzz) tests for the shared sanitizers every HAX element
 * relies on. fast-check generates thousands of hostile HTML / URL inputs and
 * shrinks any failure to a minimal reproduction, so a regression in
 * sanitizeHTMLString / sanitizeHTMLForImport / urlHostMatches shows up as a
 * small, readable counterexample instead of a silent XSS.
 */
import { expect } from "@open-wc/testing";
import fc from "fast-check";
import {
  sanitizeHTMLString,
  sanitizeHTMLForImport,
  isEventHandlerAttribute,
  isURLAttribute,
  badContentElements,
} from "../utils.js";
import { hasUnsafeURLProtocol, urlHostMatches } from "../lib/url.js";
import { fuzzConfig } from "../../../scripts/test-setup/fuzz-config.mjs";

// fixed seed so CI failures reproduce. `yarn test:fuzz` at the monorepo root
// hunts on a random seed; HAX_FUZZ_SEED=<seed> HAX_FUZZ_PATH=<path> yarn test
// replays a reported failure (haxtheweb/issues#3272)
const RUNS = fuzzConfig({ defaultSeed: 20261102, defaultRuns: 400 });

// ---- hostile HTML soup -----------------------------------------------------

const TAGS = [
  "div",
  "p",
  "span",
  "a",
  "img",
  "svg",
  "math",
  "iframe",
  "video",
  "form",
  "button",
  "template",
  "script",
  "SCRIPT",
  "base",
  "meta",
  "object",
  "use",
  "animate",
  "set",
  "details",
  "body",
];
const ATTRS = [
  "onerror",
  "onclick",
  "ONLOAD",
  "onmouseover",
  "onfocus",
  "ontoggle",
  "onbegin",
  "href",
  "HREF",
  "src",
  "xlink:href",
  "action",
  "formaction",
  "poster",
  "data",
  "srcset",
  "link-url",
  "attributeName",
  "class",
  "id",
  "open",
  "autofocus",
];
const VALUES = [
  "javascript:alert(1)",
  "JaVaScRiPt:alert(1)",
  " javascript:alert(1)",
  "java\tscript:alert(1)",
  "java\nscript:alert(1)",
  "\u0000javascript:alert(1)",
  "&#106;avascript:alert(1)",
  "vbscript:msgbox(1)",
  "data:text/html,<script>alert(1)</script>",
  "alert(1)",
  "https://example.com/ok",
  "/relative/path",
  "href",
  "",
];
const RAW = [
  "<",
  ">",
  "/>",
  "</",
  '"',
  "'",
  "=",
  " ",
  "<!--",
  "-->",
  "--!>",
  "<![CDATA[",
  "]]>",
  "text",
  "&lt;",
  "&#x3c;",
];

const tagName = fc.constantFrom(...TAGS);
const attribute = fc
  .tuple(
    fc.constantFrom(...ATTRS),
    fc.constantFrom(...VALUES),
    fc.constantFrom('"', "'", ""),
  )
  .map(([n, v, q]) => ` ${n}=${q}${v}${q}`);
const openTag = fc
  .tuple(tagName, fc.array(attribute, { maxLength: 3 }))
  .map(([t, a]) => `<${t}${a.join("")}>`);
const closeTag = tagName.map((t) => `</${t}>`);
const piece = fc.oneof(
  { weight: 4, arbitrary: openTag },
  { weight: 2, arbitrary: closeTag },
  { weight: 2, arbitrary: fc.constantFrom(...RAW) },
  { weight: 1, arbitrary: fc.constantFrom(...VALUES) },
  { weight: 1, arbitrary: fc.string({ maxLength: 6 }) },
);
const hostileHTML = fc
  .array(piece, { minLength: 1, maxLength: 24 })
  .map((p) => p.join(""));

/**
 * every element in a parsed tree, descending into <template> content;
 * each entry records whether it sits inside a <template>
 */
function allElements(root) {
  const out = [];
  const walk = (node, inTemplate) => {
    const kids = node.querySelectorAll ? node.querySelectorAll("*") : [];
    for (let i = 0; i < kids.length; i++) {
      out.push({ el: kids[i], inTemplate: inTemplate });
      if (kids[i].content) {
        walk(kids[i].content, true);
      }
    }
  };
  walk(root, false);
  return out;
}

/** list the unsafe things still present after sanitizing */
function unsafeLeftovers(root) {
  const problems = [];
  for (const { el, inTemplate } of allElements(root)) {
    const tag = el.tagName.toLowerCase();
    // by design, encapsulateScriptsAndStyles restores <script> inside a
    // <template> (code-sample keeps example code there as inert text), so
    // only scripts outside a template are a failure here
    if (tag === "script" && !inTemplate) {
      problems.push("script element");
    }
    if (badContentElements.includes(tag)) {
      problems.push(`${tag} element`);
    }
    for (let i = 0; i < el.attributes.length; i++) {
      const { name, value } = el.attributes[i];
      if (isEventHandlerAttribute(name)) {
        problems.push(`${tag}[${name}]`);
      }
      if (isURLAttribute(name) && hasUnsafeURLProtocol(value)) {
        problems.push(`${tag}[${name}=${value}]`);
      }
    }
  }
  return problems;
}

function parse(html) {
  const t = globalThis.document.createElement("template");
  t.innerHTML = html;
  return t.content;
}

describe("sanitizer fuzzing (fast-check)", () => {
  it("sanitizeHTMLString output never keeps scripts, handlers or unsafe URLs", () => {
    fc.assert(
      fc.property(hostileHTML, (html) => {
        const leftovers = unsafeLeftovers(parse(sanitizeHTMLString(html)));
        expect(leftovers, `input: ${JSON.stringify(html)}`).to.deep.equal([]);
      }),
      RUNS,
    );
  });

  it("sanitizeHTMLForImport fragments never keep scripts, handlers or unsafe URLs", () => {
    fc.assert(
      fc.property(hostileHTML, (html) => {
        const leftovers = unsafeLeftovers(sanitizeHTMLForImport(html));
        expect(leftovers, `input: ${JSON.stringify(html)}`).to.deep.equal([]);
      }),
      RUNS,
    );
  });

  it("re-parsing sanitized output stays safe (no mutation-XSS round trip)", () => {
    fc.assert(
      fc.property(hostileHTML, (html) => {
        // serialize -> parse again: catches markup that only becomes
        // dangerous after the browser re-parses the sanitized string
        const once = sanitizeHTMLString(html);
        const t = globalThis.document.createElement("template");
        t.innerHTML = once;
        const leftovers = unsafeLeftovers(parse(t.innerHTML));
        expect(leftovers, `input: ${JSON.stringify(html)}`).to.deep.equal([]);
      }),
      RUNS,
    );
  });

  it("a <template> elsewhere in the input never re-enables a stray <script>", () => {
    // regression: the string-level template exception used to restore
    // scripts that the browser parses outside any template
    fc.assert(
      fc.property(
        fc.constantFrom(
          "<template></template>",
          "<template><b></b></template>",
          "<!--<template>-->",
          '<p title="<template>"></p>',
        ),
        hostileHTML,
        (prefix, html) => {
          const input = prefix + "<script>alert(1)</script>" + html;
          const out = parse(sanitizeHTMLString(input));
          const stray = allElements(out).filter(
            (e) => e.el.tagName.toLowerCase() === "script" && !e.inTemplate,
          );
          expect(stray, `input: ${JSON.stringify(input)}`).to.deep.equal([]);
        },
      ),
      RUNS,
    );
  });

  it("scripts inside a real <template> are kept as authored (code-sample)", () => {
    const out = parse(
      sanitizeHTMLString(
        '<template><script>console.log("example")</script></template>',
      ),
    );
    const tpl = out.querySelector("template");
    expect(tpl.content.querySelector("script").textContent).to.equal(
      'console.log("example")',
    );
  });

  it("sanitizeHTMLString accepts any input type without throwing", () => {
    fc.assert(
      fc.property(fc.anything(), (value) => {
        expect(sanitizeHTMLString(value)).to.be.a("string");
      }),
      RUNS,
    );
  });
});

// ---- host matching ---------------------------------------------------------

const DOMAINS = [
  "youtube.com",
  "youtu.be",
  "vimeo.com",
  "discord.com",
  "twitch.tv",
  "mediaspace.kaltura.com",
];
const domain = fc.constantFrom(...DOMAINS);
const label = fc.stringMatching(/^[a-z0-9]{1,12}$/);
const path = fc.stringMatching(/^[a-z0-9/._-]{0,16}$/);

describe("urlHostMatches fuzzing (fast-check)", () => {
  it("accepts the domain and any subdomain of it", () => {
    fc.assert(
      fc.property(domain, label, path, (d, sub, p) => {
        expect(urlHostMatches(`https://${d}/${p}`, [d])).to.equal(true);
        expect(urlHostMatches(`https://${sub}.${d}/${p}`, [d])).to.equal(true);
        expect(urlHostMatches(`//${sub}.${d}/${p}`, [d])).to.equal(true);
      }),
      RUNS,
    );
  });

  it("rejects the domain smuggled into path, query, userinfo or a lookalike host", () => {
    fc.assert(
      fc.property(domain, label, path, (d, evil, p) => {
        const host = `${evil}.attacker.test`;
        expect(urlHostMatches(`https://${host}/?u=${d}`, [d])).to.equal(false);
        expect(urlHostMatches(`https://${host}/${d}/${p}`, [d])).to.equal(
          false,
        );
        expect(urlHostMatches(`https://${d}.${host}/${p}`, [d])).to.equal(
          false,
        );
        expect(urlHostMatches(`https://${d}@${host}/${p}`, [d])).to.equal(
          false,
        );
        // "x" + "vimeo.com" is a different registrable name, not a subdomain
        expect(urlHostMatches(`https://${evil}${d}/${p}`, [d])).to.equal(false);
      }),
      RUNS,
    );
  });

  it("never matches non-http(s) schemes", () => {
    fc.assert(
      fc.property(
        domain,
        fc.constantFrom("javascript:", "data:", "vbscript:", "file:", "ftp:"),
        path,
        (d, scheme, p) => {
          expect(
            urlHostMatches(`${scheme}//${d}/${p}`, [d], {
              allowSchemeless: true,
            }),
          ).to.equal(false);
        },
      ),
      RUNS,
    );
  });

  it("never throws on arbitrary input", () => {
    fc.assert(
      fc.property(fc.anything(), fc.array(fc.string()), (value, ds) => {
        expect(urlHostMatches(value, ds)).to.be.a("boolean");
      }),
      RUNS,
    );
  });
});
