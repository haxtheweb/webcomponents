import { fixture, expect, html, aTimeout, waitUntil } from "@open-wc/testing";
import "../lib/simple-toast-el.js";

// The toast fades in when it opens and fades out when its time is up. These
// run the real animations: a keyframe name that does not resolve from where
// the animation is declared leaves the toast with nothing running.
describe("simple-toast-el fades in and out", () => {
  const running = (el) =>
    el
      .getAnimations()
      .map((a) => a.animationName)
      .sort();

  it("runs fadein when it opens and has fadeout waiting", async () => {
    const el = await fixture(
      html`<simple-toast-el duration="400"></simple-toast-el>`,
    );
    el.opened = true;
    await el.updateComplete;
    await waitUntil(() => running(el).length > 0, "an animation started");
    expect(running(el)).to.deep.equal(["fadein", "fadeout"]);
    expect(el.classList.contains("show")).to.equal(true);
    el.hide();
  });

  it("fades out once its time is up, then hides on the end of that fade", async () => {
    const el = await fixture(
      html`<simple-toast-el duration="200"></simple-toast-el>`,
    );
    let ended = "";
    el.addEventListener("animationend", (e) => {
      ended += e.animationName + " ";
    });
    el.opened = true;
    await el.updateComplete;
    // part way through the fade out (it starts at 200ms and takes 600ms)
    await aTimeout(500);
    const opacity = Number(globalThis.getComputedStyle(el).opacity);
    expect(opacity).to.be.greaterThan(0);
    expect(opacity).to.be.lessThan(1);
    expect(el.classList.contains("show")).to.equal(true);
    // hidden by the end of the fade, before the backup timer (200 + 600ms)
    await waitUntil(() => !el.classList.contains("show"), "the toast hid", {
      timeout: 2000,
    });
    expect(ended).to.contain("fadeout");
    expect(el.opened).to.equal(false);
  });

  it("stays up with only a fade in when it is always visible", async () => {
    const el = await fixture(
      html`<simple-toast-el duration="200" alwaysvisible></simple-toast-el>`,
    );
    el.opened = true;
    await el.updateComplete;
    await waitUntil(() => running(el).length > 0, "an animation started");
    expect(running(el)).to.deep.equal(["fadein"]);
    await aTimeout(1000);
    expect(el.classList.contains("show")).to.equal(true);
    el.alwaysvisible = false;
    el.hide();
  });
});
