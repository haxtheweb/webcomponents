/**
 * Conservative minifier for the text of Lit css`` templates.
 *
 * It only does two things: drops /* comments * / and collapses runs of
 * whitespace to one space, removing that space entirely next to { } and ;
 * (never after a colon, so `--empty: ;` keeps its meaning). It does not
 * reorder, merge or rewrite rules, values, colors or units, so modern CSS
 * (nesting, @container, light-dark(), :is(), custom properties) passes
 * through untouched. Quoted strings and backslash escapes are copied as is.
 *
 * It works on the raw text of each template piece between ${} expressions,
 * so expressions are never touched. Whitespace that touches an expression is
 * kept as a single space, because what the expression produces is only known
 * at runtime.
 *
 * minifyTemplate() returns null (leave the template alone) when the template
 * does not pass checkCss(), when a comment spans an expression, or when the
 * result is not equivalent to the original: both versions are minified by
 * lightningcss and must produce identical output.
 */
import { createRequire } from "node:module";
import { checkCss, placeholderFor } from "./css-templates.mjs";

const require = createRequire(import.meta.url);
const lightningcss = require("lightningcss");

// commas keep one space: lightningcss (and getPropertyValue on custom
// properties) treat "a, b" and "a,b" as different text
const TIGHT = "{};";
const isSpace = (ch) =>
  ch === " " || ch === "\n" || ch === "\t" || ch === "\r" || ch === "\f";

/**
 * @param {string} raw raw template text between expressions
 * @param {{afterExpr:boolean, beforeExpr:boolean}} edges whether an
 *   expression sits right before / right after this piece
 * @returns {string|null} minified text, or null if a comment is left open
 */
export function minifyRaw(raw, edges) {
  let out = "";
  let pendingSpace = false;
  // whitespace that touches an expression keeps a newline when it had one,
  // so the expression is read in the same position (whole rules vs value)
  let pendingNewline = false;
  let i = 0;
  const prevOut = () => (out.length ? out[out.length - 1] : "");
  const flushSpace = (next) => {
    if (!pendingSpace) {
      return;
    }
    pendingSpace = false;
    const prev = prevOut();
    if (prev === "") {
      // start of this piece: keep one character only if an expression precedes it
      if (edges.afterExpr && TIGHT.indexOf(next) === -1) {
        out += pendingNewline ? "\n" : " ";
      }
      pendingNewline = false;
      return;
    }
    pendingNewline = false;
    if (prev === ":") {
      out += " ";
      return;
    }
    if (TIGHT.indexOf(prev) !== -1 || TIGHT.indexOf(next) !== -1) {
      return;
    }
    out += " ";
  };
  while (i < raw.length) {
    const ch = raw[i];
    if (isSpace(ch)) {
      pendingSpace = true;
      if (ch === "\n") {
        pendingNewline = true;
      }
      i += 1;
      continue;
    }
    if (ch === "/" && raw[i + 1] === "*") {
      const close = raw.indexOf("*/", i + 2);
      if (close === -1) {
        return null;
      }
      pendingSpace = true;
      i = close + 2;
      continue;
    }
    flushSpace(ch);
    if (ch === "\\") {
      out += raw.substr(i, 2);
      i += 2;
      continue;
    }
    if (ch === '"' || ch === "'") {
      let j = i + 1;
      while (j < raw.length && raw[j] !== ch) {
        j += raw[j] === "\\" ? 2 : 1;
      }
      out += raw.slice(i, j + 1);
      i = j + 1;
      continue;
    }
    out += ch;
    i += 1;
  }
  if (pendingSpace && edges.beforeExpr) {
    if (pendingNewline) {
      out += "\n";
    } else if (TIGHT.indexOf(prevOut()) === -1) {
      out += " ";
    }
  }
  return out;
}

function cssFromRaws(raws) {
  let css = "";
  raws.forEach((raw, i) => {
    css += raw;
    if (i < raws.length - 1) {
      css += placeholderFor(raw, raws[i + 1]);
    }
  });
  return css;
}

function lightningMinified(css) {
  return lightningcss
    .transform({
      filename: "template.css",
      code: Buffer.from(css),
      errorRecovery: true,
      minify: true,
    })
    .code.toString();
}

/**
 * @param {ReturnType<import("./css-templates.mjs").findCssTemplates>[number]} template
 * @returns {{raws:string[], reason:null}|{raws:null, reason:string}}
 */
export function minifyTemplate(template) {
  const check = checkCss(template);
  if (check.errors.length || check.uncheckable) {
    return { raws: null, reason: "syntax" };
  }
  const last = template.raw.length - 1;
  const raws = [];
  for (let i = 0; i <= last; i += 1) {
    const min = minifyRaw(template.raw[i], {
      afterExpr: i > 0,
      beforeExpr: i < last,
    });
    if (min === null) {
      return { raws: null, reason: "comment-spans-expression" };
    }
    raws.push(min);
  }
  if (raws.join("") === template.raw.join("")) {
    return { raws: null, reason: "unchanged" };
  }
  let same = false;
  try {
    same =
      lightningMinified(cssFromRaws(template.raw)) ===
      lightningMinified(cssFromRaws(raws));
  } catch (e) {
    same = false;
  }
  if (!same) {
    return { raws: null, reason: "not-equivalent" };
  }
  return { raws, reason: null };
}
