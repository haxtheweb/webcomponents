/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
/**
 * Detect if pasted content appears to be markdown
 * @param {string} text - The text content to analyze
 * @return {boolean} - Whether the text appears to be markdown
 */
export function detectMarkdown(text) {
  if (!text || typeof text !== "string") return false;

  // Strip HTML tags for analysis but keep line breaks
  // (repeat until stable so nested input cannot leave a tag behind)
  let stripped = text;
  let previous;
  do {
    previous = stripped;
    stripped = stripped.replace(/<[^<>]*>/g, "");
  } while (stripped !== previous);
  const plainText = stripped.trim();

  // Strong indicators (these alone suggest markdown)
  const strongIndicators = [
    // Headers (# ## ### etc.)
    (t) => /^#{1,6}\s+\S/m.test(t),
    hasFencedCodeBlock, // Fenced code blocks
    hasTableRow, // Tables (at least 2 pipes per line)
    (t) => /^>\s+\S/m.test(t), // Blockquotes (line-level)
    (t) => HR_STAR.test(t), // Horizontal rules (***)
    (t) => HR_DASH.test(t), // Horizontal rules (---)
    (t) => HR_UNDERSCORE.test(t), // Horizontal rules (___)
  ];

  // Check for strong indicators first
  for (const check of strongIndicators) {
    if (check(plainText)) {
      return true;
    }
  }

  // Moderate indicators (need multiple matches)
  const moderateIndicators = [
    // Unordered lists (line-level)
    (t) => /^[^\S\n\r\u2028\u2029]*[-*+]\s+\S/m.test(t),
    // Ordered lists (line-level)
    (t) => /^[^\S\n\r\u2028\u2029]*\d+\.\s+\S/m.test(t),
    (t) => /\*\*[^*]+\*\*/.test(t), // Bold text (non-greedy)
    (t) => /(?<!\*)\*[^*]+\*(?!\*)/.test(t), // Italic text (not bold)
    hasLink, // Links [text](url)
    hasImage, // Images ![alt](url)
    (t) => /`[^`\n]+`/.test(t), // Inline code (no line breaks)
    // Indented code blocks (4+ whitespace; plainText is trimmed so a run of
    // whitespace is always followed by content)
    (t) => /^\s{4}/m.test(t),
  ];

  // Count moderate indicators
  let matches = 0;
  for (const check of moderateIndicators) {
    if (check(plainText)) {
      matches++;
    }
  }

  // Need at least 2 moderate indicators to consider it markdown
  return matches >= 2;
}

// Horizontal rules: optional indentation, 3+ marker characters, optional trailing
// whitespace, all on one line. Whitespace classes exclude line terminators so the
// scan is anchored per line (linear time) rather than spanning blank lines.
const HR_STAR = /^[^\S\n\r\u2028\u2029]*\*{3,}[^\S\n\r\u2028\u2029]*$/m;
const HR_DASH = /^[^\S\n\r\u2028\u2029]*-{3,}[^\S\n\r\u2028\u2029]*$/m;
const HR_UNDERSCORE = /^[^\S\n\r\u2028\u2029]*_{3,}[^\S\n\r\u2028\u2029]*$/m;
const LINE_BREAKS = /[\n\r\u2028\u2029]/;

/**
 * A line opening with ``` and a later ``` that ends a line. Only the first
 * opener needs checking: any later opener has a subset of possible closers.
 */
function hasFencedCodeBlock(text) {
  const opener = /^```/m.exec(text);
  if (!opener) return false;
  return /```(?=[\n\r\u2028\u2029]|$)/g.test(text.slice(opener.index + 3));
}

/** a line like `| a | b |`: starts with | and has two more pipes, each after at least one character */
function hasTableRow(text) {
  for (const line of text.split(LINE_BREAKS)) {
    if (line[0] !== "|") continue;
    const a = line.indexOf("|", 2);
    if (a !== -1 && line.indexOf("|", a + 2) !== -1) return true;
  }
  return false;
}

/** `[text](url)` on one line, with non-empty text and url */
function hasLink(text) {
  return text.split(LINE_BREAKS).some((line) => {
    const a = line.indexOf("[");
    if (a === -1) return false;
    const b = line.indexOf("](", a + 2);
    return b !== -1 && line.indexOf(")", b + 3) !== -1;
  });
}

/** `![alt](url)` on one line, alt may be empty, url non-empty */
function hasImage(text) {
  return text.split(LINE_BREAKS).some((line) => {
    const a = line.indexOf("![");
    if (a === -1) return false;
    const b = line.indexOf("](", a + 2);
    return b !== -1 && line.indexOf(")", b + 3) !== -1;
  });
}

/**
 * Convert markdown text to HTML using the marked library
 * @param {string} markdown - The markdown text to convert
 * @param {Object} [options] - marked options for this call (for example
 *   { headerIds: false, mangle: false } so headings and email addresses come
 *   through as written)
 * @return {Promise<string>} - The converted HTML
 */
export async function markdownToHTML(markdown, options = {}) {
  try {
    // Dynamically import the marked library from local utils
    const module = await import("./marked.js");
    const { marked } = module;
    return marked.parse(markdown, options);
  } catch (e) {
    console.warn("Failed to parse markdown, falling back to original text:", e);
    return markdown;
  }
}

/**
 * Attributes HAX writes onto blocks for OER schema metadata. Authors never
 * set them by hand, so the Markdown view hides them and puts them back when
 * the Markdown is turned into HTML again (see restoreManagedAttributes).
 */
export const MANAGED_ATTRIBUTES = ["resource", "prefix", "typeof"];

// attributes each Markdown-able tag may carry and still be written as Markdown;
// anything else on the element keeps it as raw HTML so nothing is lost
const MD_SAFE_ATTRIBUTES = {
  a: ["href", "title"],
  img: ["src", "alt", "title"],
  ol: ["start"],
  code: ["class"],
};
// heading ids HAX generates itself (h2--1128800479); custom ids stay as HTML
const AUTO_HEADING_ID = /^h[1-6]--?\d+$/;
const BLOCK_TAGS = [
  "address",
  "article",
  "aside",
  "blockquote",
  "details",
  "dialog",
  "dd",
  "div",
  "dl",
  "dt",
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
  "hr",
  "li",
  "main",
  "nav",
  "ol",
  "p",
  "pre",
  "section",
  "table",
  "ul",
];

function attrsAreSafe(el) {
  const tag = el.tagName.toLowerCase();
  const allowed = MD_SAFE_ATTRIBUTES[tag] || [];
  for (let i = 0; i < el.attributes.length; i++) {
    const name = el.attributes[i].name;
    if (allowed.includes(name)) {
      continue;
    }
    if (
      name === "id" &&
      /^h[1-6]$/.test(tag) &&
      AUTO_HEADING_ID.test(el.attributes[i].value)
    ) {
      continue;
    }
    return false;
  }
  return true;
}

// escape what Markdown would otherwise read as syntax inside running text
function escapeText(text) {
  let out = "";
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if ("\\*_`[]<".indexOf(c) !== -1) {
      out += "\\" + c;
    } else {
      out += c;
    }
  }
  return out;
}

// a line opening with block syntax (# > - + or "1.") would change meaning
function escapeLineStart(line) {
  if (/^(#{1,6}\s|>|[-+]\s|\d+[.)]\s)/.test(line)) {
    const m = /^\d+/.exec(line);
    if (m) {
      return m[0] + "\\" + line.slice(m[0].length);
    }
    return "\\" + line;
  }
  return line;
}

function collapse(text) {
  return text.replace(/\s+/g, " ");
}

function longestRun(text, ch) {
  let best = 0;
  let run = 0;
  for (let i = 0; i < text.length; i++) {
    run = text[i] === ch ? run + 1 : 0;
    if (run > best) {
      best = run;
    }
  }
  return best;
}

// a link title inside "..." escapes backslashes first, then quotes
function escapeTitle(value) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function escapeAttr(value) {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

function openTag(el) {
  let out = "<" + el.tagName.toLowerCase();
  for (let i = 0; i < el.attributes.length; i++) {
    const a = el.attributes[i];
    out +=
      a.value === ""
        ? " " + a.name
        : " " + a.name + '="' + escapeAttr(a.value) + '"';
  }
  return out + ">";
}

// Markdown ends an HTML block at a blank line, so raw HTML keeps none
function withoutBlankLines(html) {
  return html
    .split("\n")
    .filter((line) => line.trim() !== "")
    .join("\n");
}

// raw HTML block: the open tag alone on its first line (CommonMark only starts
// an HTML block for a custom element when its open tag stands alone)
function rawBlock(el) {
  const tag = el.tagName.toLowerCase();
  const voids = [
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
    "source",
    "track",
    "wbr",
  ];
  if (voids.includes(tag)) {
    return openTag(el);
  }
  // standard block tags start an HTML block whatever follows them
  if (BLOCK_TAGS.includes(tag)) {
    return withoutBlankLines(el.outerHTML.trim());
  }
  const inner = withoutBlankLines(el.innerHTML.trim());
  return openTag(el) + (inner ? "\n" + inner + "\n" : "") + "</" + tag + ">";
}

function inline(node) {
  let out = "";
  node.childNodes.forEach((child) => {
    if (child.nodeType === 3) {
      out += escapeText(collapse(child.textContent));
      return;
    }
    if (child.nodeType !== 1) {
      return;
    }
    const tag = child.tagName.toLowerCase();
    if (!attrsAreSafe(child) || BLOCK_TAGS.includes(tag)) {
      out += child.outerHTML;
      return;
    }
    switch (tag) {
      case "strong":
      case "b": {
        const t = inline(child).trim();
        out += t ? "**" + t + "**" : "";
        break;
      }
      case "em":
      case "i": {
        const t = inline(child).trim();
        out += t ? "*" + t + "*" : "";
        break;
      }
      case "code": {
        if (child.children.length) {
          out += child.outerHTML;
          break;
        }
        const t = child.textContent;
        const fence = "`".repeat(longestRun(t, "`") + 1);
        out += fence + (t[0] === "`" ? " " + t + " " : t) + fence;
        break;
      }
      case "a": {
        const href = child.getAttribute("href");
        if (href === null || /[\s()]/.test(href)) {
          out += child.outerHTML;
          break;
        }
        const title = child.getAttribute("title");
        out +=
          "[" +
          inline(child) +
          "](" +
          href +
          (title ? ' "' + escapeTitle(title) + '"' : "") +
          ")";
        break;
      }
      case "img": {
        const src = child.getAttribute("src");
        if (src === null || /[\s()]/.test(src)) {
          out += child.outerHTML;
          break;
        }
        out +=
          "![" + escapeText(child.getAttribute("alt") || "") + "](" + src + ")";
        break;
      }
      case "br":
        out += "\\\n";
        break;
      default:
        out += child.outerHTML;
    }
  });
  return out;
}

function hasOnlyInline(el) {
  for (let i = 0; i < el.children.length; i++) {
    const tag = el.children[i].tagName.toLowerCase();
    if (BLOCK_TAGS.includes(tag) || tag.indexOf("-") !== -1) {
      return false;
    }
  }
  return true;
}

function inlineLines(el) {
  return inline(el)
    .trim()
    .split("\n")
    .map((line) => escapeLineStart(line.trim()))
    .join("\n");
}

function list(el, depth) {
  const ordered = el.tagName.toLowerCase() === "ol";
  let n =
    ordered && el.getAttribute("start")
      ? parseInt(el.getAttribute("start"), 10) || 1
      : 1;
  const lines = [];
  for (let i = 0; i < el.children.length; i++) {
    const li = el.children[i];
    if (li.tagName.toLowerCase() !== "li" || li.attributes.length) {
      return null;
    }
    const marker = ordered ? n + ". " : "- ";
    n++;
    const pad = " ".repeat(marker.length);
    // the item's own text, then any nested lists
    const textHolder = li.cloneNode(true);
    const nested = [];
    for (let j = textHolder.children.length - 1; j >= 0; j--) {
      const c = textHolder.children[j];
      const ct = c.tagName.toLowerCase();
      if ((ct === "ul" || ct === "ol") && attrsAreSafe(c)) {
        nested.unshift(c);
        c.remove();
      }
    }
    if (!hasOnlyInline(textHolder)) {
      return null;
    }
    const text = inlineLines(textHolder)
      .split("\n")
      .join("\n" + pad);
    lines.push(" ".repeat(depth) + marker + text);
    for (const sub of nested) {
      const md = list(sub, depth + marker.length);
      if (md === null) {
        return null;
      }
      lines.push(md);
    }
  }
  return lines.join("\n");
}

function block(el) {
  const tag = el.tagName.toLowerCase();
  if (!attrsAreSafe(el)) {
    return rawBlock(el);
  }
  if (/^h[1-6]$/.test(tag)) {
    if (!hasOnlyInline(el) || el.querySelector("br")) {
      return rawBlock(el);
    }
    const text = inline(el).trim();
    return text ? "#".repeat(parseInt(tag[1], 10)) + " " + text : "";
  }
  switch (tag) {
    case "p": {
      if (!hasOnlyInline(el)) {
        return rawBlock(el);
      }
      return inlineLines(el);
    }
    case "ul":
    case "ol": {
      const md = list(el, 0);
      return md === null ? rawBlock(el) : md;
    }
    case "blockquote": {
      if (!hasOnlyInline(el)) {
        return rawBlock(el);
      }
      return inlineLines(el)
        .split("\n")
        .map((line) => "> " + line)
        .join("\n");
    }
    case "pre": {
      const code = el.children.length === 1 ? el.children[0] : null;
      if (
        !code ||
        code.tagName.toLowerCase() !== "code" ||
        code.children.length ||
        !attrsAreSafe(code)
      ) {
        return rawBlock(el);
      }
      const lang = /(?:^|\s)language-([\w-]+)/.exec(
        code.getAttribute("class") || "",
      );
      const t = code.textContent.replace(/\n$/, "");
      const fence = "`".repeat(Math.max(3, longestRun(t, "`") + 1));
      return fence + (lang ? lang[1] : "") + "\n" + t + "\n" + fence;
    }
    case "hr":
      return "---";
    default:
      return rawBlock(el);
  }
}

/**
 * Convert HAX page HTML to Markdown (GFM) for authoring. Headings,
 * paragraphs, lists, quotes, code, links, images and rules become Markdown;
 * every other block, and any element carrying attributes Markdown cannot
 * hold, stays as raw HTML so nothing is lost on the way back. The page-break
 * that opens a HAXcms page is left out (the editor keeps it), and the
 * attributes in MANAGED_ATTRIBUTES are taken off and returned in `managed`
 * so restoreManagedAttributes can put them back.
 * @param {string} html - page HTML, as hax-body haxToContent() returns it
 * @return {{markdown: string, managed: Array}}
 */
export function htmlToMarkdown(html) {
  const doc = globalThis.document.implementation.createHTMLDocument("");
  // Security: the inert document never runs scripts or loads resources; the
  // result is text for an editor, not markup inserted into the page
  doc.body.innerHTML = typeof html === "string" ? html : "";
  const managed = [];
  const count = {};
  doc.body.querySelectorAll("*").forEach((el) => {
    const tag = el.tagName.toLowerCase();
    const index = count[tag] || 0;
    count[tag] = index + 1;
    const found = {};
    let any = false;
    MANAGED_ATTRIBUTES.forEach((name) => {
      if (el.hasAttribute(name)) {
        found[name] = el.getAttribute(name);
        el.removeAttribute(name);
        any = true;
      }
    });
    if (any) {
      managed.push({ tag: tag, index: index, attrs: found });
    }
  });
  const parts = [];
  let first = true;
  doc.body.childNodes.forEach((node) => {
    if (node.nodeType === 3) {
      const t = node.textContent.trim();
      if (t) {
        parts.push(escapeLineStart(escapeText(collapse(t))));
      }
      return;
    }
    if (node.nodeType !== 1) {
      return;
    }
    if (first && node.tagName.toLowerCase() === "page-break") {
      first = false;
      return;
    }
    first = false;
    const md = block(node);
    if (md) {
      parts.push(md);
    }
  });
  return { markdown: parts.join("\n\n"), managed: managed };
}

/**
 * Put back the attributes htmlToMarkdown took off. Elements are matched by
 * tag and position among elements of that tag: the second stop-note gets the
 * second stop-note's attributes. Blocks the author added get none (HAX gives them new ones);
 * an attribute the author typed in is kept.
 * @param {string} html - HTML converted from the Markdown
 * @param {Array} managed - `managed` from htmlToMarkdown
 * @return {string} HTML with the attributes restored
 */
export function restoreManagedAttributes(html, managed) {
  if (!managed || !managed.length) {
    return html;
  }
  const doc = globalThis.document.implementation.createHTMLDocument("");
  // Security: inert document; only attributes are changed and the string is
  // handed back to the caller, which imports it through the HAX sanitizer
  doc.body.innerHTML = typeof html === "string" ? html : "";
  const byTag = {};
  managed.forEach((m) => {
    byTag[m.tag] = byTag[m.tag] || {};
    byTag[m.tag][m.index] = m.attrs;
  });
  const seen = {};
  doc.body.querySelectorAll("*").forEach((el) => {
    const tag = el.tagName.toLowerCase();
    if (!byTag[tag]) {
      return;
    }
    const i = seen[tag] || 0;
    seen[tag] = i + 1;
    const attrs = byTag[tag][i];
    if (!attrs) {
      return;
    }
    Object.keys(attrs).forEach((name) => {
      if (!el.hasAttribute(name)) {
        el.setAttribute(name, attrs[name]);
      }
    });
  });
  return doc.body.innerHTML;
}
