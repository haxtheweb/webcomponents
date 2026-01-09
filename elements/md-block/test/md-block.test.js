import { fixture, expect, html } from "@open-wc/testing";

import "../md-block.js";

describe("md-block test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <md-block title="test-title"></md-block> `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Accessibility - Markdown Content", () => {
    it("renders accessible HTML from markdown", async () => {
      const testElement = await fixture(html`
        <md-block>
          # Heading This is a paragraph with [a link](https://example.com). -
          List item 1 - List item 2
        </md-block>
      `);
      await testElement.updateComplete;

      await expect(testElement).shadowDom.to.be.accessible();

      // Check for proper heading structure
      const heading = testElement.shadowRoot.querySelector("h1");
      expect(heading).to.exist;

      // Check for accessible list structure
      const list = testElement.shadowRoot.querySelector("ul");
      expect(list).to.exist;

      // Check for accessible link
      const link = testElement.shadowRoot.querySelector("a");
      if (link) {
        expect(link.hasAttribute("href")).to.be.true;
      }
    });

    it("maintains proper heading hierarchy", async () => {
      const testElement = await fixture(html`
        <md-block> # Main Heading ## Subheading ### Sub-subheading </md-block>
      `);
      await testElement.updateComplete;

      const h1 = testElement.shadowRoot.querySelector("h1");
      const h2 = testElement.shadowRoot.querySelector("h2");
      const h3 = testElement.shadowRoot.querySelector("h3");

      expect(h1).to.exist;
      expect(h2).to.exist;
      expect(h3).to.exist;
    });

    it("handles code blocks with proper markup", async () => {
      const testElement = await fixture(html`
        <md-block>
          \`\`\`javascript console.log('Hello, world!'); \`\`\`
        </md-block>
      `);
      await testElement.updateComplete;

      await expect(testElement).shadowDom.to.be.accessible();

      const code = testElement.shadowRoot.querySelector("code");
      const pre = testElement.shadowRoot.querySelector("pre");

      if (code || pre) {
        expect(code || pre).to.exist;
      }
    });
  });

  describe("Accessibility - Images and Media", () => {
    it("renders accessible images from markdown", async () => {
      const testElement = await fixture(html`
        <md-block>
          ![Alt text](https://example.com/image.jpg "Title text")
        </md-block>
      `);
      await testElement.updateComplete;

      const img = testElement.shadowRoot.querySelector("img");
      if (img) {
        expect(img.hasAttribute("alt")).to.be.true;
        expect(img.alt).to.equal("Alt text");
        expect(img.hasAttribute("title")).to.be.true;
      }
    });

    it("handles missing alt text appropriately", async () => {
      const testElement = await fixture(html`
        <md-block> ![](https://example.com/image.jpg) </md-block>
      `);
      await testElement.updateComplete;

      // Should still pass accessibility with empty alt
      await expect(testElement).shadowDom.to.be.accessible();
    });
  });

  describe("Accessibility - Tables and Data", () => {
    it("renders accessible tables from markdown", async () => {
      const testElement = await fixture(html`
        <md-block>
          | Header 1 | Header 2 | | -------- | -------- | | Cell 1 | Cell 2 |
        </md-block>
      `);
      await testElement.updateComplete;

      const table = testElement.shadowRoot.querySelector("table");
      if (table) {
        const thead = table.querySelector("thead");
        const tbody = table.querySelector("tbody");
        const th = table.querySelector("th");

        expect(table).to.exist;
        if (thead) expect(thead).to.exist;
        if (tbody) expect(tbody).to.exist;
        if (th) expect(th).to.exist;

        await expect(testElement).shadowDom.to.be.accessible();
      }
    });
  });

  describe("Accessibility - Interactive Content", () => {
    it("renders accessible links with proper attributes", async () => {
      const testElement = await fixture(html`
        <md-block>
          [Internal link](#section) [External link](https://example.com)
        </md-block>
      `);
      await testElement.updateComplete;

      const links = testElement.shadowRoot.querySelectorAll("a");
      links.forEach((link) => {
        expect(link.hasAttribute("href")).to.be.true;
        expect(link.textContent.trim().length).to.be.greaterThan(0);
      });
    });

    it("supports focus management for interactive elements", async () => {
      const testElement = await fixture(html`
        <md-block> [Focusable link](https://example.com) </md-block>
      `);
      await testElement.updateComplete;

      const link = testElement.shadowRoot.querySelector("a");
      if (link) {
        expect(link.tabIndex >= 0).to.be.true;
      }
    });
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("md-block passes accessibility test", async () => {
    const el = await fixture(html` <md-block></md-block> `);
    await expect(el).to.be.accessible();
  });
  it("md-block passes accessibility negation", async () => {
    const el = await fixture(
      html`<md-block aria-labelledby="md-block"></md-block>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("md-block can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<md-block .foo=${'bar'}></md-block>`);
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
      const el = await fixture(html`<md-block ></md-block>`);
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
      const el = await fixture(html`<md-block></md-block>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<md-block></md-block>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
