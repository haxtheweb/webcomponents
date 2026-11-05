// Content admin: the read-only Activities column (trackable element counts
// per page, from the Learning activity scan)
import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { store } from "../lib/core/haxcms-site-store.js";
import "../lib/core/haxcms-content-admin-dialog.js";
import {
  cachedTrackable,
  countTrackable,
  invalidateTrackable,
  rememberTrackable,
} from "../lib/core/insights/learning-activity-scan.js";

const flush = (ms = 60) => new Promise((r) => setTimeout(r, ms));

const ITEMS = [
  {
    id: "item-1",
    title: "Welcome",
    slug: "welcome",
    parent: null,
    metadata: { published: true, updated: 1700000000 },
  },
  {
    id: "item-2",
    title: "Cell membrane",
    slug: "cell-membrane",
    parent: "item-1",
    metadata: { published: true, updated: 1700000100 },
  },
  {
    id: "item-3",
    title: "Nucleus",
    slug: "nucleus",
    parent: "item-1",
    metadata: { published: true, updated: 1699999000 },
  },
];

async function contentSection(width = 1200) {
  const el = document.createElement("haxcms-content-admin-dialog");
  el.inShell = true;
  const host = await fixture(html`<div style="width: ${width}px"></div>`);
  host.appendChild(el);
  await el.updateComplete;
  el.rows = el._buildRows(JSON.parse(JSON.stringify(ITEMS)));
  await el.updateComplete;
  // the column loads its scan lazily and reads missing pages (404 here)
  await waitUntil(() => el.__trackableScan, "scan module loaded");
  await waitUntil(() => !el._trackableBusy, "counts read");
  await el.updateComplete;
  return el;
}

const cell = (el, id) =>
  el.shadowRoot.querySelector(`tr[data-node-id="${id}"] td.activities`);
const shown = (el, id) => {
  const c = cell(el, id);
  const vis = c.querySelector('[aria-hidden="true"]');
  return vis ? vis.textContent.trim() : "";
};
const spoken = (el, id) => {
  const sr = cell(el, id).querySelector(".hax-ui-sr-only");
  return sr ? sr.textContent.trim() : "";
};
const titles = (el) =>
  [...el.shadowRoot.querySelectorAll("table.pages tbody .title-btn")].map((a) =>
    a.textContent.trim(),
  );

describe("haxcms-content-admin-dialog Activities column", () => {
  let saved;
  let realFetch;
  before(() => {
    saved = {
      manifest: store.manifest,
      activeId: store.activeId,
      editMode: store.editMode,
    };
    realFetch = globalThis.fetch;
  });
  beforeEach(() => {
    store.activeId = null;
    store.editMode = false;
    store.manifest = { id: "c", title: "C", items: ITEMS, metadata: {} };
    invalidateTrackable();
    rememberTrackable(
      "item-1",
      countTrackable(
        "<multiple-choice></multiple-choice><video-player></video-player>" +
          "<bullet-check-list></bullet-check-list><flash-card></flash-card>",
      ),
    );
    rememberTrackable("item-2", countTrackable("<p>No activities</p>"));
  });
  afterEach(() => {
    globalThis.fetch = realFetch;
  });
  after(() => {
    store.manifest = saved.manifest;
    store.activeId = saved.activeId;
    store.editMode = saved.editMode;
    invalidateTrackable();
  });

  it("adds a sortable Activities header right after Status", async () => {
    const el = await contentSection();
    const heads = [...el.shadowRoot.querySelectorAll("table.pages thead th")]
      .map((th) => th.className)
      .slice(1);
    expect(heads).to.deep.equal([
      "title",
      "status",
      "activities",
      "updated",
      "parent",
      "slug",
      "actions",
    ]);
    const btn = el.shadowRoot.querySelector(
      'button.sort[data-sort="activities"]',
    );
    expect(btn.textContent.trim()).to.equal("Activities");
    // the existing default sort is untouched
    expect(el._sortKey).to.equal("updated");
  });

  it("shows counts as text, a dash for none, nothing when unknown", async () => {
    const el = await contentSection();
    expect(shown(el, "item-1")).to.equal("4");
    expect(spoken(el, "item-1")).to.equal("4 trackable elements");
    expect(shown(el, "item-2")).to.equal("—");
    expect(spoken(el, "item-2")).to.equal("No trackable elements");
    // item-3 could not be read (no backend here): stays quiet
    expect(cell(el, "item-3").textContent.trim()).to.equal("");
  });

  it("shows a quiet ellipsis while counting", async () => {
    const el = await contentSection();
    el._trackableBusy = true;
    await el.updateComplete;
    expect(shown(el, "item-3")).to.equal("…");
    expect(spoken(el, "item-3")).to.equal("Counting trackable elements");
    // counted pages keep their numbers
    expect(shown(el, "item-1")).to.equal("4");
  });

  it("sorts by the count", async () => {
    const el = await contentSection();
    const sort = () =>
      el.shadowRoot
        .querySelector('button.sort[data-sort="activities"]')
        .click();
    sort();
    await el.updateComplete;
    expect(
      el.shadowRoot.querySelector("th.activities").getAttribute("aria-sort"),
    ).to.equal("ascending");
    expect(titles(el)).to.deep.equal(["Nucleus", "Cell membrane", "Welcome"]);
    sort();
    await el.updateComplete;
    expect(titles(el)).to.deep.equal(["Welcome", "Cell membrane", "Nucleus"]);
  });

  it("gives way at narrow widths, like the slug column", async () => {
    const wide = await contentSection(1200);
    expect(getComputedStyle(cell(wide, "item-1")).display).to.not.equal("none");
    const narrow = await contentSection(600);
    await flush();
    expect(getComputedStyle(cell(narrow, "item-1")).display).to.equal("none");
    expect(
      getComputedStyle(narrow.shadowRoot.querySelector("th.activities"))
        .display,
    ).to.equal("none");
    const phone = await contentSection(400);
    await flush();
    expect(getComputedStyle(cell(phone, "item-1")).display).to.equal("none");
    expect(
      getComputedStyle(phone.shadowRoot.querySelector("th.activities")).display,
    ).to.equal("none");
  });

  it("drops a saved page's count and reads that page again", async () => {
    const el = await contentSection();
    const asked = [];
    globalThis.fetch = (url, init) => {
      asked.push(String(url));
      if (String(url).endsWith("/x/api/v1/content/welcome")) {
        return Promise.resolve(
          new Response(
            JSON.stringify({
              status: 200,
              data: { body: "<video-player></video-player>" },
            }),
            { status: 200 },
          ),
        );
      }
      return realFetch(url, init);
    };
    store.activeId = "item-1";
    await flush();
    globalThis.dispatchEvent(new CustomEvent("haxcms-trigger-update-node"));
    await waitUntil(
      () => cachedTrackable("item-1") && cachedTrackable("item-1").total === 1,
      "saved page read again",
    );
    await waitUntil(() => !el._trackableBusy, "counts read");
    await el.updateComplete;
    expect(asked.some((u) => u.endsWith("/x/api/v1/content/welcome"))).to.equal(
      true,
    );
    expect(shown(el, "item-1")).to.equal("1");
    expect(spoken(el, "item-1")).to.equal("1 trackable element");
    // other pages keep their counts
    expect(shown(el, "item-2")).to.equal("—");
  });

  it("the focused page's details list its count too", async () => {
    const el = await contentSection();
    el._focusId = "item-1";
    await el.updateComplete;
    const dd = el.shadowRoot.querySelector(".detail dd.activities");
    expect(
      dd.querySelector('[aria-hidden="true"]').textContent.trim(),
    ).to.equal("4");
    expect(dd.querySelector(".hax-ui-sr-only").textContent.trim()).to.equal(
      "4 trackable elements",
    );
  });

  it("passes the a11y audit", async () => {
    const el = await contentSection();
    await expect(el).shadowDom.to.be.accessible();
  });
});
