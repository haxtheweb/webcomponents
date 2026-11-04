import { fixture, expect, html } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import { XAPI_VOCABULARY } from "@haxtheweb/user-action/lib/xapi-vocabulary.js";
import {
  activityGroupOf,
  countTrackable,
  invalidateTrackable,
  pageHref,
  rememberTrackable,
  scanLearningActivity,
  trackableCountsById,
  cachedTrackable,
  vocabularyMap,
} from "../lib/core/insights/learning-activity-scan.js";
import {
  PAGES_LIMIT,
  pageTableModel,
} from "../lib/core/insights/learning-activity-report.js";
import "../lib/core/insights/haxcms-site-reports.js";
import { getSiteAdminSection } from "../lib/core/admin/site-admin-sections.js";
import "../lib/ui-components/navigation/site-menu.js";
import "@haxtheweb/map-menu/lib/map-menu-item.js";

const flush = (ms = 40) => new Promise((r) => setTimeout(r, ms));
const ORIGIN = globalThis.location.origin;
const BASE_URL = `${ORIGIN}/sites/la/`;
const API = `${BASE_URL}x/api`;

const page = (id, order, title, parent = null) => ({
  id,
  title,
  slug: parent ? `${parent}/${id}` : id,
  location: `pages/${id}/index.html`,
  parent,
  indent: parent ? 1 : 0,
  order,
  metadata: {},
});

const MANIFEST = {
  id: "la-site",
  title: "Physics 010",
  metadata: { platform: {}, theme: { variables: {} }, site: { settings: {} } },
  items: [
    page("p1", 0, "Waves 101"),
    page("p2", 1, "Energy in waves"),
    page("p3", 0, "Sound", "p2"),
    page("p4", 2, "About this course"),
  ],
};

// nested and duplicate trackable tags, plus look-alikes that must not count
const PAGES = {
  p1: `<multiple-choice></multiple-choice>
    <grid-plate><div slot="col-1">
      <true-false-question></true-false-question>
      <multiple-choice title="<multiple-choice>"></multiple-choice>
    </div></grid-plate>
    <video-player source="https://example.com/v.mp4"></video-player>`,
  p2: `<user-action><bullet-check-list></bullet-check-list></user-action>
    <template><multiple-choice></multiple-choice></template>
    <p>Write &lt;multiple-choice&gt; to add a question.</p>
    <script type="text/plain"><multiple-choice></multiple-choice></script>`,
  p3: `<concept-quest-game></concept-quest-game>
    <video-player><video-player></video-player></video-player>`,
  p4: `<p>No activities here.</p><img src="x.png" alt="">`,
};

// a bigger site: 12 pages with activities in two sections, 3 without
const MANY = {
  id: "la-many",
  title: "Big course",
  metadata: MANIFEST.metadata,
  items: [],
};
const MANY_PAGES = {};
[
  ["s1", "Unit one", 7],
  ["s2", "Unit two", 5],
].forEach(([sid, title, n], si) => {
  MANY.items.push(page(sid, si, title));
  MANY_PAGES[sid] = "<p>Intro</p>";
  for (let i = 1; i <= n; i++) {
    const id = `${sid}-${i}`;
    MANY.items.push(page(id, i, `${title} page ${i}`, sid));
    MANY_PAGES[id] = "<multiple-choice></multiple-choice>".repeat(i % 3 || 1);
  }
});
MANY.items.push(page("z1", 9, "Credits"));
MANY_PAGES.z1 = "<p>Thanks</p>";

function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// the whole-site export markup the backends build
function buildExport(manifest = MANIFEST, pages = PAGES) {
  const s = [
    "<!doctype html>",
    "<html><head><title>x</title></head><body>",
    `<main data-haxcms-export="site" data-title="${esc(manifest.title)}">`,
    `<h1>${esc(manifest.title)}</h1>`,
  ];
  manifest.items.forEach((item) => {
    s.push(
      `<article data-item-id="${esc(item.id)}" data-item-slug="${esc(item.slug)}">`,
    );
    s.push(`<h2>${esc(item.title)}</h2>`);
    s.push(pages[item.id]);
    s.push("</article>");
  });
  s.push("</main>", "</body>", "</html>");
  return s.join("\n");
}

function fakeFetch(manifest = MANIFEST, pages = PAGES) {
  const calls = [];
  const fn = async (url) => {
    calls.push(String(url));
    if (String(url) === `${API}/v1/site/export/html`) {
      return new Response(buildExport(manifest, pages), { status: 200 });
    }
    const m = /\/v1\/content\/([^?]+)$/.exec(String(url));
    if (m) {
      const lookup = decodeURIComponent(m[1]);
      const item = manifest.items.find(
        (i) => i.slug === lookup || i.id === lookup,
      );
      if (item) {
        return new Response(
          JSON.stringify({ status: 200, data: { body: pages[item.id] } }),
          { status: 200 },
        );
      }
    }
    return new Response("", { status: 404 });
  };
  return { fn, calls };
}

describe("learning activity: scan", () => {
  afterEach(() => invalidateTrackable());

  it("groups vocabulary entries from interactionType and activity type", () => {
    const v = vocabularyMap();
    expect(v.get("multiple-choice").group).to.equal("questions");
    expect(v.get("flash-card").group).to.equal("questions");
    expect(v.get("video-player").group).to.equal("media");
    expect(v.get("bullet-check-list").group).to.equal("checklists");
    expect(v.get("concept-quest-game").group).to.equal("games");
    expect(v.get("user-action").group).to.equal("other");
    expect(activityGroupOf(null)).to.equal("other");
    // every tag of the generated vocabulary is known
    expect(Array.from(v.keys())).to.deep.equal(
      Object.keys(XAPI_VOCABULARY).sort(),
    );
  });

  it("matches the generated xapi-vocabulary.json", async () => {
    const res = await fetch(
      new URL("../../user-action/lib/xapi-vocabulary.json", import.meta.url),
    );
    const json = await res.json();
    expect(Object.keys(json).sort()).to.deep.equal(
      Object.keys(XAPI_VOCABULARY).sort(),
    );
  });

  it("counts nested and duplicate tags, not look-alikes", () => {
    const p1 = countTrackable(PAGES.p1);
    expect(p1.total).to.equal(4);
    expect(p1.completion).to.equal(4);
    expect(p1.byTag.get("multiple-choice")).to.equal(2);
    expect(p1.byTag.get("true-false-question")).to.equal(1);
    expect(p1.groups.get("questions")).to.equal(3);
    expect(p1.groups.get("media")).to.equal(1);
    const p2 = countTrackable(PAGES.p2);
    // template contents, text, script text and attribute values never count
    expect(p2.total).to.equal(2);
    expect(p2.completion).to.equal(1);
    expect(p2.byTag.has("multiple-choice")).to.equal(false);
    expect(p2.groups.get("other")).to.equal(1);
    expect(p2.groups.get("checklists")).to.equal(1);
    const p3 = countTrackable(PAGES.p3);
    expect(p3.byTag.get("video-player")).to.equal(2);
    expect(p3.groups.get("games")).to.equal(1);
    expect(countTrackable(PAGES.p4).total).to.equal(0);
    // the built-in parser (no DOMParser, as in a worker) agrees
    expect(countTrackable(PAGES.p1, undefined, "lite").total).to.equal(4);
    expect(countTrackable(PAGES.p2, undefined, "lite").total).to.equal(2);
  });

  it("scans the full site with one export request", async () => {
    const f = fakeFetch();
    const s = await scanLearningActivity({
      manifest: MANIFEST,
      fetchImpl: f.fn,
      baseUrl: BASE_URL,
    });
    expect(f.calls).to.deep.equal([`${API}/v1/site/export/html`]);
    expect(s.pages).to.equal(4);
    expect(s.total).to.equal(9);
    expect(s.completion).to.equal(8);
    expect(s.withActivities).to.equal(3);
    expect(s.withoutActivities).to.equal(1);
    expect(s.rows.map((r) => r.item.id)).to.deep.equal([
      "p1",
      "p2",
      "p3",
      "p4",
    ]);
    expect(s.types.map((t) => [t.tag, t.count])).to.deep.equal([
      ["video-player", 3],
      ["multiple-choice", 2],
      ["bullet-check-list", 1],
      ["concept-quest-game", 1],
      ["true-false-question", 1],
      ["user-action", 1],
    ]);
    // results are cached per page for the outline badge
    expect(cachedTrackable("p1").total).to.equal(4);
    expect(trackableCountsById().p4).to.equal(0);
  });

  it("scans a page and below with per-page requests", async () => {
    const f = fakeFetch();
    const s = await scanLearningActivity({
      rootId: "p2",
      manifest: MANIFEST,
      fetchImpl: f.fn,
      baseUrl: BASE_URL,
    });
    expect(f.calls).to.deep.equal([
      `${API}/v1/content/p2`,
      `${API}/v1/content/p2%2Fp3`,
    ]);
    expect(s.pages).to.equal(2);
    expect(s.total).to.equal(5);
    expect(s.rows.map((r) => r.item.id)).to.deep.equal(["p2", "p3"]);
  });

  it("builds same-site page links only", () => {
    expect(pageHref({ slug: "p2/p3" }, BASE_URL)).to.equal(`${BASE_URL}p2/p3`);
    expect(pageHref({ slug: "/p1" }, BASE_URL)).to.equal(`${BASE_URL}p1`);
    expect(pageHref({ slug: "https://evil.example/x" }, BASE_URL)).to.equal(
      BASE_URL,
    );
    expect(pageHref({ slug: "//evil.example/x" }, BASE_URL)).to.equal(
      `${BASE_URL}evil.example/x`,
    );
  });
});

describe("learning activity: report element", () => {
  afterEach(() => invalidateTrackable());

  async function report(rootId = "") {
    const f = fakeFetch();
    const el = await fixture(
      html`<haxcms-learning-activity-report
        .manifest="${MANIFEST}"
        .fetchImpl="${f.fn}"
        base-url="${BASE_URL}"
        root-id="${rootId}"
      ></haxcms-learning-activity-report>`,
    );
    await el.refresh(false);
    await el.updateComplete;
    return { el, calls: f.calls };
  }

  it("shows tiles, bars and the by-page table as text", async () => {
    const { el } = await report();
    const root = el.shadowRoot;
    const tiles = Array.from(root.querySelectorAll(".kpis li")).map((li) =>
      li.textContent.replace(/\s+/g, " ").trim(),
    );
    expect(tiles[0]).to.equal(
      "Trackable elements 9 across 4 pages 8 count toward completion",
    );
    expect(tiles[1]).to.equal("Pages with activities 3 / 4 1 have none");
    expect(tiles[2]).to.equal("Element types 6 that send statements");
    expect(tiles[3]).to.equal(
      "Learner completion — needs a server or LRS adapter",
    );
    const bars = Array.from(root.querySelectorAll(".bars li"));
    expect(bars.map((b) => b.getAttribute("data-tag"))[0]).to.equal(
      "video-player",
    );
    // the number is text, the bar is decoration
    expect(bars[0].querySelector(".bar-count").textContent.trim()).to.equal(
      "3",
    );
    expect(
      bars[0].querySelector(".bar-track").getAttribute("aria-hidden"),
    ).to.equal("true");
    expect(bars[0].getAttribute("data-group")).to.equal("media");
    const head = Array.from(root.querySelectorAll("thead th")).map((th) =>
      th.textContent.trim(),
    );
    expect(head).to.deep.equal([
      "Page",
      "Trackable",
      "Questions",
      "Media",
      "Checklists",
      "Games",
      "Other",
    ]);
    const row = (id) =>
      Array.from(root.querySelectorAll(`tr[data-page-id="${id}"] > *`)).map(
        (c) => c.textContent.trim(),
      );
    expect(row("p1")).to.deep.equal([
      "Waves 101",
      "4",
      "3",
      "1",
      "0",
      "0",
      "0",
    ]);
    expect(row("p2")).to.deep.equal([
      "Energy in waves",
      "2",
      "0",
      "0",
      "1",
      "0",
      "1",
    ]);
    // by default only pages with activities, in outline order
    expect(
      Array.from(root.querySelectorAll("tbody tr")).map((tr) =>
        tr.getAttribute("data-page-id"),
      ),
    ).to.deep.equal(["p1", "p2", "p3"]);
    // pages without: one summary line and a toggle, then flagged rows
    const line = root.querySelector(".none-line");
    expect(line.textContent.replace(/\s+/g, " ").trim()).to.equal(
      "1 page has none Show pages without activities",
    );
    expect(root.querySelector(".all-pages")).to.equal(null);
    const toggle = line.querySelector("button");
    expect(toggle.getAttribute("aria-expanded")).to.equal("false");
    toggle.click();
    await el.updateComplete;
    expect(toggle.getAttribute("aria-expanded")).to.equal("true");
    expect(toggle.textContent.trim()).to.equal("Hide pages without activities");
    expect(row("p4")).to.deep.equal(["About this course", "0 — not tracked"]);
    expect(
      root.querySelector('tr[data-page-id="p4"] td').getAttribute("colspan"),
    ).to.equal("6");
    // the learner results empty state is there with no learner data
    expect(root.querySelector(".empty-state h3").textContent).to.equal(
      "Learner results",
    );
  });

  it("links every page row to a same-site page URL", async () => {
    const { el } = await report();
    const links = Array.from(el.shadowRoot.querySelectorAll("tbody a"));
    // pages with activities only, by default
    expect(links.length).to.equal(3);
    links.forEach((a) => {
      const url = new URL(a.href);
      expect(url.origin).to.equal(ORIGIN);
      expect(url.pathname.indexOf("/sites/la/")).to.equal(0);
      expect(a.hasAttribute("target")).to.equal(false);
    });
    expect(links[2].getAttribute("href")).to.equal(`${BASE_URL}p2/p3`);
  });

  it("follows the page / branch scope", async () => {
    const { el, calls } = await report("p2");
    expect(calls.length).to.equal(2);
    expect(
      Array.from(el.shadowRoot.querySelectorAll("tbody tr")).map((tr) =>
        tr.getAttribute("data-page-id"),
      ),
    ).to.deep.equal(["p2", "p3"]);
    // a new root rescans by itself
    el.rootId = "";
    await flush();
    await el.__scan;
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll("tbody tr").length).to.equal(3);
    expect(el.shadowRoot.querySelector(".none-line")).to.not.equal(null);
  });

  it("opens a readable vocabulary list from the JSON", async () => {
    const { el } = await report();
    const btn = el.shadowRoot.querySelector(".ddd-block-action");
    expect(btn.getAttribute("aria-expanded")).to.equal("false");
    expect(el.shadowRoot.querySelector("#la-vocabulary")).to.equal(null);
    btn.click();
    await el.updateComplete;
    expect(btn.getAttribute("aria-expanded")).to.equal("true");
    const items = el.shadowRoot.querySelectorAll("#la-vocabulary li");
    expect(items.length).to.equal(Object.keys(XAPI_VOCABULARY).length);
    const mc = el.shadowRoot.querySelector(
      '#la-vocabulary li[data-tag="multiple-choice"]',
    );
    const text = mc.textContent.replace(/\s+/g, " ");
    expect(text).to.include("multiple-choice");
    expect(text).to.include("Verbs answered");
    expect(text).to.include(XAPI_VOCABULARY["multiple-choice"].result[0]);
    expect(text).to.include(XAPI_VOCABULARY["multiple-choice"].done);
    expect(text).to.include("Counts toward page completion Yes");
    const ua = el.shadowRoot.querySelector(
      '#la-vocabulary li[data-tag="user-action"]',
    );
    expect(ua.textContent.replace(/\s+/g, " ")).to.include(
      "Result fields none",
    );
  });

  it("reports a failed scan", async () => {
    const el = await fixture(
      html`<haxcms-learning-activity-report
        .manifest="${MANIFEST}"
        .fetchImpl="${async () => new Response("", { status: 500 })}"
        base-url="${BASE_URL}"
      ></haxcms-learning-activity-report>`,
    );
    await el.refresh(false);
    await el.updateComplete;
    expect(
      el.shadowRoot.querySelector('[role="alert"]').textContent,
    ).to.include("500");
  });

  it("passes the a11y audit", async () => {
    const { el } = await report();
    el.shadowRoot.querySelector(".ddd-block-action").click();
    await el.updateComplete;
    await expect(el).shadowDom.to.be.accessible();
  });
});

describe("learning activity: by page list", () => {
  afterEach(() => invalidateTrackable());

  it("caps the list, then groups everything by section", async () => {
    const f = fakeFetch(MANY, MANY_PAGES);
    const s = await scanLearningActivity({
      manifest: MANY,
      fetchImpl: f.fn,
      baseUrl: BASE_URL,
    });
    const m = pageTableModel(s.rows);
    expect(PAGES_LIMIT).to.equal(10);
    expect(m.active).to.equal(12);
    expect(m.none).to.equal(3);
    expect(m.more).to.equal(true);
    expect(m.shown.map((r) => r.item.id)).to.deep.equal([
      "s1-1",
      "s1-2",
      "s1-3",
      "s1-4",
      "s1-5",
      "s1-6",
      "s1-7",
      "s2-1",
      "s2-2",
      "s2-3",
    ]);
    expect(
      m.sections.map((x) => [x.id, x.rows.length, x.active]),
    ).to.deep.equal([
      ["s1", 7, 7],
      ["s2", 5, 5],
    ]);
    const all = pageTableModel(s.rows, { withNone: true });
    expect(all.sections.map((x) => [x.id, x.rows.length])).to.deep.equal([
      ["s1", 8],
      ["s2", 6],
      ["z1", 1],
    ]);
    expect(all.sections[2].title).to.equal("Credits");
  });

  it("shows ten, then all pages with activities in sections", async () => {
    const f = fakeFetch(MANY, MANY_PAGES);
    const el = await fixture(
      html`<haxcms-learning-activity-report
        .manifest="${MANY}"
        .fetchImpl="${f.fn}"
        base-url="${BASE_URL}"
      ></haxcms-learning-activity-report>`,
    );
    await el.refresh(false);
    await el.updateComplete;
    const root = el.shadowRoot;
    expect(root.querySelectorAll(".by-page tbody tr").length).to.equal(10);
    expect(root.querySelector(".none-line").textContent).to.include(
      "3 pages have none",
    );
    const more = root.querySelector(".all-pages");
    expect(more.textContent.trim()).to.equal(
      "Show all 12 pages with activities",
    );
    expect(more.getAttribute("aria-controls")).to.equal("la-pages");
    more.click();
    await el.updateComplete;
    const sections = Array.from(root.querySelectorAll("details.section"));
    expect(sections.map((d) => d.getAttribute("data-section"))).to.deep.equal([
      "s1",
      "s2",
    ]);
    expect(
      sections[0].querySelector("summary").textContent.replace(/\s+/g, " "),
    ).to.include("Unit one 7 with activities · 9 trackable");
    expect(sections[0].open).to.equal(true);
    // each section keeps real table semantics, named by its section
    const table = sections[1].querySelector("table");
    expect(table.getAttribute("aria-labelledby")).to.equal("la-section-s2");
    expect(table.querySelectorAll("thead th").length).to.equal(7);
    expect(table.querySelectorAll('tbody th[scope="row"]').length).to.equal(5);
    expect(root.querySelector(".all-pages").textContent.trim()).to.equal(
      "Show fewer pages",
    );
    // with pages without activities: their own section, closed
    root.querySelector(".none-line button").click();
    await el.updateComplete;
    const z = root.querySelector('details.section[data-section="z1"]');
    expect(z.open).to.equal(false);
    expect(z.textContent).to.include("0 — not tracked");
    await expect(el).shadowDom.to.be.accessible();
    // back to the short list
    root.querySelector(".all-pages").click();
    root.querySelector(".none-line button").click();
    await el.updateComplete;
    expect(root.querySelectorAll("details.section").length).to.equal(0);
    expect(root.querySelectorAll(".by-page tbody tr").length).to.equal(10);
  });

  it("asks the host to open a page", async () => {
    const f = fakeFetch();
    const host = await fixture(html`<div></div>`);
    const seen = [];
    host.addEventListener("insights-open-page", (e) => {
      seen.push(e.detail.slug);
      e.detail.handled = true;
    });
    const el = document.createElement("haxcms-learning-activity-report");
    el.manifest = MANIFEST;
    el.fetchImpl = f.fn;
    el.baseUrl = BASE_URL;
    host.appendChild(el);
    await el.updateComplete;
    await el.refresh(false);
    await el.updateComplete;
    const link = el.shadowRoot.querySelector('tr[data-page-id="p3"] a');
    const click = new MouseEvent("click", {
      bubbles: true,
      cancelable: true,
      composed: true,
    });
    link.dispatchEvent(click);
    expect(seen).to.deep.equal(["p2/p3"]);
    expect(click.defaultPrevented).to.equal(true);
  });
});

describe("learning activity: Reports screen", () => {
  let saved;
  let realFetch;
  before(() => {
    saved = { manifest: store.manifest, activeId: store.activeId };
    realFetch = globalThis.fetch;
    // the site API the Reports section reads, answered from the fixture
    globalThis.fetch = (url, init) => {
      if (String(url).endsWith("/x/api/v1/site/export/html")) {
        return Promise.resolve(new Response(buildExport(), { status: 200 }));
      }
      return realFetch(url, init);
    };
  });
  after(() => {
    globalThis.fetch = realFetch;
    store.manifest = saved.manifest;
    store.activeId = saved.activeId;
    invalidateTrackable();
  });

  it("is a Reports child screen right after Instructional", () => {
    const reports = getSiteAdminSection("reports");
    const keys = reports.children.map((c) => c.key);
    expect(keys.indexOf("learning")).to.equal(
      keys.indexOf("instructional") + 1,
    );
    const child = reports.children.find((c) => c.key === "learning");
    expect(child.route).to.equal("reports-learning");
    expect(child.labelKey).to.equal("reportsLearning");
    expect(child.descriptionKey).to.equal("reportsLearningDescription");
    expect(child.icon).to.equal("hax:admin-check");
  });

  it("has its rail strings in the en locale", async () => {
    const res = await fetch(
      new URL("../locales/haxcms.en.json", import.meta.url),
    );
    const en = await res.json();
    expect(en.reportsLearning).to.equal("Learning activity");
    expect(en.reportsLearningDescription).to.be.a("string");
    expect(en.laShowAllPages).to.equal(
      "Show all {count} pages with activities",
    );
  });

  it("renders the report for its route and follows the scope control", async () => {
    store.manifest = JSON.parse(JSON.stringify(MANIFEST));
    const el = await fixture(
      html`<haxcms-site-reports section="learning"></haxcms-site-reports>`,
    );
    await flush(200);
    await el.updateComplete;
    const rep = () =>
      el.shadowRoot.querySelector("haxcms-learning-activity-report");
    expect(rep()).to.not.equal(null);
    expect(rep().rootId).to.equal("");
    await rep().__scan;
    await rep().updateComplete;
    expect(
      rep().shadowRoot.querySelectorAll(".by-page tbody tr").length,
    ).to.equal(3);
    // the analyzer screens' CSV has nothing to say about this screen
    expect(el.shadowRoot.querySelector(".btn.export").disabled).to.equal(true);
    // This page and below
    el.selectedReportId = "p2";
    const scope = el.shadowRoot.querySelector("#scope");
    scope.value = "branch";
    scope.dispatchEvent(new Event("change"));
    await flush(50);
    await el.updateComplete;
    expect(rep().rootId).to.equal("p2");
    // other screens still render from the analyzer
    el.section = "media";
    await flush(50);
    await el.updateComplete;
    expect(rep()).to.equal(null);
  });
});

describe("learning activity: outline badge", () => {
  let saved;
  before(() => {
    saved = { manifest: store.manifest, editMode: store.editMode };
  });
  after(() => {
    store.manifest = saved.manifest;
    store.editMode = saved.editMode;
    invalidateTrackable();
  });

  it("menu items draw a quiet count, a dash for none, nothing without", async () => {
    const el = await fixture(
      html`<map-menu-item itemtitle="Waves 101" trackable="4"></map-menu-item>`,
    );
    const badge = () => el.shadowRoot.querySelector(".trackable-count");
    expect(badge().textContent.trim()).to.equal("4");
    expect(badge().getAttribute("aria-hidden")).to.equal("true");
    expect(
      el.shadowRoot.querySelector("button").textContent.replace(/\s+/g, " "),
    ).to.include("Waves 101, 4 trackable");
    el.trackable = "0";
    await el.updateComplete;
    expect(badge().textContent.trim()).to.equal("—");
    el.trackable = "";
    await el.updateComplete;
    expect(badge()).to.equal(null);
  });

  it("site menu shows counts only in edit mode", async () => {
    store.editMode = false;
    store.manifest = JSON.parse(JSON.stringify(MANIFEST));
    rememberTrackable("p1", countTrackable(PAGES.p1));
    rememberTrackable("p2", countTrackable(PAGES.p2));
    rememberTrackable("p4", countTrackable(PAGES.p4));
    const menu = await fixture(html`<site-menu></site-menu>`);
    await flush(150);
    await menu.updateComplete;
    const mm = menu.shadowRoot.querySelector("map-menu");
    await mm.updateComplete;
    const items = () => {
      const out = {};
      mm.shadowRoot
        .querySelectorAll("map-menu-item, map-menu-header")
        .forEach((i) => {
          out[i.id] = i;
        });
      return out;
    };
    const badgeOf = (i) =>
      i && i.shadowRoot ? i.shadowRoot.querySelector(".trackable-count") : null;
    // learners (no edit mode): nothing
    expect(mm.trackable).to.equal(null);
    expect(badgeOf(items().p1)).to.equal(null);
    store.editMode = true;
    await flush(150);
    await menu.updateComplete;
    await mm.updateComplete;
    await flush(50);
    let all = items();
    await Promise.all(Object.values(all).map((i) => i.updateComplete));
    expect(mm.trackable.p1).to.equal(4);
    expect(badgeOf(all.p1).textContent.trim()).to.equal("4");
    expect(badgeOf(all.p4).textContent.trim()).to.equal("—");
    // a saved page drops its count until its content is read again
    store.activeId = "p1";
    globalThis.dispatchEvent(new CustomEvent("haxcms-trigger-update-node"));
    await flush(50);
    expect(cachedTrackable("p1")).to.equal(null);
    store.editMode = false;
    await flush(150);
    await menu.updateComplete;
    expect(mm.trackable).to.equal(null);
    all = items();
    await Promise.all(Object.values(all).map((i) => i.updateComplete));
    expect(badgeOf(all.p2)).to.equal(null);
  });
});
