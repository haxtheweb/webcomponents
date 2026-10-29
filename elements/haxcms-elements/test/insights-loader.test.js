import { expect } from "@open-wc/testing";
import { analyzeSite } from "../lib/core/insights/insights-analyzer.js";
import {
  loadInsights,
  loadInsightsSpec,
  splitSiteExportHtml,
  resolveSiteUrls,
  orderedItems,
  branchItems,
} from "../lib/core/insights/insights-loader.js";
import { SITE_API_STATE_KEY } from "../lib/core/utils/site-api-auth-fetch.js";
import {
  NOW,
  BASE_PATH,
  SITE_ORIGIN,
  loadSpec,
  loadFixtureSite,
  loadExtras,
  fixtureText,
} from "./insights-fixture-helpers.js";

const BASE_URL = `${SITE_ORIGIN}${BASE_PATH}`;
const API = `${SITE_ORIGIN}${BASE_PATH}x/api`;

let spec;
let site;
let publicFiles;

function escapeHtmlValue(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// the same markup haxcms-nodejs buildSiteExportHtml / PHP ExportConverters
// produce for /x/api/v1/site/export/html without ?magic
function buildExport(pages, title) {
  const s = [
    "<!doctype html>",
    "<html>",
    "<head>",
    '<meta charset="utf-8" />',
    `<title>${escapeHtmlValue(title)}</title>`,
    "</head>",
    "<body>",
    `<main data-haxcms-export="site" data-title="${escapeHtmlValue(title)}">`,
    `<h1>${escapeHtmlValue(title)}</h1>`,
  ];
  pages.forEach((p) => {
    s.push(
      `<article data-item-id="${escapeHtmlValue(p.item.id)}" data-item-slug="${escapeHtmlValue(p.item.slug)}">`,
    );
    s.push(`<h2>${escapeHtmlValue(p.item.title)}</h2>`);
    s.push(p.html);
    s.push("</article>");
  });
  s.push("</main>", "</body>", "</html>");
  return s.join("\n");
}

function response(status, body, type) {
  return new Response(body, {
    status,
    headers: { "Content-Type": type || "text/plain" },
  });
}

function fakeFetchers(overrides = {}) {
  const calls = { api: [], public: [] };
  const apiFetch = async (url, init) => {
    calls.api.push({ url: String(url), init });
    if (overrides.api) {
      const r = await overrides.api(String(url), init);
      if (r) {
        return r;
      }
    }
    if (String(url) === `${API}/v1/site/export/html`) {
      return response(
        200,
        buildExport(site.pages, site.manifest.title),
        "text/html",
      );
    }
    const m = /\/v1\/content\/([^?]+)$/.exec(String(url));
    if (m) {
      const lookup = decodeURIComponent(m[1]);
      const page = site.pages.find(
        (p) => p.item.slug === lookup || p.item.id === lookup,
      );
      if (!page) {
        return response(404, "{}", "application/json");
      }
      return response(
        200,
        JSON.stringify({
          status: 200,
          data: {
            id: page.item.id,
            slug: page.item.slug,
            title: page.item.title,
            format: "html",
            mode: "bundle",
            body: page.html,
          },
        }),
        "application/json",
      );
    }
    return response(404, "");
  };
  const publicFetch = async (url, init) => {
    calls.public.push({ url: String(url), init });
    if (String(url) === `${SITE_ORIGIN}/robots.txt`) {
      return response(200, publicFiles.robots);
    }
    if (String(url) === `${BASE_URL}llms.txt`) {
      return response(200, publicFiles.llms);
    }
    if (String(url) === `${BASE_URL}index`) {
      return response(200, publicFiles.shell, "text/html");
    }
    return response(404, "");
  };
  return { calls, apiFetch, publicFetch };
}

before(async () => {
  spec = await loadSpec();
  site = await loadFixtureSite();
  publicFiles = {
    robots: await fixtureText("robots.txt"),
    llms: await fixtureText("llms.txt"),
    shell: await fixtureText("nojs-shell.html"),
  };
});

describe("insights-loader: helpers", () => {
  it("loads and caches the rules file", async () => {
    const a = await loadInsightsSpec();
    const b = await loadInsightsSpec();
    expect(a).to.equal(b);
    expect(a).to.deep.equal(spec);
    expect(a.content.longPageParagraphs).to.equal(5);
    expect(a.content.thinMaxWords).to.equal(40);
    expect(a.accessibility.alt.maxLength).to.equal(150);
    expect(a.bulkAltSave.maxPagesPerHour).to.equal(20);
  });

  it("splits the backend's whole-site export into pages", async () => {
    const parts = splitSiteExportHtml(await fixtureText("export-sample.html"));
    expect(parts.map((p) => [p.id, p.slug])).to.deep.equal([
      ["home", "index"],
      ["a&b", "lesson-1/q&a"],
      ["empty", "empty"],
    ]);
    expect(parts[0].html).to.equal("<p>Welcome students</p>");
    expect(parts[1].html).to.contain("<article><h3>Nested</h3>");
    expect(parts[1].html).to.contain("<main><p>Inner main kept.</p></main>");
    expect(parts[1].html).to.not.contain("data-item-id");
    expect(parts[2].html.trim()).to.equal("");
  });

  it("round-trips every fixture page through the export markup", () => {
    const parts = splitSiteExportHtml(
      buildExport(site.pages, site.manifest.title),
    );
    expect(parts).to.have.length(site.pages.length);
    parts.forEach((part, i) => {
      expect(part.id).to.equal(site.pages[i].item.id);
      expect(part.html).to.equal(site.pages[i].html);
    });
    expect(splitSiteExportHtml("")).to.deep.equal([]);
  });

  it("resolves the site and API URLs", () => {
    expect(resolveSiteUrls({ baseUrl: BASE_URL })).to.deep.equal({
      siteBase: BASE_URL,
      apiBase: API,
      origin: SITE_ORIGIN,
      basePath: BASE_PATH,
    });
    expect(
      resolveSiteUrls({
        baseUrl: `${BASE_URL}lesson-1/x?y=1`,
        siteApiBasePath: "/tenant/x/api/",
      }).apiBase,
    ).to.equal(`${SITE_ORIGIN}/tenant/x/api`);
    expect(
      resolveSiteUrls({ baseUrl: `${BASE_URL}lesson-1/x?y=1` }).siteBase,
    ).to.equal(`${BASE_URL}lesson-1/`);
  });

  it("orders items and finds a branch", () => {
    const ids = orderedItems(site.manifest).map((i) => i.id);
    expect(ids.slice(0, 9)).to.deep.equal([
      "home",
      "hdr",
      "syllabus",
      "prereq",
      "l1",
      "algebra",
      "percent",
      "mole",
      "tryit1",
    ]);
    expect(ids).to.have.length(18);
    expect(branchItems(site.manifest, "l1").map((i) => i.id)).to.deep.equal([
      "l1",
      "algebra",
      "percent",
      "mole",
      "tryit1",
    ]);
    expect(
      branchItems(site.manifest, "algebra").map((i) => i.id),
    ).to.deep.equal(["algebra"]);
  });
});

describe("insights-loader: loadInsights", () => {
  it("scans the whole site with one export request plus public files", async () => {
    const f = fakeFetchers();
    const progress = [];
    const results = await loadInsights({
      manifest: site.manifest,
      spec,
      baseUrl: BASE_URL,
      fetchImpl: f.apiFetch,
      publicFetch: f.publicFetch,
      now: NOW,
      mode: "main",
      onProgress: (p) => progress.push(p),
    });
    expect(f.calls.api.map((c) => c.url)).to.deep.equal([
      `${API}/v1/site/export/html`,
    ]);
    expect(f.calls.api[0].init.credentials).to.equal("include");
    expect(f.calls.public.map((c) => c.url).sort()).to.deep.equal(
      [
        `${SITE_ORIGIN}/robots.txt`,
        `${BASE_URL}llms.txt`,
        `${BASE_URL}index`,
      ].sort(),
    );
    f.calls.public.forEach((c) => expect(c.init.credentials).to.equal("omit"));
    const expected = analyzeSite(site.pages, site.manifest, spec, {
      now: NOW,
      siteOrigin: SITE_ORIGIN,
      basePath: BASE_PATH,
      scope: { mode: "site", rootId: null },
      extras: Object.assign(await loadExtras("home"), {
        robots: {
          found: true,
          status: 200,
          url: `${SITE_ORIGIN}/robots.txt`,
          text: publicFiles.robots,
        },
        llms: {
          found: true,
          status: 200,
          url: `${BASE_URL}llms.txt`,
          text: publicFiles.llms,
        },
      }),
    });
    const got = JSON.parse(JSON.stringify(results));
    delete got.engine;
    expect(got).to.deep.equal(JSON.parse(JSON.stringify(expected)));
    const phases = progress
      .map((p) => p.phase)
      .filter((p, i, a) => a.indexOf(p) === i);
    expect(phases).to.deep.equal(["spec", "fetch", "analyze", "done"]);
    expect(progress[progress.length - 1]).to.include({
      phase: "done",
      done: 18,
      total: 18,
    });
  });

  it("scans a page and below with per-page content requests", async () => {
    const f = fakeFetchers();
    const progress = [];
    const results = await loadInsights({
      scope: "branch",
      rootId: "l1",
      manifest: site.manifest,
      spec,
      baseUrl: BASE_URL,
      fetchImpl: f.apiFetch,
      publicFetch: f.publicFetch,
      now: NOW,
      concurrency: 2,
      onProgress: (p) => progress.push(p),
    });
    expect(f.calls.api.map((c) => c.url)).to.deep.equal([
      `${API}/v1/content/lesson-1`,
      `${API}/v1/content/lesson-1%2Falgebra`,
      `${API}/v1/content/lesson-1%2Fpercent-composition`,
      `${API}/v1/content/lesson-1%2Fvideo-1`,
      `${API}/v1/content/lesson-1%2Ftry-it`,
    ]);
    expect(results.scope).to.deep.equal({
      mode: "branch",
      rootId: "l1",
      pages: 5,
    });
    expect(results.totals.pages).to.equal(5);
    expect(results.totals.videos).to.equal(2);
    // links still resolve against the whole site.json
    expect(
      results.links.findings.filter((r) => r.code === "brokenInternal"),
    ).to.have.length(0);
    const fetches = progress
      .filter((p) => p.phase === "fetch")
      .map((p) => p.done);
    expect(fetches).to.deep.equal([0, 1, 2, 3, 4, 5]);
    // no-JS page is the first visible page in the branch
    expect(f.calls.public.map((c) => c.url)).to.include(`${BASE_URL}lesson-1`);
  });

  it("carries on when public files are missing", async () => {
    const f = fakeFetchers();
    const results = await loadInsights({
      manifest: site.manifest,
      spec,
      baseUrl: BASE_URL,
      fetchImpl: f.apiFetch,
      publicFetch: async () => {
        throw new Error("offline");
      },
      now: NOW,
      mode: "main",
    });
    const states = {};
    results.metadata.checks.forEach((c) => {
      states[c.code] = c.state;
    });
    expect(states).to.include({
      noJs: "notChecked",
      robots: "info",
      llms: "warning",
    });
  });

  it("skips public checks when asked", async () => {
    const f = fakeFetchers();
    await loadInsights({
      manifest: site.manifest,
      spec,
      baseUrl: BASE_URL,
      fetchImpl: f.apiFetch,
      publicFetch: f.publicFetch,
      publicChecks: false,
      now: NOW,
      mode: "main",
    });
    expect(f.calls.public).to.have.length(0);
  });

  it("fails clearly on a bad export or scope", async () => {
    const f = fakeFetchers({ api: async () => response(500, "nope") });
    let error = null;
    try {
      await loadInsights({
        manifest: site.manifest,
        spec,
        baseUrl: BASE_URL,
        fetchImpl: f.apiFetch,
        publicFetch: f.publicFetch,
        mode: "main",
      });
    } catch (e) {
      error = e;
    }
    expect(error.message).to.contain("site export failed (500)");
    error = null;
    try {
      await loadInsights({
        scope: "branch",
        rootId: "missing",
        manifest: site.manifest,
        spec,
        baseUrl: BASE_URL,
        fetchImpl: f.apiFetch,
        publicFetch: f.publicFetch,
      });
    } catch (e) {
      error = e;
    }
    expect(error.message).to.contain("rootId");
  });

  it("sends the editor JWT through siteApiFetch by default", async () => {
    const original = globalThis.fetch;
    const hadState = Object.prototype.hasOwnProperty.call(
      globalThis,
      SITE_API_STATE_KEY,
    );
    const previous = globalThis[SITE_API_STATE_KEY];
    const seen = [];
    globalThis[SITE_API_STATE_KEY] = {
      auth: { jwt: "test-jwt" },
      siteApiBasePath: "/sites/chem110/x/api",
    };
    globalThis.fetch = async (url, init) => {
      seen.push({ url: String(url), init });
      return response(
        200,
        buildExport(site.pages.slice(0, 2), "T"),
        "text/html",
      );
    };
    try {
      const results = await loadInsights({
        manifest: site.manifest,
        spec,
        baseUrl: BASE_URL,
        publicChecks: false,
        now: NOW,
        mode: "main",
      });
      expect(results.totals.pages).to.equal(2);
    } finally {
      globalThis.fetch = original;
      if (hadState) {
        globalThis[SITE_API_STATE_KEY] = previous;
      } else {
        delete globalThis[SITE_API_STATE_KEY];
      }
    }
    expect(seen).to.have.length(1);
    expect(seen[0].url).to.equal(`${API}/v1/site/export/html`);
    expect(seen[0].init.headers.Authorization).to.equal("Bearer test-jwt");
  });
});
