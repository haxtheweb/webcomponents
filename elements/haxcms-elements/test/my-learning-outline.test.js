import { fixture, expect, html } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import { LearnerProgress } from "../lib/core/haxcms-learner-progress.js";
import {
  MyLearningNavigation,
  sitePageUrl,
} from "../lib/ui-components/progress/my-learning.js";
import "../lib/ui-components/progress/my-learning-panel.js";
import {
  LearnerOutlineNavigation,
  learnerOutlineModel,
} from "../lib/ui-components/progress/learner-outline-progress.js";
import { UserScaffoldInstance } from "@haxtheweb/user-scaffold/user-scaffold.js";
import {
  MemoryMemoryAdapter,
  MemoryStatementAdapter,
} from "@haxtheweb/user-scaffold/lib/user-scaffold-storage.js";
import { XAPI_EXTENSIONS } from "@haxtheweb/user-action/lib/xapi.js";

// haxtheweb/issues#3267: the All pages view on the My learning dashboard,
// shared with the My learning panel

const SITE = "outline-site";
const flush = (ms = 40) => new Promise((r) => setTimeout(r, ms));
const item = (id, parent, order, title, metadata = {}) => ({
  id,
  parent,
  order,
  title,
  slug: id,
  location: `pages/${id}/index.html`,
  indent: 0,
  metadata,
});
// ch1 (p1, p2 > p2a), ch2 (p3, hidden), solo
const ITEMS = [
  item("ch2", null, 1, "Chapter 2"),
  item("ch1", null, 0, "Chapter 1", { icon: "icons:star" }),
  item("p2", "ch1", 1, "Energy"),
  item("p1", "ch1", 0, "Waves 101"),
  item("p2a", "p2", 0, "Energy deep dive"),
  item("p3", "ch2", 0, "Sound"),
  item("hidden", "ch2", 1, "Hidden", { hideInMenu: true }),
  item("solo", null, 2, "Wrap up"),
];
const MANIFEST = {
  id: SITE,
  title: "Physics 010",
  metadata: {
    platform: {},
    theme: { variables: {} },
    site: { name: "physics-010", settings: {} },
  },
  items: ITEMS,
};
let n = 0;
// the learner read a page through (a page with nothing else on it is done)
const read = (page) => {
  UserScaffoldInstance.recordPageVisit(SITE, page, {});
  UserScaffoldInstance.recordStatement(
    SITE,
    {
      id: `00000000-0000-4000-8000-${String(++n).padStart(12, "0")}`,
      verb: {
        id: "http://adlnet.gov/expapi/verbs/completed",
        display: { "en-US": "completed" },
      },
      object: {
        id: `https://example.com/${page}`,
        objectType: "Activity",
        definition: { name: { "en-US": page } },
      },
      result: {
        completion: true,
        extensions: { [XAPI_EXTENSIONS.progress]: 1 },
      },
      context: { extensions: { [XAPI_EXTENSIONS.element]: "haxcms-page" } },
      timestamp: new Date().toISOString(),
    },
    { page, tag: "haxcms-page", trackable: false, reading: true },
  );
};
const rowsOf = (root) =>
  Array.from(root.querySelectorAll(".lop-list > .lop-row"));
const textOf = (el) => el.textContent.replace(/\s+/g, " ").trim();

describe("My learning dashboard: All pages", () => {
  let saved;
  before(() => {
    saved = {
      manifest: store.manifest,
      activeId: store.activeId,
      editMode: store.editMode,
      memory: UserScaffoldInstance._memoryAdapter,
      statements: UserScaffoldInstance._statementAdapter,
      go: MyLearningNavigation.go,
      outlineGo: LearnerOutlineNavigation.go,
    };
  });
  beforeEach(async () => {
    UserScaffoldInstance.setMemoryAdapter(new MemoryMemoryAdapter());
    UserScaffoldInstance.setStatementAdapter(new MemoryStatementAdapter());
    store.editMode = true; // no automatic page visits while setting up
    store.manifest = JSON.parse(JSON.stringify(MANIFEST));
    LearnerProgress.start();
    store.activeId = "p1";
    await flush();
    // p1 and p3 read; p1 is half of chapter 1 (p1, p2, p2a), p3 all of
    // chapter 2 (hidden does not count)
    read("p1");
    read("p3");
  });
  afterEach(() => {
    MyLearningNavigation.go = saved.go;
    LearnerOutlineNavigation.go = saved.outlineGo;
  });
  after(() => {
    store.manifest = saved.manifest;
    store.activeId = saved.activeId;
    store.editMode = saved.editMode;
    UserScaffoldInstance.setMemoryAdapter(saved.memory);
    UserScaffoldInstance.setStatementAdapter(saved.statements);
  });
  const make = async (markup) => {
    const el = await fixture(markup);
    await el.refresh();
    await el.updateComplete;
    return el;
  };

  it("site scope: the top level of the outline, each in its own ring", async () => {
    const el = await make(html`<my-learning scope="site"></my-learning>`);
    const card = el.shadowRoot.querySelector(".outline-card");
    expect(card).to.exist;
    expect(card.getAttribute("role")).to.equal("region");
    expect(textOf(card.querySelector("h3"))).to.equal("Progress by page");
    // it sits right after the tiles, before the chart and pages cards
    expect(card.previousElementSibling.classList.contains("tiles")).to.equal(
      true,
    );
    const sp = LearnerProgress.siteProgress();
    expect(sp.total).to.equal(7);
    expect(textOf(card.querySelector(".lop-summary"))).to.equal(
      `${Math.round(sp.percent * 100)}% All pages 2 of 7 pages done`,
    );
    const rows = rowsOf(card);
    expect(rows.map((r) => r.getAttribute("data-id"))).to.deep.equal([
      "ch1",
      "ch2",
      "solo",
    ]);
    // chapter 1: 1 of 4 pages read (ch1, p1, p2, p2a)
    expect(textOf(rows[0].querySelector(".lop-pct"))).to.equal("25%");
    expect(textOf(rows[0].querySelector(".lop-meta"))).to.equal("4 pages");
    expect(
      rows[0].querySelector(".ddd-ring simple-icon-lite").getAttribute("icon"),
    ).to.equal("icons:star");
    expect(
      rows[0].querySelector(".ddd-ring").getAttribute("data-state"),
    ).to.equal("progress");
    // chapter 2: ch2 not read, p3 read
    expect(textOf(rows[1].querySelector(".lop-pct"))).to.equal("50%");
    // wrap up: a page of its own, not started
    expect(rows[2].querySelector(".lop-meta")).to.equal(null);
    expect(
      rows[2].querySelector(".ddd-ring simple-icon-lite").getAttribute("icon"),
    ).to.equal("icons:description");
    expect(
      rows[2].querySelector(".ddd-ring").getAttribute("data-state"),
    ).to.equal("none");
    await expect(el).shadowDom.to.be.accessible();
  });

  it("a done page shows a filled disc with a check", async () => {
    read("solo");
    const el = await make(html`<my-learning scope="site"></my-learning>`);
    const solo = rowsOf(el.shadowRoot.querySelector(".outline-card"))[2];
    expect(solo.getAttribute("data-state")).to.equal("done");
    const ring = solo.querySelector(".ddd-ring");
    expect(ring.getAttribute("data-state")).to.equal("done");
    expect(
      ring.querySelector("simple-icon-lite").getAttribute("icon"),
    ).to.equal("icons:check");
    expect(textOf(solo.querySelector(".lop-sr"))).to.equal(", Complete");
  });

  it("rows are links with the percent in their name and hover text", async () => {
    const el = await make(html`<my-learning scope="site"></my-learning>`);
    const a = rowsOf(
      el.shadowRoot.querySelector(".outline-card"),
    )[0].querySelector("a.lop-go");
    expect(a.getAttribute("href")).to.equal(sitePageUrl({ slug: "ch1" }));
    expect(a.getAttribute("title")).to.equal("Chapter 1, 25% complete");
    // the visible percent is not read twice
    expect(a.querySelector(".lop-pct").getAttribute("aria-hidden")).to.equal(
      "true",
    );
    expect(textOf(a.querySelector(".lop-sr"))).to.equal(", 25% complete");
    a.focus();
    expect(el.shadowRoot.activeElement).to.equal(a);
  });

  it("matches the panel's All pages numbers", async () => {
    const el = await make(html`<my-learning scope="site"></my-learning>`);
    const panel = await fixture(
      html`<my-learning-panel tab="site"></my-learning-panel>`,
    );
    await flush(60);
    await panel.updateComplete;
    const dash = el.shadowRoot.querySelector(".outline-card");
    const pane = panel.shadowRoot.querySelector("#pane-site");
    expect(textOf(pane.querySelector(".lop-summary"))).to.equal(
      textOf(dash.querySelector(".lop-summary")),
    );
    const rowText = (root) => rowsOf(root).map((r) => textOf(r));
    expect(rowText(pane)).to.deep.equal(rowText(dash));
    expect(rowText(pane).length).to.equal(3);
  });

  it("branch scope: the section's pages instead of the top level", async () => {
    store.activeId = "p1";
    const el = await make(html`<my-learning scope="branch"></my-learning>`);
    const card = el.shadowRoot.querySelector(".outline-card");
    // the summary is named after the section and counts its pages
    expect(textOf(card.querySelector(".lop-summary .lop-name"))).to.equal(
      "Chapter 1",
    );
    expect(textOf(card.querySelector(".lop-summary .lop-meta"))).to.equal(
      "1 of 4 pages done",
    );
    const rows = rowsOf(card);
    expect(rows.map((r) => r.getAttribute("data-id"))).to.deep.equal([
      "p1",
      "p2",
    ]);
    expect(textOf(rows[0].querySelector(".lop-pct"))).to.equal("100%");
    expect(textOf(rows[1].querySelector(".lop-meta"))).to.equal("2 pages");
  });

  it("children scope of a page without children shows that page", async () => {
    store.activeId = "p3";
    const el = await make(html`<my-learning scope="children"></my-learning>`);
    const rows = rowsOf(el.shadowRoot.querySelector(".outline-card"));
    expect(rows.map((r) => r.getAttribute("data-id"))).to.deep.equal(["p3"]);
  });

  it("following a row closes the dialog and opens that page", async () => {
    const went = [];
    MyLearningNavigation.go = (url) => {
      went.push(url);
      return "load";
    };
    const el = await make(
      html`<my-learning scope="site" in-dialog></my-learning>`,
    );
    let hidden = 0;
    el.addEventListener("simple-modal-hide", () => hidden++);
    const a = rowsOf(
      el.shadowRoot.querySelector(".outline-card"),
    )[1].querySelector("a.lop-go");
    a.click();
    await flush();
    expect(hidden).to.equal(1);
    expect(went).to.deep.equal([sitePageUrl({ slug: "ch2" })]);
  });

  it("the panel's rows close the panel and open the page", async () => {
    const went = [];
    LearnerOutlineNavigation.go = (url) => {
      went.push(url);
      return "router";
    };
    const panel = await fixture(
      html`<my-learning-panel tab="site"></my-learning-panel>`,
    );
    await flush(60);
    await panel.updateComplete;
    let closed = null;
    panel.addEventListener("my-learning-panel-close", (e) => {
      closed = e.detail;
    });
    rowsOf(panel.shadowRoot.querySelector("#pane-site"))[2]
      .querySelector("a.lop-go")
      .click();
    expect(closed).to.deep.equal({ returnFocus: false });
    expect(went).to.deep.equal([sitePageUrl({ slug: "solo" })]);
  });

  it("rings keep 3:1 against the card in light and dark (WCAG 1.4.11)", async () => {
    read("solo");
    const rgb = (c) =>
      String(c)
        .match(/[\d.]+/g)
        .slice(0, 3)
        .map(Number);
    const lum = (c) => {
      const [r, g, b] = rgb(c).map((v) => {
        const x = v / 255;
        return x <= 0.03928 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const contrast = (a, b) => {
      const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
      return (hi + 0.05) / (lo + 0.05);
    };
    for (const scheme of ["light", "dark"]) {
      const bg = scheme === "light" ? "rgb(255, 255, 255)" : "rgb(38, 38, 38)";
      const el = await make(
        html`<my-learning
          scope="site"
          style="color-scheme: ${scheme}; background-color: ${bg};"
        ></my-learning>`,
      );
      const rows = rowsOf(el.shadowRoot.querySelector(".outline-card"));
      const open = rows[0].querySelector(".ddd-ring");
      const track = getComputedStyle(
        open.querySelector(".ddd-ring-track"),
      ).stroke;
      const fill = getComputedStyle(
        open.querySelector(".ddd-ring-fill"),
      ).stroke;
      expect(contrast(track, bg), `${scheme} track`).to.be.at.least(3);
      expect(contrast(fill, bg), `${scheme} fill`).to.be.at.least(3);
      const done = rows[2].querySelector(".ddd-ring");
      const disc = getComputedStyle(done).backgroundColor;
      const check = getComputedStyle(
        done.querySelector("simple-icon-lite"),
      ).color;
      expect(contrast(disc, bg), `${scheme} disc`).to.be.at.least(3);
      expect(contrast(check, disc), `${scheme} check`).to.be.at.least(3);
    }
  });

  it("the model: scope pages, hidden pages and roots", () => {
    const sp = LearnerProgress.siteProgress();
    const all = learnerOutlineModel(ITEMS, sp, {
      pageIds: LearnerProgress.pageIds(),
    });
    expect(all.total).to.equal(7);
    expect(all.done).to.equal(2);
    expect(all.rows.map((r) => r.count)).to.deep.equal([4, 2, 1]);
    const branch = learnerOutlineModel(ITEMS, sp, {
      pageIds: LearnerProgress.pageIds(),
      root: "ch2",
      pages: ["ch2", "p3"],
    });
    expect(branch.rows.map((r) => r.id)).to.deep.equal(["p3"]);
    expect(branch.done).to.equal(1);
    expect(branch.total).to.equal(2);
    expect(branch.percent).to.equal(0.5);
  });
});
