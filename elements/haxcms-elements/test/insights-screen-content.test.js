import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import { analyzeSite } from "../lib/core/insights/insights-analyzer.js";
import "../lib/core/insights/sections/insights-content.js";
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
    html`<insights-content .results="${r}" density="roomy"></insights-content>`,
  );
}

describe("insights-content", () => {
  it("shows the key numbers", async () => {
    const el = await render(results);
    const k = results.content.kpis;
    const kpis = el.shadowRoot.querySelectorAll(".kpi");
    expect(kpis[0].textContent).to.contain(String(k.pages));
    expect(kpis[0].textContent).to.contain(`${k.words} words`);
    expect(kpis[1].textContent).to.contain(String(k.paragraphsPerPage));
    expect(kpis[2].textContent).to.contain(`${k.noHeadingsPct}%`);
    expect(kpis[4].textContent).to.contain(String(k.thinPages));
    expect(kpis[5].textContent).to.contain(`${k.longest.paragraphs} ¶`);
    expect(kpis[5].textContent).to.contain(k.longest.title);
  });

  it("has a row per section and every page", async () => {
    const el = await render(results);
    const rows = el.shadowRoot.querySelectorAll("table.sections tbody tr");
    expect(rows.length).to.equal(results.content.sections.length);
    const first = results.content.sections[0];
    expect(rows[0].textContent).to.contain(first.name);
    expect(
      el.shadowRoot.querySelector("table.sections").getAttribute("class"),
    ).to.equal("sections");
    expect(
      el.shadowRoot.querySelectorAll("table.pages tbody tr").length,
    ).to.equal(results.content.pages.length);
    const ths = el.shadowRoot.querySelectorAll(
      'table.sections th[scope="col"]',
    );
    expect(ths.length).to.equal(9);
  });

  it("shows longest pages, read time and reading grade", async () => {
    const el = await render(results);
    const longest = el.shadowRoot.querySelectorAll(".longest li");
    expect(longest.length).to.equal(results.content.longest.length);
    expect(longest[0].textContent).to.contain("Long");
    const rt = el.shadowRoot.querySelectorAll(".read-time .bar");
    expect(rt.length).to.equal(results.content.readTime.length);
    expect(rt[0].textContent).to.contain(
      String(results.content.readTime[0].count),
    );
    if (results.content.readability.scored) {
      expect(
        el.shadowRoot.querySelectorAll(".readability .bar").length,
      ).to.equal(results.content.readability.bands.length);
    }
  });

  it("lists thin pages and opens one", async () => {
    const el = await render(results);
    const rows = el.shadowRoot.querySelectorAll(".thin li");
    expect(rows.length).to.equal(results.content.thin.length);
    const first = results.content.thin[0];
    const page = results.content.pages.find((p) => p.pageId === first.pageId);
    setTimeout(() => rows[0].querySelector(".open-page").click());
    const ev = await oneEvent(el, "insights-open-page");
    expect(ev.detail.slug).to.equal(page.slug);
    expect(ev.bubbles).to.equal(true);
    expect(ev.composed).to.equal(true);
  });

  it("shows only the first 50 rows until asked", async () => {
    const r = JSON.parse(JSON.stringify(results));
    const base = r.content.thin[0];
    r.content.thin = [];
    for (let i = 0; i < 60; i++) {
      r.content.thin.push(Object.assign({}, base, { title: `Page ${i}` }));
    }
    const el = await render(r);
    expect(el.shadowRoot.querySelectorAll(".thin li").length).to.equal(50);
    const more = Array.from(el.shadowRoot.querySelectorAll(".more")).find(
      (b) => b.textContent.indexOf("Show all 60") !== -1,
    );
    more.click();
    await el.updateComplete;
    expect(el.shadowRoot.querySelectorAll(".thin li").length).to.equal(60);
  });

  it("has empty states", async () => {
    const r = JSON.parse(JSON.stringify(results));
    r.content.thin = [];
    r.content.longest = [];
    r.content.readability = { bands: [], median: null, scored: 0 };
    const el = await render(r);
    const text = Array.from(el.shadowRoot.querySelectorAll(".empty")).map(
      (e) => e.textContent,
    );
    expect(text.join(" ")).to.contain("No thin pages");
    expect(text.join(" ")).to.contain("none has a reading grade");
    expect(text.length).to.equal(3);
  });

  it("describes thresholds from results, not fixed numbers", async () => {
    const r = JSON.parse(JSON.stringify(results));
    Object.assign(r.thresholds, {
      longPageParagraphs: 7,
      thinMaxWords: 25,
      paragraphsPerHeadingWarn: 4,
      wordsPerMinute: 150,
      sectionNoHeadingsParagraphs: 12,
      readabilityMinWords: 90,
    });
    r.content.sections[0].flagged = true;
    const el = await render(r);
    const text = el.shadowRoot.textContent.replace(/\s+/g, " ");
    expect(text).to.contain("7+ paragraphs and no h2–h6");
    expect(text).to.contain("under 25 words");
    expect(text).to.not.contain("under 40 words");
    expect(text).to.contain("over 4 per heading");
    expect(text).to.contain("150 words per minute");
    expect(text).to.contain("over 12 paragraphs and no headings");
    expect(text).to.contain("90 words");
  });

  it("opens longest pages from their own slug", async () => {
    const el = await render(results);
    const btn = el.shadowRoot.querySelector(".longest .open-page");
    setTimeout(() => btn.click());
    const ev = await oneEvent(el, "insights-open-page");
    expect(ev.detail.slug).to.equal(results.content.longest[0].slug);
  });

  it("shows trends as Coming soon with the needs text", async () => {
    const el = await render(results);
    const panel = el.shadowRoot.querySelector(".soon-panel.trends");
    expect(panel.textContent).to.contain("Coming soon");
    expect(panel.textContent).to.contain(results.content.trends.needs);
  });

  it("is accessible", async () => {
    const el = await render(results);
    await expect(el).shadowDom.to.be.accessible();
  });
});
