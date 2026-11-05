import { fixture, expect, html } from "@open-wc/testing";
import { analyzeSite } from "../lib/core/insights/insights-analyzer.js";
import { store } from "../lib/core/haxcms-site-store.js";
import "../lib/core/insights/sections/insights-cadence.js";
import {
  loadSpec,
  loadFixtureSite,
  loadExtras,
  RESULT_OPTIONS,
} from "./insights-fixture-helpers.js";

let results;
let site;
let savedManifest;

before(async () => {
  const spec = await loadSpec();
  site = await loadFixtureSite();
  results = analyzeSite(
    site.pages,
    site.manifest,
    spec,
    Object.assign({ extras: await loadExtras() }, RESULT_OPTIONS),
  );
  savedManifest = store.manifest;
  store.manifest = site.manifest;
});

after(() => {
  store.manifest = savedManifest;
});

describe("insights-cadence screen", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(
      html`<insights-cadence .results="${results}"></insights-cadence>`,
    );
  });

  it("shows the cadence KPIs", () => {
    const kpis = [...el.shadowRoot.querySelectorAll(".kpi .l")].map((k) =>
      k.textContent.trim(),
    );
    expect(kpis).to.include("Flow");
    expect(kpis).to.include("Lessons that close");
    expect(kpis).to.include("Rests");
  });

  it("feeds the scanned pages to the cadence element", () => {
    const cadence = el.shadowRoot.querySelector("instructional-cadence");
    expect(cadence).to.exist;
    expect(cadence.rows.length).to.equal(results.content.pages.length);
    expect(cadence.items.length).to.equal(results.content.pages.length);
    expect(cadence.hideStats).to.equal(true);
  });

  it("turns a page link into insights-open-page", async () => {
    let opened = "";
    el.addEventListener("insights-open-page", (e) => {
      opened = e.detail.slug;
    });
    const cadence = el.shadowRoot.querySelector("instructional-cadence");
    const evt = new CustomEvent("cadence-open-page", {
      bubbles: true,
      composed: true,
      cancelable: true,
      detail: { id: "mole", slug: "lesson-1/the-mole" },
    });
    cadence.dispatchEvent(evt);
    expect(opened).to.equal("lesson-1/the-mole");
    expect(evt.defaultPrevented).to.equal(true);
  });

  it("lets the author pick the lesson level", async () => {
    const select = el.shadowRoot.querySelector("#depth");
    select.value = "0";
    select.dispatchEvent(new Event("change"));
    await el.updateComplete;
    const cadence = el.shadowRoot.querySelector("instructional-cadence");
    expect(cadence.lessonDepth).to.equal(0);
  });

  it("passes the a11y audit", async () => {
    await expect(el).shadowDom.to.be.accessible();
  });
});
