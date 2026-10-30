/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Loads everything an Insights scan needs and runs the analyzer.
 *
 * Request sequence (all same-origin, nothing is saved):
 *  1. insights-spec.json, next to this module (cached after the first load)
 *  2. site.json, taken from the site store (no request) unless passed in
 *  3. page HTML, with the editor's JWT through siteApiFetch():
 *       whole site:          GET <api>/v1/site/export/html   (one request)
 *       this page and below: GET <api>/v1/content/<slug|id>  (per page,
 *                            a few at a time)
 *  4. in parallel with 3, public files fetched without credentials, the way
 *     a crawler sees them: <origin>/robots.txt, <site>/llms.txt and one page
 *     URL (<site>/<slug>) for the readable-without-JavaScript check
 *  5. the analyzer, in a module worker or on the main thread
 *     (insights-worker.js)
 * Progress goes to onProgress({ phase, done, total, message }) with phases
 * "spec", "fetch", "analyze", "done".
 */
import {
  siteApiFetch,
  SITE_API_STATE_KEY,
} from "../utils/site-api-auth-fetch.js";
import { runInsights } from "./insights-worker.js";

let specPromise = null;

/**
 * The shared rules file. Cached for the session.
 * @param {function} [fetchImpl]
 */
export function loadInsightsSpec(fetchImpl) {
  if (!specPromise || fetchImpl) {
    const doFetch = fetchImpl || globalThis.fetch.bind(globalThis);
    const p = doFetch(new URL("./insights-spec.json", import.meta.url).href)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Unable to load insights-spec.json (${res.status})`);
        }
        return res.json();
      })
      .catch((e) => {
        if (!fetchImpl) {
          specPromise = null;
        }
        throw e;
      });
    if (fetchImpl) {
      return p;
    }
    specPromise = p;
  }
  return specPromise;
}

function cleanPath(value) {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Absolute URLs the scan uses.
 * @param {Object} [opts]
 * @param {string} [opts.baseUrl] site root; default the page's <base href>
 * @param {string} [opts.siteApiBasePath] e.g. "/sites/chem/x/api"; default
 *   the site API registry's value, else "<site root>x/api"
 * @returns {{siteBase: string, apiBase: string, origin: string, basePath: string}}
 */
export function resolveSiteUrls(opts = {}) {
  const loc = globalThis.location || {
    origin: "http://localhost",
    href: "http://localhost/",
  };
  let baseUrl = cleanPath(opts.baseUrl);
  if (baseUrl === "" && globalThis.document) {
    const base = globalThis.document.querySelector("base");
    baseUrl = base && base.href ? base.href : "";
  }
  if (baseUrl === "") {
    baseUrl = `${loc.origin}/`;
  }
  const site = new URL(baseUrl, loc.href);
  site.search = "";
  site.hash = "";
  if (!site.pathname.endsWith("/")) {
    site.pathname = site.pathname.replace(/[^/]*$/, "");
  }
  let apiPath = cleanPath(opts.siteApiBasePath);
  if (apiPath === "") {
    const state = globalThis[SITE_API_STATE_KEY];
    apiPath =
      state && typeof state.siteApiBasePath === "string"
        ? state.siteApiBasePath.trim()
        : "";
  }
  if (apiPath === "" && globalThis.appSettings) {
    apiPath = cleanPath(globalThis.appSettings.siteApiBasePath);
  }
  const api =
    apiPath !== ""
      ? new URL(apiPath, site.href)
      : new URL("./x/api", site.href);
  return {
    siteBase: site.href,
    apiBase: api.href.replace(/\/+$/, ""),
    origin: site.origin,
    basePath: site.pathname,
  };
}

function decodeAttr(value) {
  return String(value || "")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&#x27;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/**
 * Split the whole-site HTML export (Node and PHP build the same markup:
 * `<article data-item-id data-item-slug>` + an `<h2>` title per page, joined
 * by newlines) into page bodies. Split on the article markers rather than by
 * parsing, so page HTML that itself contains <article> or <main> is kept.
 * @param {string} html
 * @returns {Array<{id: string, slug: string, html: string}>}
 */
export function splitSiteExportHtml(html) {
  const source = String(html || "");
  const re =
    /(?:^|\n)<article data-item-id="([^"]*)" data-item-slug="([^"]*)">\n?<h2>[^\n]*?<\/h2>\n?/g;
  const marks = [];
  let m = re.exec(source);
  while (m) {
    marks.push({
      id: decodeAttr(m[1]),
      slug: decodeAttr(m[2]),
      start: m.index,
      bodyStart: re.lastIndex,
    });
    m = re.exec(source);
  }
  return marks.map((mark, i) => {
    const end = i + 1 < marks.length ? marks[i + 1].start : source.length;
    let body = source.substring(mark.bodyStart, end);
    if (i + 1 === marks.length) {
      const mainEnd = body.lastIndexOf("</main>");
      if (mainEnd !== -1) {
        body = body.substring(0, mainEnd);
      }
    }
    body = body.replace(/\n?<\/article>\s*$/, "");
    return { id: mark.id, slug: mark.slug, html: body };
  });
}

/**
 * site.json items in outline order (parents before children, by order).
 */
export function orderedItems(manifest) {
  const items = manifest && Array.isArray(manifest.items) ? manifest.items : [];
  const known = {};
  items.forEach((it) => {
    if (it && it.id) {
      known[it.id] = true;
    }
  });
  const kids = {};
  items.forEach((it) => {
    if (!it) {
      return;
    }
    const parent = it.parent && known[it.parent] ? it.parent : "";
    if (!kids[parent]) {
      kids[parent] = [];
    }
    kids[parent].push(it);
  });
  Object.keys(kids).forEach((k) =>
    kids[k].sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0)),
  );
  const out = [];
  const seen = {};
  const visit = (parent) => {
    (kids[parent] || []).forEach((it) => {
      if (seen[it.id]) {
        return;
      }
      seen[it.id] = true;
      out.push(it);
      visit(it.id);
    });
  };
  visit("");
  return out;
}

/**
 * An item and everything below it, in outline order.
 */
export function branchItems(manifest, rootId) {
  const all = orderedItems(manifest);
  const inBranch = {};
  inBranch[rootId] = true;
  return all.filter((it) => {
    if (it.id === rootId) {
      return true;
    }
    if (it.parent && inBranch[it.parent]) {
      inBranch[it.id] = true;
      return true;
    }
    return false;
  });
}

function plain(value) {
  return JSON.parse(JSON.stringify(value || {}));
}

async function storeManifest() {
  const [{ store }, { toJS }] = await Promise.all([
    import("../haxcms-site-store.js"),
    import("mobx"),
  ]);
  return toJS(store.manifest);
}

async function getText(fetchImpl, url, init) {
  try {
    const res = await fetchImpl(url, init);
    if (!res.ok) {
      return { found: false, status: res.status, url };
    }
    return { found: true, status: res.status, url, text: await res.text() };
  } catch (e) {
    if (init && init.signal && init.signal.aborted) {
      throw e;
    }
    return { found: false, status: 0, url, error: e.message };
  }
}

async function mapLimit(list, limit, fn) {
  const out = new Array(list.length);
  let next = 0;
  const worker = async () => {
    while (next < list.length) {
      const i = next++;
      out[i] = await fn(list[i], i);
    }
  };
  const runners = [];
  for (let i = 0; i < Math.min(limit, list.length); i++) {
    runners.push(worker());
  }
  await Promise.all(runners);
  return out;
}

/**
 * Fetch, analyze, return results.
 * @param {Object} opts
 * @param {"site"|"branch"} [opts.scope] whole site, or rootId and below
 * @param {string} [opts.rootId] item id for the "branch" scope
 * @param {Object} [opts.manifest] site.json; default the site store's
 * @param {Object} [opts.spec] rules; default insights-spec.json
 * @param {function} [opts.onProgress]
 * @param {AbortSignal} [opts.signal]
 * @param {function} [opts.fetchImpl] authenticated fetch for site API
 *   routes; default siteApiFetch
 * @param {function} [opts.publicFetch] fetch for public files; default fetch
 * @param {string} [opts.baseUrl] see resolveSiteUrls()
 * @param {string} [opts.siteApiBasePath] see resolveSiteUrls()
 * @param {boolean} [opts.publicChecks] fetch robots/llms/page (default true)
 * @param {number} [opts.now] ms clock for ages (default Date.now())
 * @param {"auto"|"worker"|"main"} [opts.mode] see runInsights()
 * @param {number} [opts.concurrency] per-page requests at once (default 4)
 */
export async function loadInsights(opts = {}) {
  const scope = opts.scope === "branch" ? "branch" : "site";
  const progress =
    typeof opts.onProgress === "function" ? opts.onProgress : () => {};
  const signal = opts.signal || null;
  const apiFetch = opts.fetchImpl || siteApiFetch;
  const publicFetch = opts.publicFetch || globalThis.fetch.bind(globalThis);
  const concurrency = opts.concurrency || 4;

  progress({ phase: "spec", done: 0, total: 1, message: "Loading rules" });
  const spec = opts.spec || (await loadInsightsSpec());
  const manifest = plain(opts.manifest || (await storeManifest()));
  const urls = resolveSiteUrls(opts);
  const items = orderedItems(manifest);
  const byId = {};
  items.forEach((it) => {
    byId[it.id] = it;
  });

  let targetItems = items;
  if (scope === "branch") {
    if (!opts.rootId || !byId[opts.rootId]) {
      throw new Error("Insights: rootId must name a page in site.json");
    }
    targetItems = branchItems(manifest, opts.rootId);
  }

  // public, same-origin files; run while the page HTML downloads
  const firstVisible = targetItems.find((it) => {
    const md = it.metadata || {};
    return md.published !== false && md.hideInMenu !== true && it.slug;
  });
  const publicInit = { credentials: "omit", signal };
  const extrasPromise =
    opts.publicChecks === false
      ? Promise.resolve({})
      : Promise.all([
          getText(publicFetch, `${urls.origin}/robots.txt`, publicInit),
          getText(publicFetch, `${urls.siteBase}llms.txt`, publicInit),
          firstVisible
            ? getText(
                publicFetch,
                new URL(firstVisible.slug, urls.siteBase).href,
                publicInit,
              )
            : Promise.resolve({ found: false }),
        ]).then(([robots, llms, page]) => ({
          robots,
          llms,
          noJs: {
            found: page.found,
            url: page.url,
            html: page.text || "",
            pageId: firstVisible ? firstVisible.id : null,
          },
        }));

  let pages = [];
  if (scope === "site") {
    progress({
      phase: "fetch",
      done: 0,
      total: 1,
      message: "Downloading every page",
    });
    const url = `${urls.apiBase}/v1/site/export/html`;
    const res = await apiFetch(url, { credentials: "include", signal });
    if (!res.ok) {
      throw new Error(`Insights: site export failed (${res.status})`);
    }
    const parts = splitSiteExportHtml(await res.text());
    pages = parts.map((part) => ({
      html: part.html,
      item: byId[part.id] || { id: part.id, slug: part.slug, title: "" },
    }));
    progress({
      phase: "fetch",
      done: 1,
      total: 1,
      message: `Downloaded ${pages.length} pages`,
    });
  } else {
    const total = targetItems.length;
    let done = 0;
    progress({ phase: "fetch", done, total, message: "Downloading pages" });
    pages = await mapLimit(targetItems, concurrency, async (item) => {
      const lookup = encodeURIComponent(item.slug || item.id);
      const res = await apiFetch(`${urls.apiBase}/v1/content/${lookup}`, {
        credentials: "include",
        signal,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) {
        throw new Error(
          `Insights: page "${item.slug || item.id}" failed (${res.status})`,
        );
      }
      const payload = await res.json();
      const data = payload && payload.data ? payload.data : payload;
      done++;
      progress({
        phase: "fetch",
        done,
        total,
        message: `Downloaded ${done} of ${total} pages`,
      });
      return {
        html: data && typeof data.body === "string" ? data.body : "",
        item,
      };
    });
  }

  const extras = await extrasPromise;
  const results = await runInsights({
    pages,
    manifest,
    spec,
    options: {
      now: typeof opts.now === "number" ? opts.now : Date.now(),
      siteOrigin: urls.origin,
      basePath: urls.basePath,
      scope: { mode: scope, rootId: scope === "branch" ? opts.rootId : null },
      extras,
    },
    onProgress: (p) =>
      progress(
        Object.assign({ message: `Checked ${p.done} of ${p.total} pages` }, p),
      ),
    signal,
    mode: opts.mode || "auto",
  });
  progress({
    phase: "done",
    done: pages.length,
    total: pages.length,
    message: `Scanned ${pages.length} pages`,
  });
  return results;
}
