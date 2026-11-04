/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Learning activity scan: which elements on a site's pages can send xAPI
 * statements, counted from the page HTML alone (no learner data).
 *
 * - Vocabulary: the generated xAPI vocabulary of trackable elements
 *   (@haxtheweb/user-action/lib/xapi-vocabulary.js, built from each
 *   element's static xapiVocabulary into xapi-vocabulary.json/.js): tag ->
 *   verbs, objectType, interactionType, result fields, countsTowardCompletion
 *   and the done rule.
 * - Page HTML: the same requests as the Insights scan
 *   (insights-loader.js loadInsightsPages: one site export, or one content
 *   request per page for a branch) and the same parser (insights-html.js
 *   parseHtml, an inert DOMParser document or the built-in tree parser).
 *   Nothing is rendered or run; tags are only counted.
 * - Cache: counts per page id, shared by the report and the Activities
 *   column of the site admin Content table. A save of the active page drops its entry; fresh content for the
 *   active page replaces it.
 *
 * Kept free of UI so it can move into a plugin with the report element
 * (learning-activity-report.js).
 */
import { XAPI_VOCABULARY } from "@haxtheweb/user-action/lib/xapi-vocabulary.js";
import { parseHtml } from "./insights-html.js";
import {
  fetchInsightsPages,
  loadInsightsPages,
  resolveSiteUrls,
} from "./insights-loader.js";

/**
 * Element groups, in table / legend order. Derived from the vocabulary:
 * an interactionType makes a question; otherwise the activity type
 * (objectType) decides.
 */
export const LEARNING_ACTIVITY_GROUPS = [
  "questions",
  "media",
  "checklists",
  "games",
  "other",
];

const OBJECT_TYPE_GROUPS = new Map([
  ["cmi.interaction", "questions"],
  ["question", "questions"],
  ["assessment", "questions"],
  ["media", "media"],
  ["objective", "checklists"],
  ["simulation", "games"],
]);

/**
 * Group of one vocabulary entry.
 * @param {Object} entry vocabulary entry
 * @returns {string} one of LEARNING_ACTIVITY_GROUPS
 */
export function activityGroupOf(entry) {
  if (!entry || typeof entry !== "object") {
    return "other";
  }
  if (typeof entry.interactionType === "string" && entry.interactionType) {
    return "questions";
  }
  const type = typeof entry.objectType === "string" ? entry.objectType : "";
  const last = type.split("/").pop();
  return OBJECT_TYPE_GROUPS.has(last) ? OBJECT_TYPE_GROUPS.get(last) : "other";
}

/**
 * The vocabulary as a Map of tag -> entry (plus its group), sorted by tag.
 * @param {Object} [vocabulary] default the generated XAPI_VOCABULARY
 * @returns {Map<string, Object>}
 */
export function vocabularyMap(vocabulary) {
  const source =
    vocabulary && typeof vocabulary === "object" ? vocabulary : XAPI_VOCABULARY;
  const map = new Map();
  Object.keys(source)
    .sort()
    .forEach((tag) => {
      const entry = source[tag];
      if (entry && typeof entry === "object") {
        map.set(tag, {
          ...entry,
          tag,
          group: activityGroupOf(entry),
          verbs: Array.isArray(entry.verbs) ? entry.verbs.slice() : [],
          result: Array.isArray(entry.result) ? entry.result.slice() : [],
          countsTowardCompletion: entry.countsTowardCompletion === true,
        });
      }
    });
  return map;
}

function emptyGroups() {
  const groups = new Map();
  LEARNING_ACTIVITY_GROUPS.forEach((g) => groups.set(g, 0));
  return groups;
}

/**
 * Count the trackable elements in one page body. Every occurrence counts,
 * nested ones too (each sends its own statements); template contents are
 * skipped because they are not rendered.
 * @param {string} html page body
 * @param {Map} [vocab] from vocabularyMap()
 * @param {"auto"|"dom"|"lite"} [parser] see parseHtml()
 * @returns {{total: number, completion: number, byTag: Map<string, number>,
 *   groups: Map<string, number>}}
 */
export function countTrackable(html, vocab, parser) {
  const v = vocab instanceof Map ? vocab : vocabularyMap();
  const byTag = new Map();
  const groups = emptyGroups();
  let total = 0;
  let completion = 0;
  const root = parseHtml(String(html || ""), parser || "auto");
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    if (!node || !Array.isArray(node.children)) {
      continue;
    }
    if (node.tag === "template") {
      continue;
    }
    if (v.has(node.tag)) {
      const entry = v.get(node.tag);
      byTag.set(node.tag, (byTag.get(node.tag) || 0) + 1);
      groups.set(entry.group, groups.get(entry.group) + 1);
      total++;
      if (entry.countsTowardCompletion) {
        completion++;
      }
    }
    for (let i = node.children.length - 1; i >= 0; i--) {
      stack.push(node.children[i]);
    }
  }
  return { total, completion, byTag, groups };
}

/**
 * Same-site URL of a page from its slug.
 * @param {Object} item site.json item
 * @param {string} siteBase absolute site root ending in /
 */
export function pageHref(item, siteBase) {
  const slug = item && typeof item.slug === "string" ? item.slug : "";
  try {
    const base = new URL(siteBase);
    const url = new URL(slug.replace(/^\/+/, ""), base);
    return url.origin === base.origin ? url.href : base.href;
  } catch {
    return "";
  }
}

/**
 * Top-level section of each item: its top-most ancestor among the items
 * (the whole outline, or the branch that was scanned).
 * @param {Object[]} items site.json items
 * @returns {Map<string, Object>} item id -> section item
 */
export function topSections(items) {
  const byId = new Map();
  (Array.isArray(items) ? items : []).forEach((it) => {
    if (it && it.id) {
      byId.set(it.id, it);
    }
  });
  const out = new Map();
  byId.forEach((it, id) => {
    let top = it;
    const seen = new Set([id]);
    while (top.parent && byId.has(top.parent) && !seen.has(top.parent)) {
      seen.add(top.parent);
      top = byId.get(top.parent);
    }
    out.set(id, top);
  });
  return out;
}

/**
 * Summary of a scan over pages (outline order kept).
 * @param {Array<{item: Object, counts: Object}>} rows
 * @param {Map} vocab
 */
export function summarizeLearningActivity(rows, vocab) {
  const v = vocab instanceof Map ? vocab : vocabularyMap();
  const byTag = new Map();
  const groups = emptyGroups();
  let total = 0;
  let completion = 0;
  let withActivities = 0;
  rows.forEach((row) => {
    const c = row.counts;
    total += c.total;
    completion += c.completion;
    if (c.total > 0) {
      withActivities++;
    }
    c.byTag.forEach((n, tag) => byTag.set(tag, (byTag.get(tag) || 0) + n));
    c.groups.forEach((n, g) => groups.set(g, groups.get(g) + n));
  });
  const types = Array.from(byTag.keys())
    .map((tag) => ({
      tag,
      count: byTag.get(tag),
      group: v.has(tag) ? v.get(tag).group : "other",
      countsTowardCompletion: v.has(tag)
        ? v.get(tag).countsTowardCompletion
        : false,
    }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  return {
    pages: rows.length,
    withActivities,
    withoutActivities: rows.length - withActivities,
    total,
    completion,
    types,
    groups,
    rows,
  };
}

/* ------- cache shared by the report and the Content table column ------- */

const pageCounts = new Map();
const pending = new Set();
// pages a single read failed for; tried again after invalidateTrackable()
const failed = new Set();
const listeners = new Set();
let siteLoad = null;

function notify() {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch {
      // a listener failing must not stop the others
    }
  });
}

/**
 * Cached counts for a page id, or null.
 */
export function cachedTrackable(pageId) {
  return pageCounts.has(pageId) ? pageCounts.get(pageId) : null;
}

/**
 * Store counts for a page (from a scan, or fresh active page content).
 */
export function rememberTrackable(pageId, counts) {
  if (!pageId || !counts) {
    return;
  }
  pageCounts.set(pageId, counts);
  notify();
}

/**
 * Drop a page's counts (or all of them with no id).
 */
export function invalidateTrackable(pageId) {
  if (pageId) {
    pageCounts.delete(pageId);
    failed.delete(pageId);
  } else {
    pageCounts.clear();
    failed.clear();
    siteLoad = null;
  }
  notify();
}

/**
 * Listen for cache changes; returns the unsubscribe function.
 */
export function onTrackableChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * Plain { id: count } of every cached page, for the Content table.
 */
export function trackableCountsById() {
  const out = Object.create(null);
  pageCounts.forEach((c, id) => {
    out[id] = c.total;
  });
  return out;
}

/**
 * Scan a scope: the whole site (no rootId) or a page and below.
 * @param {Object} [opts]
 * @param {string} [opts.rootId] page id; "" or missing = whole site
 * @param {Object} [opts.manifest] site.json; default the site store's
 * @param {Object} [opts.vocabulary] default XAPI_VOCABULARY
 * @param {function} [opts.fetchImpl] see loadInsightsPages()
 * @param {string} [opts.baseUrl] see resolveSiteUrls()
 * @param {AbortSignal} [opts.signal]
 * @param {function} [opts.onProgress]
 */
export async function scanLearningActivity(opts = {}) {
  const rootId = typeof opts.rootId === "string" ? opts.rootId.trim() : "";
  const vocab = vocabularyMap(opts.vocabulary);
  const loaded = await loadInsightsPages({
    scope: rootId ? "branch" : "site",
    rootId,
    manifest: opts.manifest,
    fetchImpl: opts.fetchImpl,
    baseUrl: opts.baseUrl,
    siteApiBasePath: opts.siteApiBasePath,
    signal: opts.signal,
    onProgress: opts.onProgress,
  });
  const htmlById = new Map();
  loaded.pages.forEach((p) => {
    if (p && p.item && p.item.id) {
      htmlById.set(p.item.id, typeof p.html === "string" ? p.html : "");
    }
  });
  const sections = topSections(loaded.targetItems);
  const rows = loaded.targetItems.map((item) => {
    const counts = countTrackable(htmlById.get(item.id) || "", vocab);
    pageCounts.set(item.id, counts);
    const top = sections.get(item.id) || item;
    return {
      item,
      href: pageHref(item, loaded.urls.siteBase),
      counts,
      section: top.id,
      sectionTitle: top.title || "",
    };
  });
  notify();
  return summarizeLearningActivity(rows, vocab);
}

let watching = null;

/**
 * Keep the active page's cached counts current: a content save drops them
 * (haxcms-trigger-update-node), and the page's saved HTML replaces them once
 * the store has it again (store.activeItemContent outside edit mode). Safe
 * to call more than once; returns the stop function.
 * @param {Object} store the HAXcms site store
 * @param {function} autorun mobx autorun
 */
export function watchActivePageTrackable(store, autorun) {
  if (watching) {
    return watching;
  }
  let lastContent = null;
  const dispose = autorun(() => {
    const content = store.activeItemContent;
    const id = store.activeId;
    const editing = store.editMode;
    // only fresh content belongs to the active id; an id change alone can
    // still be showing the previous page's HTML
    if (
      !editing &&
      id &&
      typeof content === "string" &&
      content !== lastContent
    ) {
      lastContent = content;
      rememberTrackable(id, countTrackable(content));
    }
  });
  const onSaved = () => {
    lastContent = null;
    if (store.activeId) {
      invalidateTrackable(store.activeId);
    }
  };
  globalThis.addEventListener("haxcms-trigger-update-node", onSaved);
  watching = () => {
    dispose();
    globalThis.removeEventListener("haxcms-trigger-update-node", onSaved);
    watching = null;
  };
  return watching;
}

/**
 * Make sure every page has cached counts (one site scan at most at a time;
 * a failed scan is not retried until invalidateTrackable() or retry).
 * @param {Object} [opts] passed to scanLearningActivity()
 * @param {boolean} [retry]
 */
export function ensureSiteTrackable(opts = {}, retry = false) {
  if (!siteLoad || retry) {
    siteLoad = scanLearningActivity({ ...opts, rootId: "" }).catch(() => null);
  }
  return siteLoad;
}

/**
 * Make sure the given pages have cached counts: one site scan first (see
 * ensureSiteTrackable), then any page still missing (a page saved since,
 * or added) is read on its own with the same content request a branch scan
 * uses. Quiet on failure: those pages stay uncounted.
 * @param {string[]} ids page ids
 * @param {Object} [opts] { manifest (site.json, needed for single pages),
 *   fetchImpl, baseUrl, siteApiBasePath }
 */
export async function ensureTrackable(ids, opts = {}) {
  await ensureSiteTrackable(opts);
  const want = new Set(
    (Array.isArray(ids) ? ids : []).filter(
      (id) => id && !pageCounts.has(id) && !pending.has(id) && !failed.has(id),
    ),
  );
  const items =
    opts.manifest && Array.isArray(opts.manifest.items)
      ? opts.manifest.items.filter((it) => it && want.has(it.id))
      : [];
  if (!items.length) {
    return;
  }
  const byId = Object.create(null);
  items.forEach((it) => {
    byId[it.id] = it;
    pending.add(it.id);
  });
  try {
    const pages = await fetchInsightsPages({
      scope: "branch",
      targetItems: items,
      byId,
      urls: resolveSiteUrls(opts),
      fetchImpl: opts.fetchImpl,
    });
    const vocab = vocabularyMap();
    pages.forEach((p) => {
      if (p && p.item && p.item.id) {
        pageCounts.set(p.item.id, countTrackable(p.html, vocab));
      }
    });
  } catch {
    // quiet: these pages stay uncounted until they change again
    items.forEach((it) => failed.add(it.id));
  }
  items.forEach((it) => pending.delete(it.id));
  if (items.some((it) => pageCounts.has(it.id))) {
    notify();
  }
}
