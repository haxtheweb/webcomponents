import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import { analyzeSite } from "../lib/core/insights/insights-analyzer.js";
import "../lib/core/insights/sections/insights-components.js";
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
    html`<insights-components
      .results="${r}"
      density="roomy"
    ></insights-components>`,
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

describe("insights-components", () => {
  it("shows the key numbers from the analyzer", async () => {
    const el = await render(results);
    const root = el.shadowRoot;
    const k = results.components.kpis;
    expect(
      root.querySelector('[data-kpi="elements"] .v').textContent.trim(),
    ).to.equal(`${k.elements}`);
    expect(
      root.querySelector('[data-kpi="distinct"] .v').textContent.trim(),
    ).to.equal(`${k.distinctTags}`);
    expect(root.querySelector('[data-kpi="distinct"]').textContent).to.contain(
      `${k.distinctHax} HAX`,
    );
    expect(root.querySelector('[data-kpi="share"] .v').textContent).to.contain(
      `${k.haxShare}%`,
    );
    expect(
      root.querySelector('[data-kpi="flags"] .v').textContent.trim(),
    ).to.equal(`${k.flags}`);
    expect(
      root.querySelector('[data-kpi="native"] .v').textContent.trim(),
    ).to.equal(`${k.nativeChecks}`);
  });

  it("lists HAX and HTML elements with counts and pages", async () => {
    const el = await render(results);
    const root = el.shadowRoot;
    const c = results.components;
    const haxRows = root.querySelectorAll("table.hax tbody tr");
    expect(haxRows.length).to.equal(c.hax.length);
    expect(haxRows[0].dataset.tag).to.equal(c.hax[0].tag);
    expect(haxRows[0].textContent).to.contain(`${c.hax[0].count}`);
    expect(haxRows[0].querySelector("td.num").textContent.trim()).to.equal(
      `${c.hax[0].pages}`,
    );
    expect(root.querySelectorAll("table.html tbody tr").length).to.equal(
      c.html.length,
    );
    // flagged tags say so in words
    expect(
      root.querySelector('table.hax tr[data-tag="place-holder"]').textContent,
    ).to.contain("flagged");
    expect(
      root.querySelector('table.html tr[data-tag="iframe"]').textContent,
    ).to.contain("flagged");
  });

  it("lists flags and suggestions", async () => {
    const el = await render(results);
    const root = el.shadowRoot;
    const c = results.components;
    expect(root.querySelectorAll(".flags li").length).to.equal(c.flags.length);
    const ph = root.querySelector('.flags [data-code="placeholder"]');
    expect(ph.textContent).to.contain("Review");
    expect(root.querySelectorAll(".unused li").length).to.equal(
      c.suggestions.length,
    );
    expect(root.querySelector(".unused").textContent).to.contain(
      c.suggestions[0].tag,
    );
  });

  it("fires insights-open-page for the placeholder page", async () => {
    const el = await render(results);
    const btn = el.shadowRoot.querySelector(
      '.flags [data-code="placeholder"] .open',
    );
    setTimeout(() => btn.click());
    const ev = await oneEvent(el, "insights-open-page");
    expect(ev.detail.slug).to.equal("week-8/draft");
  });

  it("shows positive empty states", async () => {
    const r = clone(results);
    r.components.hax = [];
    r.components.flags = [];
    r.components.suggestions = [];
    const el = await render(r);
    const root = el.shadowRoot;
    expect(root.textContent).to.contain("No HAX elements counted yet");
    expect(root.textContent).to.contain("No markup flags");
    expect(root.textContent).to.contain("No gaps found");
  });

  it("passes the a11y audit", async () => {
    const el = await render(results);
    await expect(el).shadowDom.to.be.accessible();
  });
});
