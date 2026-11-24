import { html, fixture, expect } from "@open-wc/testing";
import { HAX_NETWORK } from "@haxtheweb/hax-network-bar/lib/hax-network.js";
import "../lib/hax-network-sites.js";

describe("hax-network-sites", () => {
  const cards = (el) => [...el.shadowRoot.querySelectorAll("li a")];

  it("lists every property in the bar's order, then hax.psu.edu", async () => {
    const el = await fixture(html`<hax-network-sites></hax-network-sites>`);
    const ids = cards(el).map((a) => a.dataset.site);
    expect(ids).to.deep.equal([...HAX_NETWORK.order, "psu"]);
    expect(ids).to.not.include("rpg");
  });

  it("draws each site from the network's record: name, address, purpose, icon and color", async () => {
    const el = await fixture(html`<hax-network-sites></hax-network-sites>`);
    cards(el).forEach((a) => {
      const p = HAX_NETWORK.properties[a.dataset.site];
      expect(a.getAttribute("href")).to.equal(p.url);
      expect(a.querySelector(".name").textContent).to.equal(p.label);
      expect(a.querySelector(".purpose").textContent).to.equal(p.purpose);
      expect(a.querySelector(".host").textContent).to.equal(
        p.url.replace("https://", "").replace(/\/$/, ""),
      );
      expect(a.querySelector("svg.glyph")).to.exist;
      expect(a.classList.contains("glyph-host")).to.equal(true);
      expect(a.getAttribute("style")).to.contain(
        `--ddd-theme-default-${p.color}`,
      );
    });
  });

  it("picks and orders sites, ignoring ids the network does not know", async () => {
    const el = await fixture(
      html`<hax-network-sites sites="psu web nope rpg"></hax-network-sites>`,
    );
    expect(cards(el).map((a) => a.dataset.site)).to.deep.equal(["psu", "web"]);
  });

  it("is a labelled list", async () => {
    const el = await fixture(html`<hax-network-sites></hax-network-sites>`);
    expect(
      el.shadowRoot.querySelector("ul").getAttribute("aria-label"),
    ).to.equal("Sites made with HAX");
    await expect(el).shadowDom.to.be.accessible();
  });
});
