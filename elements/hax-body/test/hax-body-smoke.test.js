import { fixture, expect, html } from "@open-wc/testing";
import "../hax-body.js";

describe("hax-body smoke", () => {
  it("instantiates", async () => {
    const el = await fixture(html`<hax-body></hax-body>`);
    expect(el).to.exist;
    expect(el.tagName.toLowerCase()).to.equal("hax-body");
  });

  it("self-announces undo/redo state transitions through a live region", async () => {
    const el = await fixture(html`<hax-body></hax-body>`);
    // match on the sr-only div; the toolbar host also carries a
    // polite live region in the same shadow tree
    const region = el.shadowRoot.querySelector(
      'div.sr-only[aria-live="polite"]',
    );
    // the region renders the mixin announcement state, visually hidden
    expect(region).to.exist;
    expect(region.className.trim()).to.equal("sr-only");
    expect(el.__undoAnnouncement).to.equal("");
    // first stack entry flips canUndo from false to true
    el.undoStack.execute({
      execute: () => {},
      undo: () => {},
      redo: () => {},
    });
    await el.updateComplete;
    expect(el.canUndo).to.be.true;
    expect(el.__undoAnnouncement).to.equal("Undo available.");
    expect(region.textContent.trim()).to.equal("Undo available.");
  });
});
