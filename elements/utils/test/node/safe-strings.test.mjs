// Plain `node --test` suite: differential + linear-time tests for the string
// helpers that replaced polynomial regexes (trim/strip/extract helpers).
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  trimChars,
  trimTrailingSlashes,
  trimSlashes,
  removeThroughLast,
  replaceThrough,
  removeTagsWithSpace,
  extractBodyContents,
  looksLikeEmail,
  collapseFirstIndentRun,
  extractFilesAttrPaths,
  findTagAttrValue,
} from "../../lib/safe-html.js";

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
function fuzz(pieces, fn, runs = 3000) {
  for (let i = 0; i < runs; i++) {
    const input = build(pieces, 1 + (i % 14), i + 1);
    fn(input);
  }
}
const N = 300_000;
const LIMIT_MS = 3000;
function timed(fn) {
  const t = performance.now();
  fn();
  return performance.now() - t;
}

// ---- trims ---------------------------------------------------------------
test("trimTrailingSlashes / trimSlashes match the regexes", () => {
  fuzz(["/", "a", "//", " ", "\n", "b/c"], (s) => {
    assert.equal(
      trimTrailingSlashes(s),
      s.replace(/\/+$/, ""),
      JSON.stringify(s),
    );
    assert.equal(
      trimSlashes(s),
      s.replace(/^\/+|\/+$/g, ""),
      JSON.stringify(s),
    );
    assert.equal(trimSlashes(s), s.replace(/^\/+/, "").replace(/\/+$/, ""));
  });
});
test("trimChars matches /^[-_]+|[-_]+$/g and /^-+/ /-+$/", () => {
  fuzz(["-", "_", "a", "--", "-_", " ", "b-c"], (s) => {
    assert.equal(trimChars(s, "-_"), s.replace(/^[-_]+|[-_]+$/g, ""));
    assert.equal(trimChars(s, "-"), s.replace(/^-+/, "").replace(/-+$/, ""));
    assert.equal(trimChars(s, '"'), s.replace(/(^"+|"+$)/g, ""));
  });
});
test("trim helpers are linear", () => {
  for (const s of [
    "/".repeat(N) + "x",
    "x" + "/".repeat(N) + "x",
    "-_".repeat(N / 2) + "x" + "-_".repeat(N / 2),
    "a/".repeat(N / 2),
  ]) {
    assert.ok(timed(() => trimTrailingSlashes(s)) < LIMIT_MS);
    assert.ok(timed(() => trimSlashes(s)) < LIMIT_MS);
    assert.ok(timed(() => trimChars(s, "-_")) < LIMIT_MS);
  }
});

// ---- removeThroughLast ----------------------------------------------------
test("removeThroughLast matches /.*\\//g, /.*\\./g and /.*\\/embed\\//", () => {
  fuzz(
    ["/", "a", ".", "\n", "\r\n", "/embed/", "embed", "x/y", "\u2028", "b."],
    (s) => {
      assert.equal(
        removeThroughLast(s, "/"),
        s.replace(/.*\//g, ""),
        JSON.stringify(s),
      );
      assert.equal(
        removeThroughLast(s, "."),
        s.replace(/.*\./g, ""),
        JSON.stringify(s),
      );
      assert.equal(
        removeThroughLast(s, "/embed/", { all: false }),
        s.replace(/.*\/embed\//, ""),
        JSON.stringify(s),
      );
    },
  );
});
test("removeThroughLast is linear", () => {
  for (const s of ["a".repeat(N), "a.".repeat(N / 2), "/embed".repeat(N / 6)]) {
    assert.ok(timed(() => removeThroughLast(s, "/")) < LIMIT_MS);
    assert.ok(timed(() => removeThroughLast(s, ".")) < LIMIT_MS);
    assert.ok(
      timed(() => removeThroughLast(s, "/embed/", { all: false })) < LIMIT_MS,
    );
  }
});

// ---- replaceThrough / removeTagsWithSpace -------------------------------
test("replaceThrough matches /sepia\\([^)]*\\)/g and simple-search tags", () => {
  fuzz(
    [
      "sepia(",
      ")",
      "a",
      " ",
      "\n",
      "sepia(1)",
      "<simple-search-match>",
      "</simple-search-match",
      ">",
      "<b>",
    ],
    (s) => {
      assert.equal(
        replaceThrough(s, /sepia\(/g, ")", ""),
        s.replace(/sepia\([^)]*\)/g, ""),
        JSON.stringify(s),
      );
      assert.equal(
        replaceThrough(s, /<\/?simple-search-match/g, ">", ""),
        s.replace(/<\/?simple-search-match[^>]*>/g, ""),
        JSON.stringify(s),
      );
    },
  );
});
test("removeTagsWithSpace matches /\\s*<\\/?template[^>]*>\\s*/g", () => {
  fuzz(
    [
      "<template",
      "</template",
      "<iframe",
      "</iframe",
      ">",
      " ",
      "\n",
      "\t",
      "a",
      " x=1",
      "<b>",
      " ",
    ],
    (s) => {
      assert.equal(
        removeTagsWithSpace(s, /<\/?template/g),
        s.replace(/\s*<\/?template[^>]*>\s*/g, ""),
        JSON.stringify(s),
      );
      assert.equal(
        removeTagsWithSpace(s, /<\/?iframe/g),
        s.replace(/\s*<\/?iframe[^>]*>\s*/g, ""),
        JSON.stringify(s),
      );
    },
  );
});
test("replaceThrough / removeTagsWithSpace are linear", () => {
  for (const s of [
    "sepia(".repeat(N / 6),
    "<template ".repeat(N / 10),
    " ".repeat(N) + "<template",
    "\n".repeat(N),
  ]) {
    assert.ok(timed(() => replaceThrough(s, /sepia\(/g, ")", "")) < LIMIT_MS);
    assert.ok(timed(() => removeTagsWithSpace(s, /<\/?template/g)) < LIMIT_MS);
  }
});

// ---- extractBodyContents -------------------------------------------------
function oldBody(html) {
  const regex = /<body[^>]*>[\s\S]*<\/body>/i;
  if (html.match(regex) && html.match(regex).length > 0)
    html = html
      .match(regex)[0]
      .replace(/<body[^>]*>/i, "")
      .replace(/<\/body>/i, "");
  return html;
}
test("extractBodyContents matches the old regex chain", () => {
  fuzz(
    [
      "<body",
      "<BODY class=a",
      ">",
      "</body>",
      "</BODY>",
      "a",
      " ",
      "<p>",
      "\n",
      "</body",
    ],
    (s) => {
      const inner = extractBodyContents(s);
      assert.equal(inner === null ? s : inner, oldBody(s), JSON.stringify(s));
    },
  );
});
test("extractBodyContents is linear", () => {
  for (const s of [
    "<body ".repeat(N / 6),
    "<body>".repeat(N / 6),
    "<body>" + "</body".repeat(N / 6),
  ]) {
    assert.ok(timed(() => extractBodyContents(s)) < LIMIT_MS);
  }
});

// ---- looksLikeEmail ------------------------------------------------------
test("looksLikeEmail matches /^\\S+@\\S+.\\S+$/", () => {
  fuzz(
    ["a", "@", ".", " ", "\n", "bc", "\t", " ", "x@y.z"],
    (s) => {
      assert.equal(
        looksLikeEmail(s),
        /^\S+@\S+.\S+$/.test(s),
        JSON.stringify(s),
      );
    },
    20000,
  );
  assert.ok(looksLikeEmail("test@example.com"));
  assert.ok(!looksLikeEmail("not an email"));
});
test("looksLikeEmail is linear", () => {
  for (const s of ["@".repeat(N), "a@".repeat(N / 2), "a".repeat(N) + " "]) {
    assert.ok(timed(() => looksLikeEmail(s)) < LIMIT_MS);
  }
});

// ---- collapseFirstIndentRun ---------------------------------------------
function oldIndent(str) {
  const pattern = str.match(/\s*\n[\t\s]*/);
  return str.replace(new RegExp(pattern, "g"), "\n");
}
test("collapseFirstIndentRun matches the old idiom when a run exists", () => {
  fuzz(
    ["a", " ", "\n", "\t", "  ", "\r\n", "b", "if (x) {", "\n    ", " "],
    (s) => {
      if (!/\s*\n[\t\s]*/.test(s)) {
        assert.equal(collapseFirstIndentRun(s), s);
        return;
      }
      assert.equal(collapseFirstIndentRun(s), oldIndent(s), JSON.stringify(s));
    },
  );
});
test("collapseFirstIndentRun is linear", () => {
  for (const s of [" ".repeat(N) + "x", "a \t".repeat(N / 3), "\n".repeat(N)]) {
    assert.ok(timed(() => collapseFirstIndentRun(s)) < LIMIT_MS);
  }
});

// ---- extractFilesAttrPaths -----------------------------------------------
test("extractFilesAttrPaths matches the old global regex", () => {
  const pieces = [
    'src="files/',
    'a.png"',
    "x",
    '="files/',
    ".",
    '"',
    " ",
    ">",
    "b.c.d",
    "'",
    "FILES/",
    'href="files/y.jpg"',
    "=",
    "-",
    "é",
    "1.2",
  ];
  fuzz(
    pieces,
    (s) => {
      const old = [];
      const re = /\w+="files\/([^"'\s>]+\.[a-zA-Z0-9]+)"/gi;
      let m;
      while ((m = re.exec(s)) !== null) old.push(m[1]);
      assert.deepEqual(extractFilesAttrPaths(s), old, JSON.stringify(s));
    },
    20000,
  );
});
test("extractFilesAttrPaths is linear", () => {
  for (const s of [
    'a="files/'.repeat(N / 9),
    "a".repeat(N) + '="files/' + "b".repeat(N),
    'a="files/b.'.repeat(N / 11),
  ]) {
    assert.ok(timed(() => extractFilesAttrPaths(s)) < LIMIT_MS);
  }
});

// ---- findTagAttrValue ----------------------------------------------------
test("findTagAttrValue matches the old page-break regex", () => {
  const pieces = [
    "<page-break",
    "<PAGE-BREAK",
    " item-id=",
    '"',
    "'",
    "abc",
    ">",
    " ",
    "\n",
    "item-id=",
    "<p>",
    "x",
    "=",
    "\titem-id='q'",
  ];
  fuzz(
    pieces,
    (s) => {
      const m = s.match(/<page-break[^>]*?\sitem-id=["']([^"']+)["']/i);
      assert.equal(
        findTagAttrValue(s, "page-break", "item-id"),
        m ? m[1] : null,
        JSON.stringify(s),
      );
    },
    30000,
  );
});
test("findTagAttrValue is linear", () => {
  for (const s of [
    "<page-break ".repeat(N / 12),
    '<page-break item-id="'.repeat(N / 20),
    "<page-break" + " item-id='".repeat(N / 10),
    "<page-break " + "a".repeat(N),
  ]) {
    assert.ok(
      timed(() => findTagAttrValue(s, "page-break", "item-id")) < LIMIT_MS,
    );
  }
});
