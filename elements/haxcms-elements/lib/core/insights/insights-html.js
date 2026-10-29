/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * HTML to a small, plain tree for the Insights analyzer.
 *
 * The analyzer walks one tree shape whichever parser produced it:
 *   element: { tag, attrs: { name: value }, children: [], parent }
 *   text:    { tag: "#text", text, parent }
 *
 * parseHtml() uses DOMParser when the global has one (the editor's main
 * thread, tests) and the built-in tolerant parser otherwise. DOMParser is not
 * exposed inside Web Workers, so the worker always takes the built-in path;
 * tests check both paths give the same page facts on the fixtures.
 *
 * The built-in parser covers what stored HAX page HTML needs: attributes in
 * any quoting, void and self-closed elements, raw-text elements (script,
 * style, textarea, title), comments, character references, and the implied
 * end tags of p, li, dt/dd, tr/td/th, option and headings. It does not do
 * table foster-parenting or full adoption-agency repair.
 */

const VOID = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const RAW_TEXT = new Set([
  "script",
  "style",
  "textarea",
  "title",
  "xmp",
  "noembed",
  "noframes",
]);

// start tags that close an open <p> (HTML "closes a p element")
const CLOSES_P = new Set([
  "address",
  "article",
  "aside",
  "blockquote",
  "center",
  "details",
  "dialog",
  "dir",
  "div",
  "dl",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hgroup",
  "hr",
  "main",
  "menu",
  "nav",
  "ol",
  "p",
  "pre",
  "section",
  "summary",
  "table",
  "ul",
]);

// "button scope" boundaries used when looking for an open <p>
const P_SCOPE = new Set([
  "applet",
  "caption",
  "html",
  "table",
  "td",
  "th",
  "marquee",
  "object",
  "template",
  "button",
]);

// elements that stop the search for an open li / dt / dd
const LIST_STOP = new Set([
  "ul",
  "ol",
  "dl",
  "table",
  "td",
  "th",
  "template",
  "button",
  "object",
  "applet",
  "marquee",
  "caption",
  "html",
  "body",
  "section",
  "article",
  "aside",
  "nav",
  "blockquote",
  "figure",
  "fieldset",
  "form",
  "details",
]);

const HEADINGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

const NAMED_ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  copy: "©",
  reg: "®",
  trade: "™",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  sbquo: "‚",
  ldquo: "“",
  rdquo: "”",
  bdquo: "„",
  hellip: "…",
  bull: "•",
  middot: "·",
  times: "×",
  divide: "÷",
  deg: "°",
  plusmn: "±",
  micro: "µ",
  para: "¶",
  sect: "§",
  euro: "€",
  pound: "£",
  yen: "¥",
  cent: "¢",
  laquo: "«",
  raquo: "»",
  shy: "­",
  ensp: " ",
  emsp: " ",
  thinsp: " ",
  zwnj: "‌",
  zwj: "‍",
  larr: "←",
  rarr: "→",
  uarr: "↑",
  darr: "↓",
  harr: "↔",
  rArr: "⇒",
  le: "≤",
  ge: "≥",
  ne: "≠",
  asymp: "≈",
  minus: "−",
  frac12: "½",
  frac14: "¼",
  frac34: "¾",
  sup2: "²",
  sup3: "³",
  aacute: "á",
  agrave: "à",
  acirc: "â",
  auml: "ä",
  eacute: "é",
  egrave: "è",
  ecirc: "ê",
  euml: "ë",
  iacute: "í",
  oacute: "ó",
  ouml: "ö",
  uacute: "ú",
  uuml: "ü",
  ntilde: "ñ",
  ccedil: "ç",
  szlig: "ß",
  alpha: "α",
  beta: "β",
  gamma: "γ",
  delta: "δ",
  Delta: "Δ",
  lambda: "λ",
  mu: "μ",
  pi: "π",
  sigma: "σ",
  theta: "θ",
  omega: "ω",
  Omega: "Ω",
};

/**
 * Decode HTML character references in a string.
 * @param {string} value
 * @returns {string}
 */
export function decodeEntities(value) {
  const source = String(value || "");
  if (source.indexOf("&") === -1) {
    return source;
  }
  return source.replace(
    /&(#[xX][0-9a-fA-F]+|#[0-9]+|[a-zA-Z][a-zA-Z0-9]*);?/g,
    (match, body) => {
      if (body.charAt(0) === "#") {
        const isHex = body.charAt(1) === "x" || body.charAt(1) === "X";
        const code = parseInt(body.substring(isHex ? 2 : 1), isHex ? 16 : 10);
        if (!Number.isFinite(code) || code <= 0 || code > 0x10ffff) {
          return "�";
        }
        try {
          return String.fromCodePoint(code);
        } catch {
          return "�";
        }
      }
      if (Object.prototype.hasOwnProperty.call(NAMED_ENTITIES, body)) {
        return NAMED_ENTITIES[body];
      }
      return match;
    },
  );
}

function makeElement(tag, attrs, parent) {
  return { tag, attrs, children: [], parent };
}

function appendText(parent, text) {
  if (text === "") {
    return;
  }
  const last = parent.children[parent.children.length - 1];
  if (last && last.tag === "#text") {
    last.text += text;
    return;
  }
  parent.children.push({ tag: "#text", text, parent });
}

/**
 * Tolerant HTML parser that needs no DOM. Returns a root node whose children
 * are the top-level nodes of the fragment.
 * @param {string} html
 * @returns {{tag: string, attrs: Object, children: Array, parent: null}}
 */
export function parseHtmlLite(html) {
  const source = String(html || "");
  const root = makeElement("#root", {}, null);
  const stack = [root];
  const len = source.length;
  let i = 0;

  const current = () => stack[stack.length - 1];

  const popTo = (index) => {
    stack.length = index;
  };

  // index of the nearest open element named `tag`, stopping at `stops`
  const findOpen = (tags, stops) => {
    for (let s = stack.length - 1; s > 0; s--) {
      const name = stack[s].tag;
      if (tags.has(name)) {
        return s;
      }
      if (stops && stops.has(name)) {
        return -1;
      }
    }
    return -1;
  };

  const closeImplied = (tag) => {
    if (CLOSES_P.has(tag)) {
      const p = findOpen(new Set(["p"]), P_SCOPE);
      if (p > 0) {
        popTo(p);
      }
    }
    if (HEADINGS.has(tag) && HEADINGS.has(current().tag)) {
      stack.pop();
    }
    if (tag === "li") {
      const li = findOpen(new Set(["li"]), LIST_STOP);
      if (li > 0) {
        popTo(li);
      }
    } else if (tag === "dt" || tag === "dd") {
      const d = findOpen(new Set(["dt", "dd"]), LIST_STOP);
      if (d > 0) {
        popTo(d);
      }
    } else if (tag === "td" || tag === "th") {
      const cell = findOpen(new Set(["td", "th"]), new Set(["table", "tr"]));
      if (cell > 0) {
        popTo(cell);
      }
    } else if (tag === "tr") {
      const row = findOpen(new Set(["tr"]), new Set(["table"]));
      if (row > 0) {
        popTo(row);
      }
    } else if (tag === "thead" || tag === "tbody" || tag === "tfoot") {
      const sec = findOpen(
        new Set(["thead", "tbody", "tfoot"]),
        new Set(["table"]),
      );
      if (sec > 0) {
        popTo(sec);
      }
    } else if (tag === "option") {
      if (current().tag === "option") {
        stack.pop();
      }
    } else if (tag === "a") {
      const a = findOpen(new Set(["a"]), P_SCOPE);
      if (a > 0) {
        popTo(a);
      }
    }
  };

  while (i < len) {
    const lt = source.indexOf("<", i);
    if (lt === -1) {
      appendText(current(), decodeEntities(source.substring(i)));
      break;
    }
    if (lt > i) {
      appendText(current(), decodeEntities(source.substring(i, lt)));
    }
    i = lt;
    if (source.startsWith("<!--", i)) {
      const end = source.indexOf("-->", i + 4);
      i = end === -1 ? len : end + 3;
      continue;
    }
    const next = source.charAt(i + 1);
    if (next === "!" || next === "?") {
      const end = source.indexOf(">", i + 2);
      i = end === -1 ? len : end + 1;
      continue;
    }
    if (next === "/") {
      const m = /^<\/([a-zA-Z][^\s/>]*)[^>]*>?/.exec(source.substring(i));
      if (!m) {
        appendText(current(), "</");
        i += 2;
        continue;
      }
      i += m[0].length;
      const tag = m[1].toLowerCase();
      for (let s = stack.length - 1; s > 0; s--) {
        if (stack[s].tag === tag) {
          popTo(s);
          break;
        }
      }
      continue;
    }
    if (!/[a-zA-Z]/.test(next)) {
      appendText(current(), "<");
      i += 1;
      continue;
    }
    // start tag
    let j = i + 1;
    while (j < len && !/[\s/>]/.test(source.charAt(j))) {
      j++;
    }
    const tag = source.substring(i + 1, j).toLowerCase();
    const attrs = {};
    while (j < len) {
      while (j < len && /\s/.test(source.charAt(j))) {
        j++;
      }
      const ch = source.charAt(j);
      if (ch === ">") {
        j++;
        break;
      }
      if (ch === "/") {
        if (source.charAt(j + 1) === ">") {
          j += 2;
          break;
        }
        j++;
        continue;
      }
      let k = j;
      while (k < len && !/[\s=/>]/.test(source.charAt(k))) {
        k++;
      }
      const name = source.substring(j, k).toLowerCase();
      j = k;
      while (j < len && /\s/.test(source.charAt(j))) {
        j++;
      }
      let value = "";
      if (source.charAt(j) === "=") {
        j++;
        while (j < len && /\s/.test(source.charAt(j))) {
          j++;
        }
        const quote = source.charAt(j);
        if (quote === '"' || quote === "'") {
          const end = source.indexOf(quote, j + 1);
          const stop = end === -1 ? len : end;
          value = source.substring(j + 1, stop);
          j = end === -1 ? len : end + 1;
        } else {
          let e = j;
          while (e < len && !/[\s>]/.test(source.charAt(e))) {
            e++;
          }
          value = source.substring(j, e);
          j = e;
        }
      }
      if (name !== "" && !Object.prototype.hasOwnProperty.call(attrs, name)) {
        attrs[name] = decodeEntities(value);
      }
    }
    i = j;
    closeImplied(tag);
    // rows need a row group and cells need a row, as the DOM inserts them
    const openImplied = (name) => {
      const implied = makeElement(name, {}, current());
      current().children.push(implied);
      stack.push(implied);
    };
    const isCell = tag === "td" || tag === "th";
    if ((tag === "tr" || isCell) && current().tag === "table") {
      openImplied("tbody");
    }
    if (isCell && ["tbody", "thead", "tfoot"].indexOf(current().tag) !== -1) {
      openImplied("tr");
    }
    const el = makeElement(tag, attrs, current());
    current().children.push(el);
    if (VOID.has(tag)) {
      continue;
    }
    if (RAW_TEXT.has(tag)) {
      const closeRe = new RegExp(`</${tag}\\s*>`, "i");
      const rest = source.substring(i);
      const m = closeRe.exec(rest);
      const body = m ? rest.substring(0, m.index) : rest;
      appendText(
        el,
        tag === "textarea" || tag === "title" ? decodeEntities(body) : body,
      );
      i = m ? i + m.index + m[0].length : len;
      continue;
    }
    stack.push(el);
  }
  return root;
}

function fromDomNode(node, parent) {
  if (node.nodeType === 3) {
    return { tag: "#text", text: node.nodeValue || "", parent };
  }
  if (node.nodeType !== 1) {
    return null;
  }
  const attrs = {};
  for (let a = 0; a < node.attributes.length; a++) {
    const attr = node.attributes[a];
    attrs[attr.name.toLowerCase()] = attr.value;
  }
  const el = makeElement(node.localName.toLowerCase(), attrs, parent);
  const kids =
    el.tag === "template" && node.content
      ? node.content.childNodes
      : node.childNodes;
  for (let c = 0; c < kids.length; c++) {
    const child = fromDomNode(kids[c], el);
    if (child) {
      el.children.push(child);
    }
  }
  return el;
}

/**
 * Parse with the platform DOMParser into the same plain tree as
 * parseHtmlLite(). Throws when DOMParser is missing.
 * @param {string} html
 */
export function parseHtmlDom(html) {
  const doc = new globalThis.DOMParser().parseFromString(
    `<!doctype html><html><head></head><body>${String(html || "")}</body></html>`,
    "text/html",
  );
  const root = makeElement("#root", {}, null);
  const kids = doc.body ? doc.body.childNodes : [];
  for (let c = 0; c < kids.length; c++) {
    const child = fromDomNode(kids[c], root);
    if (child) {
      root.children.push(child);
    }
  }
  return root;
}

/**
 * Whether this global offers DOMParser (false inside Web Workers).
 */
export function hasDomParser() {
  return typeof globalThis.DOMParser === "function";
}

/**
 * Parse page HTML into the analyzer's tree.
 * @param {string} html
 * @param {"auto"|"dom"|"lite"} [parser]
 */
export function parseHtml(html, parser = "auto") {
  if (parser === "lite" || (parser === "auto" && !hasDomParser())) {
    return parseHtmlLite(html);
  }
  return parseHtmlDom(html);
}
