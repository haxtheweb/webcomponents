import { fixture, expect, html } from "@open-wc/testing";

import "../self-check.js";

describe("self-check test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<self-check
        accent-color="light-blue"
        title="Sharks Self Check"
        image="https://upload.wikimedia.org/wikipedia/commons/5/56/White_shark.jpg"
        alt="Great White Shark"
      >
        <span slot="question"
          >How large can the average great white shark grow to be?</span
        >
        The Great White shark can grow to be 15 ft to more than 20 ft in length
        and weigh 2.5 tons or more.
      </self-check>`,
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("self-check passes accessibility test", async () => {
    const el = await fixture(html` <self-check></self-check> `);
    await expect(el).to.be.accessible();
  });
  it("self-check passes accessibility negation", async () => {
    const el = await fixture(
      html`<self-check aria-labelledby="self-check"></self-check>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("self-check can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<self-check .foo=${'bar'}></self-check>`);
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
      const el = await fixture(html`<self-check ></self-check>`);
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
      const el = await fixture(html`<self-check></self-check>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<self-check></self-check>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
