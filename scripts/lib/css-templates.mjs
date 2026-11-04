/**
 * Shared helpers for Lit `css` tagged templates in element source.
 *
 * findCssTemplates(source) parses a JS module with @babel/parser and returns
 * every css`...` template (comments and strings that only mention css`` are
 * ignored). Each `${expression}` is swapped for a placeholder that keeps the
 * CSS parseable: an empty string when the expression stands where whole
 * rules go (for example `${unsafeCSS(sheet)}`), `0` when a unit follows it
 * (`${bp}px`), and an identifier anywhere else.
 *
 * checkCss(css) runs the result through lightningcss, a strict, modern CSS
 * parser, and returns what a browser would drop: invalid selectors,
 * declarations and at-rules. Problems on a line that holds a placeholder are
 * reported as `uncheckable`, because the real value is only known at runtime.
 *
 * Used by scripts/css-template-check.mjs, and meant to gate any build step
 * that rewrites CSS templates: only touch a template that checks clean.
 */
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { parse } = require("@babel/parser");
const lightningcss = require("lightningcss");

const UNIT_AFTER =
  /^(px|r?em|%|ms|s\b|v[hw]|vmin|vmax|ch|ex|deg|fr|lh|dvh|svh|lvh|cqi|cqw)/;
const PLACEHOLDER_IDENT = "x-hax-expr";

/** walk any babel AST node, calling visit on every TaggedTemplateExpression */
function walk(node, visit) {
  if (!node || typeof node.type !== "string") {
    return;
  }
  if (node.type === "TaggedTemplateExpression") {
    visit(node);
  }
  for (const key of Object.keys(node)) {
    if (key === "loc" || key === "start" || key === "end") {
      continue;
    }
    const value = node[key];
    if (Array.isArray(value)) {
      value.forEach((child) => walk(child, visit));
    } else if (value && typeof value.type === "string") {
      walk(value, visit);
    }
  }
}

function isCssTag(tag) {
  return (
    (tag.type === "Identifier" && tag.name === "css") ||
    (tag.type === "MemberExpression" &&
      !tag.computed &&
      tag.property.type === "Identifier" &&
      tag.property.name === "css")
  );
}

export function placeholderFor(before, after) {
  if (UNIT_AFTER.test(after)) {
    return "0";
  }
  const statementBefore = /(^|[{};])\s*$/.test(before);
  const statementAfter = /^\s*(;|$|\n|})/.test(after);
  if (statementBefore && statementAfter) {
    return "";
  }
  return PLACEHOLDER_IDENT;
}

/**
 * @param {string} source JS module source
 * @returns {Array<{line:number, css:string, lineMap:number[], placeholderLines:Set<number>, start:number, end:number, raw:string[], quasis:Array<{start:number, end:number, raw:string}>}>}
 *   line: file line of the template start; lineMap[i]: file line of css line i+1;
 *   start/end: character offsets of the template text inside `source`
 *   (between the backticks); raw: the raw quasi strings in order;
 *   quasis: each raw string with its own start/end offsets in `source`.
 */
export function findCssTemplates(source) {
  let ast;
  try {
    ast = parse(source, {
      sourceType: "module",
      plugins: [
        "importMeta",
        "topLevelAwait",
        "classProperties",
        "decorators-legacy",
      ],
      errorRecovery: true,
    });
  } catch (e) {
    return [];
  }
  const found = [];
  walk(ast.program, (node) => {
    if (!isCssTag(node.tag)) {
      return;
    }
    const { quasis, expressions } = node.quasi;
    let css = "";
    const lineMap = [];
    const placeholderLines = new Set();
    let fileLine = quasis[0].loc.start.line;
    const pushText = (text) => {
      for (const ch of text) {
        if (lineMap.length === 0) {
          lineMap.push(fileLine);
        }
        css += ch;
        if (ch === "\n") {
          fileLine += 1;
          lineMap.push(fileLine);
        }
      }
      if (lineMap.length === 0) {
        lineMap.push(fileLine);
      }
    };
    quasis.forEach((q, i) => {
      pushText(q.value.raw);
      if (i < expressions.length) {
        const ph = placeholderFor(q.value.raw, quasis[i + 1].value.raw);
        placeholderLines.add(lineMap.length);
        css += ph;
        // keep following css lines mapped to the right file line when the
        // expression itself spans several lines
        fileLine = quasis[i + 1].loc.start.line;
      }
    });
    found.push({
      line: quasis[0].loc.start.line,
      css,
      lineMap,
      placeholderLines,
      start: node.quasi.start + 1,
      end: node.quasi.end - 1,
      raw: quasis.map((q) => q.value.raw),
      quasis: quasis.map((q) => ({
        start: q.start,
        end: q.end,
        raw: q.value.raw,
      })),
    });
  });
  return found;
}

/**
 * @param {{css:string, lineMap:number[], placeholderLines:Set<number>}} template
 * @returns {{errors:Array<{line:number, message:string}>, uncheckable:number}}
 */
export function checkCss(template) {
  const errors = [];
  let uncheckable = 0;
  const report = (loc, message) => {
    const cssLine = loc && loc.line ? loc.line : 1;
    if (template.placeholderLines.has(cssLine)) {
      uncheckable += 1;
      return;
    }
    errors.push({
      line: template.lineMap[cssLine - 1] || template.lineMap[0],
      message: String(message).split("\n")[0],
    });
  };
  try {
    const res = lightningcss.transform({
      filename: "template.css",
      code: Buffer.from(template.css),
      errorRecovery: true,
      minify: false,
    });
    (res.warnings || []).forEach((w) => report(w.loc, w.message));
  } catch (e) {
    report(e.loc, e.message || e);
  }
  return { errors, uncheckable };
}
