import { expect, fixture, html, assert, elementUpdated, fixtureCleanup } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';
import '../src/lrnsys-randomimage.js';


/* 
* Instantiation test 
* create element and see if an attribute binds to the element
*/
describe('Instantiation Test', () => {
    it('lrnsys-randomimage instantiates', async () => {
      const el = await fixture(html` <lrnsys-randomimage title="test-title"></lrnsys-randomimage> `);
      await expect(el.getAttribute("title")).to.equal("test-title");
    });
});

/*
* A11y Accessibility tests
*/
describe('A11y/chai axe tests', () => {
    it('lrnsys-randomimage passes accessibility test', async () => {
      const el = await fixture(html` <lrnsys-randomimage></lrnsys-randomimage> `);
      await expect(el).to.be.accessible();
    });
    it('lrnsys-randomimage passes accessibility negation', async () => {
        const el = await fixture(html`<lrnsys-randomimage aria-labelledby="lrnsys-randomimage"></lrnsys-randomimage>`);
        await assert.isNotAccessible(el);
    });
});


/*
// Custom properties test
describe("Custom Property Test", () => {
  it("lrnsys-randomimage can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<lrnsys-randomimage .foo=${'bar'}></lrnsys-randomimage>`);
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
      const el = await fixture(html`<lrnsys-randomimage ></lrnsys-randomimage>`);
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
      const el = await fixture(html`<lrnsys-randomimage></lrnsys-randomimage>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<lrnsys-randomimage></lrnsys-randomimage>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

// clean up fixtures after all tests are complete
afterEach(() => {
    fixtureCleanup();
});
