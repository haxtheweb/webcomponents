/**
 * Structural check for Lit html`` / svg`` templates.
 *
 * Lit hands the browser one HTML string per template (bindings replaced by
 * markers) and lets a <template> element parse it. When that markup is not
 * well formed, the HTML parser silently builds a different DOM than the code
 * reads: a <div> inside <p> closes the paragraph, <x-icon/> does not close a
 * custom element so its siblings become its children, a nested <button> or
 * <a> is split out, a stray end tag is dropped, a <div> inside <table> is
 * moved out of it. Nothing reports this at runtime.
 *
 * checkHtmlTemplate() builds the tree the source spells out (tags as written,
 * void elements and HTML's own optional end tags respected) and the tree
 * parse5 (a WHATWG-compliant parser, the same rules <template> uses) builds,
 * and reports where they differ. Tables are compared after the parser's
 * implied <tbody>, which is harmless, is folded away.
 */
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const { parse } = require("@babel/parser");
const parse5 = require("parse5");

let litSupport = null;
async function lit() {
  if (!litSupport) {
    litSupport = (await import("lit-html/private-ssr-support.js"))._$LH;
  }
  return litSupport;
}

const VOID = new Set(
  "area base br col embed hr img input link meta source track wbr param keygen".split(
    " ",
  ),
);
const RAW_TEXT = new Set(["script", "style", "textarea", "title", "xmp"]);
// elements whose end tag HTML lets you omit, closed by a following sibling
const SELF_SIBLING = {
  li: ["li"],
  dt: ["dt", "dd"],
  dd: ["dt", "dd"],
  option: ["option", "optgroup"],
  optgroup: ["optgroup"],
  tr: ["tr"],
  td: ["td", "th", "tr"],
  th: ["td", "th", "tr"],
  rt: ["rt", "rp"],
  rp: ["rt", "rp"],
};
const OPTIONAL_END = new Set([
  ...Object.keys(SELF_SIBLING),
  "p",
  "tbody",
  "thead",
  "tfoot",
  "colgroup",
]);
const FOLD = new Set(["tbody"]);

function walk(node, visit) {
  if (!node || typeof node.type !== "string") return;
  if (node.type === "TaggedTemplateExpression") visit(node);
  for (const key of Object.keys(node)) {
    if (key === "loc" || key === "start" || key === "end") continue;
    const v = node[key];
    if (Array.isArray(v)) v.forEach((c) => walk(c, visit));
    else if (v && typeof v.type === "string") walk(v, visit);
  }
}

function tagType(tag) {
  const name =
    tag.type === "Identifier"
      ? tag.name
      : tag.type === "MemberExpression" && !tag.computed
        ? tag.property.name
        : null;
  return name === "html" ? 1 : name === "svg" ? 2 : 0;
}

/** every html`` / svg`` template in a module */
export function findHtmlTemplates(source) {
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
  const out = [];
  walk(ast.program, (node) => {
    const type = tagType(node.tag);
    if (!type) return;
    const cooked = node.quasi.quasis.map((q) =>
      q.value.cooked == null ? q.value.raw : q.value.cooked,
    );
    out.push({
      type,
      line: node.quasi.loc.start.line,
      lines: node.quasi.quasis.map((q) => q.loc.start.line),
      strings: cooked,
    });
  });
  return out;
}

/** authored tree: tags as written */
function authoredTree(htmlText) {
  const root = { name: "#root", children: [], parent: null, foreign: false };
  let cur = root;
  let i = 0;
  let tagStart = 0;
  const open = (name, selfClosing) => {
    // implicit close of an optional-end sibling (li after li, td after td...)
    while (
      SELF_SIBLING[cur.name] &&
      SELF_SIBLING[cur.name].includes(name) &&
      !cur.explicit
    ) {
      cur = cur.parent;
    }
    const foreign = cur.foreign || name === "svg" || name === "math";
    const node = { name, children: [], parent: cur, foreign, pos: tagStart };
    cur.children.push(node);
    if (VOID.has(name) || (selfClosing && foreign)) return;
    if (selfClosing) {
      // non-void html element written as <x/>: the author meant it closed
      node.selfClosedHtml = true;
      return;
    }
    cur = node;
  };
  const close = (name) => {
    let n = cur;
    while (n && n.name !== name) n = n.parent;
    if (!n || n === root) {
      cur.children.push({
        name: `/${name}`,
        children: [],
        parent: cur,
        stray: true,
        pos: tagStart,
      });
      return;
    }
    // closing an outer element implicitly closes optional-end children
    while (cur !== n) cur = cur.parent;
    n.explicit = true;
    cur = n.parent;
  };
  while (i < htmlText.length) {
    if (htmlText.startsWith("<!--", i)) {
      const e = htmlText.indexOf("-->", i + 4);
      i = e === -1 ? htmlText.length : e + 3;
      continue;
    }
    if (htmlText.startsWith("<?", i) || htmlText.startsWith("<!", i)) {
      const e = htmlText.indexOf(">", i);
      i = e === -1 ? htmlText.length : e + 1;
      continue;
    }
    if (htmlText[i] === "<" && /[a-zA-Z/]/.test(htmlText[i + 1] || "")) {
      tagStart = i;
      const isEnd = htmlText[i + 1] === "/";
      let j = i + (isEnd ? 2 : 1);
      const m = /^[a-zA-Z][^\s/>]*/.exec(htmlText.slice(j));
      if (!m) {
        i += 1;
        continue;
      }
      const name = cur.foreign ? m[0] : m[0].toLowerCase();
      j += m[0].length;
      // skip attributes, honoring quotes
      let q = null;
      while (j < htmlText.length) {
        const ch = htmlText[j];
        if (q) {
          if (ch === q) q = null;
        } else if (ch === '"' || ch === "'") q = ch;
        else if (ch === ">") break;
        j += 1;
      }
      const selfClosing = htmlText[j - 1] === "/";
      i = j + 1;
      if (isEnd) {
        close(cur.foreign ? name : name.toLowerCase());
      } else {
        open(name, selfClosing);
        if (
          RAW_TEXT.has(name.toLowerCase()) &&
          !cur.foreign &&
          cur.name === name
        ) {
          const endIdx = htmlText
            .toLowerCase()
            .indexOf(`</${name.toLowerCase()}`, i);
          i = endIdx === -1 ? htmlText.length : endIdx;
        }
      }
      continue;
    }
    i += 1;
  }
  return root;
}

function parsedTree(htmlText) {
  const frag = parse5.parseFragment(htmlText);
  const conv = (n) => ({
    name: n.tagName,
    children: (n.content ? n.content.childNodes : n.childNodes || [])
      .filter((c) => c.tagName)
      .map(conv),
  });
  return {
    name: "#root",
    children: frag.childNodes.filter((c) => c.tagName).map(conv),
  };
}

/** pre-order list of [name, depth, node]; tbody is folded away on both sides */
function flatten(node, foldTbody, depth = 0, out = []) {
  for (const c of node.children) {
    if (foldTbody && c.name === "tbody") {
      flatten(c, foldTbody, depth, out);
      continue;
    }
    out.push([c.name, depth, c]);
    if (!c.stray) flatten(c, foldTbody, depth + 1, out);
  }
  return out;
}

const label = (list, k) =>
  list
    .slice(Math.max(0, k - 1), k + 2)
    .map(([n, d]) => `${"  ".repeat(0)}${n}@${d}`)
    .join(" ");

/**
 * @returns {Promise<null|{message:string}>}
 */
export async function checkHtmlTemplate(template) {
  const L = await lit();
  let htmlText;
  try {
    const strings = Object.assign([...template.strings], {
      raw: template.strings,
    });
    htmlText = String(L.getTemplateHtml(strings, template.type)[0]);
  } catch (e) {
    return null;
  }
  // what the source spells out; each expression becomes one placeholder
  // character so a value like href=x/${y}> is not read as a self-closing tag
  const written = template.strings.join("x");
  const authored = authoredTree(
    template.type === 2 ? `<svg>${written}</svg>` : written,
  );
  const a = flatten(authored, true);
  // what the browser builds from the exact string Lit hands it
  const b = flatten(parsedTree(htmlText), true);
  let k = 0;
  while (
    k < a.length &&
    k < b.length &&
    a[k][0] === b[k][0] &&
    a[k][1] === b[k][1]
  ) {
    k += 1;
  }
  if (k === a.length && k === b.length) return null;
  const node = a[k] ? a[k][2] : a.length ? a[a.length - 1][2] : null;
  const offset =
    node && typeof node.pos === "number"
      ? Math.max(0, node.pos - (template.type === 2 ? 5 : 0))
      : 0;
  // map the offset back to the template piece it falls in, for a real line
  let line = template.line;
  let rest = offset;
  for (let i = 0; i < template.strings.length; i += 1) {
    const piece = template.strings[i];
    if (rest <= piece.length || i === template.strings.length - 1) {
      const base = template.lines ? template.lines[i] : template.line;
      line = base + (piece.slice(0, rest).match(/\n/g) || []).length;
      break;
    }
    rest -= piece.length + 1;
  }
  let message;
  if (node && node.selfClosedHtml) {
    message = `<${node.name}/> is not self-closing in HTML; what follows becomes its children`;
  } else if (node && node.stray) {
    message = `stray </${node.name.slice(1)}> with no matching open element; the parser drops it`;
  } else {
    message = `browser builds a different tree here: written ${label(a, k)} | parsed ${label(b, k)}`;
  }
  return { line, message };
}
