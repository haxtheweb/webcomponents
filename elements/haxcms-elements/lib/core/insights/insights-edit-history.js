/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 *
 * Edit history for the Freshness screen of Reports (haxtheweb/issues#3167).
 *
 * Reads the site's git history through the page revisions endpoint the
 * page history dialog already uses (GET x/api/v1/items/{id}/revisions,
 * operation @site/listItemRevisions) for the most recently saved pages, and
 * folds the answers into one list of changes, newest first. A change that
 * touched several pages (a bulk save, a move) is one row naming each page.
 *
 * Answers are kept for the page's life so moving between Reports screens
 * does not reload them. Nothing is saved anywhere else.
 */
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { waitForHAXCMSSiteApiRegistryReady } from "../utils/haxcms-site-api-registry.js";

export const HISTORY_OPERATION = "@site/listItemRevisions";
/** how many of the most recently saved pages to read history for */
export const HISTORY_PAGES = 10;
/** revisions read per page */
export const HISTORY_PER_PAGE = 5;
const CONCURRENCY = 3;

let cache = { key: "", result: null };

/**
 * True when this site's backend can read its history (an editor on a
 * HAXcms server). False on published or static copies.
 * @returns {Promise<boolean>}
 */
export async function editHistoryAvailable() {
  try {
    await waitForHAXCMSSiteApiRegistryReady();
  } catch {
    return false;
  }
  return !!(
    MicroFrontendRegistry &&
    typeof MicroFrontendRegistry.has === "function" &&
    MicroFrontendRegistry.has(HISTORY_OPERATION)
  );
}

/**
 * The HISTORY_PAGES most recently saved pages from Freshness page rows.
 * @param {Array} pages results.freshness.pages
 */
export function recentlySavedPages(pages) {
  return (Array.isArray(pages) ? pages : [])
    .filter(
      (p) =>
        p &&
        p.pageId &&
        p.daysSinceUpdate !== null &&
        p.daysSinceUpdate !== undefined,
    )
    .slice()
    .sort((a, b) => a.daysSinceUpdate - b.daysSinceUpdate)
    .slice(0, HISTORY_PAGES);
}

/** The last loaded history for these pages, or null. */
export function cachedEditHistory(pages) {
  const key = (pages || []).map((p) => p.pageId).join("|");
  return cache.key === key ? cache.result : null;
}

async function pageRevisions(page) {
  const response = await MicroFrontendRegistry.call(
    HISTORY_OPERATION,
    { idOrSlug: page.pageId, "page.limit": HISTORY_PER_PAGE },
    null,
    null,
  );
  const status =
    response && typeof response.status === "number" ? response.status : 0;
  const data =
    response && response.data && typeof response.data === "object"
      ? response.data
      : null;
  if (
    (status === 200 || status === 0) &&
    data &&
    Array.isArray(data.revisions)
  ) {
    return data.revisions;
  }
  return null;
}

/**
 * Load and merge the history of `pages` ([{ pageId, title, slug }]).
 * Resolves { entries, failed } where each entry is one change:
 * { hash, shortHash, author, timestamp, date, summary, kind, pages }.
 * @param {Array} pages
 */
export async function loadEditHistory(pages) {
  const list = Array.isArray(pages) ? pages : [];
  const byHash = new Map();
  let failed = 0;
  let index = 0;
  async function next() {
    while (index < list.length) {
      const page = list[index];
      index++;
      let revisions = null;
      try {
        revisions = await pageRevisions(page);
      } catch {
        revisions = null;
      }
      if (!revisions) {
        failed++;
        continue;
      }
      revisions.forEach((r) => {
        if (!r || !r.hash) {
          return;
        }
        if (!byHash.has(r.hash)) {
          byHash.set(r.hash, {
            hash: r.hash,
            shortHash: r.shortHash || String(r.hash).substring(0, 7),
            author: r.author || "",
            timestamp: typeof r.timestamp === "number" ? r.timestamp : 0,
            date: r.date || "",
            summary: r.summary || r.message || "",
            kinds: [],
            pages: [],
          });
        }
        const entry = byHash.get(r.hash);
        if (r.kind && entry.kinds.indexOf(r.kind) === -1) {
          entry.kinds.push(r.kind);
        }
        if (!entry.pages.some((p) => p.pageId === page.pageId)) {
          entry.pages.push({
            pageId: page.pageId,
            title: page.title,
            slug: page.slug,
          });
        }
      });
    }
  }
  const runners = [];
  for (let i = 0; i < Math.min(CONCURRENCY, list.length); i++) {
    runners.push(next());
  }
  await Promise.all(runners);
  const entries = Array.from(byHash.values()).sort(
    (a, b) => b.timestamp - a.timestamp,
  );
  const result = { entries: entries, failed: failed, pages: list.length };
  cache = { key: list.map((p) => p.pageId).join("|"), result: result };
  return result;
}

/** Test-only: forget the cached history. */
export function _resetEditHistory() {
  cache = { key: "", result: null };
}
