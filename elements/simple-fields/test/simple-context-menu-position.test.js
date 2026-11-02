import { fixture, expect, html, aTimeout } from "@open-wc/testing";
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
    // a near-zero transition still needs a frame to land
    await aTimeout(100);
    const rect = el.shadowRoot.querySelector("dialog").getBoundingClientRect();
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
    await aTimeout(100);
    const a = anchor.getBoundingClientRect();
    const rect = el.shadowRoot.querySelector("dialog").getBoundingClientRect();
    el.close();
    expect(Math.round(rect.left)).to.equal(Math.round(a.left));
    expect(Math.round(rect.top)).to.equal(Math.round(a.bottom + el.offset));
  });
});
