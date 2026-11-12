// Edit mode adds hax-body's window listeners (keydown, click, resize, ...)
// through one AbortController and leaving edit mode aborts it. Leaving edit
// mode on a hax-body that never entered it threw "Cannot read properties of
// undefined (reading 'abort')", and entering twice without leaving attached
// every window listener twice, with only the second set released on exit.
// Follow-up to https://github.com/haxtheweb/issues/issues/3307
import { fixture, expect, html } from "@open-wc/testing";
import "../hax-body.js";

const settle = async (ms = 30) => {
  await new Promise((r) => setTimeout(r, ms));
  await new Promise((r) => requestAnimationFrame(r));
};

// counts calls to hax-body's window resize listener (_keepContextVisible),
// which is attached only in edit mode
function countResizeListener(body) {
  const counter = { calls: 0 };
  body._keepContextVisible = () => {
    counter.calls++;
  };
  counter.fire = () => {
    counter.calls = 0;
    globalThis.dispatchEvent(new Event("resize"));
    return counter.calls;
  };
  return counter;
}

describe("hax-body edit mode window listeners", () => {
  it("leaving edit mode on a hax-body that never entered it is a no-op", async () => {
    const body = await fixture(html`<hax-body><p>Text</p></hax-body>`);
    let error = null;
    try {
      await body._editModeChanged(false);
    } catch (e) {
      error = e;
    }
    expect(error, error ? error.message : "").to.equal(null);
    expect(body.hasAttribute("contenteditable")).to.equal(false);
    expect(body.querySelector("p").textContent).to.equal("Text");
  });

  it("entering edit mode twice attaches each window listener once", async () => {
    const body = await fixture(html`<hax-body><p>Text</p></hax-body>`);
    const counter = countResizeListener(body);
    expect(counter.fire(), "no listener before edit mode").to.equal(0);
    await body._editModeChanged(true);
    await body._editModeChanged(true);
    expect(counter.fire(), "one listener after entering twice").to.equal(1);
    await body._editModeChanged(false);
    expect(counter.fire(), "no listener left after leaving").to.equal(0);
  });

  it("entering and leaving repeatedly adds and removes the listeners each time", async () => {
    const body = await fixture(html`<hax-body><p>Text</p></hax-body>`);
    const counter = countResizeListener(body);
    for (let round = 1; round <= 3; round++) {
      await body._editModeChanged(true);
      await settle();
      expect(counter.fire(), `round ${round}: on`).to.equal(1);
      await body._editModeChanged(false);
      await settle();
      expect(counter.fire(), `round ${round}: off`).to.equal(0);
    }
  });
});
