import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../super-daemon.js";
import { HaxConsent } from "@haxtheweb/utils/lib/hax-consent.js";

// When speech would leave the device, Merlin stops listening and asks in
// its toast with the shared consent panel; allowing resumes listening
describe("super-daemon voice consent", () => {
  beforeEach(() => HaxConsent.clearAll());
  after(() => HaxConsent.clearAll());

  it("asks with the speech consent panel and resumes on allow", async () => {
    const el = await fixture(html`<super-daemon></super-daemon>`);
    el.hal = null;
    const shown = [];
    const hidden = [];
    const onShow = (e) => shown.push(e.detail);
    const onHide = () => hidden.push(true);
    globalThis.addEventListener("super-daemon-toast-show", onShow);
    globalThis.addEventListener("super-daemon-toast-hide", onHide);
    try {
      el.listeningForInput = true;
      el._voiceStateChanged("consent");
      // the panel's element loads on first use
      for (let i = 0; i < 100 && !shown.some((d) => d.slot); i++) {
        await aTimeout(20);
      }
      expect(el.listeningForInput).to.equal(false);
      const ask = shown.find((d) => d.slot);
      expect(ask).to.exist;
      expect(ask.alwaysvisible).to.equal(true);
      expect(ask.slot.tagName).to.equal("HAX-CONSENT-GATE");
      expect(ask.slot.getAttribute("service")).to.equal("speech");
      HaxConsent.set("speech", "allow");
      expect(hidden.length).to.be.above(0);
      expect(el.listeningForInput).to.equal(true);
    } finally {
      globalThis.removeEventListener("super-daemon-toast-show", onShow);
      globalThis.removeEventListener("super-daemon-toast-hide", onHide);
    }
  });
});
