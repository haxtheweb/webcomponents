// local development and mobx
window.process = window.process || {
  env: {
    NODE_ENV: "development",
  },
};
import { fixture, expect, html } from "@open-wc/testing";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";

import "../outline-player.js";
/*
describe("outline-player test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html` <outline-player title="test-title"></outline-player> `
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("A11y/chai axe tests", () => {
  it("outline-player passes accessibility test", async () => {
    const el = await fixture(html` <outline-player></outline-player> `);
    await expect(el).to.be.accessible();
  });
  it("outline-player passes accessibility negation", async () => {
    const el = await fixture(
      html`<outline-player aria-labelledby="outline-player"></outline-player>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("outline-player can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<outline-player .foo=${'bar'}></outline-player>`);
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
      const el = await fixture(html`<outline-player ></outline-player>`);
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
      const el = await fixture(html`<outline-player></outline-player>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<outline-player></outline-player>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

// Issue 3106: outline-player's constructor used to reassign
// this.__disposer = [] right after super(), orphaning the three
// constructor-time autoruns pushed by HAXCMSLitElementTheme
// (editMode/trayStatus/activeItemContent) so removal never disposed them
// (zombie autoruns on every removed theme).
describe("outline-player autorun disposal (issue 3106)", () => {
  it("retains the constructor-time autoruns in __disposer", () => {
    const detached = globalThis.document.createElement("outline-player");
    expect(Array.isArray(detached.__disposer)).to.equal(true);
    expect(detached.__disposer.length).to.equal(3);
    // dispose here so this never-connected element does not leak live
    // reactions (including its wiring watchdog) into the suite
    detached.__disposer.forEach((disposer) => {
      if (typeof disposer === "function") {
        disposer();
      } else if (disposer && typeof disposer.dispose === "function") {
        disposer.dispose();
      }
    });
    detached.__disposer = [];
    if (
      detached.HAXCMSThemeWiring &&
      detached.HAXCMSThemeWiring.disposeDisposers
    ) {
      detached.HAXCMSThemeWiring.disposeDisposers();
    }
  });

  it("disposes every autorun on disconnect so removed themes stop reacting", async () => {
    const el = await fixture(html`<outline-player></outline-player>`);
    await el.updateComplete;
    expect(el.__disposer.length).to.be.at.least(3);
    el.remove();
    expect(el.__disposer.length).to.equal(0);
    expect(el.HAXCMSThemeWiring.__disposer.length).to.equal(0);
    const savedEditMode = store.editMode;
    const before = el.editMode;
    store.editMode = !before;
    await new Promise((resolve) => setTimeout(resolve, 80));
    expect(el.editMode).to.equal(before);
    store.editMode = savedEditMode;
  });
});
