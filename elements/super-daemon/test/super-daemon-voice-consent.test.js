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

// The mic button: when speech needs consent, the panel comes first, before
// Merlin says anything or listens, and allowing starts the conversation
// with a fresh card
describe("super-daemon voice consent comes first", () => {
  beforeEach(() => HaxConsent.clearAll());
  after(() => HaxConsent.clearAll());

  const fakeHal = (needs) => {
    const calls = { speak: [], toast: [] };
    return {
      calls,
      santaMode: false,
      needsSpeechConsent: () => Promise.resolve(needs()),
      speak: (text) => {
        calls.speak.push(text);
        return Promise.resolve(true);
      },
      setToast: (text, alwaysvisible, awaiting) =>
        calls.toast.push({ text, alwaysvisible, awaiting }),
    };
  };

  it("asks before speaking, then speaks and listens once allowed", async () => {
    const el = await fixture(html`<super-daemon></super-daemon>`);
    const hal = fakeHal(() => !HaxConsent.allowed("speech"));
    el.hal = hal;
    el.playSound = () => Promise.resolve();
    const shown = [];
    const onShow = (e) => shown.push(e.detail);
    globalThis.addEventListener("super-daemon-toast-show", onShow);
    try {
      await el.startListening("How may I help you?");
      for (let i = 0; i < 100 && !shown.some((d) => d.slot); i++) {
        await aTimeout(20);
      }
      // nothing said, nothing heard: only the panel
      expect(hal.calls.speak).to.be.empty;
      expect(el.listeningForInput).to.equal(false);
      const ask = shown.find((d) => d.slot);
      expect(ask.awaitingMerlinInput).to.not.be.ok;
      // the toast puts the panel in on the next tick
      await aTimeout(20);
      HaxConsent.set("speech", "allow");
      // the panel is swapped for the opening line, then Merlin speaks it
      expect(hal.calls.toast[0]).to.deep.equal({
        text: "How may I help you?",
        alwaysvisible: false,
        awaiting: true,
      });
      for (let i = 0; i < 50 && !el.listeningForInput; i++) {
        await aTimeout(20);
      }
      expect(hal.calls.speak).to.deep.equal(["How may I help you?"]);
      expect(el.listeningForInput).to.equal(true);
    } finally {
      globalThis.removeEventListener("super-daemon-toast-show", onShow);
    }
  });

  it("goes straight to speaking when no consent is needed", async () => {
    const el = await fixture(html`<super-daemon></super-daemon>`);
    const hal = fakeHal(() => false);
    el.hal = hal;
    el.playSound = () => Promise.resolve();
    await el.startListening("How may I help you?");
    expect(hal.calls.speak).to.deep.equal(["How may I help you?"]);
    expect(el.listeningForInput).to.equal(true);
  });

  it("a later allow elsewhere does not start listening by surprise", async () => {
    const el = await fixture(html`<super-daemon></super-daemon>`);
    const hal = fakeHal(() => !HaxConsent.allowed("speech"));
    el.hal = hal;
    await el.startListening("How may I help you?");
    await aTimeout(50);
    // the visitor closed the panel instead of answering
    el.__voiceConsentGate.remove();
    HaxConsent.set("speech", "allow");
    await aTimeout(50);
    expect(hal.calls.speak).to.be.empty;
    expect(el.listeningForInput).to.equal(false);
  });
});
