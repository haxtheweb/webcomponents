import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import { analyzeSite } from "../lib/core/insights/insights-analyzer.js";
import "../lib/core/insights/sections/insights-instructional.js";
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

describe("insights-instructional screen", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(
      html`<insights-instructional
        .results="${results}"
      ></insights-instructional>`,
    );
  });

  it("shows the instructional KPIs", () => {
    const kpis = [...el.shadowRoot.querySelectorAll(".kpi")]
      .map((k) => k.textContent.replace(/\s+/g, " ").trim())
      .join("|");
    expect(kpis).to.include("Practice pages 4");
    expect(kpis).to.include("Native checks 1");
    expect(kpis).to.include("Empty practice pages 1 of 4");
    expect(kpis).to.include("Weeks without practice 1 week-12");
    expect(kpis).to.include("Objectives 5 40% Remember or Understand");
  });

  it("draws the activity map as sections by activity columns", () => {
    const heads = [...el.shadowRoot.querySelectorAll(".heat thead th")].map(
      (t) => t.textContent.trim(),
    );
    expect(heads).to.deep.equal(
      ["Section", "Pages"].concat(
        results.instructional.columns.map((c) => c.label),
      ),
    );
    const week8 = el.shadowRoot.querySelector(
      '.heat tr[data-section="week-8"]',
    );
    const read = week8.querySelector('td[data-col="read"]');
    expect(read.textContent.trim()).to.equal("3");
    expect(read.getAttribute("data-l")).to.equal("2");
    expect(
      week8.querySelector('td[data-col="watch"]').getAttribute("data-l"),
    ).to.equal("0");
  });

  it("lists practice pages, practice per section and weeks without practice", () => {
    const states = [...el.shadowRoot.querySelectorAll(".practice li")].map(
      (l) => l.getAttribute("data-state"),
    );
    expect(states[0]).to.equal("none");
    expect(states.length).to.equal(4);
    expect(text(el)).to.include("No practice");
    const wk = el.shadowRoot.querySelector(
      '.per-section .bar[data-section="week-12"]',
    );
    expect(wk.textContent).to.include("none");
    expect(el.shadowRoot.querySelector(".weeks-list").textContent).to.include(
      "week-12",
    );
  });

  it("shows Bloom levels, objectives, walls and what works", () => {
    const bloom = {};
    el.shadowRoot.querySelectorAll(".bloom .bar").forEach((b) => {
      bloom[b.getAttribute("data-level")] = Number(
        b.querySelector(".num").textContent,
      );
    });
    expect(bloom).to.include({
      Apply: 1,
      Remember: 1,
      Understand: 1,
      Analyze: 1,
      Unmatched: 1,
    });
    expect(
      el.shadowRoot.querySelectorAll(".objectives tbody tr").length,
    ).to.equal(5);
    expect(el.shadowRoot.querySelectorAll(".walls li").length).to.equal(
      results.instructional.walls.length,
    );
    expect(el.shadowRoot.querySelectorAll(".working li").length).to.equal(
      results.instructional.workingWell.length,
    );
  });

  it("opens a page from a practice row", async () => {
    const btn = el.shadowRoot.querySelector(".practice .open-page");
    setTimeout(() => btn.click());
    const ev = await oneEvent(el, "insights-open-page");
    expect(ev.detail.slug).to.equal(btn.getAttribute("data-slug"));
    expect(ev.detail.slug).to.not.equal("");
  });

  it("opens walls of text and objectives from their own slugs", async () => {
    const wall = el.shadowRoot.querySelector(".walls .open-page");
    expect(wall.dataset.slug).to.equal(results.instructional.walls[0].slug);
    const obj = el.shadowRoot.querySelector(".objectives .open-page");
    expect(obj.dataset.slug).to.equal(results.instructional.objectives[0].slug);
  });

  it("states the thresholds in use from results", async () => {
    const r = clone(results);
    r.thresholds.paragraphsPerHeadingWarn = 6;
    r.thresholds.thinMaxWords = 30;
    const own = await fixture(
      html`<insights-instructional .results="${r}"></insights-instructional>`,
    );
    const t = text(own);
    expect(t).to.include("more than 6 paragraphs per heading");
    expect(t).to.include("under 30 words");
  });

  it("renders threshold settings as Coming soon with needs text", () => {
    const btn = el.shadowRoot.querySelector(".thresholds-btn");
    expect(btn.getAttribute("aria-disabled")).to.equal("true");
    expect(btn.getAttribute("title")).to.equal(
      results.instructional.thresholds.needs,
    );
    expect(text(el)).to.include("Needs insights settings saved on the server");
  });

  it("shows positive empty states", async () => {
    const r = clone(results);
    r.instructional.weeksWithoutPractice = [];
    r.instructional.walls = [];
    const e = await fixture(
      html`<insights-instructional .results="${r}"></insights-instructional>`,
    );
    expect(text(e)).to.include("Every week has at least one practice page.");
    expect(text(e)).to.include("No walls of text");
  });

  it("is accessible", async () => {
    await expect(el).shadowDom.to.be.accessible();
  });
});
