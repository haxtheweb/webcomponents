import { fixture, expect, html } from "@open-wc/testing";
import "../linkedin-embed.js";
import { HaxConsent } from "@haxtheweb/utils/lib/hax-consent.js";

// LinkedIn's badge script loads only once the visitor allows it
describe("linkedin-embed consent", () => {
  beforeEach(() => HaxConsent.clearAll());
  after(() => HaxConsent.clearAll());

  it("keeps the plain profile link and shows the panel, with no script", async () => {
    const el = await fixture(
      html`<linkedin-embed vanityname="btopro"></linkedin-embed>`,
    );
    await el.updateComplete;
    expect(el.shadowRoot.querySelector("a.badge-base__link")).to.exist;
    expect(
      el.shadowRoot.querySelector("hax-consent-gate").getAttribute("service"),
    ).to.equal("embed:badges.linkedin.com");
    expect(globalThis.document.querySelector('script[src*="linkedin"]')).to.not
      .exist;
    expect(el.__lastRequestUid).to.not.exist;
  });

  it("requests the badge once allowed", async () => {
    const el = await fixture(
      html`<linkedin-embed vanityname="btopro"></linkedin-embed>`,
    );
    let requested = 0;
    const real = el.__requestBadgeMarkup.bind(el);
    el.__requestBadgeMarkup = () => {
      if (el._consent.allowed) {
        requested++;
      }
      return undefined;
    };
    HaxConsent.set("embed:badges.linkedin.com", "allow");
    await el.updateComplete;
    expect(requested).to.be.above(0);
    expect(el.shadowRoot.querySelector("hax-consent-gate")).to.not.exist;
    el.__requestBadgeMarkup = real;
  });
});
