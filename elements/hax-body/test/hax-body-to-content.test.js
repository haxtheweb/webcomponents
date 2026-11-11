import { fixture, expect, html } from "@open-wc/testing";
import "../hax-body.js";
import "../lib/hax-tray.js";

// haxToContent turns the page into the HTML that View source shows and
// that is saved. Text sitting directly in the page (whitespace between
// blocks, or a stray word) is not an element: it must be kept as text,
// not break the export.
describe("hax-body haxToContent with text in the page", () => {
  it("keeps text between blocks and exports every block", async () => {
    const el = await fixture(
      html`<hax-body
        ><p>First</p>
        loose words
        <p>Second</p></hax-body
      >`,
    );
    await el.updateComplete;
    const texts = [...el.childNodes].filter((n) => n.nodeType === 3);
    expect(texts.length, "the fixture has text nodes in the page").to.be.above(
      0,
    );
    const content = await el.haxToContent();
    expect(content).to.contain("First");
    expect(content).to.contain("loose words");
    expect(content).to.contain("Second");
    expect(content.indexOf("First")).to.be.below(content.indexOf("Second"));
  });
});

// haxToContent clears the active block while it exports and puts it back
// after; the tray must not take that as the user picking a block
describe("hax-tray keeps Structure open when a block becomes active", () => {
  const gizmo = { title: "Paragraph", tag: "p" };
  it("stays on Structure when a block is selected from nothing", async () => {
    const tray = await fixture(html`<hax-tray></hax-tray>`);
    tray.trayDetail = "content-map";
    tray.activeGizmo = null;
    await tray.updateComplete;
    tray.activeGizmo = gizmo;
    await tray.updateComplete;
    expect(tray.trayDetail).to.equal("content-map");
  });
});
