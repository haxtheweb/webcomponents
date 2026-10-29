import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import { analyzeSite } from "../lib/core/insights/insights-analyzer.js";
import "../lib/core/insights/sections/insights-overview.js";
import {
  loadSpec,
  loadFixtureSite,
  loadExtras,
  RESULT_OPTIONS,
} from "./insights-fixture-helpers.js";

let results;

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

async function render(r) {
  return fixture(
    html`<insights-overview
      .results="${r}"
      density="compact"
    ></insights-overview>`,
  );
}

describe("insights-overview", () => {
  it("shows the key numbers and health score", async () => {
    const el = await render(results);
    const text = el.shadowRoot.textContent;
    const s = results.overview.stats;
    const kpis = el.shadowRoot.querySelectorAll(".kpis .kpi");
    expect(kpis.length).to.equal(7);
    expect(kpis[0].textContent).to.contain(String(s.pages));
    expect(kpis[4].textContent).to.contain(String(s.accessibilityErrors));
    expect(kpis[4].getAttribute("data-tone")).to.equal("danger");
    expect(text).to.contain(`${s.daysSinceLastEdit} d`);
    expect(text).to.contain(s.lastEdit);
    expect(
      el.shadowRoot.querySelector(".health-score").textContent.trim(),
    ).to.equal(`${results.overview.health.score} / 100`);
    const checks = el.shadowRoot.querySelectorAll("[data-check]");
    expect(checks.length).to.equal(results.overview.health.checks.length);
    const alt = el.shadowRoot.querySelector('[data-check="usableAlt"]');
    expect(alt.textContent).to.contain("1 of 9");
    expect(alt.textContent).to.contain("11%");
    expect(el.getAttribute("density")).to.equal("compact");
  });

  it("lists fix next and expands to every finding", async () => {
    const el = await render(results);
    const rows = () => el.shadowRoot.querySelectorAll("#fix-next + ul li");
    expect(rows().length).to.equal(results.overview.fixNext.length);
    expect(rows()[0].textContent).to.contain(results.overview.fixNext[0].title);
    expect(rows()[0].querySelector(".hax-ui-pill").textContent).to.equal(
      "Error",
    );
    el.shadowRoot.querySelector(".more").click();
    await el.updateComplete;
    expect(rows().length).to.equal(results.overview.findings.length);
  });

  it("Review opens that finding's screen", async () => {
    const el = await render(results);
    const btn = el.shadowRoot.querySelector('.review[data-section="links"]');
    setTimeout(() => btn.click());
    const ev = await oneEvent(el, "haxcms-site-admin-navigate");
    expect(ev.detail.route).to.equal("reports-links");
    expect(ev.composed).to.equal(true);
  });

  it("shows folders with flagged ones in words", async () => {
    const el = await render(results);
    const bars = el.shadowRoot.querySelectorAll(".folders .bar");
    expect(bars.length).to.equal(results.overview.folders.length);
    expect(bars[0].textContent).to.contain("(root)");
    expect(bars[0].textContent).to.contain("Check");
    expect(el.shadowRoot.textContent).to.contain(
      `Where the ${results.overview.stats.pages} pages live`,
    );
  });

  it("marks outside link checks Coming soon with the needs text", async () => {
    const el = await render(results);
    const needs = results.overview.brokenOutsideLinks.needs;
    const tile = el.shadowRoot.querySelector('.kpi[data-tone="soon"]');
    expect(tile.textContent).to.contain("Coming soon");
    expect(tile.textContent).to.contain(needs);
    const row = el.shadowRoot.querySelector(".soon-row");
    expect(row.querySelector('[data-tone="soon"]').title).to.equal(
      results.overview.health.outsideLinks.needs,
    );
    expect(el.shadowRoot.querySelector(".soon-panel").textContent).to.contain(
      results.overview.savedHistory.needs,
    );
  });

  it("has empty states", async () => {
    const r = JSON.parse(JSON.stringify(results));
    r.overview.fixNext = [];
    r.overview.findings = [];
    r.overview.folders = [];
    const el = await render(r);
    const empties = el.shadowRoot.querySelectorAll(".empty");
    expect(empties.length).to.equal(2);
    expect(empties[0].textContent).to.contain("Nothing to fix");
  });

  it("is accessible", async () => {
    const el = await render(results);
    await expect(el).shadowDom.to.be.accessible();
  });
});
