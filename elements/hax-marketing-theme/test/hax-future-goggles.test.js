import { html, fixture, expect, aTimeout } from "@open-wc/testing";
import "../lib/hax-future-goggles.js";
import "../lib/hax-marketing-blocks.js";
import { HAX_TRAVELER_ERAS } from "@haxtheweb/hax-network-bar/lib/hax-future-traveler.js";

describe("hax-future-goggles", function () {
  this.timeout(10000);

  it("has a HAX editor schema file", () => {
    expect(customElements.get("hax-future-goggles").haxProperties).to.match(
      /\/lib\/hax-future-goggles\.haxProperties\.json$/,
    );
  });

  it("shows him today, lit, with the tagline and every era to pick", async () => {
    const el = await fixture(
      html`<hax-future-goggles
        tagline="Your Future has never looked so bright."
      ></hax-future-goggles>`,
    );
    const root = el.shadowRoot;
    expect(
      root.querySelector(".traveler svg.future-traveler").dataset.era,
    ).to.equal("now");
    expect(root.querySelector(".light")).to.exist;
    expect(root.querySelector(".tagline").textContent).to.contain(
      "never looked so bright",
    );
    expect(root.querySelectorAll(".eras button").length).to.equal(
      HAX_TRAVELER_ERAS.length,
    );
    expect(
      root
        .querySelector('.eras button[aria-pressed="true"] .sr-only')
        .textContent.trim(),
    ).to.equal("Today");
    await expect(el).shadowDom.to.be.accessible();
  });

  it("travels to the next era on click and to a picked era", async () => {
    const el = await fixture(html`<hax-future-goggles></hax-future-goggles>`);
    el.shadowRoot.querySelector(".traveler").click();
    await aTimeout(400);
    await el.updateComplete;
    expect(el.era).to.equal(HAX_TRAVELER_ERAS[1].id);
    expect(
      el.shadowRoot.querySelector(".traveler .sr-only").textContent,
    ).to.contain(HAX_TRAVELER_ERAS[1].label);
    el.shadowRoot.querySelectorAll(".eras button")[4].click();
    await aTimeout(400);
    expect(el.era).to.equal(HAX_TRAVELER_ERAS[4].id);
  });

  it("falls back to today for an era it does not know", async () => {
    const el = await fixture(
      html`<hax-future-goggles era="nope" no-eras></hax-future-goggles>`,
    );
    expect(el.current.id).to.equal("now");
    expect(el.shadowRoot.querySelector(".eras")).to.not.exist;
  });

  it("feature row: shows the media slot unframed when there is no image", async () => {
    const el = await fixture(
      html`<hax-feature-row eyebrow="Future" heading="See the Future."
        ><hax-future-goggles slot="media"></hax-future-goggles>
        <p>Words.</p></hax-feature-row
      >`,
    );
    expect(el.shadowRoot.querySelector(".screen")).to.not.exist;
    expect(el.shadowRoot.querySelector('.media slot[name="media"]')).to.exist;
    const pic = await fixture(
      html`<hax-feature-row image="x.jpg" alt="A screen"></hax-feature-row>`,
    );
    expect(pic.shadowRoot.querySelector(".screen img")).to.exist;
    expect(pic.shadowRoot.querySelector(".media")).to.not.exist;
  });
});
