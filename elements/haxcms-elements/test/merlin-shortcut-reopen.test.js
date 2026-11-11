import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../lib/core/haxcms-site-editor-ui.js";

// Merlin's open / close shortcut must tear full Merlin down the same way
// the close button does, so the next open lands under the top bar field
// again instead of in the top left corner.
describe("Merlin shortcut after full Merlin", () => {
  const shortcut = { key: "Shift", altKey: true, shiftKey: true };
  const spot = (sdi) => {
    const ap = sdi.shadowRoot.querySelector("absolute-position-behavior");
    const r = ap.getBoundingClientRect();
    return [Math.round(r.x), Math.round(r.y)];
  };

  it("reopens the mini popover where it first opened", async () => {
    await fixture(html`<haxcms-site-editor-ui></haxcms-site-editor-ui>`);
    await aTimeout(300);
    const sdi = globalThis.SuperDaemonManager.requestAvailability();
    const allowed = sdi.allowedCallback;
    sdi.allowedCallback = () => true;
    sdi.key1 = "Alt";
    try {
      sdi.keyHandler(shortcut);
      await aTimeout(400);
      expect(sdi.opened).to.equal(true);
      expect(sdi.mini).to.equal(true);
      const first = spot(sdi);
      sdi.expand();
      await aTimeout(400);
      expect(sdi.mini).to.equal(false);
      // close full Merlin with the shortcut
      sdi.keyHandler(shortcut);
      await aTimeout(400);
      expect(sdi.opened).to.equal(false);
      expect(sdi.mini).to.equal(false);
      sdi.keyHandler(shortcut);
      await aTimeout(400);
      expect(sdi.opened).to.equal(true);
      expect(spot(sdi)).to.deep.equal(first);
    } finally {
      sdi.close();
      sdi.allowedCallback = allowed;
    }
  });
});
