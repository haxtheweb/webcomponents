import {
  expect,
  fixture,
  html,
  assert,
  elementUpdated,
  fixtureCleanup,
} from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import "../src/anchor-behaviors.js";

/*
 * Instantiation test
 * create element and see if an attribute binds to the element
 */
describe("Instantiation Test", () => {
  it("anchor-behaviors instantiates", async () => {
    const el = await fixture(
      html` <anchor-behaviors title="test-title"></anchor-behaviors> `
    );
    await expect(el.getAttribute("title")).to.equal("test-title");
  });
});

/*
 * A11y Accessibility tests
 */
describe("A11y/chai axe tests", () => {
  it("anchor-behaviors passes accessibility test", async () => {
    const el = await fixture(html` <anchor-behaviors></anchor-behaviors> `);
    await expect(el).to.be.accessible();
  });
  it("anchor-behaviors passes accessibility negation", async () => {
    const el = await fixture(
      html`<anchor-behaviors
        aria-labelledby="anchor-behaviors"
      ></anchor-behaviors>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("anchor-behaviors can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<anchor-behaviors .foo=${'bar'}></anchor-behaviors>`);
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
      const el = await fixture(html`<anchor-behaviors ></anchor-behaviors>`);
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
      const el = await fixture(html`<anchor-behaviors></anchor-behaviors>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<anchor-behaviors></anchor-behaviors>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

// clean up fixtures after all tests are complete
afterEach(() => {
  fixtureCleanup();
});
