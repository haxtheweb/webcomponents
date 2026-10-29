import { fixture, expect, html, oneEvent } from "@open-wc/testing";
import { analyzeSite } from "../lib/core/insights/insights-analyzer.js";
import "../lib/core/insights/sections/insights-links.js";
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

describe("insights-links screen", () => {
  let el;
  beforeEach(async () => {
    el = await fixture(
      html`<insights-links
        .results="${results}"
        density="compact"
      ></insights-links>`,
    );
  });

  it("shows the link KPIs from the analyzer", () => {
    const kpis = [...el.shadowRoot.querySelectorAll(".kpi")].map((k) =>
      k.textContent.replace(/\s+/g, " ").trim(),
    );
    expect(kpis[0]).to.include("Unnamed links").and.include("2");
    expect(kpis.join("|")).to.include("Raw item-ID URLs 1");
    expect(kpis.join("|")).to.include("Textbook links 2 on 2 pages");
    expect(kpis.join("|")).to.include("Embeds 4 iframes on 3 pages");
    expect(kpis.join("|")).to.include("Outside links 5");
    expect(kpis.join("|")).to.include("URL auto-naming Off");
    expect(el.getAttribute("density")).to.equal("compact");
  });

  it("filters findings by severity with counts", async () => {
    const buttons = el.shadowRoot.querySelectorAll(".filters button");
    expect(
      [...buttons].map((b) => b.textContent.replace(/\s+/g, " ").trim()),
    ).to.deep.equal(["All 13", "Errors 3", "Warnings 8", "Info 2"]);
    const rows = () => el.shadowRoot.querySelectorAll("tbody tr[data-code]");
    expect(rows().length).to.equal(13);
    buttons[1].click();
    await el.updateComplete;
    expect(rows().length).to.equal(3);
    expect(buttons[1].getAttribute("aria-pressed")).to.equal("true");
    buttons[3].click();
    await el.updateComplete;
    expect(rows().length).to.equal(2);
    expect(text(el)).to.include("Not https");
  });

  it("lists embed hosts, outside hosts and pages that lean on hosts", () => {
    const embed = el.shadowRoot.querySelector(".embed-hosts tbody tr");
    expect(embed.textContent).to.include("phet.colorado.edu");
    expect(embed.textContent).to.include("3");
    expect(el.shadowRoot.querySelectorAll(".outside tbody tr").length).to.equal(
      results.links.outsideLinks.hosts.length,
    );
    expect(el.shadowRoot.querySelector(".lean-on li")).to.exist;
  });

  it("fires insights-open-page with the page slug", async () => {
    const btn = el.shadowRoot.querySelector("tbody .open-page");
    const slug = btn.getAttribute("data-slug");
    setTimeout(() => btn.click());
    const ev = await oneEvent(el, "insights-open-page");
    expect(ev.detail.slug).to.equal(slug);
    expect(ev.bubbles).to.equal(true);
    expect(ev.composed).to.equal(true);
  });

  it("shows outside link status as Coming soon with its needs text", () => {
    const btn = el.shadowRoot.querySelector(".check-outside");
    expect(btn.getAttribute("aria-disabled")).to.equal("true");
    expect(btn.getAttribute("title")).to.equal(
      results.links.outsideLinkStatus.needs,
    );
    expect(text(el)).to.include("Needs server-side link checks");
    expect(el.shadowRoot.querySelector(".soon-kpi")).to.exist;
  });

  it("shows positive empty states", async () => {
    const r = clone(results);
    r.links.findings = [];
    r.links.counts = { all: 0, errors: 0, warnings: 0, info: 0 };
    r.links.leanOnHosts = [];
    r.links.embedHosts = [];
    r.links.outsideLinks = { total: 0, hosts: [] };
    const e = await fixture(
      html`<insights-links .results="${r}"></insights-links>`,
    );
    const empties = [...e.shadowRoot.querySelectorAll(".empty")].map(
      (x) => x.textContent,
    );
    expect(empties.length).to.equal(4);
    expect(empties[0]).to.include("No link findings");
  });

  it("shows the first 50 findings with a Show all button", async () => {
    const r = clone(results);
    const row = r.links.findings[0];
    r.links.findings = Array.from({ length: 60 }, () => row);
    const e = await fixture(
      html`<insights-links .results="${r}"></insights-links>`,
    );
    expect(
      e.shadowRoot.querySelectorAll("tbody tr[data-code]").length,
    ).to.equal(50);
    const more = e.shadowRoot.querySelector('[data-more="findings"]');
    expect(more.textContent).to.include("Show all 60");
    more.click();
    await e.updateComplete;
    expect(
      e.shadowRoot.querySelectorAll("tbody tr[data-code]").length,
    ).to.equal(60);
  });

  it("is accessible", async () => {
    await expect(el).shadowDom.to.be.accessible();
  });
});
