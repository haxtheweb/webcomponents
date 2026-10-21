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
 * @param {Array<string|RegExp>} tokens literal strings (or simple RegExps such as
 *   /\sdata-x="/), matched in order, earliest first
 * @param {Object} [opts]
 * @param {boolean} [opts.ignoreCase=false]
 * @param {string|function(string): string} [opts.replacement=""] replacement text, or
 *   a function receiving the text between the first and the last token
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
  const res = tokens.map(
    (t) =>
      new RegExp(typeof t === "string" ? escapeRegExp(t) : t.source, flags),
  );
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
      let gapEnd = cur;
      for (let k = 1; k < res.length; k++) {
        const m = execFrom(res[k], line, cur);
        if (!m) {
          ok = false;
          break;
        }
        gapEnd = m.index;
        cur = m.index + m[0].length;
      }
      // if the earliest start cannot complete, no later start can either
      if (!ok) break;
      out +=
        line.slice(pos, first.index) +
        (typeof replacement === "function"
          ? replacement(line.slice(first.index + first[0].length, gapEnd))
          : replacement);
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
  // `</` + [a-z,0-9]* + `-`, then non-space characters up to the next ">".
  // Done as prefix + forward search for the terminator (not one regex with an
  // open-ended `[^\s>]*`) so unterminated candidates cannot rescan the input.
  const prefix = /<\/[a-z,0-9]*-/g;
  const stop = /[\s>]/g;
  let pos = 0;
  for (;;) {
    const p = execFrom(prefix, html, pos);
    if (!p) break;
    const s = execFrom(stop, html, p.index + p[0].length);
    if (!s) break;
    if (s[0] === ">") {
      const tag = html.slice(p.index + 2, s.index);
      tags[tag] = tag;
      pos = s.index + 1;
    } else {
      // whitespace before ">": every start before it fails the same way
      pos = s.index;
    }
  }
  return tags;
}

/**
 * Remove `style="prop: value; prop2: value2;"` attributes whose value is a plain
 * declaration list (what Word / Docs / contenteditable pastes produce).
 * Replaces `/(?:style="(\S+:\s*[^;"]+;\s*)*)+"/g`, which backtracks exponentially:
 * its `\S+` property name could swallow ";" and ":" so a declaration list had
 * many ways to be split. Property names here exclude whitespace, ":", ";" and
 * quotes, and values are `[^;"]+`, so every string has one parse.
 */
export function stripInlineStyleAttributes(str) {
  return str.replace(/style="(?:[^\s:;"]+:[^;"]+;\s*)*"/g, "");
}

/**
 * Linear emulation of `text.replace(/^\s+|\s+$/gm, "")`: whitespace that starts
 * a line, or that ends a line, is removed (whitespace runs may include line
 * breaks, exactly as the regex's `\s` does). The regex rescans each whitespace
 * run once per start position; this precomputes per-position answers in one
 * backward pass instead.
 */
export function trimLineEdges(text) {
  const n = text.length;
  const isWs = (i) => /\s/.test(text[i]);
  const isTerm = (i) => /[\n\r\u2028\u2029]/.test(text[i]);
  // wsEnd[i]: end (exclusive) of the whitespace run starting at i (i itself ws)
  // endAt[i]: largest j in (i, wsEnd[i]] where `$` holds, or -1
  const wsEnd = new Int32Array(n + 1);
  const endAt = new Int32Array(n + 1).fill(-1);
  const dollar = (j) => j === n || isTerm(j);
  for (let i = n - 1; i >= 0; i--) {
    if (!isWs(i)) continue;
    const next = i + 1;
    wsEnd[i] = next < n && isWs(next) ? wsEnd[next] : next;
    if (next < n && isWs(next) && endAt[next] !== -1) {
      endAt[i] = endAt[next];
    } else if (dollar(next)) {
      endAt[i] = next;
    } else {
      endAt[i] = -1;
    }
  }
  let out = "";
  let i = 0;
  let keepFrom = 0;
  while (i < n) {
    let end = -1;
    if (isWs(i)) {
      if (i === 0 || isTerm(i - 1)) {
        end = wsEnd[i]; // /^\s+/ takes the whole run
      } else if (endAt[i] !== -1) {
        end = endAt[i]; // /\s+$/ takes the longest prefix ending at a line end
      }
    }
    if (end > i) {
      out += text.slice(keepFrom, i);
      keepFrom = end;
      i = end;
    } else {
      i++;
    }
  }
  return out + text.slice(keepFrom);
}

/**
 * Strip characters from the edges of a string without a regular expression.
 * Linear replacement for `/^[-_]+|[-_]+$/g`, `/\/+$/`, `/^\/+/` and friends:
 * `str.replace(/\/+$/, "")` rescans the whole slash run from every start
 * position on input such as "////…x", this walks inward from each end once.
 * @param {string} str
 * @param {string} chars every character in this string is trimmed (a set)
 * @param {Object} [opts]
 * @param {boolean} [opts.start=true] trim the beginning
 * @param {boolean} [opts.end=true] trim the end
 */
export function trimChars(str, chars, { start = true, end = true } = {}) {
  if (typeof str !== "string") return str;
  let s = 0;
  let e = str.length;
  if (start) while (s < e && chars.includes(str[s])) s++;
  if (end) while (e > s && chars.includes(str[e - 1])) e--;
  return s === 0 && e === str.length ? str : str.slice(s, e);
}

/** Linear `str.replace(/\/+$/, "")` */
export function trimTrailingSlashes(str) {
  return trimChars(str, "/", { start: false });
}

/** Linear `str.replace(/^\/+|\/+$/g, "")` */
export function trimSlashes(str) {
  return trimChars(str, "/");
}

/**
 * Linear replacement for `.replace(/.*NEEDLE/g, "")` (or the non-global
 * `.replace(/.*NEEDLE/, "")`): drop everything on a line up to and including
 * the LAST occurrence of a literal. `.` does not cross line terminators so
 * every line is handled on its own, exactly like the regex.
 * @param {string} input
 * @param {string} needle literal text
 * @param {Object} [opts]
 * @param {boolean} [opts.all=true] every line (g flag) or only the first
 *   line that contains the literal
 */
export function removeThroughLast(input, needle, { all = true } = {}) {
  if (typeof input !== "string" || !needle) return input;
  if (!input.includes(needle)) return input;
  const parts = input.split(LINE_TERMINATORS);
  for (let p = 0; p < parts.length; p += 2) {
    const idx = parts[p].lastIndexOf(needle);
    if (idx >= 0) {
      parts[p] = parts[p].slice(idx + needle.length);
      if (!all) break;
    }
  }
  return parts.join("");
}

/**
 * Generalised replaceThroughGt: linear replacement for
 * a global `PREFIX[^X]*X` or `PREFIX[\s\S]*?X` where X is a single character.
 * Everything from each prefix match through the next `closeChar` is replaced.
 * @param {string} input
 * @param {RegExp} prefixRe global prefix pattern (no quantified groups)
 * @param {string} closeChar single character that ends the run
 * @param {string} replacement
 */
export function replaceThrough(input, prefixRe, closeChar, replacement) {
  let out = "";
  let pos = 0;
  for (;;) {
    const m = execFrom(prefixRe, input, pos);
    if (!m) break;
    const close = input.indexOf(closeChar, m.index + m[0].length);
    if (close < 0) break; // no later prefix can find the close char either
    out += input.slice(pos, m.index) + replacement;
    pos = close + 1;
  }
  return out + input.slice(pos);
}

/**
 * Linear replacement for the pattern "optional whitespace, `<tag` or `</tag`, any run of non-`>`,
 * `>`, optional whitespace" (global, replaced by nothing): remove each tag
 * together with the whitespace on both sides of it.
 * @param {string} input
 * @param {RegExp} prefixRe global pattern for the start of the tag, e.g. /<\/?template/g
 */
export function removeTagsWithSpace(input, prefixRe) {
  const ws = /\s/;
  let out = "";
  let pos = 0;
  for (;;) {
    const m = execFrom(prefixRe, input, pos);
    if (!m) break;
    const gt = input.indexOf(">", m.index + m[0].length);
    if (gt < 0) break;
    let s = m.index;
    while (s > pos && ws.test(input[s - 1])) s--;
    let e = gt + 1;
    while (e < input.length && ws.test(input[e])) e++;
    out += input.slice(pos, s);
    pos = e;
  }
  return out + input.slice(pos);
}

/**
 * Linear replacement for the "full <body> wrapper" extraction
 * `html.match(/<body[^>]*>[\s\S]*<\/body>/i)[0].replace(/<body[^>]*>/i, "")
 * .replace(/<\/body>/i, "")`.
 * @param {string} html
 * @returns {string|null} the content between the opening tag and the last
 *   closing tag (with the first closing tag removed, as the regex chain did),
 *   or null when there is no complete <body>…</body> wrapper
 */
export function extractBodyContents(html) {
  if (typeof html !== "string") return null;
  const open = /<body/gi.exec(html);
  if (!open) return null;
  // the earliest "<body" is the only start that needs trying: any later start
  // has a later ">" and therefore fewer possible closing tags
  const gt = html.indexOf(">", open.index + open[0].length);
  if (gt < 0) return null;
  const close = /<\/body>/gi;
  close.lastIndex = gt + 1;
  let first = null;
  let last = null;
  let m;
  while ((m = close.exec(html))) {
    if (!first) first = m;
    last = m;
  }
  if (!last) return null;
  const inner = html.slice(gt + 1, last.index + last[0].length);
  const f = first.index - (gt + 1);
  return inner.slice(0, f) + inner.slice(f + first[0].length);
}

/**
 * Linear equivalent of `!!text.match(/^\S+@\S+.\S+$/)` (note the unescaped
 * "." – it may be any one character, including a single whitespace).
 * @param {string} text
 * @returns {boolean}
 */
export function looksLikeEmail(text) {
  if (typeof text !== "string") return false;
  const n = text.length;
  const at = text.indexOf("@", 1);
  if (at < 1) return false;
  let wsCount = 0;
  let p = -1;
  for (let i = 0; i < n; i++) {
    if (/\s/.test(text[i])) {
      wsCount++;
      p = i;
      if (wsCount > 1) return false;
    }
  }
  if (wsCount === 0) return n - at - 1 >= 3;
  // the single whitespace has to be the "." and sit between two \S+ runs
  return !/[\n\r\u2028\u2029]/.test(text[p]) && at <= p - 2 && p <= n - 2;
}

/**
 * Linear replacement for the "find the first indent run, then replace every
 * copy of it with a newline" idiom
 * (match whitespace-then-newline-then-whitespace, then replace every copy of that
 * exact text with a newline).
 * The first match is the first whole whitespace run that contains a newline.
 * (The regex version turned a missing match into `/null/g`, i.e. replaced the
 * literal text "null"; here no run means the input is returned unchanged.)
 * @param {string} str
 */
export function collapseFirstIndentRun(str) {
  const ws = /\s/;
  const n = str.length;
  let i = 0;
  while (i < n) {
    if (!ws.test(str[i])) {
      i++;
      continue;
    }
    let j = i;
    let hasNl = false;
    while (j < n && ws.test(str[j])) {
      if (str[j] === "\n") hasNl = true;
      j++;
    }
    if (hasNl) return str.split(str.slice(i, j)).join("\n");
    i = j;
  }
  return str;
}

/**
 * Linear replacement for collecting capture group 1 of
 * `/\w+="files\/([^"'\s>]+\.[a-zA-Z0-9]+)"/gi` – the paths in attributes such
 * as src="files/img/a.png". The regex re-scans the word before every "=" and
 * the path body for every start position; this finds each `="files/` once.
 * @param {string} content
 * @returns {string[]} the captured paths, in order
 */
export function extractFilesAttrPaths(content) {
  const out = [];
  if (typeof content !== "string") return out;
  const re = /="files\//gi;
  const stop = /["'\s>]/;
  const alnum = /^[a-zA-Z0-9]+$/;
  let consumed = 0; // end of the previous match: characters before it are spent
  let scan = 0;
  for (;;) {
    const m = execFrom(re, content, scan);
    if (!m) break;
    scan = m.index + 1;
    // \w+ immediately before the "="
    if (m.index - 1 < consumed || !/\w/.test(content[m.index - 1])) continue;
    const from = m.index + m[0].length;
    let j = from;
    while (j < content.length && !stop.test(content[j])) j++;
    if (content[j] !== '"') continue;
    const path = content.slice(from, j);
    const dot = path.lastIndexOf(".");
    if (dot < 1 || !alnum.test(path.slice(dot + 1))) continue;
    out.push(path);
    consumed = j + 1;
    scan = consumed;
  }
  return out;
}

/**
 * Linear replacement for
 * `content.match(/<TAG[^>]*?\sATTR=["']([^"']+)["']/i)?.[1]`: the value of the
 * first quoted `ATTR` attribute found inside the first opening `<TAG …>` that
 * has one. The attribute name has to start inside the tag (before its ">"),
 * the value itself may be followed by anything.
 * @param {string} content
 * @param {string} tag literal tag name, e.g. "page-break"
 * @param {string} attr literal attribute name, e.g. "item-id"
 * @returns {string|null}
 */
export function findTagAttrValue(content, tag, attr) {
  if (typeof content !== "string") return null;
  const open = new RegExp("<" + escapeRegExp(tag), "gi");
  const attrRe = new RegExp("\\s" + escapeRegExp(attr) + "=[\"']", "gi");
  let pos = 0;
  for (;;) {
    const m = execFrom(open, content, pos);
    if (!m) return null;
    const from = m.index + m[0].length;
    const gt = content.indexOf(">", from);
    const end = gt < 0 ? content.length : gt;
    // later "<TAG" starts inside this same tag could only offer a subset of
    // the attribute positions, so the whole tag is handled in one pass
    let a;
    attrRe.lastIndex = from;
    while ((a = attrRe.exec(content)) && a.index < end) {
      const vStart = a.index + a[0].length;
      let vEnd = vStart;
      while (
        vEnd < content.length &&
        content[vEnd] !== '"' &&
        content[vEnd] !== "'"
      )
        vEnd++;
      if (vEnd > vStart && vEnd < content.length) {
        return content.slice(vStart, vEnd);
      }
      attrRe.lastIndex = a.index + 1;
    }
    if (gt < 0) return null;
    pos = gt + 1;
  }
}
