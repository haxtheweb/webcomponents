/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Saves attribute edits made on Reports screens through the site's block
 * operations API (haxtheweb/issues#3270, haxtheweb/issues#3321):
 * GET x/api/v1/content/{idOrSlug}/blocks lists a page's allowlisted elements
 * with the { tag, index, before } that addresses each one, and one PATCH per
 * page sets their attributes. The backend refuses a change when the element
 * no longer matches `before`, so nothing a person did not see on the screen
 * is overwritten.
 *
 * A row is one attribute on one element:
 *   { pageId, slug, pageTitle, tag, attribute, value|null, src }
 * `value` is what Reports scanned (null when the attribute is absent) and
 * `src` the element's source, which tells two elements on one page apart.
 * Rows pair with server blocks by tag, attribute, stored value and source;
 * when a page holds the same pair more than once, the nth row pairs with the
 * nth block, and only when both sides count the same number of them.
 *
 * Pages are saved one after another, at most `maxPages` per call (one click
 * of Save). The backend also caps block changes per site per minute; a 429
 * stops the run and the rest stays edited for the next click.
 */
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { waitForHAXCMSSiteApiRegistryReady } from "../utils/haxcms-site-api-registry.js";
import { haxcmsApiMessage } from "../utils/HAXCMSApiMessages.js";

export const BLOCK_LIST_OPERATION = "@site/listContentBlocks";
export const BLOCK_SAVE_OPERATION = "@site/updateContentBlocks";
/** pages saved per click when the rules file does not say */
export const BLOCK_SAVE_MAX_PAGES = 20;
/** ops per request; the backend refuses more */
export const BLOCK_SAVE_MAX_OPS = 200;
/** commit note for alt text saved from the accessibility screen */
export const ALT_SAVE_NOTE = "Alt text from Reports";

/**
 * Failure kinds a row can end with. The screen turns each into its own words;
 * `message` carries the backend's text when there is one.
 *  - stale: the element changed on the server since Reports scanned it
 *  - locked: the page is locked
 *  - refused: the backend refused the value (data.detail says why)
 *  - missing: the page is gone
 *  - error: anything else (network, sign-in, server error)
 */
export const BLOCK_SAVE_FAILURES = [
  "stale",
  "locked",
  "refused",
  "missing",
  "error",
];

function hasOps() {
  return !!(
    MicroFrontendRegistry &&
    typeof MicroFrontendRegistry.has === "function" &&
    MicroFrontendRegistry.has(BLOCK_LIST_OPERATION) &&
    MicroFrontendRegistry.has(BLOCK_SAVE_OPERATION)
  );
}

/**
 * True when this site's backend can save block changes (an editor on a
 * HAXcms server). False on published or static copies.
 * @returns {Promise<boolean>}
 */
export async function blockSaveAvailable() {
  try {
    await waitForHAXCMSSiteApiRegistryReady();
  } catch {
    return false;
  }
  return hasOps();
}

function defaultCall(name, params) {
  return MicroFrontendRegistry.call(name, params, null, null);
}

/** the text sent for an edit: trimmed, as the backend would store it */
export function blockValue(value) {
  return String(value === null || value === undefined ? "" : value).trim();
}

function sameValue(a, b) {
  const x = a === null || a === undefined ? null : String(a);
  const y = b === null || b === undefined ? null : String(b);
  return x === y;
}

function has(obj, key) {
  return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * Where each image tag keeps its source, from the rules file, as the
 * `srcAttributes` option: tag -> [attribute names, first non-empty wins].
 */
export function imageSrcAttributes(spec) {
  const out = {};
  const list =
    spec && spec.accessibility && Array.isArray(spec.accessibility.imageTags)
      ? spec.accessibility.imageTags
      : [];
  list.forEach((entry) => {
    if (entry && typeof entry.tag === "string") {
      const name = typeof entry.src === "string" ? entry.src : "src";
      out[entry.tag] = name === "src" ? ["src"] : [name, "src"];
    }
  });
  if (!Object.keys(out).length) {
    out.img = ["src"];
  }
  return out;
}

/**
 * Save options for the accessibility screen's alt rows. Alt rows come from
 * the analyzer as { tag, src, alt, ... }; this reads them as attribute "alt".
 */
export function altSaveOptions(spec) {
  return {
    srcAttributes: imageSrcAttributes(spec),
    note: ALT_SAVE_NOTE,
    allowEmpty: true,
    rowAttribute: () => "alt",
    rowValue: (row) => (row ? row.alt : null),
  };
}

function rowAttributeOf(options, row) {
  return typeof options.rowAttribute === "function"
    ? options.rowAttribute(row)
    : row.attribute;
}

function rowValueOf(options, row) {
  return typeof options.rowValue === "function"
    ? options.rowValue(row)
    : row.value;
}

function keyOf(tag, attribute, value, src) {
  return JSON.stringify([
    tag,
    attribute,
    value === undefined ? null : value,
    src || "",
  ]);
}

function blockSrc(block, srcAttributes) {
  const attrs = (block && block.attributes) || {};
  const names = (srcAttributes && srcAttributes[block.tag]) || [];
  for (let i = 0; i < names.length; i++) {
    if (attrs[names[i]]) {
      return attrs[names[i]];
    }
  }
  return "";
}

/**
 * Group edited rows by page, in row order. Rows whose edit equals what is
 * stored are left out (nothing to send), and so are empty edits unless
 * `options.allowEmpty` (an empty alt is meaningful; an empty title is not).
 * @param {Array} rows
 * @param {Object} edits row index -> edited value
 * @param {Object} [options] see saveBlockEdits
 * @returns {Array<{pageId, slug, title, rows: Array, items: Array}>}
 *   `rows` is every row on the page as { i, row }, `items` the edited ones
 *   as { i, row, value }
 */
export function groupBlockEdits(rows, edits, options) {
  const o = options || {};
  const pages = [];
  const byId = new Map();
  (rows || []).forEach((row, i) => {
    if (!row || !row.pageId) {
      return;
    }
    let page = byId.get(row.pageId);
    if (!page) {
      page = {
        pageId: row.pageId,
        slug: row.slug || "",
        title: row.pageTitle || row.title || "",
        rows: [],
        items: [],
      };
      byId.set(row.pageId, page);
      pages.push(page);
    }
    page.rows.push({ i, row });
    if (has(edits, i)) {
      const value = blockValue(edits[i]);
      if (value === "" && !o.allowEmpty) {
        return;
      }
      if (!sameValue(value, rowValueOf(o, row))) {
        page.items.push({ i, row, value });
      }
    }
  });
  return pages.filter((page) => page.items.length > 0);
}

/**
 * Find the server block for each edited row.
 * @param {Object} page from groupBlockEdits
 * @param {Array} blocks `blocks` from GET .../blocks
 * @param {Object} [options] see saveBlockEdits
 * @returns {{ops: Array, opRows: Array<number>, unmatched: Array<number>}}
 */
export function matchBlocks(page, blocks, options) {
  const o = options || {};
  const srcAttributes = o.srcAttributes || {};
  const attributeOf = (row) => rowAttributeOf(o, row);
  const wanted = new Set();
  page.rows.forEach(({ row }) => {
    wanted.add(JSON.stringify([row.tag, attributeOf(row)]));
  });
  const serverByKey = new Map();
  (blocks || []).forEach((block) => {
    if (!block || typeof block.tag !== "string") {
      return;
    }
    const attrs = block.attributes || {};
    const src = blockSrc(block, srcAttributes);
    wanted.forEach((pair) => {
      const [tag, attribute] = JSON.parse(pair);
      if (tag !== block.tag) {
        return;
      }
      const value = has(attrs, attribute) ? attrs[attribute] : null;
      const key = keyOf(tag, attribute, value, src);
      if (!serverByKey.has(key)) {
        serverByKey.set(key, []);
      }
      serverByKey.get(key).push(block);
    });
  });
  const rowKey = (row) =>
    keyOf(row.tag, attributeOf(row), rowValueOf(o, row), row.src || "");
  const rank = new Map();
  const localCount = new Map();
  page.rows.forEach(({ i, row }) => {
    const key = rowKey(row);
    const n = localCount.get(key) || 0;
    rank.set(i, n);
    localCount.set(key, n + 1);
  });
  // two edited rows on one element (say its src and its longdesc) become
  // one op, so the second does not fail on the first one's new `before`
  const opByBlock = new Map();
  const ops = [];
  const opRows = [];
  const unmatched = [];
  page.items.forEach((item) => {
    const key = rowKey(item.row);
    const found = serverByKey.get(key) || [];
    const block =
      found.length === localCount.get(key) ? found[rank.get(item.i)] : null;
    if (!block) {
      unmatched.push(item.i);
      return;
    }
    const attribute = attributeOf(item.row);
    const blockId = `${block.tag}#${block.index}`;
    const existing = opByBlock.get(blockId);
    if (existing && !has(existing.op.set, attribute)) {
      existing.op.set[attribute] = item.value;
      existing.rows.push(item.i);
      return;
    }
    if (existing) {
      // the same attribute twice on one element: only one can win
      unmatched.push(item.i);
      return;
    }
    const op = {
      op: "setAttributes",
      tag: block.tag,
      index: block.index,
      before: block.before,
      set: { [attribute]: item.value },
    };
    const entry = { op, rows: [item.i] };
    opByBlock.set(blockId, entry);
    ops.push(op);
    opRows.push(entry.rows);
  });
  return { ops, opRows, unmatched };
}

function statusOf(response) {
  if (response && typeof response.status === "number") {
    return response.status;
  }
  return response && response.data ? 200 : 0;
}

function bodyData(response) {
  const body = response && response.body ? response.body : response;
  return body && body.data && typeof body.data === "object" ? body.data : {};
}

function failureKind(status) {
  if (status === 409) {
    return "stale";
  }
  if (status === 423) {
    return "locked";
  }
  if (status === 404) {
    return "missing";
  }
  if (status === 400) {
    return "refused";
  }
  return "error";
}

function flat(lists) {
  return lists.reduce((all, list) => all.concat(list), []);
}

/**
 * Save edited rows, one page per request, at most `maxPages` pages.
 * @param {Array} rows
 * @param {Object} edits row index -> edited value
 * @param {Object} [o]
 * @param {string} [o.note] commit note the backend adds to each page's change
 * @param {Object} [o.srcAttributes] tag -> [names] holding an element's source
 * @param {boolean} [o.allowEmpty] whether an empty edit is sent
 * @param {Function} [o.rowAttribute] row -> attribute (default row.attribute)
 * @param {Function} [o.rowValue] row -> stored value (default row.value)
 * @param {number} [o.maxPages]
 * @param {Function} [o.onProgress] called with { done, total, title }
 * @param {Function} [o.call] (operationName, params) => response; defaults
 *   to MicroFrontendRegistry.call
 * @returns {Promise<{saved: Object, failed: Object, pagesSaved: number,
 *   pagesTried: number, pagesLeft: number, stopped: null|{status, message,
 *   retryAfter}}>} `saved` maps row index -> stored value, `failed` maps row
 *   index -> { kind, message }
 */
export async function saveBlockEdits(rows, edits, o) {
  const options = o || {};
  const call = typeof options.call === "function" ? options.call : defaultCall;
  const maxPages =
    typeof options.maxPages === "number" && options.maxPages > 0
      ? Math.floor(options.maxPages)
      : BLOCK_SAVE_MAX_PAGES;
  const pages = groupBlockEdits(rows, edits, options);
  const todo = pages.slice(0, maxPages);
  const outcome = {
    saved: {},
    failed: {},
    pagesSaved: 0,
    pagesTried: 0,
    pagesLeft: pages.length - todo.length,
    stopped: null,
  };
  const progress = (done, title) => {
    if (typeof options.onProgress === "function") {
      options.onProgress({ done, total: todo.length, title: title || "" });
    }
  };
  const failAll = (indexes, kind, message) => {
    indexes.forEach((i) => {
      outcome.failed[i] = { kind, message: message || "" };
    });
  };
  for (let p = 0; p < todo.length; p++) {
    const page = todo[p];
    progress(p, page.title);
    outcome.pagesTried++;
    const result = await savePage(page, options, call);
    Object.keys(result.saved).forEach((i) => {
      outcome.saved[i] = result.saved[i];
    });
    Object.keys(result.failed).forEach((i) => {
      outcome.failed[i] = result.failed[i];
    });
    if (Object.keys(result.saved).length) {
      outcome.pagesSaved++;
    }
    if (result.stop) {
      // this page's unsaved rows stay edited, like the pages after it
      outcome.pagesTried--;
      outcome.pagesLeft += todo.length - p;
      outcome.stopped = result.stop;
      break;
    }
    if (result.halt) {
      // sign-in or permission problems will not clear on the next page
      failAll(
        flat(todo.slice(p + 1).map((next) => next.items.map((x) => x.i))),
        "error",
        result.message,
      );
      outcome.pagesTried = todo.length;
      break;
    }
  }
  progress(outcome.pagesTried, "");
  return outcome;
}

async function listBlocks(page, call) {
  const response = await call(BLOCK_LIST_OPERATION, {
    idOrSlug: page.pageId,
  });
  const status = statusOf(response);
  const data =
    response && response.data && typeof response.data === "object"
      ? response.data
      : null;
  if (status === 200 && data && Array.isArray(data.blocks)) {
    return { ok: true, blocks: data.blocks };
  }
  return { ok: false, status, response };
}

/** stop the whole run (rate limit) */
function stopFor(status, response) {
  const data = bodyData(response);
  return {
    status,
    message: haxcmsApiMessage(response, ""),
    retryAfter: typeof data.retryAfter === "number" ? data.retryAfter : 0,
  };
}

async function savePage(page, options, call) {
  const saved = {};
  const failed = {};
  const allRows = page.items.map((x) => x.i);
  const valueOf = {};
  page.items.forEach((x) => {
    valueOf[x.i] = x.value;
  });
  const fail = (indexes, kind, message) => {
    indexes.forEach((i) => {
      failed[i] = { kind, message: message || "" };
    });
  };
  const params = { idOrSlug: page.pageId };
  if (options.note) {
    params.note = options.note;
  }
  let refetched = false;
  let refusedRetry = false;
  let listed = await listBlocks(page, call);
  let pending = page.items;
  // a loop instead of recursion: at most one refetch and one refused retry
  for (let attempt = 0; attempt < 4; attempt++) {
    if (!listed.ok) {
      if (listed.status === 429) {
        return { saved, failed, stop: stopFor(429, listed.response) };
      }
      const message = haxcmsApiMessage(listed.response, "");
      fail(
        pending.map((x) => x.i),
        failureKind(listed.status),
        message,
      );
      return {
        saved,
        failed,
        halt: listed.status === 401 || listed.status === 403,
        message,
      };
    }
    const matched = matchBlocks(
      Object.assign({}, page, { items: pending }),
      listed.blocks,
      options,
    );
    fail(matched.unmatched, "stale", "");
    if (!matched.ops.length) {
      return { saved, failed };
    }
    const chunkOps = matched.ops.slice(0, BLOCK_SAVE_MAX_OPS);
    const chunkRowLists = matched.opRows.slice(0, BLOCK_SAVE_MAX_OPS);
    const chunkRows = flat(chunkRowLists);
    const response = await call(
      BLOCK_SAVE_OPERATION,
      Object.assign({}, params, { ops: chunkOps }),
    );
    const status = statusOf(response);
    if (status === 200) {
      chunkRows.forEach((i) => {
        saved[i] = valueOf[i];
      });
      const rest = flat(matched.opRows.slice(BLOCK_SAVE_MAX_OPS));
      if (!rest.length) {
        return { saved, failed };
      }
      // more than one request's worth on this page: list again, since the
      // saved elements now hold their new values
      pending = page.items.filter((x) => rest.indexOf(x.i) !== -1);
      listed = await listBlocks(page, call);
      continue;
    }
    if (status === 429) {
      return { saved, failed, stop: stopFor(429, response) };
    }
    const message = haxcmsApiMessage(response, "");
    const data = bodyData(response);
    if (status === 409 && !refetched) {
      // someone changed the page since the list; list once more and retry
      refetched = true;
      pending = page.items.filter((x) => chunkRows.indexOf(x.i) !== -1);
      listed = await listBlocks(page, call);
      continue;
    }
    if (
      status === 400 &&
      !refusedRetry &&
      typeof data.op === "number" &&
      data.op >= 0 &&
      data.op < chunkRowLists.length
    ) {
      // one op refused: mark its rows and send the others again (nothing
      // was written, so their `before` still holds)
      refusedRetry = true;
      const bad = chunkRowLists[data.op];
      fail(bad, "refused", data.detail || message);
      pending = page.items.filter(
        (x) => bad.indexOf(x.i) === -1 && chunkRows.indexOf(x.i) !== -1,
      );
      if (!pending.length) {
        return { saved, failed };
      }
      continue;
    }
    fail(chunkRows, failureKind(status), message);
    return {
      saved,
      failed,
      halt: status === 401 || status === 403,
      message,
    };
  }
  fail(
    allRows.filter((i) => !has(saved, i) && !has(failed, i)),
    "error",
    "",
  );
  return { saved, failed };
}
