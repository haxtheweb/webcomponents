import { fixture, expect, html } from "@open-wc/testing";

import "../undo-manager.js";

describe("undo-manager test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <undo-manager title="test-title"></undo-manager>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("renders a visually-hidden polite live region for state changes", async () => {
    const region = element.shadowRoot.querySelector("[aria-live='polite']");
    expect(region).to.exist;
    expect(region.className.trim()).to.equal("sr-only");
  });

  it("announces undo availability as the stack changes", async () => {
    // first stack entry flips canUndo from false to true
    element.undoStack.execute({ execute: () => {}, undo: () => {}, redo: () => {} });
    await element.updateComplete;
    expect(element.canUndo).to.be.true;
    expect(element.__undoAnnouncement).to.equal("Undo available.");
    // undoing empties the stack and opens a redo step, announcing both
    element.undoStack.undo();
    await element.updateComplete;
    expect(element.canRedo).to.be.true;
    expect(element.__undoAnnouncement).to.equal(
      "No more undo steps. Redo available.",
    );
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("undo-manager passes accessibility test", async () => {
    const el = await fixture(html` <undo-manager></undo-manager> `);
    await expect(el).to.be.accessible();
  });
  it("undo-manager passes accessibility negation", async () => {
    const el = await fixture(
      html`<undo-manager aria-labelledby="undo-manager"></undo-manager>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("undo-manager can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<undo-manager .foo=${'bar'}></undo-manager>`);
    expect(el.foo).to.equal('bar');
  })
})
*/

/*
// Test if element is mobile responsive
describe('Test Mobile Responsiveness', () => {
    before(async () => {z   
      await setViewport({width: 375, height: 750});
    })
    it('sizes down to 360px', async () => {
      const el = await fixture(html`<undo-manager ></undo-manager>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('360px');
    })
}) */

/*
// Test if element sizes up for desktop behavior
describe('Test Desktop Responsiveness', () => {
    before(async () => {
      await setViewport({width: 1000, height: 1000});
    })
    it('sizes up to 410px', async () => {
      const el = await fixture(html`<undo-manager></undo-manager>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<undo-manager></undo-manager>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
