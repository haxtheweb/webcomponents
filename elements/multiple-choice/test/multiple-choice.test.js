import { fixture, expect, html } from "@open-wc/testing";

import "../multiple-choice.js";

describe("multiple-choice test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(
      html`<multiple-choice
        id="basic"
        name="basic"
        title="Which are ducks????"
        randomize
        question="Which are ducks?"
      >
        <input correct value="Huey" />
        <input correct value="Duey" />
        <input correct value="Daffy" />
        <input correct value="Donald" />
        <input value="Mickey" />
        <p slot="correct-feedback">Yay! Let's jump in the money pit.</p>
        <p slot="incorrect-feedback">You're despicable. What a quack!</p>
      </multiple-choice>`,
    );
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("multiple-choice passes accessibility test", async () => {
    const el = await fixture(html` <multiple-choice></multiple-choice> `);
    await expect(el).to.be.accessible();
  });
  it("multiple-choice passes accessibility negation", async () => {
    const el = await fixture(
      html`<multiple-choice
        aria-labelledby="multiple-choice"
      ></multiple-choice>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("multiple-choice can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<multiple-choice .foo=${'bar'}></multiple-choice>`);
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
      const el = await fixture(html`<multiple-choice ></multiple-choice>`);
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
      const el = await fixture(html`<multiple-choice></multiple-choice>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<multiple-choice></multiple-choice>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
