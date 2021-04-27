import {
  expect,
  fixture,
  html,
  assert,
  elementUpdated,
  fixtureCleanup,
} from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import "../src/pdf-browser-viewer.js";

/*
 * Instantiation test
 * create element and see if an attribute binds to the element
 */
describe("Instantiation Test", () => {
  it("pdf-browser-viewer instantiates", async () => {
    const el = await fixture(
      html` <pdf-browser-viewer title="test-title"></pdf-browser-viewer> `
    );
    await expect(el.getAttribute("title")).to.equal("test-title");
  });
});

/*
 * A11y Accessibility tests
 */
describe("A11y/chai axe tests", () => {
  it("pdf-browser-viewer passes accessibility test", async () => {
    const el = await fixture(html` <pdf-browser-viewer></pdf-browser-viewer> `);
    await expect(el).to.be.accessible();
  });
  it("pdf-browser-viewer passes accessibility negation", async () => {
    const el = await fixture(
      html`<pdf-browser-viewer
        aria-labelledby="pdf-browser-viewer"
      ></pdf-browser-viewer>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("pdf-browser-viewer can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<pdf-browser-viewer .foo=${'bar'}></pdf-browser-viewer>`);
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
      const el = await fixture(html`<pdf-browser-viewer ></pdf-browser-viewer>`);
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
      const el = await fixture(html`<pdf-browser-viewer></pdf-browser-viewer>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<pdf-browser-viewer></pdf-browser-viewer>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */

// clean up fixtures after all tests are complete
afterEach(() => {
  fixtureCleanup();
});
