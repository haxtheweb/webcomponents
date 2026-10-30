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

  it("Review opens the screen of a finding about several pages", async () => {
    const el = await render(results);
    const btn = el.shadowRoot.querySelector(
      '.review[data-code="untitledIframes"]',
    );
    expect(btn.dataset.section).to.equal("accessibility");
    setTimeout(() => btn.click());
    const ev = await oneEvent(el, "haxcms-site-admin-navigate");
    expect(ev.detail.route).to.equal("reports-accessibility");
    expect(ev.composed).to.equal(true);
    // site-wide findings also Review
    expect(
      el.shadowRoot.querySelector('.review[data-code="themeContrast"]'),
    ).to.not.equal(null);
  });

  it("Open page visits the one page a finding is about", async () => {
    const el = await render(results);
    const btn = el.shadowRoot.querySelector(
      '.open-page[data-code="brokenInternal"]',
    );
    expect(btn.textContent.trim()).to.equal("Open page");
    expect(btn.getAttribute("aria-label")).to.equal("Open page: Week 5");
    expect(
      el.shadowRoot.querySelector('.review[data-code="brokenInternal"]'),
    ).to.equal(null);
    setTimeout(() => btn.click());
    const ev = await oneEvent(el, "insights-open-page");
    expect(ev.detail.slug).to.equal("week-4/week-5");
    expect(ev.composed).to.equal(true);
  });

  it("shows no score when nothing could be measured", async () => {
    const r = JSON.parse(JSON.stringify(results));
    r.overview.health.score = null;
    r.overview.health.checks.forEach((c) => {
      c.passed = 0;
      c.total = 0;
      c.score = null;
    });
    const el = await render(r);
    const pill = el.shadowRoot.querySelector(".health-score");
    expect(pill.textContent).to.contain("—");
    expect(pill.textContent).to.not.contain("0 / 100");
    expect(el.shadowRoot.querySelector("#site-health").textContent).to.contain(
      "Nothing to check yet",
    );
  });

  it("uses singular words for a one-page site", async () => {
    const r = JSON.parse(JSON.stringify(results));
    Object.assign(r.overview.stats, {
      pages: 1,
      paragraphs: 1,
      words: 1,
      videoPages: 1,
      untitledIframes: 1,
    });
    const el = await render(r);
    const text = el.shadowRoot.textContent;
    expect(text).to.contain("1 paragraph");
    expect(text).to.not.contain("1 paragraphs");
    expect(text).to.contain("1 word");
    expect(text).to.contain("on 1 page");
    expect(text).to.contain("1 untitled iframe");
    expect(text).to.contain("Where the 1 page lives");
  });

  it("colours the score from the threshold bands", async () => {
    const r = JSON.parse(JSON.stringify(results));
    r.overview.health.score = 60;
    r.thresholds.scoreDanger = 65;
    const el = await render(r);
    expect(
      el.shadowRoot.querySelector(".health-score").getAttribute("data-tone"),
    ).to.equal("danger");
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
