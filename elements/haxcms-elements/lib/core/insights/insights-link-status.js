/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Outside link status for Reports (haxtheweb/issues#3167).
 *
 * Asks the site's own backend, POST x/api/v1/site/check-links (operation
 * @site/checkSiteLinks), whether outside links still answer. A browser cannot
 * tell by itself: a cross-origin fetch in no-cors mode is opaque, so a 404
 * and a 200 look the same. The backend only checks links that are in this
 * site's pages, caps each request at LINK_CHECK_BATCH links, rate limits per
 * user and site, and caches answers, so nothing here goes to a third party.
 *
 * Answers are kept for the page's life in one shared map so the Links and
 * Overview screens (each its own element) agree, and moving between screens
 * does not re-check. Nothing is saved anywhere else.
 */
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { waitForHAXCMSSiteApiRegistryReady } from "../utils/haxcms-site-api-registry.js";
import { haxcmsApiMessage } from "../utils/HAXCMSApiMessages.js";

export const LINK_CHECK_OPERATION = "@site/checkSiteLinks";
/** links per request; the backend refuses more */
export const LINK_CHECK_BATCH = 25;
/** states a result can have, in display order */
export const LINK_STATES = ["broken", "check", "redirected", "ok", "skipped"];
// a request that runs out of time answers "deferred"; send those again
const MAX_PASSES = 4;

const results = new Map();
const listeners = new Set();
let running = null;

function notify() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch {
      // a listener's failure is its own
    }
  });
}

function hasOperation() {
  return !!(
    MicroFrontendRegistry &&
    typeof MicroFrontendRegistry.has === "function" &&
    MicroFrontendRegistry.has(LINK_CHECK_OPERATION)
  );
}

/**
 * True when this site's backend can check links (an editor on a HAXcms
 * server). False on published or static copies.
 * @returns {Promise<boolean>}
 */
export async function linkCheckAvailable() {
  try {
    await waitForHAXCMSSiteApiRegistryReady();
  } catch {
    return false;
  }
  return hasOperation();
}

/**
 * The last answer for an href, or null.
 * @param {string} href as written in the page
 */
export function getLinkStatus(href) {
  const key = typeof href === "string" ? href.trim() : "";
  return results.has(key) ? results.get(key) : null;
}

/**
 * Counts of each state over `hrefs`, plus how many have no answer yet.
 * @param {string[]} hrefs
 */
export function linkStatusSummary(hrefs) {
  const summary = {
    total: 0,
    checked: 0,
    unchecked: 0,
    ok: 0,
    redirected: 0,
    broken: 0,
    check: 0,
    skipped: 0,
  };
  const seen = new Set();
  (hrefs || []).forEach((href) => {
    const key = typeof href === "string" ? href.trim() : "";
    if (key === "" || seen.has(key)) {
      return;
    }
    seen.add(key);
    summary.total++;
    const row = results.get(key);
    if (!row || row.reason === "deferred") {
      summary.unchecked++;
      return;
    }
    summary.checked++;
    if (Object.prototype.hasOwnProperty.call(summary, row.state)) {
      summary[row.state]++;
    }
  });
  return summary;
}

/**
 * Call `fn` whenever answers change. Returns the unsubscribe function.
 * @param {Function} fn
 */
export function onLinkStatusChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** True while a check is running. */
export function linkCheckRunning() {
  return running !== null;
}

async function sendBatch(batch) {
  const response = await MicroFrontendRegistry.call(
    LINK_CHECK_OPERATION,
    { links: batch },
    null,
    null,
  );
  const status =
    response && typeof response.status === "number" ? response.status : 0;
  const data =
    response && response.data && typeof response.data === "object"
      ? response.data
      : null;
  if ((status === 200 || status === 0) && data && Array.isArray(data.results)) {
    return { ok: true, results: data.results };
  }
  let retryAfterSeconds = 0;
  const body = response && response.body ? response.body : response;
  if (body && body.data && typeof body.data.retryAfterSeconds === "number") {
    retryAfterSeconds = body.data.retryAfterSeconds;
  }
  return {
    ok: false,
    status: status,
    retryAfterSeconds: retryAfterSeconds,
    message: haxcmsApiMessage(body, ""),
  };
}

async function run(hrefs, o) {
  const options = o || {};
  const unique = [];
  const seen = new Set();
  (hrefs || []).forEach((href) => {
    const key = typeof href === "string" ? href.trim() : "";
    if (key === "" || seen.has(key)) {
      return;
    }
    seen.add(key);
    const known = results.get(key);
    if (!options.force && known && known.reason !== "deferred") {
      return;
    }
    unique.push(key);
  });
  const outcome = {
    total: unique.length,
    done: 0,
    error: "",
    status: 0,
    retryAfterSeconds: 0,
  };
  const progress = () => {
    if (typeof options.onProgress === "function") {
      options.onProgress({ done: outcome.done, total: outcome.total });
    }
  };
  progress();
  let queue = unique;
  for (let pass = 0; pass < MAX_PASSES && queue.length; pass++) {
    const again = [];
    for (let i = 0; i < queue.length; i += LINK_CHECK_BATCH) {
      if (options.signal && options.signal.aborted) {
        return outcome;
      }
      const batch = queue.slice(i, i + LINK_CHECK_BATCH);
      const answer = await sendBatch(batch);
      if (!answer.ok) {
        outcome.error = answer.message || "";
        outcome.status = answer.status;
        outcome.retryAfterSeconds = answer.retryAfterSeconds;
        notify();
        return outcome;
      }
      answer.results.forEach((row) => {
        if (!row || typeof row.href !== "string") {
          return;
        }
        results.set(row.href, row);
        if (row.reason === "deferred") {
          again.push(row.href);
        } else {
          outcome.done++;
        }
      });
      progress();
      notify();
    }
    queue = again;
  }
  return outcome;
}

/**
 * Check `hrefs` (outside links as written in the pages). Links that already
 * have an answer are skipped unless `force`. One check runs at a time; a
 * second call while one runs waits for it and returns its outcome.
 * @param {string[]} hrefs
 * @param {{force?: boolean, onProgress?: Function, signal?: AbortSignal}} [o]
 * @returns {Promise<{total:number, done:number, error:string, status:number,
 *   retryAfterSeconds:number}>}
 */
export async function checkLinks(hrefs, o) {
  if (running) {
    return running;
  }
  if (!(await linkCheckAvailable())) {
    return {
      total: 0,
      done: 0,
      error: "",
      status: 0,
      retryAfterSeconds: 0,
      unavailable: true,
    };
  }
  running = run(hrefs, o).finally(() => {
    running = null;
    notify();
  });
  notify();
  return running;
}

/** Test-only: forget every answer. */
export function _resetLinkStatus() {
  results.clear();
  running = null;
  notify();
}
