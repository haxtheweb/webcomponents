import { fixture, expect, html } from "@open-wc/testing";

import "../paper-fab-speed-dial.js";

describe("paper-fab-speed-dial test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <paper-fab-speed-dial title="test-title"></paper-fab-speed-dial>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("paper-fab-speed-dial passes accessibility test", async () => {
    const el = await fixture(
      html` <paper-fab-speed-dial></paper-fab-speed-dial> `
    );
    await expect(el).to.be.accessible();
  });
  it("paper-fab-speed-dial passes accessibility negation", async () => {
    const el = await fixture(
      html`<paper-fab-speed-dial
        aria-labelledby="paper-fab-speed-dial"
      ></paper-fab-speed-dial>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("paper-fab-speed-dial can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<paper-fab-speed-dial .foo=${'bar'}></paper-fab-speed-dial>`);
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
      const el = await fixture(html`<paper-fab-speed-dial ></paper-fab-speed-dial>`);
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
      const el = await fixture(html`<paper-fab-speed-dial></paper-fab-speed-dial>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<paper-fab-speed-dial></paper-fab-speed-dial>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
