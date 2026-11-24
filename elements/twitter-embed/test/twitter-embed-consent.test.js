import { fixture, expect, html } from "@open-wc/testing";
import "../twitter-embed.js";
import "../lib/twitter-embed-vanilla.js";
import { HaxConsent } from "@haxtheweb/utils/lib/hax-consent.js";

// nothing is requested from X / Twitter until the visitor allows it
describe("twitter-embed consent", () => {
  beforeEach(() => HaxConsent.clearAll());
  after(() => HaxConsent.clearAll());

  it("twitter-embed shows the panel, then the tweet once allowed", async () => {
    const el = await fixture(
      html`<twitter-embed tweet-id="42"></twitter-embed>`,
    );
    expect(el.shadowRoot.querySelector("iframe")).to.not.exist;
    expect(
      el.shadowRoot.querySelector("hax-consent-gate").getAttribute("service"),
    ).to.equal("embed:platform.x.com");
    HaxConsent.set("embed:platform.x.com", "allow");
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("iframe")).to.exist;
  });

  it("twitter-embed-vanilla shows the panel, then the tweet once allowed", async () => {
    const el = await fixture(
      html`<twitter-embed-vanilla tweet-id="42"></twitter-embed-vanilla>`,
    );
    expect(el.querySelector("iframe")).to.not.exist;
    expect(el.querySelector("hax-consent-gate")).to.exist;
    HaxConsent.set("embed:platform.twitter.com", "allow");
    expect(el.querySelector("iframe")).to.exist;
    HaxConsent.set("embed:platform.twitter.com", "deny");
    expect(el.querySelector("iframe")).to.not.exist;
  });
});
