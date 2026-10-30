import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import { analyzeSite } from "../lib/core/insights/insights-analyzer.js";
import "../lib/core/insights/sections/insights-media.js";
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

function text(el) {
  return el.shadowRoot.textContent.replace(/\s+/g, " ");
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

describe("insights-media screen", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(
      html`<insights-media .results="${results}"></insights-media>`,
    );
  });

  it("shows the media KPIs", () => {
    const kpis = [...el.shadowRoot.querySelectorAll(".kpi")]
      .map((k) => k.textContent.replace(/\s+/g, " ").trim())
      .join("|");
    const pages = results.totals.pages;
    expect(kpis).to.include(`Videos 3 on 2 of ${pages} pages`);
    expect(kpis).to.include("Embeds 4 iframes on 3 pages");
    expect(kpis).to.include("Images 9 7 img · 2 media-image");
    expect(kpis).to.include("Tables 2 1 without header cells");
    expect(kpis).to.include(`No media 12 pages of ${pages}`);
  });

  it("draws videos per page from the analyzer buckets", () => {
    const counts = [...el.shadowRoot.querySelectorAll(".cols li .n")].map((n) =>
      Number(n.textContent),
    );
    expect(counts).to.deep.equal([16, 1, 1, 0, 0]);
    expect(text(el)).to.include("0 videos: 16 pages");
  });

  it("lists pages without media and opens them", async () => {
    const rows = el.shadowRoot.querySelectorAll(".no-media li");
    expect(rows.length).to.equal(12);
    const btn = el.shadowRoot.querySelector(".no-media .open-page");
    setTimeout(() => btn.click());
    const ev = await oneEvent(el, "insights-open-page");
    expect(ev.detail.slug).to.equal(btn.getAttribute("data-slug"));
    expect(ev.detail.slug).to.be.a("string").and.not.equal("");
  });

  it("shows media by section and the media index gap", () => {
    const bars = el.shadowRoot.querySelectorAll(".by-section .bar");
    expect(bars.length).to.equal(
      results.media.bySection.filter((s) => s.total > 0).length,
    );
    expect(
      bars[0].querySelector('[role="img"]').getAttribute("aria-label"),
    ).to.match(/videos, \d+ embeds, \d+ images/);
    const idx = el.shadowRoot.querySelector(".media-index").textContent;
    expect(idx).to.include("2 missing");
    expect(idx).to.include("8 missing");
  });

  it("renders Coming soon controls disabled with needs text", () => {
    const btn = el.shadowRoot.querySelector(".rebuild-index");
    expect(btn.getAttribute("aria-disabled")).to.equal("true");
    expect(btn.getAttribute("title")).to.equal(
      results.media.rebuildIndex.needs,
    );
    expect(
      el.shadowRoot.querySelector(".soon-kpi").getAttribute("title"),
    ).to.equal(results.media.videoMinutes.needs);
    expect(text(el)).to.include("Needs a server-side YouTube lookup");
  });

  it("opens pages without media from their own slug", async () => {
    const r = clone(results);
    r.media.noMedia[0].slug = "only/from-the-row";
    r.media.pages = [];
    r.content.pages = [];
    const own = await fixture(
      html`<insights-media .results="${r}"></insights-media>`,
    );
    const btn = own.shadowRoot.querySelector(".no-media .open-page");
    expect(btn.dataset.slug).to.equal("only/from-the-row");
  });

  it("shows positive empty states", async () => {
    const r = clone(results);
    r.media.noMedia = [];
    r.media.bySection = [];
    const e = await fixture(
      html`<insights-media .results="${r}"></insights-media>`,
    );
    expect(text(e)).to.include("Every page has a video, embed or image.");
    expect(e.shadowRoot.querySelectorAll(".empty").length).to.equal(2);
  });

  it("is accessible", async () => {
    await expect(el).shadowDom.to.be.accessible();
  });
});
