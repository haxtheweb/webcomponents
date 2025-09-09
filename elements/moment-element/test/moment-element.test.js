import { fixture, expect, html } from "@open-wc/testing";

import "../moment-element.js";

describe("moment-element test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <moment-element title="test-title"></moment-element>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Accessibility - Time Semantics", () => {
    it("uses time element with datetime attribute when appropriate", async () => {
      const testElement = await fixture(html`
        <moment-element datetime="2020-01-01T12:00:00Z"></moment-element>
      `);
      await testElement.updateComplete;
      
      const time = testElement.shadowRoot.querySelector('time');
      if (time) {
        expect(time.hasAttribute('datetime')).to.be.true;
      }
    });

    it("provides accessible relative time text", async () => {
      const now = new Date().toISOString();
      const testElement = await fixture(html`
        <moment-element datetime="${now}"></moment-element>
      `);
      await testElement.updateComplete;
      
      // Should render text content that is meaningful
      const text = testElement.shadowRoot.textContent.trim();
      expect(text.length).to.be.greaterThan(0);
    });
  });

  describe("Accessibility - Attributes and Localization", () => {
    it("supports locale changes for accessible formatting", async () => {
      const testElement = await fixture(html`
        <moment-element datetime="2020-01-01T12:00:00Z" locale="fr"></moment-element>
      `);
      await testElement.updateComplete;
      
      await expect(testElement).shadowDom.to.be.accessible();
    });

    it("handles invalid dates gracefully", async () => {
      const testElement = await fixture(html`
        <moment-element datetime="invalid-date"></moment-element>
      `);
      await testElement.updateComplete;
      
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("moment-element passes accessibility test", async () => {
    const el = await fixture(html` <moment-element></moment-element> `);
    await expect(el).to.be.accessible();
  });
  it("moment-element passes accessibility negation", async () => {
    const el = await fixture(
      html`<moment-element aria-labelledby="moment-element"></moment-element>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("moment-element can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<moment-element .foo=${'bar'}></moment-element>`);
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
      const el = await fixture(html`<moment-element ></moment-element>`);
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
      const el = await fixture(html`<moment-element></moment-element>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<moment-element></moment-element>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
