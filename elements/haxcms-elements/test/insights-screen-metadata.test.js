import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import { analyzeSite } from "../lib/core/insights/insights-analyzer.js";
import "../lib/core/insights/sections/insights-metadata.js";
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
  return fixture(html`<insights-metadata .results="${r}"></insights-metadata>`);
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

describe("insights-metadata", () => {
  it("shows the key numbers from the analyzer", async () => {
    const el = await render(results);
    const root = el.shadowRoot;
    const k = results.metadata.kpis;
    expect(root.querySelector('[data-kpi="nojs"] .v').textContent).to.contain(
      "No",
    );
    expect(root.querySelector('[data-kpi="nojs"]').dataset.tone).to.equal(
      "danger",
    );
    expect(root.querySelector('[data-kpi="ai"] .v').textContent).to.contain(
      `${k.aiFiles.found} / ${k.aiFiles.total}`,
    );
    expect(
      root.querySelector('[data-kpi="nodesc"] .v').textContent.trim(),
    ).to.equal(`${k.noDescription}`);
    expect(
      root.querySelector('[data-kpi="shared"] .v').textContent.trim(),
    ).to.equal(`${k.sharedTitlePages}`);
    expect(
      root.querySelector('[data-kpi="license"] .v').textContent,
    ).to.contain("BY-SA");
  });

  it("lists every check with its state in words", async () => {
    const el = await render(results);
    const root = el.shadowRoot;
    const items = root.querySelectorAll(".checks li");
    expect(items.length).to.equal(results.metadata.checks.length);
    const robots = root.querySelector('.checks [data-code="robots"]');
    expect(robots.dataset.state).to.equal("fails");
    expect(robots.querySelector(".hax-ui-pill").textContent).to.contain(
      "Fails",
    );
    expect(robots.querySelector(".hax-ui-pill").dataset.tone).to.equal(
      "danger",
    );
    const llms = root.querySelector('.checks [data-code="llms"]');
    expect(llms.querySelector(".hax-ui-pill").textContent).to.contain("Passes");
    expect(root.querySelector('.checks [data-code="noJs"]')).to.not.equal(null);
  });

  it("lists pages without a description, shared titles and the pages table", async () => {
    const el = await render(results);
    const root = el.shadowRoot;
    const m = results.metadata;
    expect(root.querySelectorAll(".nodesc li").length).to.equal(
      m.noDescription.length,
    );
    expect(root.querySelector(".nodesc").textContent).to.contain("Syllabus");
    const shared = root.querySelector(".titles .shared");
    expect(shared.textContent).to.contain("Try it!");
    expect(shared.querySelectorAll(".open").length).to.equal(
      m.sharedTitles[0].pageIds.length,
    );
    expect(root.querySelectorAll("table.pages tbody tr").length).to.equal(
      m.pages.length,
    );
  });

  it("fires insights-open-page with the slug", async () => {
    const el = await render(results);
    const btn = el.shadowRoot.querySelector(".nodesc .open");
    setTimeout(() => btn.click());
    const ev = await oneEvent(el, "insights-open-page");
    expect(ev.detail.slug).to.equal(results.metadata.noDescription[0].slug);
    expect(ev.composed).to.equal(true);
  });

  it("shows positive empty states", async () => {
    const r = clone(results);
    r.metadata.noDescription = [];
    r.metadata.sharedTitles = [];
    r.metadata.genericTitles = [];
    const el = await render(r);
    const root = el.shadowRoot;
    expect(root.textContent).to.contain("No pages without a description");
    expect(root.textContent).to.contain("No shared or generic titles");
  });

  it("shows generic titles and caps long lists", async () => {
    const r = clone(results);
    r.metadata.genericTitles = [
      { title: "Page", pageId: "home", slug: "index" },
    ];
    const many = [];
    for (let i = 0; i < 55; i++) {
      many.push({ pageId: `p${i}`, title: `P ${i}`, slug: `p${i}` });
    }
    r.metadata.noDescription = many;
    const el = await render(r);
    const root = el.shadowRoot;
    expect(root.querySelector(".titles .generic").textContent).to.contain(
      "generic",
    );
    expect(root.querySelectorAll(".nodesc li").length).to.equal(50);
    root.querySelector(".show-all").click();
    await el.updateComplete;
    expect(root.querySelectorAll(".nodesc li").length).to.equal(55);
  });

  it("passes the a11y audit", async () => {
    const el = await render(results);
    await expect(el).shadowDom.to.be.accessible();
  });
});
