import { fixture, expect, html } from "@open-wc/testing";
import "../tableau-embed.js";
import { HaxConsent } from "@haxtheweb/utils/lib/hax-consent.js";

// neither Tableau's script nor the viz loads until the visitor allows it
describe("tableau-embed consent", () => {
  beforeEach(() => HaxConsent.clearAll());
  after(() => HaxConsent.clearAll());

  it("does not fetch the embedding api before consent", async () => {
    const el = await fixture(
      html`<tableau-embed
        src="https://public.tableau.com/views/sheet"
      ></tableau-embed>`,
    );
    expect(el.loading).to.equal(false);
    expect(el.loaded).to.not.equal(true);
    expect(
      el.shadowRoot.querySelector("hax-consent-gate").getAttribute("service"),
    ).to.equal("embed:public.tableau.com");
  });

  it("loads once allowed", async () => {
    const el = await fixture(
      html`<tableau-embed
        src="https://public.tableau.com/views/sheet"
      ></tableau-embed>`,
    );
    let calls = 0;
    // network stub: no real request to Tableau in tests
    el.loadTableau = () => {
      calls++;
      el.loaded = true;
      el.loading = false;
    };
    HaxConsent.set("embed:public.tableau.com", "allow");
    await el.updateComplete;
    await el.updateComplete;
    expect(calls).to.equal(1);
    expect(el.shadowRoot.querySelector("hax-consent-gate")).to.not.exist;
  });
});
