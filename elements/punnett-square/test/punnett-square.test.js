import { fixture, expect, html } from "@open-wc/testing";

import "../punnett-square.js";

describe("punnett-square test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`
        <punnett-square variant1="Aa" variant2="Aa">
          <img data-variant="Aa" src="images/green-alien.png" alt="" />
          <img data-variant="AA" src="images/green-alien.png" alt="" />
          <img data-variant="aa" src="images/purple-alien.png" alt="" />
        </punnett-square>
      `
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("punnett-square passes accessibility test", async () => {
    const el = await fixture(html` <punnett-square></punnett-square> `);
    await expect(el).to.be.accessible();
  });
  it("punnett-square passes accessibility negation", async () => {
    const el = await fixture(
      html`<punnett-square aria-labelledby="punnett-square"></punnett-square>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("punnett-square can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<punnett-square .foo=${'bar'}></punnett-square>`);
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
      const el = await fixture(html`<punnett-square ></punnett-square>`);
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
      const el = await fixture(html`<punnett-square></punnett-square>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<punnett-square></punnett-square>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
