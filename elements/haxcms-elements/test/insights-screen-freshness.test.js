import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import { analyzeSite } from "../lib/core/insights/insights-analyzer.js";
import "../lib/core/insights/sections/insights-freshness.js";
import {
  loadSpec,
  loadFixtureSite,
  loadExtras,
  RESULT_OPTIONS,
} from "./insights-fixture-helpers.js";

let results;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

async function render(r) {
  return fixture(
    html`<insights-freshness
      .results="${r}"
      density="compact"
    ></insights-freshness>`,
  );
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

describe("insights-freshness", () => {
  it("shows the key numbers from the analyzer", async () => {
    const el = await render(results);
    const k = results.freshness.kpis;
    const root = el.shadowRoot;
    expect(root.querySelector('[data-kpi="since"] .v').textContent).to.contain(
      `${k.daysSinceLastEdit}`,
    );
    expect(root.querySelector('[data-kpi="since"]').dataset.tone).to.equal(
      "warning",
    );
    expect(
      root.querySelector('[data-kpi="recent"] .v').textContent.trim(),
    ).to.equal(`${k.editedRecently}`);
    expect(
      root.querySelector('[data-kpi="term"] .v').textContent.trim(),
    ).to.equal(`${k.termSpecific}`);
    expect(
      root.querySelector('[data-kpi="oldest"] .v').textContent.trim(),
    ).to.equal(`${k.oldestCreatedYear}`);
    expect(
      root.querySelector('[data-kpi="never"] .v').textContent.trim(),
    ).to.equal(`${k.neverSaved}`);
    expect(el.getAttribute("density")).to.equal("compact");
  });

  it("lists timeline events, age buckets, term pages and every page", async () => {
    const el = await render(results);
    const root = el.shadowRoot;
    const f = results.freshness;
    expect(root.querySelectorAll(".events li").length).to.equal(
      f.events.length,
    );
    expect(root.querySelector('.events [data-code="now"]')).to.not.equal(null);
    expect(root.querySelector(".events").textContent).to.contain(
      "Last content edit",
    );
    const cols = root.querySelectorAll(".cols li");
    expect(cols.length).to.equal(f.ageBuckets.length);
    expect(cols[3].textContent).to.contain(`${f.ageBuckets[3].count}`);
    const term = root.querySelectorAll(".term li");
    expect(term.length).to.equal(f.termSpecific.length);
    expect(term[0].textContent).to.contain("Syllabus");
    expect(root.querySelectorAll("table.pages tbody tr").length).to.equal(
      f.pages.length,
    );
    // no bulk saves in the fixture: positive empty state
    expect(root.textContent).to.contain("No bulk saves");
  });

  it("colours age buckets by their tone", async () => {
    const el = await render(results);
    const cols = el.shadowRoot.querySelectorAll(".cols .col");
    results.freshness.ageBuckets.forEach((b, i) => {
      expect(cols[i].getAttribute("data-tone"), b.label).to.equal(b.tone);
    });
    expect(el.shadowRoot.querySelector("#fr-ages").textContent).to.contain(
      "Amber from 1 yr, red from 3 yr",
    );
    // tone in words for screen readers
    expect(cols[3].parentElement.textContent).to.contain("old");
  });

  it("shows where a term matched, with the snippet for text matches", async () => {
    const el = await render(results);
    const rows = el.shadowRoot.querySelectorAll(".term li");
    const w12 = Array.from(rows).find((li) =>
      li.textContent.includes("Week 12"),
    );
    expect(w12.dataset.where).to.equal("text");
    expect(w12.querySelector(".where").textContent.trim()).to.equal("Text");
    expect(w12.querySelector("mark").textContent).to.equal("Office hours");
    expect(w12.textContent).to.contain("Fall 2025");
    expect(w12.querySelector(".open").dataset.slug).to.equal("week-12");
    const syl = rows[0];
    expect(syl.dataset.where).to.equal("title");
    expect(syl.querySelector(".where").textContent.trim()).to.equal("Title");
  });

  it("describes thresholds from results", async () => {
    const r = clone(results);
    r.thresholds.editedRecentlyDays = 180;
    const el = await render(r);
    const root = el.shadowRoot;
    expect(root.querySelector('[data-kpi="recent"]').textContent).to.contain(
      "Edited in last 180 days",
    );
    expect(root.querySelector(".soon-panel").textContent).to.contain(
      "not touched in 180 days",
    );
  });

  it("fires insights-open-page with the slug", async () => {
    const el = await render(results);
    const btn = el.shadowRoot.querySelector(".term .open");
    setTimeout(() => btn.click());
    const ev = await oneEvent(el, "insights-open-page");
    expect(ev.detail.slug).to.equal("syllabus");
    expect(ev.bubbles).to.equal(true);
    expect(ev.composed).to.equal(true);
  });

  it("shows Coming soon controls disabled with their needs text", async () => {
    const el = await render(results);
    const root = el.shadowRoot;
    const remind = root.querySelector(".remind");
    expect(remind.disabled).to.equal(true);
    expect(remind.getAttribute("title")).to.equal(
      results.freshness.reminders.needs,
    );
    expect(root.querySelector(".needs-history").textContent).to.contain(
      results.freshness.editHistory.needs,
    );
    expect(root.querySelector('.soon-panel [data-tone="soon"]')).to.not.equal(
      null,
    );
  });

  it("shows empty states and caps long lists at 50", async () => {
    const r = clone(results);
    r.freshness.termSpecific = [];
    r.freshness.events = [];
    const many = [];
    for (let i = 0; i < 60; i++) {
      many.push(
        Object.assign({}, r.freshness.pages[0], {
          pageId: `p${i}`,
          slug: `p${i}`,
        }),
      );
    }
    r.freshness.pages = many;
    r.freshness.bulkSaves = [
      { date: "2023-04-01", start: 1680307200, end: 1680309000, count: 22 },
    ];
    const el = await render(r);
    const root = el.shadowRoot;
    expect(root.textContent).to.contain("No pages look tied to one term");
    expect(root.textContent).to.contain("No dated events");
    expect(root.querySelectorAll("table.bulk tbody tr").length).to.equal(1);
    expect(root.querySelectorAll("table.pages tbody tr").length).to.equal(50);
    const more = root.querySelector(".show-all");
    expect(more.textContent).to.contain("Show all 60");
    more.click();
    await el.updateComplete;
    expect(root.querySelectorAll("table.pages tbody tr").length).to.equal(60);
  });

  it("passes the a11y audit", async () => {
    const el = await render(results);
    await expect(el).shadowDom.to.be.accessible();
  });
});
