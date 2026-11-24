import { fixture, expect, html } from "@open-wc/testing";
import "../disqus-embed.js";
import { HaxConsent } from "@haxtheweb/utils/lib/hax-consent.js";

// Disqus's script loads only once the visitor allows that forum's host
describe("disqus-embed consent", () => {
  beforeEach(() => HaxConsent.clearAll());
  after(() => HaxConsent.clearAll());

  const disqusScripts = () =>
    globalThis.document.querySelectorAll('script[src*="disqus.com"]').length;

  it("shows the panel and adds no script before consent", async () => {
    const el = await fixture(
      html`<disqus-embed short-name="mysite"></disqus-embed>`,
    );
    expect(disqusScripts()).to.equal(0);
    expect(
      el.shadowRoot.querySelector("hax-consent-gate").getAttribute("service"),
    ).to.equal("embed:mysite.disqus.com");
  });
});
