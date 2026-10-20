// Plain `node --test` suite (no browser needed):  yarn test:node
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  encapScript,
  findTagsInHTML,
  normalizeTypography,
  stripMSWord,
} from "../../utils.js";
import { isSameOriginUploadedMarkup } from "../../lib/url.js";
import {
  replaceLazyRun,
  stripHtmlComments,
  unwrapSpans,
} from "../../lib/safe-html.js";
import { detectMarkdown } from "../../lib/markdown.js";
import {
  detectMarkdownOld,
  encapScriptOld,
  findTagsInHTMLOld,
  stripMSWordOld,
} from "./reference-regex-impl.js";

// deterministic PRNG so failures reproduce
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}
function build(pieces, n, seed) {
  const r = rng(seed);
  let out = "";
  for (let i = 0; i < n; i++) out += pieces[Math.floor(r() * pieces.length)];
  return out;
}

const WORDISH = [
  "<p>",
  "</p>",
  '<p style="margin-top:0pt;line-height:1.2">',
  "<ul style='x'>",
  '<li style="a">',
  "</li>",
  '<span style="font-weight:normal;">',
  "</span>",
  "<span>",
  "<b>",
  "</b>",
  "text ",
  "hello world ",
  " align=center ",
  " start='3'",
  "<!-- c -->",
  "<!--[if gte mso 9]>x<![endif]-->",
  "<!DOCTYPE html>",
  "<meta charset=x>",
  "<style>p{x}</style>",
  '<style type="text/css">a{}</style>',
  "<script>x</script>",
  "<o:p></o:p>",
  " class=MsoNormal",
  ' id="a"',
  " margin-left:0;",
  "line-height:1.5;",
  'line-height:2"',
  "text-decoration:none;",
  "<br />",
  "&nbsp;",
  "\n",
  "\r\n",
  '<td style="a">',
  '<tr style="b">',
  '<ol style="c">',
  "<noscript>x</noscript>",
  "<embed src=x>",
  "<applet>x</applet>",
  '<a href="x">',
  "</a>",
  "<p> </p>",
  "<style></style>",
];
const SCRIPTY = [
  "<script>",
  '<script type="module">',
  "</script>",
  "<SCRIPT>",
  "</SCRIPT>",
  "<style>",
  "</style>",
  "<STYLE media=x>",
  "<template>",
  "</template>",
  "<template id=a>",
  "<hax-body>",
  "</hax-body>",
  "<hax-tray x>",
  "</hax-store>",
  "<h-a-x>",
  "</h-a-x>",
  "</h-a->",
  "<div>",
  "</div>",
  "text",
  " ",
  "\n",
  "alert(1);",
  '<my-el a="b">',
  "</my-el>",
  "<p>",
  ">",
  "<",
  "&lt;",
  "&gt;",
];

test("encapScript matches the old regex chain on random script/style/template soup", () => {
  // `</script >`-style closers are deliberately handled more strictly (see below)
  for (let seed = 1; seed <= 400; seed++) {
    const html = build(SCRIPTY, 40, seed);
    assert.equal(
      encapScript(html),
      encapScriptOld(html),
      `seed ${seed}: ${html}`,
    );
  }
});

test("encapScript: template special case round-trips like before", () => {
  const html =
    "<template><script>alert(1)</script><style>a{}</style></template><script>x</script>";
  assert.equal(encapScript(html), encapScriptOld(html));
  assert.ok(encapScript(html).includes("<template><script>"));
});

test("encapScript neutralises browser-tolerated closers like </script > and </script foo>", () => {
  for (const closer of [
    "</script >",
    "</script\n>",
    "</script foo=1>",
    "</SCRIPT >",
  ]) {
    const out = encapScript(`<script>alert(1)${closer}after`);
    assert.ok(!/<\/script/i.test(out), `${JSON.stringify(closer)} -> ${out}`);
    assert.ok(!/<script/i.test(out));
  }
  for (const closer of ["</style >", "</style foo>"]) {
    assert.ok(!/<\/style/i.test(encapScript(`<style>a{}${closer}`)));
  }
});

test("encapScript leaves non-strings alone", () => {
  assert.equal(encapScript(null), null);
  assert.equal(encapScript(undefined), undefined);
  assert.equal(encapScript(""), "");
});

test("findTagsInHTML matches the old implementation", () => {
  const html =
    "<a-b>x</a-b> </my-el> </x-y-z> </a b-c> </a-b c> </A-b> </a1,2-b> </-x> </x-> </no>";
  assert.deepEqual(findTagsInHTML(html), findTagsInHTMLOld(html));
  for (let seed = 1; seed <= 200; seed++) {
    const h = build(
      SCRIPTY.concat(["</a-b>", "</x-y>", "-", "</", "a1,", "\t"]),
      30,
      seed,
    );
    assert.deepEqual(findTagsInHTML(h), findTagsInHTMLOld(h), h);
  }
  assert.deepEqual(findTagsInHTML("no tags"), {});
});

test("stripMSWord matches the old implementation on Word/Docs-like soup", () => {
  for (let seed = 1; seed <= 400; seed++) {
    const html = build(WORDISH, 40, seed);
    assert.equal(
      stripMSWord(html),
      stripMSWordOld(html),
      `seed ${seed}: ${html}`,
    );
  }
  const real =
    '<p style="margin-top:0pt; line-height:1.38;"><span style="font-weight:normal;">Hi <b>there</b></span></p><!-- c --><ul style="x"><li style="y">a</li></ul>';
  assert.equal(stripMSWord(real), stripMSWordOld(real));
});

test("stripMSWord comment handling: --!> ends a comment like browsers do", () => {
  assert.equal(stripMSWord("a<!-- x --!>b"), "ab");
  assert.equal(stripMSWord("a<!-- x -->b"), "ab");
  assert.equal(stripMSWord("a<!<!-- x -->-- y -->b"), "ab");
  // unterminated comment opener is left untouched (same as before)
  assert.equal(stripHtmlComments("a<!-- never closed"), "a<!-- never closed");
});

test("replaceLazyRun / unwrapSpans edge cases", () => {
  assert.equal(replaceLazyRun("a align=x b c", [" align=", " "]), "ab c");
  // `.` never crosses a line terminator
  assert.equal(
    replaceLazyRun("a align=x\nb ", [" align=", " "]),
    "a align=x\nb ",
  );
  assert.equal(
    replaceLazyRun("<STYLE>x</Style>y", ["<style", "style", ">"], {
      ignoreCase: true,
    }),
    "y",
  );
  assert.equal(unwrapSpans("<span a>x</span>y<span>z"), "xy<span>z");
  assert.equal(
    unwrapSpans("<span a><span b>x</span></span>"),
    "<span b>x</span>",
  );
});

// ---- linear-time regression ------------------------------------------------
// With the old regexes each of these takes minutes (quadratic/cubic); the linear
// versions finish in well under a second. Generous bound to avoid CI flakiness.
const N = 300_000;
const LIMIT_MS = 4000;
function timed(fn) {
  const t = performance.now();
  fn();
  return performance.now() - t;
}
const hostile = {
  "<script": "<script ".repeat(N / 8),
  "<style": "<style ".repeat(N / 8),
  "<hax-body": "<hax-body ".repeat(N / 10),
  "<template": "<template ".repeat(N / 10),
  "<template + &lt;script": "<template>&lt;script ".repeat(N / 22),
  "<template + &lt;script&gt;": "<template>&lt;script&gt;".repeat(N / 24),
  "<!--": "<!-- ".repeat(N / 5),
  "<span": "<span ".repeat(N / 6),
  " align=": " align=x".repeat(N / 8),
  "<p style=": '<p style="'.repeat(N / 10),
  "margin-": "margin-:".repeat(N / 8),
  "line-height:": "line-height:".repeat(N / 12),
  "</a": "</a".repeat(N / 3),
  "</a-</a-": "</a-".repeat(N / 4),
  "<!": "<! ".repeat(N / 3),
  "<meta": "<meta ".repeat(N / 6),
  "<li><p": "<li><p ".repeat(N / 7),
  " data-": ' data-x="'.repeat(N / 9),
  " id=": ' id="'.repeat(N / 5),
  " style='": " style='".repeat(N / 8),
  " start='": " start='".repeat(N / 8),
  "</a-": "</a-b ".repeat(N / 6),
};
for (const [name, input] of Object.entries(hostile)) {
  test(`linear time: ${name}`, () => {
    for (const fn of [encapScript, findTagsInHTML, stripMSWord]) {
      const ms = timed(() => fn(input));
      assert.ok(ms < LIMIT_MS, `${fn.name} took ${ms.toFixed(0)}ms on ${name}`);
    }
  });
}

// ---- lib/markdown.js detectMarkdown ---------------------------------------
const MD_LINES = [
  "# Title",
  "## Sub heading",
  "###### six",
  "####### seven",
  "#nospace",
  "Plain paragraph text.",
  "- item one",
  "* item two",
  "+ item three",
  "1. first",
  "22. second",
  "   - nested",
  "**bold** word",
  "some *italic* word",
  "a [link](http://x.y) here",
  "![alt](img.png)",
  "![](img.png)",
  "[empty]()",
  "[only text]",
  "`inline code`",
  "    indented code",
  "\tx",
  "> quote",
  ">nospace",
  "---",
  "***",
  "___",
  "  ---  ",
  "-- not rule",
  "| a | b | c |",
  "|a|b|",
  "| only | one",
  "||",
  "```js",
  "```",
  "x = 1; ```",
  "",
  "   ",
  "text with ] and ( and ) only",
  "<p>html</p>",
  "<div># inside tag</div>",
];
test("detectMarkdown matches the old regex implementation on line-oriented docs", () => {
  for (let seed = 1; seed <= 1500; seed++) {
    const r = rng(seed);
    const n = 1 + Math.floor(r() * 6);
    const lines = [];
    for (let i = 0; i < n; i++)
      lines.push(MD_LINES[Math.floor(r() * MD_LINES.length)]);
    const doc = lines.join(r() < 0.2 ? "\r\n" : "\n");
    assert.equal(
      detectMarkdown(doc),
      detectMarkdownOld(doc),
      JSON.stringify(doc),
    );
  }
});
test("detectMarkdown works with CRLF line endings", () => {
  assert.equal(detectMarkdown("# Title\r\n\r\ntext"), true);
  assert.equal(detectMarkdown("intro\r\n\r\n    code line\r\n- item"), true);
  assert.equal(detectMarkdown("just some words\r\nand more words"), false);
});
test("detectMarkdown handles non-strings like before", () => {
  for (const v of ["", null, undefined, 123, {}]) {
    assert.equal(detectMarkdown(v), false);
  }
});
test("detectMarkdown is linear on hostile input", () => {
  const hostile = [
    "[".repeat(N / 2),
    "![".repeat(N / 2),
    "```\n".repeat(N / 4),
    "|".repeat(N),
    "\n".repeat(N),
    " ".repeat(N) + "x",
    ("#" + " ".repeat(8)).repeat(N / 10),
    "- ".repeat(N / 2),
    "1. ".repeat(N / 3),
    ("\n" + " ".repeat(3)).repeat(N / 4),
    "*".repeat(N),
    "[a](".repeat(N / 4),
    "<".repeat(N),
    "`".repeat(N),
  ];
  for (const h of hostile) {
    const ms = timed(() => detectMarkdown(h));
    assert.ok(
      ms < LIMIT_MS,
      `detectMarkdown took ${ms.toFixed(0)}ms on ${h.slice(0, 12)}...`,
    );
  }
});

// ---- normalizeTypography / isSameOriginUploadedMarkup -----------------------
const OLD_TYPO = (html) =>
  html.replace(
    /<[^>]*>|[\u2018\u2019\u201A\u201B\u201C\u201D\u201E\u201F]/g,
    (m) => {
      if (m.charAt(0) === "<") return m;
      return "\u201C\u201D\u201E\u201F".includes(m) ? '"' : "'";
    },
  );
test("normalizeTypography matches the old regex (tags kept, text quotes straightened)", () => {
  const P = [
    "\u201Chi\u201D",
    "\u2018x\u2019",
    '<a href="x">',
    "</a>",
    '<img alt="a \u201Cfancy\u201D image">',
    "text ",
    "<",
    ">",
    "<p",
    "a > b",
    "<<",
    "\n",
    "\u201E",
    "\u201B",
  ];
  for (let seed = 1; seed <= 600; seed++) {
    const h = build(P, 14, seed);
    assert.equal(normalizeTypography(h), OLD_TYPO(h), JSON.stringify(h));
  }
  assert.equal(normalizeTypography(""), "");
  assert.equal(normalizeTypography(null), null);
});
test("normalizeTypography is linear on '<' without '>'", () => {
  const ms = timed(() => normalizeTypography("<a ".repeat(N / 3)));
  assert.ok(ms < LIMIT_MS, `took ${ms.toFixed(0)}ms`);
  assert.ok(
    timed(() => normalizeTypography("<\u201C".repeat(N / 2))) < LIMIT_MS,
  );
});
test("isSameOriginUploadedMarkup matches the old regex", () => {
  globalThis.location = new URL("https://example.edu/site/page");
  const old = (v) => {
    try {
      const u = new URL(v, globalThis.location.href);
      return (
        u.origin === globalThis.location.origin &&
        /\/files\/.*\.(x?html?|xml)$/i.test(u.pathname)
      );
    } catch {
      return false;
    }
  };
  for (const v of [
    "/files/a.html",
    "files/a.html",
    "/site/files/x/y.XML",
    "/files/.html",
    "/files/a.htm?x=1",
    "/FILES/a.xhtml",
    "/files/a.txt",
    "/other/a.html",
    "https://evil.test/files/a.html",
    "/files/a/files/b.html",
    "/files/",
    "/files/a.html/b",
    "",
    null,
    "/a/files/b.png/c.xml",
  ]) {
    assert.equal(isSameOriginUploadedMarkup(v), old(v), String(v));
  }
  assert.ok(
    timed(() =>
      isSameOriginUploadedMarkup("/files/" + "/files/".repeat(N / 7)),
    ) < LIMIT_MS,
  );
  delete globalThis.location;
});
