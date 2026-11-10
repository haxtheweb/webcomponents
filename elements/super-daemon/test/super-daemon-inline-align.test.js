import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import "../super-daemon.js";

// Inline mini Merlin (/ in an empty text block) puts its search field on
// the line that was typed on, whatever that block's line height and padding
describe("super-daemon inline field alignment", () => {
  it("centers the search field on the typing line", async () => {
    const p = await fixture(
      html`<p
        style="margin: 200px 40px; padding: 12px 0; line-height: 40px; font-size: 24px;"
      ></p>`,
    );
    const sdi = globalThis.SuperDaemonManager.requestAvailability();
    sdi.mini = true;
    sdi.wand = false;
    sdi.inlineMode = true;
    sdi.activeNode = p;
    sdi.open();
    await sdi.updateComplete;
    await aTimeout(300);
    const ui = sdi.shadowRoot.querySelector(
      "absolute-position-behavior super-daemon-ui",
    );
    const field = ui.shadowRoot
      .querySelector("super-daemon-search")
      .getBoundingClientRect();
    const r = p.getBoundingClientRect();
    const lineCenter = r.top + 12 + 20;
    expect(Math.abs(field.top + field.height / 2 - lineCenter)).to.be.below(2);
    sdi.close();
    await sdi.updateComplete;
    expect(ui.style.marginTop).to.equal("");
  });
});
