import { expect, fixture, html, assert, elementUpdated, fixtureCleanup } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';
import '../src/lrndesign-stepper.js';


/* 
* Instantiation test 
* create element and see if an attribute binds to the element
*/
describe('Instantiation Test', () => {
    it('lrndesign-stepper instantiates', async () => {
      const el = await fixture(html` <lrndesign-stepper title="test-title"></lrndesign-stepper> `);
      await expect(el.getAttribute("title")).to.equal("test-title");
    });
});

/*
* A11y Accessibility tests
*/
describe('A11y/chai axe tests', () => {
    it('lrndesign-stepper passes accessibility test', async () => {
      const el = await fixture(html` <lrndesign-stepper></lrndesign-stepper> `);
      await expect(el).to.be.accessible();
    });
    it('lrndesign-stepper passes accessibility negation', async () => {
        const el = await fixture(html`<lrndesign-stepper aria-labelledby="lrndesign-stepper"></lrndesign-stepper>`);
        await assert.isNotAccessible(el);
    });
});


/*
// Custom properties test
describe("Custom Property Test", () => {
  it("lrndesign-stepper can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<lrndesign-stepper .foo=${'bar'}></lrndesign-stepper>`);
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
      const el = await fixture(html`<lrndesign-stepper ></lrndesign-stepper>`);
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
      const el = await fixture(html`<lrndesign-stepper></lrndesign-stepper>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<lrndesign-stepper></lrndesign-stepper>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

// clean up fixtures after all tests are complete
afterEach(() => {
    fixtureCleanup();
});
