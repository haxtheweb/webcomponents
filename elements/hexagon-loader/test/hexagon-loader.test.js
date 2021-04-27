import {
  expect,
  fixture,
  html,
  assert,
  elementUpdated,
  fixtureCleanup,
} from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import "../src/hexagon-loader.js";

/*
 * Instantiation test
 * create element and see if an attribute binds to the element
 */
describe("Instantiation Test", () => {
  it("hexagon-loader instantiates", async () => {
    const el = await fixture(
      html` <hexagon-loader title="test-title"></hexagon-loader> `
    );
    await expect(el.getAttribute("title")).to.equal("test-title");
  });
});

/*
 * A11y Accessibility tests
 */
describe("A11y/chai axe tests", () => {
  it("hexagon-loader passes accessibility test", async () => {
    const el = await fixture(html` <hexagon-loader></hexagon-loader> `);
    await expect(el).to.be.accessible();
  });
  it("hexagon-loader passes accessibility negation", async () => {
    const el = await fixture(
      html`<hexagon-loader aria-labelledby="hexagon-loader"></hexagon-loader>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("hexagon-loader can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<hexagon-loader .foo=${'bar'}></hexagon-loader>`);
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
      const el = await fixture(html`<hexagon-loader ></hexagon-loader>`);
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
      const el = await fixture(html`<hexagon-loader></hexagon-loader>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<hexagon-loader></hexagon-loader>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

// clean up fixtures after all tests are complete
afterEach(() => {
  fixtureCleanup();
});
