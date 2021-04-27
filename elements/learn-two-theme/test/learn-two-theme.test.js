import {
  expect,
  fixture,
  html,
  assert,
  elementUpdated,
  fixtureCleanup,
} from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import "../src/learn-two-theme.js";

/*
 * Instantiation test
 * create element and see if an attribute binds to the element
 */
describe("Instantiation Test", () => {
  it("learn-two-theme instantiates", async () => {
    const el = await fixture(
      html` <learn-two-theme title="test-title"></learn-two-theme> `
    );
    await expect(el.getAttribute("title")).to.equal("test-title");
  });
});

/*
 * A11y Accessibility tests
 */
describe("A11y/chai axe tests", () => {
  it("learn-two-theme passes accessibility test", async () => {
    const el = await fixture(html` <learn-two-theme></learn-two-theme> `);
    await expect(el).to.be.accessible();
  });
  it("learn-two-theme passes accessibility negation", async () => {
    const el = await fixture(
      html`<learn-two-theme
        aria-labelledby="learn-two-theme"
      ></learn-two-theme>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("learn-two-theme can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<learn-two-theme .foo=${'bar'}></learn-two-theme>`);
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
      const el = await fixture(html`<learn-two-theme ></learn-two-theme>`);
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
      const el = await fixture(html`<learn-two-theme></learn-two-theme>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<learn-two-theme></learn-two-theme>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

// clean up fixtures after all tests are complete
afterEach(() => {
  fixtureCleanup();
});
