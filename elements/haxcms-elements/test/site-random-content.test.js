import { expect } from "@open-wc/testing";
import "../lib/ui-components/site/site-random-content.js";

// site-random-content reads a page's raw HTML to pick a block from it. That
// HTML is parsed inertly and sanitized at the parse, so an inline handler in
// stored page content never reaches a live element.
describe("site-random-content extractTopLevelElements", () => {
  let element;
  beforeEach(() => {
    element = globalThis.document.createElement("site-random-content");
  });

  it("keeps content blocks and their text", () => {
    const blocks = element.extractTopLevelElements(
      "<p>First paragraph of the page.</p><h2>A heading</h2><style>p{}</style>",
    );
    expect(blocks.map((block) => block.tag)).to.deep.equal(["p", "h2"]);
    expect(blocks[0].text).to.equal("First paragraph of the page.");
  });

  it("strips inline handlers and script URLs at the parse", () => {
    const blocks = element.extractTopLevelElements(
      '<p>Picture <img src="x" onerror="void 0"> and <a href="javascript:void 0">link</a></p>',
    );
    expect(blocks.length).to.equal(1);
    expect(blocks[0].html).to.not.include("onerror");
    expect(blocks[0].html).to.not.include("javascript:");
    expect(blocks[0].text).to.include("Picture");
  });

  it("parses in an inert document, never a live one", () => {
    const created = [];
    const originalCreate = globalThis.document.createElement;
    globalThis.document.createElement = function (tag, ...rest) {
      created.push(String(tag).toLowerCase());
      return originalCreate.call(this, tag, ...rest);
    };
    try {
      element.extractTopLevelElements("<p>Some text in a block.</p>");
    } finally {
      globalThis.document.createElement = originalCreate;
    }
    expect(created).to.not.include("div");
  });
});
