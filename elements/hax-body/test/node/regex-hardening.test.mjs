// Plain `node --test` suite (no browser needed):  yarn test:node
// Covers the string-cleaning helpers hax-store / hax-body / hax-app-search use.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  replaceLazyRun,
  replaceThroughGt,
  stripInlineStyleAttributes,
} from "../../../utils/lib/safe-html.js";

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}
function build(pieces, n, seed, sep = "") {
  const r = rng(seed);
  let out = "";
  for (let i = 0; i < n; i++)
    out += pieces[Math.floor(r() * pieces.length)] + sep;
  return out;
}
function timed(fn) {
  const t = performance.now();
  fn();
  return performance.now() - t;
}
const N = 300_000;
const LIMIT_MS = 4000;

// ---- hax-store: paste style stripping (was a js/redos alert) ---------------
const OLD_STYLE_RE = /(?:style="(\S+:\s*[^;"]+;\s*)*)+"/g;
const STYLE_PIECES = [
  'style="color: red;"',
  'style="font-size:12pt; margin:0;"',
  'style=""',
  'style="a:b;c:d;"',
  'style="  "',
  'style="width: 100%; "',
  "<span ",
  "<p ",
  ">",
  " ",
  "text",
  'class="x"',
  'style="background: url(x.png) no-repeat;"',
  'style="a: b: c;"',
  'style="color:red"',
  'style="x"',
];
test("stripInlineStyleAttributes matches the old regex on realistic style attributes", () => {
  for (let seed = 1; seed <= 600; seed++) {
    // attributes are whitespace separated in real markup (the old `\\S+` could
    // run across adjacent `style="..."style="..."` with no space between)
    const html = build(STYLE_PIECES, 12, seed, " ");
    assert.equal(
      stripInlineStyleAttributes(html),
      html.replace(OLD_STYLE_RE, ""),
      html,
    );
  }
});
test("stripInlineStyleAttributes: the old regex is exponential, the new one is linear", () => {
  // 30 declarations then a missing semicolon: old pattern needs 2^30 steps
  const evil = 'style="' + "a:b;".repeat(40) + "a:b";
  assert.ok(timed(() => stripInlineStyleAttributes(evil)) < 50);
  for (const h of [
    'style="'.repeat(N / 7),
    'style="' + "a:b;".repeat(N / 4),
    'style="' + "a:b: c;".repeat(N / 7) + "x",
    'style="' + ":;".repeat(N / 2),
    'style="a:' + " ".repeat(N),
  ]) {
    const ms = timed(() => stripInlineStyleAttributes(h));
    assert.ok(ms < LIMIT_MS, `took ${ms.toFixed(0)}ms`);
  }
});

// ---- hax-store / hax-body output clean up ----------------------------------
const ATTR_PIECES = [
  ' data-hax-ray="x"',
  ' data-hax-active="1"',
  '\tdata-hax-grid="a"',
  '\ndata-hax-layout=""',
  ' contenteditable="true"',
  ' t="12"',
  ' t="',
  "<p>",
  "</p>",
  '<span style="a:b">',
  '<STRONG style="c">',
  '<b style="x"',
  '<i style="y">',
  '<em style="z">',
  "text ",
  "\n",
  ' DATA-HAX-RAY="Q"',
  '<strike style="s">',
  '<span style="multi\nline">',
];
const OLD = {
  ray: (c) => c.replace(/ data-hax-ray="[^"]*"/gim, ""),
  active: (c) => c.replace(/ data-hax-active="[^"]*"/gim, ""),
  ce: (c) => c.replace(/ contenteditable="[^"]*"/gim, ""),
  t: (c) => c.replace(/ t="[^"]*"/gim, ""),
  span: (c) => c.replace(/<span style="(.*?)">/gim, "<span>"),
  strong: (c) => c.replace(/<strong style="(.*?)">/gim, "<strong>"),
  b: (c) => c.replace(/<b style="(.*?)">/gim, "<b>"),
  strike: (c) => c.replace(/<strike style="(.*?)">/gim, "<strike>"),
  em: (c) => c.replace(/<em style="(.*?)">/gim, "<em>"),
  i: (c) => c.replace(/<i style="(.*?)">/gim, "<i>"),
  // hax-body.js uses \s as the leading character
  bodyRay: (c) => c.replace(/\sdata-hax-ray="[^"]*"/gim, ""),
  bodyGrid: (c) => c.replace(/\sdata-hax-grid="[^"]*"/gim, ""),
  bodyT: (c) => c.replace(/\st="[^"]*"/gim, ""),
};
const NEW = {
  ray: (c) =>
    replaceLazyRun(c, [' data-hax-ray="', '"'], {
      ignoreCase: true,
      crossLines: true,
    }),
  active: (c) =>
    replaceLazyRun(c, [' data-hax-active="', '"'], {
      ignoreCase: true,
      crossLines: true,
    }),
  ce: (c) =>
    replaceLazyRun(c, [' contenteditable="', '"'], {
      ignoreCase: true,
      crossLines: true,
    }),
  t: (c) =>
    replaceLazyRun(c, [' t="', '"'], { ignoreCase: true, crossLines: true }),
  span: (c) =>
    replaceLazyRun(c, ['<span style="', '">'], {
      ignoreCase: true,
      replacement: "<span>",
    }),
  strong: (c) =>
    replaceLazyRun(c, ['<strong style="', '">'], {
      ignoreCase: true,
      replacement: "<strong>",
    }),
  b: (c) =>
    replaceLazyRun(c, ['<b style="', '">'], {
      ignoreCase: true,
      replacement: "<b>",
    }),
  strike: (c) =>
    replaceLazyRun(c, ['<strike style="', '">'], {
      ignoreCase: true,
      replacement: "<strike>",
    }),
  em: (c) =>
    replaceLazyRun(c, ['<em style="', '">'], {
      ignoreCase: true,
      replacement: "<em>",
    }),
  i: (c) =>
    replaceLazyRun(c, ['<i style="', '">'], {
      ignoreCase: true,
      replacement: "<i>",
    }),
  bodyRay: (c) =>
    replaceLazyRun(c, [/\sdata-hax-ray="/, '"'], {
      ignoreCase: true,
      crossLines: true,
    }),
  bodyGrid: (c) =>
    replaceLazyRun(c, [/\sdata-hax-grid="/, '"'], {
      ignoreCase: true,
      crossLines: true,
    }),
  bodyT: (c) =>
    replaceLazyRun(c, [/\st="/, '"'], { ignoreCase: true, crossLines: true }),
};
test("attribute / style strips match the old regexes", () => {
  for (let seed = 1; seed <= 400; seed++) {
    const html = build(ATTR_PIECES, 25, seed);
    for (const k of Object.keys(OLD)) {
      assert.equal(
        NEW[k](html),
        OLD[k](html),
        `${k} seed ${seed}: ${JSON.stringify(html)}`,
      );
    }
  }
});
test("attribute / style strips are linear on unterminated openers", () => {
  const openers = [
    ' data-hax-ray="',
    ' t="',
    '<span style="',
    '<i style="',
    '\tdata-hax-grid="',
  ];
  for (const o of openers) {
    const h = o.repeat(Math.floor(N / o.length));
    for (const k of Object.keys(NEW)) {
      const ms = timed(() => NEW[k](h));
      assert.ok(
        ms < LIMIT_MS,
        `${k} took ${ms.toFixed(0)}ms on ${JSON.stringify(o)}`,
      );
    }
  }
});

// ---- hax-app-search: strip tags from search result details -----------------
const OLD_TAGS = (s) => s.replace(/(<([^>]+)>)/gi, "");
const NEW_TAGS = (s) => replaceThroughGt(s, /<(?=[^>])/g, "");
test("tag stripping matches the old regex", () => {
  const P = [
    "<b>",
    "</b>",
    '<a href="x">',
    "<>",
    "<",
    ">",
    "text ",
    "<p\nclass=x>",
    "a<b",
    "<<>",
    "\n",
  ];
  for (let seed = 1; seed <= 500; seed++) {
    const s = build(P, 15, seed);
    assert.equal(NEW_TAGS(s), OLD_TAGS(s), JSON.stringify(s));
  }
  assert.ok(timed(() => NEW_TAGS("<a".repeat(N / 2))) < LIMIT_MS);
});
