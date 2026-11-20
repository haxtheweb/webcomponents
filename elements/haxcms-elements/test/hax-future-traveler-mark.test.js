import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import {
  HAX_TRAVELER_ERA_KEY,
  HaxFutureTravelerMark,
} from "../lib/core/ui/hax-future-traveler-mark.js";

const settle = () => new Promise((r) => setTimeout(r, 400));

describe("hax-future-traveler-mark", () => {
  beforeEach(() => {
    globalThis.localStorage.removeItem(HAX_TRAVELER_ERA_KEY);
  });
  afterEach(() => {
    globalThis.localStorage.removeItem(HAX_TRAVELER_ERA_KEY);
  });

  it("is defined and starts as today's icon", async () => {
    const el = await fixture(
      html`<hax-future-traveler-mark></hax-future-traveler-mark>`,
    );
    expect(el).to.be.instanceOf(HaxFutureTravelerMark);
    expect(el.era).to.equal("now");
    expect(
      el.shadowRoot.querySelector("simple-icon-lite").getAttribute("icon"),
    ).to.equal("hax:future-traveler");
  });

  it("is decorative: hidden from assistive tech and not a tab stop", async () => {
    const el = await fixture(
      html`<hax-future-traveler-mark></hax-future-traveler-mark>`,
    );
    expect(el.getAttribute("aria-hidden")).to.equal("true");
    expect(el.tabIndex).to.equal(-1);
    expect(el.shadowRoot.querySelector("button, [tabindex], a")).to.equal(null);
  });

  it("click moves him to the next era and remembers it", async () => {
    const el = await fixture(
      html`<hax-future-traveler-mark></hax-future-traveler-mark>`,
    );
    el.click();
    await waitUntil(() => el.era !== "now", "era changed", { timeout: 2000 });
    await settle();
    expect(el.era).to.equal("steam");
    expect(globalThis.localStorage.getItem(HAX_TRAVELER_ERA_KEY)).to.equal(
      "steam",
    );
    const svg = el.shadowRoot.querySelector("svg.future-traveler");
    expect(svg).to.exist;
    expect(svg.getAttribute("data-era")).to.equal("steam");
    expect(svg.getAttribute("aria-hidden")).to.equal("true");
  });

  it("a new mark comes up in the remembered era", async () => {
    globalThis.localStorage.setItem(HAX_TRAVELER_ERA_KEY, "neon");
    const el = await fixture(
      html`<hax-future-traveler-mark></hax-future-traveler-mark>`,
    );
    await waitUntil(
      () => el.shadowRoot.querySelector("svg.future-traveler"),
      "era drawn",
      { timeout: 2000 },
    );
    expect(el.era).to.equal("neon");
  });

  it("other marks on the page follow a click", async () => {
    const wrap = await fixture(
      html`<div>
        <hax-future-traveler-mark id="a"></hax-future-traveler-mark>
        <hax-future-traveler-mark id="b"></hax-future-traveler-mark>
      </div>`,
    );
    const a = wrap.querySelector("#a");
    const b = wrap.querySelector("#b");
    a.click();
    await waitUntil(() => b.era === "steam", "b followed", { timeout: 2000 });
    await settle();
    expect(a.era).to.equal("steam");
  });

  it("cycling back to today forgets the era", async () => {
    globalThis.localStorage.setItem(HAX_TRAVELER_ERA_KEY, "terminal");
    const el = await fixture(
      html`<hax-future-traveler-mark></hax-future-traveler-mark>`,
    );
    el.click();
    await waitUntil(() => el.era === "now", "back to now", { timeout: 2000 });
    expect(globalThis.localStorage.getItem(HAX_TRAVELER_ERA_KEY)).to.equal(
      null,
    );
  });

  it("passes the a11y audit", async () => {
    const el = await fixture(
      html`<hax-future-traveler-mark></hax-future-traveler-mark>`,
    );
    await expect(el).to.be.accessible();
  });
});
