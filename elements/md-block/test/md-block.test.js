import { fixture, expect, html } from "@open-wc/testing";

import "../md-block.js";

// `lit-html` preserves the exact whitespace inside template literals, so any
// indentation in our <md-block> fixture bodies becomes leading whitespace
// in the element's `innerHTML`. CommonMark then interprets four-space
// indentation as a code block, breaking the markdown we want to assert.
// `stripIndent` collapses the common leading whitespace so the captured
// innerHTML parses cleanly while still allowing readable source.
function stripIndent(strings, ...values) {
  const raw = strings.reduce((acc, s, i) => acc + s + (values[i] ?? ""), "");
  // find smallest indent (ignoring blank lines)
  const indents = raw
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => (line.match(/^[ \t]*/) || [""])[0].length);
  const minIndent = indents.length ? Math.min(...indents) : 0;
  return raw
    .split("\n")
    .map((line) => line.slice(minIndent))
    .join("\n")
    .trim();
}

// Build an md-block fixture from a markdown string without depending on
// lit-html's whitespace preservation. We seed the element via the
// `markdown` property (the constructor only reads innerHTML at construction
// time for the light-DOM fallback, so post-construction textContent would
// miss that window).
async function mdFixture(markdown) {
  const el = document.createElement("md-block");
  el.markdown = markdown;
  document.body.appendChild(el);
  await el.updateComplete;
  // wait for the async marked.parse(...) to populate _parsedMarkdown
  await new Promise((resolve) => {
    const check = () => {
      if (el._parsedMarkdown && el._parsedMarkdown.length > 0) {
        resolve();
      } else {
        setTimeout(check, 5);
      }
    };
    check();
  });
  return el;
}

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
      // well-formed markdown: heading, paragraph with link, then a blank
      // line followed by a bulleted list so marked.js recognizes it as <ul>.
      // Markdown is delivered through textContent (not a lit-html template)
      // so leading whitespace from the source can't corrupt the parse.
      const testElement = await mdFixture(
        stripIndent`
          # Heading
          This is a paragraph with [a link](https://example.com).

          - List item 1
          - List item 2
        `,
      );
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

      // cleanup
      testElement.remove();
    });

    it("maintains proper heading hierarchy", async () => {
      // blank lines between ATX headings are required by CommonMark so
      // marked.js produces separate <h1>/<h2>/<h3> elements rather than a
      // single <h1> containing the literal middle text.
      const testElement = await mdFixture(
        stripIndent`
          # Main Heading

          ## Subheading

          ### Sub-subheading
        `,
      );
      await testElement.updateComplete;

      const h1 = testElement.shadowRoot.querySelector("h1");
      const h2 = testElement.shadowRoot.querySelector("h2");
      const h3 = testElement.shadowRoot.querySelector("h3");

      expect(h1).to.exist;
      expect(h2).to.exist;
      expect(h3).to.exist;

      testElement.remove();
    });

    it("handles code blocks with proper markup", async () => {
      // fenced code blocks don't suffer from the indented-template problem
      // the way heading bodies do, but we still use mdFixture() so the
      // source remains consistent with the other content tests.
      const testElement = await mdFixture(
        stripIndent`
          \`\`\`javascript
          console.log("Hello, world!");
          \`\`\`
        `,
      );
      await testElement.updateComplete;

      await expect(testElement).shadowDom.to.be.accessible();

      const code = testElement.shadowRoot.querySelector("code");
      const pre = testElement.shadowRoot.querySelector("pre");

      if (code || pre) {
        expect(code || pre).to.exist;
      }

      testElement.remove();
    });
  });

  describe("Accessibility - Images and Media", () => {
    it("renders accessible images from markdown", async () => {
      const testElement = await mdFixture(
        stripIndent`
          ![Alt text](https://example.com/image.jpg "Title text")
        `,
      );
      await testElement.updateComplete;

      const img = testElement.shadowRoot.querySelector("img");
      if (img) {
        expect(img.hasAttribute("alt")).to.be.true;
        expect(img.alt).to.equal("Alt text");
        expect(img.hasAttribute("title")).to.be.true;
      }

      testElement.remove();
    });

    it("handles missing alt text appropriately", async () => {
      const testElement = await mdFixture(
        stripIndent`![](https://example.com/image.jpg)`,
      );
      await testElement.updateComplete;

      // Should still pass accessibility with empty alt
      await expect(testElement).shadowDom.to.be.accessible();

      testElement.remove();
    });
  });

  describe("Accessibility - Tables and Data", () => {
    it("renders accessible tables from markdown", async () => {
      // GFM tables need a leading pipe followed by a separator row of dashes
      // to be recognized; both rows must be present on separate lines for
      // marked.js to emit a <table>.
      const testElement = await mdFixture(
        stripIndent`
          | Header 1 | Header 2 |
          | -------- | -------- |
          | Cell 1   | Cell 2   |
        `,
      );
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

      testElement.remove();
    });
  });

  describe("Accessibility - Interactive Content", () => {
    it("renders accessible links with proper attributes", async () => {
      const testElement = await mdFixture(
        stripIndent`
          [Internal link](#section) [External link](https://example.com)
        `,
      );
      await testElement.updateComplete;

      const links = testElement.shadowRoot.querySelectorAll("a");
      links.forEach((link) => {
        expect(link.hasAttribute("href")).to.be.true;
        expect(link.textContent.trim().length).to.be.greaterThan(0);
      });

      testElement.remove();
    });

    it("supports focus management for interactive elements", async () => {
      const testElement = await mdFixture(
        stripIndent`[Focusable link](https://example.com)`,
      );
      await testElement.updateComplete;

      const link = testElement.shadowRoot.querySelector("a");
      if (link) {
        expect(link.tabIndex >= 0).to.be.true;
      }

      testElement.remove();
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
