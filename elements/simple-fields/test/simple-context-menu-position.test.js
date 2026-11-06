import { fixture, expect, html, waitUntil } from "@open-wc/testing";
import { emulateMedia } from "@web/test-runner-commands";
import "../lib/simple-context-menu.js";

// DDD gives every transition a near-zero duration under reduced motion, so
// the dialog's top and left are mid-transition when the menu places itself;
// it must still open where it was asked to, not in the corner
describe("simple-context-menu placement", () => {
  afterEach(async () => {
    await emulateMedia({ reducedMotion: "no-preference" });
  });

  const openAt = async (reducedMotion) => {
    await emulateMedia({ reducedMotion });
    const el = await fixture(
      html`<simple-context-menu title="Actions"
        ><button>One</button><button>Two</button></simple-context-menu
      >`,
    );
    el.positionStrategy = "fixed";
    el.x = 200;
    el.y = 150;
    el.openMenu(null);
    // a near-zero transition still needs a frame (or, on a loaded runner,
    // several) to land; wait for the dialog to leave the corner instead of
    // a fixed 100ms
    const dialog = el.shadowRoot.querySelector("dialog");
    await waitUntil(
      () => Math.abs(dialog.getBoundingClientRect().left - el.x) < 1,
      "menu never reached the pointer",
      { timeout: 5000 },
    );
    const rect = dialog.getBoundingClientRect();
    el.close();
    return rect;
  };

  ["no-preference", "reduce"].forEach((reducedMotion) => {
    it(`opens at the pointer with reduced motion ${reducedMotion}`, async () => {
      const rect = await openAt(reducedMotion);
      expect(Math.round(rect.left)).to.equal(200);
      expect(Math.round(rect.top)).to.equal(150);
    });
  });

  it("opens under its anchor with reduced motion", async () => {
    await emulateMedia({ reducedMotion: "reduce" });
    const host = await fixture(
      html`<div style="padding: 80px 120px">
        <button id="anchor">Open</button>
        <simple-context-menu><button>One</button></simple-context-menu>
      </div>`,
    );
    const anchor = host.querySelector("#anchor");
    const el = host.querySelector("simple-context-menu");
    el.openMenu(anchor);
    const a = anchor.getBoundingClientRect();
    const dialog = el.shadowRoot.querySelector("dialog");
    const wantTop = a.bottom + el.offset;
    await waitUntil(
      () => Math.abs(dialog.getBoundingClientRect().top - wantTop) < 1,
      "menu never landed under its anchor",
      { timeout: 5000 },
    );
    const rect = dialog.getBoundingClientRect();
    el.close();
    // compare within a pixel, not rounded to whole pixels: the anchor's
    // bottom can be fractional (font metrics differ per machine), and
    // rounding each side separately flaked as 116 vs 117 for the same
    // half-pixel position. Pinned to the corner would be ~100px off.
    expect(rect.left).to.be.closeTo(a.left, 1);
    expect(rect.top).to.be.closeTo(wantTop, 1);
  });
});
