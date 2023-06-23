import { fixture, expect, html } from "@open-wc/testing";

import "../meme-maker.js";

describe("meme-maker test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`
        <meme-maker
          alt="Cat stalking a small toy"
          image-url="https://cdn2.thecatapi.com/images/9j5.jpg"
          top-text="I bring you"
          bottom-text="the death"
        ></meme-maker>
      `
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("meme-maker passes accessibility test", async () => {
    const el = await fixture(html` <meme-maker></meme-maker> `);
    await expect(el).to.be.accessible();
  });
  it("meme-maker passes accessibility negation", async () => {
    const el = await fixture(
      html`<meme-maker aria-labelledby="meme-maker"></meme-maker>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("meme-maker can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<meme-maker .foo=${'bar'}></meme-maker>`);
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
      const el = await fixture(html`<meme-maker ></meme-maker>`);
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
      const el = await fixture(html`<meme-maker></meme-maker>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<meme-maker></meme-maker>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
