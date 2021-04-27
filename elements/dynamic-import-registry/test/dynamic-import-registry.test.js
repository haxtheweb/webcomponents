import {
  expect,
  fixture,
  html,
  assert,
  elementUpdated,
  fixtureCleanup,
} from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import "../src/dynamic-import-registry.js";

/*
 * Instantiation test
 * create element and see if an attribute binds to the element
 */
describe("Instantiation Test", () => {
  it("dynamic-import-registry instantiates", async () => {
    const el = await fixture(
      html`
        <dynamic-import-registry title="test-title"></dynamic-import-registry>
      `
    );
    await expect(el.getAttribute("title")).to.equal("test-title");
  });
});

/*
 * A11y Accessibility tests
 */
describe("A11y/chai axe tests", () => {
  it("dynamic-import-registry passes accessibility test", async () => {
    const el = await fixture(
      html` <dynamic-import-registry></dynamic-import-registry> `
    );
    await expect(el).to.be.accessible();
  });
  it("dynamic-import-registry passes accessibility negation", async () => {
    const el = await fixture(
      html`<dynamic-import-registry
        aria-labelledby="dynamic-import-registry"
      ></dynamic-import-registry>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("dynamic-import-registry can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<dynamic-import-registry .foo=${'bar'}></dynamic-import-registry>`);
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
      const el = await fixture(html`<dynamic-import-registry ></dynamic-import-registry>`);
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
      const el = await fixture(html`<dynamic-import-registry></dynamic-import-registry>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<dynamic-import-registry></dynamic-import-registry>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

// clean up fixtures after all tests are complete
afterEach(() => {
  fixtureCleanup();
});
