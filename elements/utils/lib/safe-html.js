/**
 * Linear-time string helpers for HTML clean up.
 *
 * These replace lazy / nested-quantifier regular expressions such as
 * `/<script[\s\S]*?>/` or `/ align=.*? /` which backtrack polynomially on
 * crafted input (many opening markers with no closing marker). Every helper
 * here only ever walks the string forward, so the work is O(n) for any input.
 *
 * Pure string functions only (no DOM) so they can be unit tested in plain Node.
 */

/** Escape a literal so it can be placed inside a RegExp. */
function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\/-]/g, "\\$&");
}

/** exec a *global* RegExp starting at `from` */
function execFrom(re, str, from) {
  re.lastIndex = from;
  return re.exec(str);
}

// `.` in JS (no `s` flag) does not cross these
const LINE_TERMINATORS = /([\n\r\u2028\u2029])/;

/**
 * Linear replacement for chains like `/<tag.*?tag.*?>/gi`, `/ align=.*? /g`
 * and `/margin-.*?:.*?"/g`: a literal, then lazily-matched text on the same
 * line up to the next literal, and so on. The whole run (first literal through
 * the last literal) is replaced.
 * @param {string} input
 * @param {string[]} tokens literal strings, matched in order, earliest first
 * @param {Object} [opts]
 * @param {boolean} [opts.ignoreCase=false]
 * @param {string} [opts.replacement=""]
 * @param {boolean} [opts.crossLines=false] true for `[^x]*`-style gaps that may
 *   span line breaks; false for `.*?` gaps which stop at a line terminator
 */
export function replaceLazyRun(
  input,
  tokens,
  { ignoreCase = false, replacement = "", crossLines = false } = {},
) {
  if (typeof input !== "string" || !tokens.length) return input;
  const flags = ignoreCase ? "gi" : "g";
  const res = tokens.map((t) => new RegExp(escapeRegExp(t), flags));
  // `.` never matches a line terminator, so each line is independent
  const parts = crossLines ? [input] : input.split(LINE_TERMINATORS);
  for (let p = 0; p < parts.length; p += 2) {
    const line = parts[p];
    let out = "";
    let pos = 0;
    for (;;) {
      const first = execFrom(res[0], line, pos);
      if (!first) break;
      let cur = first.index + first[0].length;
      let ok = true;
      for (let k = 1; k < res.length; k++) {
        const m = execFrom(res[k], line, cur);
        if (!m) {
          ok = false;
          break;
        }
        cur = m.index + m[0].length;
      }
      // if the earliest start cannot complete, no later start can either
      if (!ok) break;
      out += line.slice(pos, first.index) + replacement;
      pos = cur;
    }
    parts[p] = out + line.slice(pos);
  }
  return parts.join("");
}

/**
 * Linear replacement for `/<prefix[\s\S]*?>/gi`: from each prefix match,
 * everything up to and including the next ">" (any characters, newlines too).
 * @param {string} input
 * @param {RegExp} prefixRe global, case-insensitive prefix pattern (no quantified groups)
 * @param {string} replacement
 */
export function replaceThroughGt(input, prefixRe, replacement) {
  let out = "";
  let pos = 0;
  for (;;) {
    const m = execFrom(prefixRe, input, pos);
    if (!m) break;
    const gt = input.indexOf(">", m.index + m[0].length);
    if (gt < 0) break; // no later prefix can find a ">" either
    out += input.slice(pos, m.index) + replacement;
    pos = gt + 1;
  }
  return out + input.slice(pos);
}

/**
 * Remove HTML comments. Per the HTML spec a comment ends at "-->" or "--!>"
 * (browsers accept both), so both are treated as the terminator. A comment
 * opener with no terminator is left alone.
 */
export function stripHtmlComments(input) {
  const open = "<!--";
  const close = /--!?>/g;
  let out = "";
  let pos = 0;
  for (;;) {
    const start = input.indexOf(open, pos);
    if (start < 0) break;
    const end = execFrom(close, input, start + open.length);
    if (!end) break;
    out += input.slice(pos, start);
    pos = end.index + end[0].length;
  }
  return out + input.slice(pos);
}

/**
 * Linear replacement for `/<span[^>]*>([\s\S]*?)<\/span>/gi` -> "$1":
 * drop one span wrapper (open tag and first following close tag).
 */
export function unwrapSpans(input) {
  const open = /<span/gi;
  const close = /<\/span>/gi;
  let out = "";
  let pos = 0;
  for (;;) {
    const o = execFrom(open, input, pos);
    if (!o) break;
    const gt = input.indexOf(">", o.index + o[0].length);
    if (gt < 0) break;
    const c = execFrom(close, input, gt + 1);
    if (!c) break;
    out += input.slice(pos, o.index) + input.slice(gt + 1, c.index);
    pos = c.index + c[0].length;
  }
  return out + input.slice(pos);
}

/**
 * Linear replacement for
 * `/<template[\s\S]*?>[\s\S]*?&lt;script[\s\S]*?&gt;[\s\S]*?&lt;\/script&gt;/gi`
 * with the callback that turns the (already encapsulated) script / style
 * markers inside a <template> back into real tags.
 */
function restoreTemplateScripts(input) {
  const tpl = /<template/gi;
  const ltScript = /&lt;script/gi;
  const gt = /&gt;/gi;
  const ltClose = /&lt;\/script&gt;/gi;
  let out = "";
  let pos = 0;
  for (;;) {
    const t = execFrom(tpl, input, pos);
    if (!t) break;
    const tagEnd = input.indexOf(">", t.index + t[0].length);
    if (tagEnd < 0) break;
    const s = execFrom(ltScript, input, tagEnd + 1);
    if (!s) break;
    const g = execFrom(gt, input, s.index + s[0].length);
    if (!g) break;
    const e = execFrom(ltClose, input, g.index + g[0].length);
    if (!e) break;
    const end = e.index + e[0].length;
    const match = input
      .slice(t.index, end)
      .replace("&lt;script&gt;", "<script>")
      .replace("&lt;/script&gt;", "</script>")
      .replace("&lt;style&gt;", "<style>")
      .replace("&lt;/style&gt;", "</style>");
    out += input.slice(pos, t.index) + match;
    pos = end;
  }
  return out + input.slice(pos);
}

/**
 * Encapsulate script / style tags in an HTML blob and drop leaked HAX
 * editor tags. Linear-time replacement for the original regex chain.
 * Closing tags are matched with the same leniency browsers apply
 * (`</script >`, `</script foo>`).
 */
export function encapsulateScriptsAndStyles(html) {
  html = replaceThroughGt(html, /<script/gi, "&lt;script&gt;");
  html = replaceThroughGt(html, /<\/script/gi, "&lt;/script&gt;");
  // ensure that HAX tags aren't leaking in here
  html = replaceThroughGt(html, /<hax-(?:body|tray|store)/gi, "");
  html = replaceThroughGt(html, /<\/hax-(?:body|tray|store)/gi, "");
  html = replaceThroughGt(html, /<h-a-x/gi, "");
  html = html.replace(/<\/h-a-x*>/gi, "");
  html = replaceThroughGt(html, /<style/gi, "&lt;style&gt;");
  html = replaceThroughGt(html, /<\/style/gi, "&lt;/style&gt;");
  // special case, it's inside a template tag
  return restoreTemplateScripts(html);
}

/**
 * Names of custom elements closed in an HTML blob (`</my-element>`),
 * as a {name: name} map.
 */
export function findClosingCustomTags(html) {
  const tags = {};
  const matches = html.match(/<\/[a-z,0-9]*-[^\s>]*>/g);
  for (const m of matches || []) {
    const tag = m.slice(2, -1);
    tags[tag] = tag;
  }
  return tags;
}
