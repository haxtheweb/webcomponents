import { fixture, expect, html } from "@open-wc/testing";

import "../pdf-browser-viewer.js";

describe("pdf-browser-viewer test", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`
      <pdf-browser-viewer title="test-title"></pdf-browser-viewer>
    `);
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("pdf-browser-viewer rendering", () => {
  it("hides without a file and shows with one", async () => {
    const el = await fixture(
      html`<pdf-browser-viewer></pdf-browser-viewer>`,
    );
    await el.updateComplete;
    expect(getComputedStyle(el).display).to.equal("none");
    el.file = "document.pdf";
    await el.updateComplete;
    expect(getComputedStyle(el).display).to.not.equal("none");
    const object = el.shadowRoot.querySelector("object");
    expect(object.getAttribute("data")).to.equal("document.pdf");
    expect(object.getAttribute("type")).to.equal("application/pdf");
    expect(object.getAttribute("width")).to.equal("100%");
    expect(object.getAttribute("height")).to.equal("400px");
    // fallback content for browsers that cannot render pdf objects
    const paragraph = el.shadowRoot.querySelector("object p");
    expect(paragraph.textContent).to.contain(
      "not configured to display PDF files",
    );
    const link = el.shadowRoot.querySelector("object a");
    expect(link.getAttribute("href")).to.equal("document.pdf");
    expect(link.textContent).to.equal("click here to download the PDF file.");
  });

  it("renders the card variant with a download button", async () => {
    // BUG: pdf-browser-viewer.js:70 binds heading but no `heading` property
    // is declared, and downloadLabel/notSupportedMessage declare no dashed
    // `attribute` names, so authoring <pdf-browser-viewer heading="X"
    // download-label="Y" not-supported-message="Z"> silently does nothing
    // under Lit. Setting the properties directly is the only working path.
    const el = await fixture(
      html`<pdf-browser-viewer card file="report.pdf"></pdf-browser-viewer>`,
    );
    el.downloadLabel = "Save it";
    el.elevation = "3";
    await el.updateComplete;
    const cardContent = el.shadowRoot.querySelector(".card-content");
    expect(cardContent).to.exist;
    const card = cardContent.parentElement;
    expect(card.getAttribute("elevation")).to.equal("3");
    const object = cardContent.querySelector("object");
    expect(object.getAttribute("data")).to.equal("report.pdf");
    const button = el.shadowRoot.querySelector(".card-actions button");
    expect(button.textContent.trim()).to.equal("Save it");
    await expect(el).shadowDom.to.be.accessible();
  });

  it("applies custom messages for unsupported browsers", async () => {
    const el = await fixture(
      html`<pdf-browser-viewer file="doc.pdf"></pdf-browser-viewer>`,
    );
    el.notSupportedMessage = "No PDF here";
    el.notSupportedLinkMessage = "grab the file instead";
    await el.updateComplete;
    const paragraph = el.shadowRoot.querySelector("object p");
    expect(paragraph.textContent).to.contain("No PDF here");
    const link = el.shadowRoot.querySelector("object a");
    expect(link.textContent).to.equal("grab the file instead");
  });

  it("clears the file on demand", async () => {
    const el = await fixture(
      html`<pdf-browser-viewer file="gone-soon.pdf"></pdf-browser-viewer>`,
    );
    await el.updateComplete;
    el.clear();
    await el.updateComplete;
    expect(el.file).to.equal(undefined);
    expect(el.hasAttribute("file")).to.be.false;
    expect(getComputedStyle(el).display).to.equal("none");
  });
});

/*
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
