/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Saves alt text edited on the Reports accessibility screen through the
 * site's block operations API (haxtheweb/issues#3270):
 * GET x/api/v1/content/{idOrSlug}/blocks lists a page's images with the
 * { tag, index, before } that addresses each one, and one PATCH per page sets
 * their alt. The backend refuses a change when the image no longer matches
 * `before`, so nothing a person did not see on this screen is overwritten.
 *
 * Pages are saved one after another, at most `maxPages` per call (one click
 * of Save). The backend also caps block changes per site per minute; a 429
 * stops the run and the rest stays edited for the next click.
 */
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { waitForHAXCMSSiteApiRegistryReady } from "../utils/haxcms-site-api-registry.js";
import { haxcmsApiMessage } from "../utils/HAXCMSApiMessages.js";

export const ALT_LIST_OPERATION = "@site/listContentBlocks";
export const ALT_SAVE_OPERATION = "@site/updateContentBlocks";
/** commit note the backend adds to each page's change */
export const ALT_SAVE_NOTE = "Alt text from Reports";
/** pages saved per click when the rules file does not say */
export const ALT_SAVE_MAX_PAGES = 20;
/** ops per request; the backend refuses more */
export const ALT_SAVE_MAX_OPS = 200;

/**
 * Failure kinds a row can end with. The screen turns each into its own words;
 * `message` carries the backend's text when there is one.
 *  - stale: the image changed on the server since Reports scanned it
 *  - locked: the page is locked
 *  - refused: the backend refused the value (data.detail says why)
 *  - missing: the page is gone
 *  - error: anything else (network, sign-in, server error)
 */
export const ALT_SAVE_FAILURES = [
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
    MicroFrontendRegistry.has(ALT_LIST_OPERATION) &&
    MicroFrontendRegistry.has(ALT_SAVE_OPERATION)
  );
}

/**
 * True when this site's backend can save block changes (an editor on a
 * HAXcms server). False on published or static copies.
 * @returns {Promise<boolean>}
 */
export async function altSaveAvailable() {
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

/** the attribute each image tag keeps its source in, from the rules file */
export function imageSrcAttributes(spec) {
  const out = {};
  const list =
    spec && spec.accessibility && Array.isArray(spec.accessibility.imageTags)
      ? spec.accessibility.imageTags
      : [];
  list.forEach((entry) => {
    if (entry && typeof entry.tag === "string") {
      out[entry.tag] = typeof entry.src === "string" ? entry.src : "src";
    }
  });
  return out;
}

/** the text sent for an edit: trimmed, as the backend would store it */
export function altValue(value) {
  return String(value === null || value === undefined ? "" : value).trim();
}

function sameAlt(a, b) {
  const x = a === null || a === undefined ? null : String(a);
  const y = b === null || b === undefined ? null : String(b);
  return x === y;
}

function rowKey(tag, src, alt) {
  return JSON.stringify([tag, src, alt === undefined ? null : alt]);
}

function blockSrc(block, srcAttrs) {
  const attrs = (block && block.attributes) || {};
  const name = srcAttrs[block.tag] || "src";
  return attrs[name] || attrs.src || "";
}

/**
 * Group edited rows by page, in row order. Rows whose edit equals what is
 * stored are left out (nothing to send).
 * @param {Array} rows altRows from the analyzer
 * @param {Object} edits row index -> edited alt
 * @returns {Array<{pageId, slug, title, rows: Array, items: Array}>}
 *   `rows` is every row on the page as { i, row }, `items` the edited ones
 *   as { i, row, value }
 */
export function groupAltEdits(rows, edits) {
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
    if (edits && Object.prototype.hasOwnProperty.call(edits, i)) {
      const value = altValue(edits[i]);
      if (!sameAlt(value, row.alt)) {
        page.items.push({ i, row, value });
      }
    }
  });
  return pages.filter((page) => page.items.length > 0);
}

/**
 * Find the server block for each edited row. Rows and blocks are paired by
 * tag, source and stored alt; when a page holds the same image with the same
 * alt more than once, the nth such row pairs with the nth such block, and
 * only when both sides count the same number of them.
 * @param {Object} page from groupAltEdits
 * @param {Array} blocks `blocks` from GET .../blocks
 * @param {Object} srcAttrs from imageSrcAttributes
 * @returns {{ops: Array, opRows: Array<number>, unmatched: Array<number>}}
 */
export function matchAltBlocks(page, blocks, srcAttrs) {
  const serverByKey = new Map();
  (blocks || []).forEach((block) => {
    if (!block || !Object.prototype.hasOwnProperty.call(srcAttrs, block.tag)) {
      return;
    }
    const attrs = block.attributes || {};
    const alt = Object.prototype.hasOwnProperty.call(attrs, "alt")
      ? attrs.alt
      : null;
    const key = rowKey(block.tag, blockSrc(block, srcAttrs), alt);
    if (!serverByKey.has(key)) {
      serverByKey.set(key, []);
    }
    serverByKey.get(key).push(block);
  });
  const rank = new Map();
  const localCount = new Map();
  page.rows.forEach(({ i, row }) => {
    const key = rowKey(row.tag, row.src || "", row.alt);
    const n = localCount.get(key) || 0;
    rank.set(i, n);
    localCount.set(key, n + 1);
  });
  const ops = [];
  const opRows = [];
  const unmatched = [];
  page.items.forEach((item) => {
    const key = rowKey(item.row.tag, item.row.src || "", item.row.alt);
    const found = serverByKey.get(key) || [];
    const block =
      found.length === localCount.get(key) ? found[rank.get(item.i)] : null;
    if (!block) {
      unmatched.push(item.i);
      return;
    }
    ops.push({
      op: "setAttributes",
      tag: block.tag,
      index: block.index,
      before: block.before,
      set: { alt: item.value },
    });
    opRows.push(item.i);
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

/**
 * Save edited alt text, one page per request, at most `maxPages` pages.
 * @param {Array} rows altRows from the analyzer
 * @param {Object} edits row index -> edited alt
 * @param {Object} [o]
 * @param {Object} [o.spec] insights rules (image tags)
 * @param {number} [o.maxPages]
 * @param {Function} [o.onProgress] called with { done, total, title }
 * @param {Function} [o.call] (operationName, params) => response; defaults
 *   to MicroFrontendRegistry.call
 * @returns {Promise<{saved: Object, failed: Object, pagesSaved: number,
 *   pagesTried: number, pagesLeft: number, stopped: null|{status, message,
 *   retryAfter}}>} `saved` maps row index -> stored alt, `failed` maps row
 *   index -> { kind, message }
 */
export async function saveAltEdits(rows, edits, o) {
  const options = o || {};
  const call = typeof options.call === "function" ? options.call : defaultCall;
  const srcAttrs = imageSrcAttributes(options.spec);
  if (!Object.keys(srcAttrs).length) {
    srcAttrs.img = "src";
  }
  const maxPages =
    typeof options.maxPages === "number" && options.maxPages > 0
      ? Math.floor(options.maxPages)
      : ALT_SAVE_MAX_PAGES;
  const pages = groupAltEdits(rows, edits);
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
    const result = await savePage(page, srcAttrs, call);
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
        todo
          .slice(p + 1)
          .reduce((all, next) => all.concat(next.items.map((x) => x.i)), []),
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
  const response = await call(ALT_LIST_OPERATION, {
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

async function savePage(page, srcAttrs, call) {
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
  let refetched = false;
  let refusedRetry = false;
  let listed = await listBlocks(page, call);
  let matched = null;
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
    matched = matchAltBlocks(
      Object.assign({}, page, { items: pending }),
      listed.blocks,
      srcAttrs,
    );
    fail(matched.unmatched, "stale", "");
    if (!matched.ops.length) {
      return { saved, failed };
    }
    const chunkOps = matched.ops.slice(0, ALT_SAVE_MAX_OPS);
    const chunkRows = matched.opRows.slice(0, ALT_SAVE_MAX_OPS);
    const response = await call(ALT_SAVE_OPERATION, {
      idOrSlug: page.pageId,
      ops: chunkOps,
      note: ALT_SAVE_NOTE,
    });
    const status = statusOf(response);
    if (status === 200) {
      chunkRows.forEach((i) => {
        saved[i] = valueOf[i];
      });
      const rest = matched.opRows.slice(ALT_SAVE_MAX_OPS);
      if (!rest.length) {
        return { saved, failed };
      }
      // more than one request's worth on this page: list again, since the
      // saved images now hold their new alt
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
      data.op < chunkRows.length
    ) {
      // one value refused: mark it and send the others again (nothing was
      // written, so their `before` still holds)
      refusedRetry = true;
      const bad = chunkRows[data.op];
      fail([bad], "refused", data.detail || message);
      pending = page.items.filter(
        (x) => x.i !== bad && chunkRows.indexOf(x.i) !== -1,
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
    allRows.filter(
      (i) =>
        !Object.prototype.hasOwnProperty.call(saved, i) &&
        !Object.prototype.hasOwnProperty.call(failed, i),
    ),
    "error",
    "",
  );
  return { saved, failed };
}
