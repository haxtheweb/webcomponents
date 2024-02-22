import { fixture, expect, html } from "@open-wc/testing";

import "../a11y-gif-player.js";

describe("a11y-gif-player test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html` <a11y-gif-player
        style="width: 200px;"
        src="https://media0.giphy.com/media/zHaPZZvl6cVHi/giphy.gif"
        longdesc="Pepe Silvia scene from It's Always Sunny in Philadelphia. Jesus, dude, you're still making GIFs. The GIF's don't stop."
        .
      >
        <img
          src="https://media0.giphy.com/media/zHaPZZvl6cVHi/480w_s.jpg"
          alt="It's Always Sunny in Philadelphia GIF Meme"
        />
      </a11y-gif-player>`,
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("a11y-gif-player passes accessibility test", async () => {
    const el = await fixture(html` <a11y-gif-player></a11y-gif-player> `);
    await expect(el).to.be.accessible();
  });
  it("a11y-gif-player passes accessibility negation", async () => {
    const el = await fixture(
      html`<a11y-gif-player
        aria-labelledby="a11y-gif-player"
      ></a11y-gif-player>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("a11y-gif-player can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<a11y-gif-player .foo=${'bar'}></a11y-gif-player>`);
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
      const el = await fixture(html`<a11y-gif-player ></a11y-gif-player>`);
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
      const el = await fixture(html`<a11y-gif-player></a11y-gif-player>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<a11y-gif-player></a11y-gif-player>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
