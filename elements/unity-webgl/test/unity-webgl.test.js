import { expect, fixture, html, assert, elementUpdated, fixtureCleanup } from '@open-wc/testing';
import { setViewport } from '@web/test-runner-commands';
import '../src/unity-webgl.js';


/* 
* Instantiation test 
* create element and see if an attribute binds to the element
*/
describe('Instantiation Test', () => {
    it('unity-webgl instantiates', async () => {
      const el = await fixture(html` <unity-webgl title="test-title"></unity-webgl> `);
      await expect(el.getAttribute("title")).to.equal("test-title");
    });
});

/*
* A11y Accessibility tests
*/
describe('A11y/chai axe tests', () => {
    it('unity-webgl passes accessibility test', async () => {
      const el = await fixture(html` <unity-webgl></unity-webgl> `);
      await expect(el).to.be.accessible();
    });
    it('unity-webgl passes accessibility negation', async () => {
        const el = await fixture(html`<unity-webgl aria-labelledby="unity-webgl"></unity-webgl>`);
        await assert.isNotAccessible(el);
    });
});


/*
// Custom properties test
describe("Custom Property Test", () => {
  it("unity-webgl can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<unity-webgl .foo=${'bar'}></unity-webgl>`);
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
      const el = await fixture(html`<unity-webgl ></unity-webgl>`);
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
      const el = await fixture(html`<unity-webgl></unity-webgl>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<unity-webgl></unity-webgl>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

// clean up fixtures after all tests are complete
afterEach(() => {
    fixtureCleanup();
});
