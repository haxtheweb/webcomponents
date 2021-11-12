import { fixture, expect, html } from "@open-wc/testing";

import "../game-show-quiz.js";

describe("game-show-quiz test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html` <game-show-quiz title="test-title"></game-show-quiz> `
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("game-show-quiz passes accessibility test", async () => {
    const el = await fixture(html` <game-show-quiz></game-show-quiz> `);
    await expect(el).to.be.accessible();
  });
  it("game-show-quiz passes accessibility negation", async () => {
    const el = await fixture(
      html`<game-show-quiz aria-labelledby="game-show-quiz"></game-show-quiz>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("game-show-quiz can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<game-show-quiz .foo=${'bar'}></game-show-quiz>`);
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
      const el = await fixture(html`<game-show-quiz ></game-show-quiz>`);
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
      const el = await fixture(html`<game-show-quiz></game-show-quiz>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<game-show-quiz></game-show-quiz>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
