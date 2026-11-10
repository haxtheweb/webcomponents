import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../super-daemon.js";

// Whatever Merlin says shows as the Merlin speaking toast, so it can be
// read with sound off or without speech support, and a close right after
// (what cheat codes do) doesn't take it down
describe("super-daemon merlinSpeak", () => {
  it("toasts the phrase without voice, and survives the close after it", async () => {
    const el = await fixture(html`<super-daemon></super-daemon>`);
    el.hal = null;
    const shown = [];
    const hidden = [];
    const onShow = (e) => shown.push(e.detail);
    const onHide = () => hidden.push(true);
    globalThis.addEventListener("super-daemon-toast-show", onShow);
    globalThis.addEventListener("super-daemon-toast-hide", onHide);
    try {
      expect(() => el.merlinSpeak("Great Scott!")).to.not.throw();
      // callers close Merlin straight after
      el.close();
      await aTimeout(20);
      const merlinToasts = shown.filter((d) => d.merlin);
      expect(merlinToasts.length).to.equal(1);
      expect(merlinToasts[0].text).to.equal("Great Scott!");
      expect(merlinToasts[0].duration).to.be.at.least(4000);
      expect(hidden.length).to.equal(0);
    } finally {
      globalThis.removeEventListener("super-daemon-toast-show", onShow);
      globalThis.removeEventListener("super-daemon-toast-hide", onHide);
    }
  });

  it("a plain close still hides toasts", async () => {
    const el = await fixture(html`<super-daemon></super-daemon>`);
    let hidden = 0;
    const onHide = () => hidden++;
    globalThis.addEventListener("super-daemon-toast-hide", onHide);
    el.opened = true;
    el.close();
    globalThis.removeEventListener("super-daemon-toast-hide", onHide);
    expect(hidden).to.be.at.least(1);
  });
});
