import { fixture, expect, html } from "@open-wc/testing";
import "../spotify-embed.js";
import { HaxConsent } from "@haxtheweb/utils/lib/hax-consent.js";

// nothing is requested from Spotify until the visitor allows it
describe("spotify-embed consent", () => {
  let el;
  beforeEach(async () => {
    HaxConsent.clearAll();
    el = await fixture(
      html`<spotify-embed
        source="https://open.spotify.com/album/5dRcZuEijcy8xMfSaRjtk8"
      ></spotify-embed>`,
    );
  });
  after(() => HaxConsent.clearAll());

  it("shows the consent panel and no player before consent", () => {
    expect(el.shadowRoot.querySelector("iframe")).to.not.exist;
    const gate = el.shadowRoot.querySelector("hax-consent-gate");
    expect(gate.getAttribute("service")).to.equal("embed:open.spotify.com");
  });

  it("passes the a11y audit while waiting", async () => {
    await expect(el).shadowDom.to.be.accessible();
  });

  it("loads the player once allowed and asks again when withdrawn", async () => {
    HaxConsent.set("embed:open.spotify.com", "allow");
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("iframe")).to.exist;
    HaxConsent.set("embed:open.spotify.com", null);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("iframe")).to.not.exist;
  });
});
