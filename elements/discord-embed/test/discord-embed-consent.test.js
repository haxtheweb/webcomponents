import { fixture, expect, html } from "@open-wc/testing";
import "../discord-embed.js";
import { HaxConsent } from "@haxtheweb/utils/lib/hax-consent.js";

// nothing is requested from Discord until the visitor allows it
describe("discord-embed consent", () => {
  let el;
  beforeEach(async () => {
    HaxConsent.clearAll();
    el = await fixture(
      html`<discord-embed
        source="https://e.widgetbot.io/channels/123456789/987654321"
      ></discord-embed>`,
    );
  });
  after(() => HaxConsent.clearAll());

  it("shows the consent panel and no frame before consent", () => {
    expect(el.shadowRoot.querySelector("iframe")).to.not.exist;
    expect(
      el.shadowRoot.querySelector("hax-consent-gate").getAttribute("service"),
    ).to.equal("embed:e.widgetbot.io");
  });

  it("draws the frame once allowed, again after a withdraw and re-allow", async () => {
    HaxConsent.set("embed:e.widgetbot.io", "allow");
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("iframe")).to.exist;
    HaxConsent.set("embed:e.widgetbot.io", null);
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("iframe")).to.not.exist;
    expect(el.__deferredPromoted).to.equal(false);
    HaxConsent.set("embed:e.widgetbot.io", "allow");
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("iframe")).to.exist;
  });
});
