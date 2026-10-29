import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import { analyzeSite } from "../lib/core/insights/insights-analyzer.js";
import "../lib/core/insights/sections/insights-accessibility.js";
import {
  loadSpec,
  loadFixtureSite,
  loadExtras,
  RESULT_OPTIONS,
} from "./insights-fixture-helpers.js";

let results;
let spec;

before(async () => {
  spec = await loadSpec();
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
    html`<insights-accessibility
      .results="${r}"
      .spec="${spec}"
    ></insights-accessibility>`,
  );
}

function rowFor(el, i) {
  return el.shadowRoot.querySelector(`tr[data-row="${i}"]`);
}

describe("insights-accessibility", () => {
  it("shows the key numbers", async () => {
    const el = await render(results);
    const k = results.accessibility.kpis;
    const kpis = el.shadowRoot.querySelectorAll(".kpi");
    expect(kpis[0].textContent).to.contain(
      String(results.accessibility.errors),
    );
    expect(kpis[1].textContent).to.contain(
      `${k.imagesToReview} / ${k.imagesTotal}`,
    );
    expect(kpis[2].textContent).to.contain(String(k.untitledIframes));
    expect(kpis[3].textContent).to.contain(`${k.youtubeVideos} on YouTube`);
    expect(kpis[4].textContent).to.contain(String(k.headingErrorPages));
    expect(kpis[5].textContent).to.contain(`${k.themeContrast.ratio}:1`);
    expect(kpis[5].textContent).to.contain("Fails");
  });

  it("lists every criterion and filters them", async () => {
    const el = await render(results);
    const rows = () => el.shadowRoot.querySelectorAll(".crit-table tbody tr");
    expect(rows().length).to.equal(results.accessibility.criteria.length);
    const fails = results.accessibility.criteria.filter(
      (c) => c.state === "fails",
    ).length;
    el.shadowRoot.querySelector('.crit-filter [data-filter="fails"]').click();
    await el.updateComplete;
    expect(rows().length).to.equal(fails);
    rows().forEach((r) => expect(r.textContent).to.contain("Fails"));
    const captions = results.accessibility.criteria.find(
      (c) => c.sc === "1.2.2",
    );
    el.shadowRoot.querySelector('.crit-filter [data-filter="all"]').click();
    await el.updateComplete;
    const row = el.shadowRoot.querySelector('tr[data-sc="1.2.2"]');
    expect(row.textContent).to.contain(captions.unavailable.needs);
  });

  it("has heading errors and contrast rows", async () => {
    const el = await render(results);
    const heads = el.shadowRoot.querySelectorAll(".heading-errors li");
    expect(heads.length).to.equal(results.accessibility.headingErrors.length);
    expect(heads[0].textContent).to.contain("h1 in body");
    const contrast = el.shadowRoot.querySelectorAll(".contrast li");
    expect(contrast.length).to.equal(results.accessibility.contrast.length);
    expect(contrast[0].textContent).to.contain("2.1:1");
    expect(contrast[0].textContent).to.contain("Fails");
    expect(contrast[2].textContent).to.contain("Passes");
  });

  it("has an alt row per image with preview, filter counts and open page", async () => {
    const el = await render(results);
    const rows = el.shadowRoot.querySelectorAll(".alt-table tbody tr");
    expect(rows.length).to.equal(results.accessibility.altRows.length);
    const img = rows[0].querySelector("img");
    expect(img.getAttribute("src")).to.equal(
      results.accessibility.altRows[0].src,
    );
    expect(img.getAttribute("alt")).to.equal("");
    expect(img.getAttribute("loading")).to.equal("lazy");
    const counts = results.accessibility.altCounts;
    const fixBtn = el.shadowRoot.querySelector(
      '.alt-filter [data-filter="fix"]',
    );
    expect(fixBtn.textContent).to.contain(String(counts.fix));
    fixBtn.click();
    await el.updateComplete;
    expect(
      el.shadowRoot.querySelectorAll(".alt-table tbody tr").length,
    ).to.equal(counts.fix);
    setTimeout(() =>
      el.shadowRoot.querySelector(".alt-table .open-page").click(),
    );
    const ev = await oneEvent(el, "insights-open-page");
    expect(ev.detail.slug).to.equal(results.accessibility.altRows[0].slug);
  });

  it("updates status live as you type and Esc undoes", async () => {
    const el = await render(results);
    const i = results.accessibility.altRows.findIndex(
      (r) => r.reason === "placeholder",
    );
    const input = rowFor(el, i).querySelector("input");
    expect(rowFor(el, i).querySelector(".alt-status").textContent).to.equal(
      "Fix",
    );
    input.value = "A balance with two beakers of water";
    input.dispatchEvent(new Event("input"));
    await el.updateComplete;
    expect(rowFor(el, i).querySelector(".alt-status").textContent).to.equal(
      "Looks OK",
    );
    expect(el.shadowRoot.querySelector(".edited-note").textContent).to.contain(
      "1 edited, not saved",
    );
    const okBtn = el.shadowRoot.querySelector('.alt-filter [data-filter="ok"]');
    expect(okBtn.textContent).to.contain(
      String(results.accessibility.altCounts.ok + 1),
    );
    input.value = "photo of a beaker";
    input.dispatchEvent(new Event("input"));
    await el.updateComplete;
    expect(rowFor(el, i).querySelector(".alt-status").textContent).to.equal(
      "Check",
    );
    input.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
    );
    await el.updateComplete;
    expect(rowFor(el, i).querySelector(".alt-status").textContent).to.equal(
      "Fix",
    );
    expect(input.value).to.equal(results.accessibility.altRows[i].alt);
  });

  it("Save alt text is a disabled Coming soon control with the needs text", async () => {
    const el = await render(results);
    const save = el.shadowRoot.querySelector(".save-alt");
    expect(save.disabled).to.equal(true);
    expect(save.textContent).to.contain("Coming soon");
    expect(save.title).to.equal(results.accessibility.bulkAltSave.needs);
    expect(el.shadowRoot.querySelector(".note").textContent).to.contain(
      "not saved",
    );
    const yt = el.shadowRoot.querySelector('.kpi[data-tone="soon"]');
    expect(yt.textContent).to.contain(
      results.accessibility.youtubeCaptions.needs,
    );
  });

  it("names the contrast ratio and alt length limit from thresholds", async () => {
    const r = JSON.parse(JSON.stringify(results));
    r.thresholds.contrastMinRatio = 7;
    r.thresholds.altMaxLength = 20;
    r.accessibility.altRows[0].alt = "A long alt text well over twenty";
    const el = await render(r);
    expect(
      el.shadowRoot.querySelector("#contrast-title").textContent,
    ).to.contain("AA needs 7:1");
    expect(
      el.shadowRoot.querySelector('tr[data-row="0"]').textContent,
    ).to.contain("over 20");
  });

  it("has empty states", async () => {
    const r = JSON.parse(JSON.stringify(results));
    r.accessibility.altRows = [];
    r.accessibility.headingErrors = [];
    const el = await render(r);
    const text = Array.from(el.shadowRoot.querySelectorAll(".empty"))
      .map((e) => e.textContent)
      .join(" ");
    expect(text).to.contain("No images");
    expect(text).to.contain("No heading order errors");
  });

  it("is accessible", async () => {
    const el = await render(results);
    await expect(el).shadowDom.to.be.accessible();
  });
});
