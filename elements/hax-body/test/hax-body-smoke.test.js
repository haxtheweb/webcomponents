import { fixture, expect, html } from "@open-wc/testing";
import "../hax-body.js";
import "../lib/hax-tray.js";
import "../lib/hax-plate-context.js";
import "../lib/hax-tray-upload.js";

describe("hax-body smoke", () => {
  it("instantiates", async () => {
    const el = await fixture(html`<hax-body></hax-body>`);
    expect(el).to.exist;
    expect(el.tagName.toLowerCase()).to.equal("hax-body");
  });

  it("is accessible on its baseline render", async () => {
    const el = await fixture(html`<hax-body></hax-body>`);
    await el.updateComplete;
    await expect(el).to.be.accessible();
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

// tier-3 held elements (render depth intentionally held for the upcoming
// editor UI rewrite): each still gets the required smoke + accessibility
// baseline so it stays verified working and accessible through the rewrite.
describe("hax-tray smoke + a11y baseline", () => {
  it("instantiates and renders", async () => {
    const el = await fixture(html`<hax-tray></hax-tray>`);
    await el.updateComplete;
    expect(el).to.exist;
    expect(el.constructor.tag).to.equal("hax-tray");
  });

  // skip: pre-existing a11y violations — reported to lead. axe finds:
  // aria-valid-attr-value (critical): aria-controls="fieldset" on the tray
  // toolbar buttons (merlin, browse, take-photo, record-audio, record-screen,
  // save, cancel, undo, redo, content-edit, content-add, super-daemon);
  // button-name (critical): icon-only buttons lack discernible text;
  // color-contrast (serious): span#label "Edit" #ffffff on #009cde is 3.08:1
  it("is accessible on its baseline render", async () => {
    const el = await fixture(html`<hax-tray></hax-tray>`);
    await el.updateComplete;
    await expect(el).to.be.accessible();
  });
});

describe("hax-plate-context smoke + a11y baseline", () => {
  it("instantiates and renders", async () => {
    const el = await fixture(html`<hax-plate-context></hax-plate-context>`);
    await el.updateComplete;
    expect(el).to.exist;
    expect(el.constructor.tag).to.equal("hax-plate-context");
  });

  it("is accessible on its baseline render", async () => {
    const el = await fixture(html`<hax-plate-context></hax-plate-context>`);
    await el.updateComplete;
    await expect(el).to.be.accessible();
  });
});

describe("hax-tray-upload smoke + a11y baseline", () => {
  it("instantiates and renders", async () => {
    const el = await fixture(html`<hax-tray-upload></hax-tray-upload>`);
    await el.updateComplete;
    expect(el).to.exist;
    expect(el.constructor.tag).to.equal("hax-tray-upload");
  });

  // skip: pre-existing a11y violations — reported to lead. axe finds:
  // aria-valid-attr-value (critical): aria-controls="fieldset" on the
  // upload toolbar buttons (take-photo, record-audio, record-screen, browse)
  it("is accessible on its baseline render", async () => {
    const el = await fixture(html`<hax-tray-upload></hax-tray-upload>`);
    await el.updateComplete;
    await expect(el).to.be.accessible();
  });
});
