import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { MicroFrontendRegistry } from "@haxtheweb/micro-frontend-registry/micro-frontend-registry.js";
import { analyzeSite } from "../lib/core/insights/insights-analyzer.js";
import {
  HISTORY_OPERATION,
  HISTORY_PAGES,
  _resetEditHistory,
  loadEditHistory,
  recentlySavedPages,
} from "../lib/core/insights/insights-edit-history.js";
import "../lib/core/insights/sections/insights-freshness.js";
import {
  loadSpec,
  loadFixtureSite,
  loadExtras,
  RESULT_OPTIONS,
} from "./insights-fixture-helpers.js";

// Edit history on the Freshness screen (haxtheweb/issues#3167): read from
// the page revisions endpoint (@site/listItemRevisions). The registry is
// stubbed so the operation looks registered and answers from REVISIONS.
let results;
let calls;
let realHas;
let realCall;

// two pages share the bulk save "abc1234"
function revisionsFor(id) {
  const bulk = {
    hash: "abc1234000",
    shortHash: "abc1234",
    author: "Ada",
    timestamp: 1767225600,
    summary: "Imported pages",
    kind: "content",
  };
  const own = {
    hash: `own-${id}`,
    shortHash: `own${id}`.substring(0, 7),
    author: "Grace",
    timestamp: 1767312000,
    summary: `Edited ${id}`,
    kind: "content",
  };
  return [own, bulk];
}

before(async () => {
  const spec = await loadSpec();
  const site = await loadFixtureSite();
  results = analyzeSite(
    site.pages,
    site.manifest,
    spec,
    Object.assign({ extras: await loadExtras() }, RESULT_OPTIONS),
  );
});

beforeEach(() => {
  calls = [];
  _resetEditHistory();
  realHas = MicroFrontendRegistry.has;
  realCall = MicroFrontendRegistry.call;
  MicroFrontendRegistry.has = (name) =>
    name === HISTORY_OPERATION
      ? true
      : realHas.call(MicroFrontendRegistry, name);
  MicroFrontendRegistry.call = async (name, params) => {
    calls.push(params);
    if (params.idOrSlug === "broken-page") {
      return { status: 500, data: null };
    }
    return { status: 200, data: { revisions: revisionsFor(params.idOrSlug) } };
  };
});

afterEach(() => {
  MicroFrontendRegistry.has = realHas;
  MicroFrontendRegistry.call = realCall;
  _resetEditHistory();
});

describe("insights-edit-history", () => {
  it("picks the most recently saved pages", () => {
    const pages = recentlySavedPages(results.freshness.pages);
    expect(pages.length).to.be.at.most(HISTORY_PAGES);
    for (let i = 1; i < pages.length; i++) {
      expect(pages[i].daysSinceUpdate).to.be.at.least(
        pages[i - 1].daysSinceUpdate,
      );
    }
    expect(pages.every((p) => p.daysSinceUpdate !== null)).to.equal(true);
  });

  it("merges a change that touched several pages into one row, newest first", async () => {
    const h = await loadEditHistory([
      { pageId: "a", title: "A", slug: "a" },
      { pageId: "b", title: "B", slug: "b" },
      { pageId: "broken-page", title: "X", slug: "x" },
    ]);
    expect(calls.map((c) => c["page.limit"])).to.deep.equal([5, 5, 5]);
    expect(h.failed).to.equal(1);
    const bulk = h.entries.find((e) => e.shortHash === "abc1234");
    expect(bulk.pages.map((p) => p.pageId)).to.deep.equal(["a", "b"]);
    expect(h.entries[h.entries.length - 1].shortHash).to.equal("abc1234");
    expect(h.entries.length).to.equal(3);
  });
});

describe("insights-freshness with a backend that reads history", () => {
  it("loads recent changes on request and opens a page's revisions", async () => {
    const el = await fixture(
      html`<insights-freshness .results="${results}"></insights-freshness>`,
    );
    await waitUntil(() => el.shadowRoot.querySelector(".load-history"));
    // the edit history is live, so the Coming soon note only covers reminders
    expect(el.shadowRoot.querySelector(".needs-history")).to.equal(null);
    expect(el.shadowRoot.querySelector(".remind")).to.exist;
    el.shadowRoot.querySelector(".load-history").click();
    await waitUntil(() => el.shadowRoot.querySelector("table.history"));
    const rows = el.shadowRoot.querySelectorAll("table.history tbody tr");
    expect(rows.length).to.be.greaterThan(1);
    const bulk = el.shadowRoot.querySelector('tr[data-hash="abc1234"]');
    expect(bulk.textContent).to.contain("Imported pages");
    expect(bulk.textContent).to.contain("Ada");
    expect(bulk.textContent).to.match(/\+\d+ more/);
    const opened = new Promise((resolve) =>
      globalThis.addEventListener("haxcms-open-page-revisions", resolve, {
        once: true,
      }),
    );
    bulk.querySelector(".view-revisions").click();
    const ev = await opened;
    expect(ev.detail.nodeId).to.be.a("string").and.not.equal("");
    expect(ev.detail.source).to.equal("insights-freshness");
  });
});
