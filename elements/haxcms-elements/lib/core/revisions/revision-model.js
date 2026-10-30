/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Page history (revisions) model: what a revision did, who made it and how
 * two versions differ. Pure functions, no DOM except HTML-to-text, so the
 * screens and tests share one source of truth.
 *
 * Commit subjects carry an op-code prefix (haxtheweb/issues#3191):
 *   [<actor>:<operationId>[:<txn>]] <summary>
 *   actor  H human | A agent | S system; X when there is no prefix
 * Backends that already parse it send actor / op / txn / summary on each
 * revision; older backends send only `message`, so the same parse runs here.
 * History from before op codes has no prefix; its HAX-written messages are
 * still recognised by their wording, so old revisions get a label too.
 */

/** same pattern the backends use (haxcms-nodejs commitContext.js) */
const PREFIX_PATTERN =
  /^\[([HAS]):([A-Za-z][A-Za-z0-9]{0,47})(?::([a-z0-9]{4}))?\] (.*)$/;

/**
 * HAX commit messages from before op codes, mapped to the op that writes
 * them now. First match wins.
 */
const LEGACY_MESSAGES = [
  [/^Committed changes$/i, "updateContentByIdOrSlug"],
  [/^Page details updated/i, "updateItem"],
  [/^Node operation:/i, "updateItem"],
  [/^Page added/i, "createItem"],
  [/^\d+ pages added/i, "createItem"],
  [/^Page deleted/i, "deleteItem"],
  [/^Outline updated in bulk/i, "updateSiteOutline"],
  [/^Bulk replace/i, "replaceContent"],
  [/^Bulk slug normalization/i, "normalizeSiteSlugs"],
  [/^Page revision restored/i, "restoreItemRevision"],
  [/^Managed files/i, "system"],
  [/^Style guide updated/i, "system"],
];

/**
 * Which filter chip a change belongs to. Anything else is "other".
 */
export const REVISION_FAMILIES = Object.freeze({
  updateContentByIdOrSlug: "content",
  replaceContent: "content",
  updateSiteOutline: "structure",
  normalizeSiteSlugs: "structure",
  deleteItem: "structure",
  updateItem: "details",
  createItem: "created",
  siteCreate: "created",
  createSite: "created",
  restoreItemRevision: "restore",
});

/** i18n keys for each op; the screen supplies the words */
export const REVISION_LABEL_KEYS = Object.freeze({
  updateContentByIdOrSlug: "opContent",
  replaceContent: "opReplace",
  updateSiteOutline: "opOutline",
  normalizeSiteSlugs: "opSlugs",
  deleteItem: "opDeleted",
  updateItem: "opDetails",
  createItem: "opCreated",
  siteCreate: "opSiteCreated",
  createSite: "opSiteCreated",
  restoreItemRevision: "opRestore",
  direct: "opDirect",
  system: "opSystem",
  upgradeManagedFiles: "opSystem",
});

/** the order filter chips appear in */
export const REVISION_FILTERS = Object.freeze([
  "all",
  "content",
  "structure",
  "details",
  "restore",
]);

/**
 * Split a commit subject into actor, op, txn and summary.
 * @param {string} message
 */
export function parseCommitMessage(message) {
  const raw = String(message || "");
  const unquoted =
    raw.length > 1 &&
    raw.charAt(0) === "'" &&
    raw.charAt(raw.length - 1) === "'"
      ? raw.substring(1, raw.length - 1)
      : raw;
  const match = PREFIX_PATTERN.exec(unquoted);
  if (!match) {
    return {
      actor: "X",
      op: "",
      txn: "",
      summary: unquoted.replace(/\s+/g, " ").trim(),
    };
  }
  return {
    actor: match[1],
    op: match[2],
    txn: match[3] || "",
    summary: String(match[4] || "")
      .replace(/\s+/g, " ")
      .trim(),
  };
}

/**
 * Guess the op of a commit written before op codes, from its wording.
 * @param {string} summary
 * @returns {string} an op, or "" when the wording is not HAX's
 */
export function legacyOp(summary) {
  const text = String(summary || "").trim();
  for (let i = 0; i < LEGACY_MESSAGES.length; i++) {
    if (LEGACY_MESSAGES[i][0].test(text)) {
      return LEGACY_MESSAGES[i][1];
    }
  }
  return "";
}

/**
 * One revision as the screens use it. Takes the API row as-is and fills in
 * what the backend did not parse.
 * @param {Object} row from listItemRevisions
 * @returns {Object} the row plus actor, op, txn, summary, family, labelKey,
 *   inferred (op guessed from wording), external (not attributable to HAX)
 */
export function describeRevision(row) {
  const revision = Object.assign({}, row || {});
  const hasServerFields =
    typeof revision.actor === "string" && revision.actor !== "";
  const parsed = hasServerFields
    ? {
        actor: revision.actor,
        op: revision.op || "",
        txn: revision.txn || "",
        summary:
          typeof revision.summary === "string"
            ? revision.summary
            : parseCommitMessage(revision.message).summary,
      }
    : parseCommitMessage(revision.message);
  let op = parsed.op;
  let inferred = false;
  if (!op && parsed.actor === "X") {
    op = legacyOp(parsed.summary);
    inferred = op !== "";
  }
  revision.actor = parsed.actor;
  revision.op = op;
  revision.txn = parsed.txn;
  revision.summary = parsed.summary;
  revision.inferred = inferred;
  // no prefix and no HAX wording: made by hand, by another tool, or by an
  // agent writing files directly
  revision.external = parsed.actor === "X" && !inferred;
  revision.family = Object.prototype.hasOwnProperty.call(REVISION_FAMILIES, op)
    ? REVISION_FAMILIES[op]
    : "other";
  revision.labelKey = Object.prototype.hasOwnProperty.call(
    REVISION_LABEL_KEYS,
    op,
  )
    ? REVISION_LABEL_KEYS[op]
    : revision.external
      ? "opExternal"
      : "opOther";
  return revision;
}

/**
 * Does a revision pass a filter chip? "created" and "other" only show
 * under All.
 */
export function revisionMatchesFilter(revision, filter) {
  if (!filter || filter === "all") {
    return true;
  }
  return !!revision && revision.family === filter;
}

/**
 * Timestamp in ms from a revision's unix seconds, ms, or date string.
 */
export function revisionTime(revision) {
  if (!revision) {
    return 0;
  }
  const value = revision.timestamp;
  if (typeof value === "number" && value > 0) {
    return value < 1000000000000 ? value * 1000 : value;
  }
  if (typeof value === "string" && /^[0-9]+$/.test(value.trim())) {
    const n = parseInt(value, 10);
    return n < 1000000000000 ? n * 1000 : n;
  }
  const parsed = Date.parse(revision.date || "");
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Group revisions (newest first) by local calendar day.
 * @param {Object[]} revisions
 * @param {number} [now] for tests
 * @returns {{key: string, kind: "today"|"yesterday"|"date", time: number,
 *   items: Object[]}[]}
 */
export function groupRevisionsByDay(revisions, now) {
  const today = new Date(typeof now === "number" ? now : Date.now());
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today.getTime());
  yesterday.setDate(yesterday.getDate() - 1);
  const groups = [];
  let current = null;
  (revisions || []).forEach((revision) => {
    const time = revisionTime(revision);
    const day = new Date(time);
    day.setHours(0, 0, 0, 0);
    const key = time ? day.toISOString() : "unknown";
    if (!current || current.key !== key) {
      let kind = "date";
      if (time && day.getTime() === today.getTime()) {
        kind = "today";
      } else if (time && day.getTime() === yesterday.getTime()) {
        kind = "yesterday";
      }
      current = { key: key, kind: kind, time: time, items: [] };
      groups.push(current);
    }
    current.items.push(revision);
  });
  return groups;
}

const BLOCK_TAGS =
  "p,h1,h2,h3,h4,h5,h6,li,blockquote,pre,figcaption,td,th,dt,dd,summary,caption";

/**
 * Readable text of stored page HTML, one block per paragraph. Nothing is
 * rendered or run: DOMParser builds an inert document.
 * @param {string} htmlString
 * @returns {string} blocks joined by blank lines
 */
export function htmlToText(htmlString) {
  const source = String(htmlString || "");
  if (!source.trim()) {
    return "";
  }
  if (typeof globalThis.DOMParser !== "function") {
    return source
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }
  const doc = new globalThis.DOMParser().parseFromString(
    "<body>" + source + "</body>",
    "text/html",
  );
  doc.querySelectorAll("script,style,template").forEach((el) => el.remove());
  const blocks = [];
  const seen = new Set();
  doc.body.querySelectorAll(BLOCK_TAGS).forEach((el) => {
    // a block inside a block (li > p) is counted once, by its outer block
    let parent = el.parentElement;
    while (parent && parent !== doc.body) {
      if (seen.has(parent)) {
        return;
      }
      parent = parent.parentElement;
    }
    seen.add(el);
    const text = el.textContent.replace(/\s+/g, " ").trim();
    if (text) {
      blocks.push(text);
    }
  });
  if (!blocks.length) {
    const text = doc.body.textContent.replace(/\s+/g, " ").trim();
    return text;
  }
  return blocks.join("\n\n");
}

/** words, single spaces and paragraph breaks, kept in order */
export function tokenizeWords(text) {
  return String(text || "").match(/\n\n|[^\s]+|[ \t\n]+/g) || [];
}

// above this many cells the exact diff is too slow for the browser; the
// diff falls back to whole paragraphs
const MAX_DIFF_CELLS = 4000000;

/**
 * Longest-common-subsequence diff of two token lists.
 * @returns {{type: "eq"|"ins"|"del", text: string}[]} merged runs
 */
export function diffTokens(before, after) {
  const a = before || [];
  const b = after || [];
  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) {
    start++;
  }
  let endA = a.length;
  let endB = b.length;
  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
    endA--;
    endB--;
  }
  const ops = [];
  for (let i = 0; i < start; i++) {
    ops.push(["eq", a[i]]);
  }
  const midA = a.slice(start, endA);
  const midB = b.slice(start, endB);
  if (midA.length * midB.length > MAX_DIFF_CELLS) {
    midA.forEach((t) => ops.push(["del", t]));
    midB.forEach((t) => ops.push(["ins", t]));
  } else if (midA.length || midB.length) {
    const n = midA.length;
    const m = midB.length;
    // lengths of LCS of suffixes, one row at a time is not enough to walk
    // back, so keep the table as typed rows
    const table = new Array(n + 1);
    for (let i = 0; i <= n; i++) {
      table[i] = new Uint32Array(m + 1);
    }
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        table[i][j] =
          midA[i] === midB[j]
            ? table[i + 1][j + 1] + 1
            : Math.max(table[i + 1][j], table[i][j + 1]);
      }
    }
    let i = 0;
    let j = 0;
    while (i < n && j < m) {
      if (midA[i] === midB[j]) {
        ops.push(["eq", midA[i]]);
        i++;
        j++;
      } else if (table[i + 1][j] >= table[i][j + 1]) {
        ops.push(["del", midA[i]]);
        i++;
      } else {
        ops.push(["ins", midB[j]]);
        j++;
      }
    }
    while (i < n) {
      ops.push(["del", midA[i++]]);
    }
    while (j < m) {
      ops.push(["ins", midB[j++]]);
    }
  }
  for (let i = endA; i < a.length; i++) {
    ops.push(["eq", a[i]]);
  }
  // merge neighbours of one type; whitespace between two changes of the
  // same kind joins them so a changed phrase reads as one run
  const runs = [];
  ops.forEach((op) => {
    const last = runs.length ? runs[runs.length - 1] : null;
    if (last && last.type === op[0]) {
      last.text += op[1];
    } else {
      runs.push({ type: op[0], text: op[1] });
    }
  });
  return runs;
}

/**
 * Word diff of two pages' text.
 * @param {string} beforeHtml older version
 * @param {string} afterHtml newer version
 * @returns {{runs: Object[], added: number, removed: number,
 *   changed: boolean}} added / removed count words
 */
export function diffPageText(beforeHtml, afterHtml) {
  const runs = diffTokens(
    tokenizeWords(htmlToText(beforeHtml)),
    tokenizeWords(htmlToText(afterHtml)),
  );
  let added = 0;
  let removed = 0;
  runs.forEach((run) => {
    const words = (run.text.match(/[^\s]+/g) || []).length;
    if (run.type === "ins") {
      added += words;
    } else if (run.type === "del") {
      removed += words;
    }
  });
  return {
    runs: runs,
    added: added,
    removed: removed,
    changed: added > 0 || removed > 0,
  };
}

/**
 * Line diff of two pages' stored HTML.
 * @returns {{runs: Object[], added: number, removed: number,
 *   changed: boolean}} added / removed count lines
 */
export function diffPageSource(beforeHtml, afterHtml) {
  const split = (s) =>
    String(s || "")
      .replace(/\r\n/g, "\n")
      .split("\n")
      .map((line) => line + "\n");
  const runs = diffTokens(split(beforeHtml), split(afterHtml));
  let added = 0;
  let removed = 0;
  runs.forEach((run) => {
    const lines = run.text.split("\n").length - 1;
    if (run.type === "ins") {
      added += lines;
    } else if (run.type === "del") {
      removed += lines;
    }
  });
  return {
    runs: runs,
    added: added,
    removed: removed,
    changed: added > 0 || removed > 0,
  };
}

/**
 * Shorten long unchanged stretches to a few words either side, so the
 * changes are what you read.
 * @param {Object[]} runs from diffTokens
 * @param {number} [context] words kept beside each change
 * @returns {Object[]} runs; a collapsed stretch is
 *   `{type: "skip", words: n}`
 */
export function collapseUnchanged(runs, context) {
  const keep = typeof context === "number" ? context : 12;
  const out = [];
  (runs || []).forEach((run, index) => {
    if (run.type !== "eq") {
      out.push(run);
      return;
    }
    const tokens = tokenizeWords(run.text);
    const wordIdx = [];
    tokens.forEach((t, i) => {
      if (/[^\s]/.test(t)) {
        wordIdx.push(i);
      }
    });
    const first = index === 0;
    const last = index === runs.length - 1;
    const head = first ? 0 : keep;
    const tail = last ? 0 : keep;
    if (wordIdx.length <= head + tail + 4) {
      out.push(run);
      return;
    }
    const headEnd = head > 0 ? wordIdx[head - 1] + 1 : 0;
    const tailStart = tail > 0 ? wordIdx[wordIdx.length - tail] : tokens.length;
    if (headEnd > 0) {
      out.push({ type: "eq", text: tokens.slice(0, headEnd).join("") });
    }
    out.push({ type: "skip", words: wordIdx.length - head - tail });
    if (tailStart < tokens.length) {
      out.push({ type: "eq", text: tokens.slice(tailStart).join("") });
    }
  });
  return out;
}

/** page fields a revision can carry (the .json variant, #2827) */
const META_FIELDS = [
  ["title", (m) => m.title],
  ["description", (m) => m.description],
  ["slug", (m) => m.slug],
  // a page is published unless it says otherwise; hidden and locked are off
  // unless set
  ["published", (m) => !(m.metadata && m.metadata.published === false)],
  ["hideInMenu", (m) => !!(m.metadata && m.metadata.hideInMenu)],
  ["locked", (m) => !!(m.metadata && m.metadata.locked)],
];

/**
 * Page details that differ between two revisions' item metadata.
 * @returns {{field: string, before: *, after: *}[]}
 */
export function diffItemMetadata(before, after) {
  if (!before || !after) {
    return [];
  }
  const changes = [];
  META_FIELDS.forEach(([field, read]) => {
    const a = read(before);
    const b = read(after);
    const norm = (v) =>
      v === undefined || v === null ? "" : typeof v === "string" ? v : v;
    if (JSON.stringify(norm(a)) !== JSON.stringify(norm(b))) {
      changes.push({ field: field, before: a, after: b });
    }
  });
  return changes;
}
