/**
 * Copyright 2026 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 *
 * Public, read-only WebMCP tools for HAXcms sites (haxtheweb/issues#3104).
 *
 * WebMCP lets a page expose tools to a browser agent through
 * `document.modelContext.registerTool()`. The tools run in the visitor's own
 * tab with the visitor's own access; there is no server endpoint.
 *
 * Ground rules for this tier (see haxtheweb/issues#3131 for later tiers):
 * - read-only: every tool sets `readOnlyHint`; nothing writes anywhere;
 * - anonymous only: tools are registered only when nobody is logged in and
 *   the editor is closed, and withdrawn the moment either changes;
 * - visible pages only: unpublished, hidden and theme-region pages are
 *   never returned (same rule as the site API for anonymous callers);
 * - private sites register nothing;
 * - page content is author-written, so content tools set
 *   `untrustedContentHint`;
 * - feature-detected: a no-op in browsers without `document.modelContext`.
 *
 * Works on static publishes too: search uses lunrSearchIndex.json and pages
 * come from the pages/<id>/index.md files written on save.
 */
import { autorun, toJS } from "mobx";

const SEARCH_LIMIT_DEFAULT = 10;
const SEARCH_LIMIT_MAX = 25;

function isFalseLike(value) {
  if (value === false || value === 0) {
    return true;
  }
  if (typeof value === "string") {
    return ["0", "false", "no", "off"].includes(value.trim().toLowerCase());
  }
  return false;
}

function isTrueLike(value) {
  if (value === true || value === 1) {
    return true;
  }
  if (typeof value === "string") {
    return ["1", "true", "yes", "on"].includes(value.trim().toLowerCase());
  }
  return false;
}

/**
 * Item ids placed in theme regions (header/footer content) render inside
 * every page rather than as pages, so agents never see them as pages.
 */
export function getThemeRegionItemIds(manifest) {
  const ids = new Set();
  const regions =
    manifest && manifest.metadata && manifest.metadata.theme
      ? manifest.metadata.theme.regions
      : null;
  if (!regions || typeof regions !== "object") {
    return ids;
  }
  Object.values(regions).forEach((regionItems) => {
    if (typeof regionItems === "string" && regionItems !== "") {
      ids.add(regionItems);
    } else if (regionItems && typeof regionItems === "object") {
      Object.values(regionItems).forEach((id) => {
        if (typeof id === "string" && id !== "") {
          ids.add(id);
        }
      });
    }
  });
  return ids;
}

/**
 * Same visibility rule as the site API for anonymous callers: published and
 * not hidden from the menu, plus not theme-region content.
 */
export function isItemVisibleToAgents(item, regionIds = new Set()) {
  if (!item || !item.id) {
    return false;
  }
  const metadata =
    item.metadata && typeof item.metadata === "object" ? item.metadata : {};
  if ("published" in metadata && isFalseLike(metadata.published)) {
    return false;
  }
  if ("hideInMenu" in metadata && isTrueLike(metadata.hideInMenu)) {
    return false;
  }
  return !regionIds.has(String(item.id));
}

export function getVisibleItems(manifest) {
  if (!manifest || !Array.isArray(manifest.items)) {
    return [];
  }
  const regionIds = getThemeRegionItemIds(manifest);
  return manifest.items.filter((item) =>
    isItemVisibleToAgents(item, regionIds),
  );
}

export function isPrivateSite(manifest) {
  return !!(
    manifest &&
    manifest.metadata &&
    manifest.metadata.site &&
    manifest.metadata.site.settings &&
    isTrueLike(manifest.metadata.site.settings.private)
  );
}

function resolveUrl(path) {
  try {
    return new URL(String(path || ""), globalThis.document.baseURI).href;
  } catch {
    return String(path || "");
  }
}

function markdownLocationFor(item) {
  const location = String(item.location || "");
  if (location === "" || location.includes("..")) {
    return "";
  }
  return /\.html?$/i.test(location)
    ? location.replace(/\.html?$/i, ".md")
    : `${location}.md`;
}

function summarizeItem(item) {
  return {
    id: item.id,
    title: item.title || item.slug || item.id,
    slug: item.slug || "",
    parent: item.parent || null,
    description: item.description || "",
    url: resolveUrl(item.slug || ""),
  };
}

function findVisibleItem(manifest, slugOrId) {
  const needle = String(slugOrId || "")
    .trim()
    .replace(/^\/+|\/+$/g, "");
  if (needle === "") {
    return null;
  }
  return (
    getVisibleItems(manifest).find(
      (item) => item.slug === needle || item.id === needle,
    ) || null
  );
}

/**
 * Score lunr index entries against the query terms. Matches in the title
 * count most, then description, then body text.
 */
export function scoreSearchEntries(entries, query) {
  const terms = String(query || "")
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter((term) => term.length > 1);
  if (terms.length === 0 || !Array.isArray(entries)) {
    return [];
  }
  const scored = [];
  entries.forEach((entry) => {
    const title = String(entry.title || "").toLowerCase();
    const description = String(entry.description || "").toLowerCase();
    const text = String(entry.text || "").toLowerCase();
    let score = 0;
    terms.forEach((term) => {
      if (title.includes(term)) score += 5;
      if (description.includes(term)) score += 3;
      if (text.includes(term)) score += 1;
    });
    if (score > 0) {
      scored.push({ entry, score });
    }
  });
  scored.sort((a, b) => b.score - a.score);
  return scored;
}

function snippetFor(entry, query) {
  const text = String(entry.text || entry.description || "");
  const term = String(query || "")
    .toLowerCase()
    .split(/\s+/)
    .find((t) => t.length > 1 && text.toLowerCase().includes(t));
  if (!term) {
    return text.slice(0, 200);
  }
  const at = text.toLowerCase().indexOf(term);
  const start = Math.max(0, at - 80);
  return (start > 0 ? "…" : "") + text.slice(start, at + 120).trim() + "…";
}

/**
 * Build the four public tools against a getter for the current manifest.
 * Exported for tests; registration happens in initHAXcmsWebMCP.
 */
export function buildPublicTools(getManifest, fetchImpl = globalThis.fetch) {
  let searchIndexPromise = null;
  const loadSearchIndex = () => {
    if (!searchIndexPromise) {
      searchIndexPromise = fetchImpl(resolveUrl("lunrSearchIndex.json"))
        .then((response) => (response && response.ok ? response.json() : []))
        .catch(() => []);
    }
    return searchIndexPromise;
  };
  return [
    {
      name: "search_site",
      description:
        "Search this site's pages by keyword. Returns matching pages with their title, URL and a short snippet. Use get_page to read one in full.",
      inputSchema: {
        type: "object",
        properties: {
          query: { type: "string", description: "Words to search for." },
          limit: {
            type: "integer",
            description: `Maximum results (1-${SEARCH_LIMIT_MAX}, default ${SEARCH_LIMIT_DEFAULT}).`,
          },
        },
        required: ["query"],
      },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      execute: async ({ query, limit }) => {
        const manifest = getManifest();
        const visibleBySlug = new Map(
          getVisibleItems(manifest).map((item) => [item.slug, item]),
        );
        const max = Math.min(
          SEARCH_LIMIT_MAX,
          Math.max(1, parseInt(limit, 10) || SEARCH_LIMIT_DEFAULT),
        );
        const index = await loadSearchIndex();
        const results = scoreSearchEntries(index, query)
          .filter(({ entry }) => visibleBySlug.has(entry.location))
          .slice(0, max)
          .map(({ entry }) => {
            const item = visibleBySlug.get(entry.location);
            return Object.assign(summarizeItem(item), {
              snippet: snippetFor(entry, query),
            });
          });
        return JSON.stringify({ query: String(query || ""), results });
      },
    },
    {
      name: "get_page",
      description:
        "Read one page of this site as markdown, by its slug or id (from search_site or get_site_outline).",
      inputSchema: {
        type: "object",
        properties: {
          page: {
            type: "string",
            description: "The page slug (e.g. 'getting-started') or id.",
          },
        },
        required: ["page"],
      },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      execute: async ({ page }) => {
        const item = findVisibleItem(getManifest(), page);
        if (!item) {
          return JSON.stringify({ error: `No page found for "${page}".` });
        }
        let markdown = "";
        const markdownLocation = markdownLocationFor(item);
        if (markdownLocation !== "") {
          try {
            const response = await fetchImpl(resolveUrl(markdownLocation));
            if (response && response.ok) {
              markdown = await response.text();
            }
          } catch {}
        }
        return JSON.stringify(Object.assign(summarizeItem(item), { markdown }));
      },
    },
    {
      name: "get_site_outline",
      description:
        "List every page of this site in outline order with its title, slug, parent and URL.",
      inputSchema: { type: "object", properties: {} },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      execute: async () => {
        const manifest = getManifest();
        return JSON.stringify({
          title: (manifest && manifest.title) || "",
          description: (manifest && manifest.description) || "",
          pages: getVisibleItems(manifest).map(summarizeItem),
        });
      },
    },
    {
      name: "go_to_page",
      description:
        "Show a page of this site in the visitor's tab, by its slug or id. Navigation only; changes nothing.",
      inputSchema: {
        type: "object",
        properties: {
          page: {
            type: "string",
            description: "The page slug or id to open.",
          },
        },
        required: ["page"],
      },
      annotations: { readOnlyHint: true },
      execute: async ({ page }) => {
        const item = findVisibleItem(getManifest(), page);
        if (!item) {
          return JSON.stringify({ error: `No page found for "${page}".` });
        }
        globalThis.history.pushState({}, "", item.slug);
        globalThis.dispatchEvent(new PopStateEvent("popstate"));
        return JSON.stringify({ opened: summarizeItem(item) });
      },
    },
  ];
}

/**
 * Register the public tools while nobody is logged in, the editor is closed
 * and the site is not private; withdraw them as soon as that stops being
 * true. Returns a disposer for the autorun.
 */
export function initHAXcmsWebMCP(store) {
  const modelContext =
    globalThis.document && globalThis.document.modelContext
      ? globalThis.document.modelContext
      : null;
  if (!modelContext || typeof modelContext.registerTool !== "function") {
    return () => {};
  }
  let controller = null;
  const withdraw = () => {
    if (controller) {
      controller.abort();
      controller = null;
    }
  };
  const getManifest = () => toJS(store.manifest);
  const dispose = autorun(() => {
    const manifest = toJS(store.manifest);
    const shouldExpose =
      !!manifest &&
      Array.isArray(manifest.items) &&
      !isPrivateSite(manifest) &&
      !toJS(store.isLoggedIn) &&
      !toJS(store.editMode);
    if (!shouldExpose) {
      withdraw();
      return;
    }
    if (controller) {
      return;
    }
    controller = new AbortController();
    buildPublicTools(getManifest).forEach((tool) => {
      try {
        modelContext.registerTool(tool, { signal: controller.signal });
      } catch {
        // an agent-side failure must never break the site
      }
    });
  });
  return () => {
    withdraw();
    dispose();
  };
}
