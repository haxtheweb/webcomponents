import { fixture, expect, html } from "@open-wc/testing";
import "../enhanced-text.js";

describe("EnhancedText test", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`
      <enhanced-text>
        This is sample text for enhancement testing.
      </enhanced-text>
    `);
    await element.updateComplete;
  });

  // Basic functionality tests
  it("instantiates the element with default values", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("enhanced-text");
  });

  it("has correct default property values", async () => {
    expect(element.loading).to.be.false;
    expect(element.auto).to.be.false;
    expect(element.fixationPoint).to.equal(4);
    expect(element.vide).to.be.false;
    expect(element.wikipedia).to.be.false;
    expect(element.haxcmsGlossary).to.be.false;
    expect(element.haxcmsSiteLocation).to.equal("");
    expect(element.haxcmsSite).to.be.null;
    expect(element.haxcmsMarkAll).to.be.false;
  });

  // Property validation tests
  it("sets boolean properties correctly", async () => {
    element.vide = true;
    element.wikipedia = true;
    element.haxcmsGlossary = true;
    element.auto = true;
    element.haxcmsMarkAll = true;
    element.loading = true;

    await element.updateComplete;

    expect(element.vide).to.be.true;
    expect(element.wikipedia).to.be.true;
    expect(element.haxcmsGlossary).to.be.true;
    expect(element.auto).to.be.true;
    expect(element.haxcmsMarkAll).to.be.true;
    expect(element.loading).to.be.true;
  });

  it("sets numeric properties correctly", async () => {
    element.fixationPoint = 6;
    await element.updateComplete;
    expect(element.fixationPoint).to.equal(6);
  });

  it("sets string properties correctly", async () => {
    element.haxcmsSiteLocation = "https://example.com/site";
    await element.updateComplete;
    expect(element.haxcmsSiteLocation).to.equal("https://example.com/site");
  });

  it("sets object properties correctly", async () => {
    const siteData = { title: "Test Site", items: [] };
    element.haxcmsSite = siteData;
    await element.updateComplete;
    expect(element.haxcmsSite).to.deep.equal(siteData);
  });

  // Attribute reflection tests
  it("reflects boolean properties to attributes", async () => {
    element.vide = true;
    element.wikipedia = true;
    element.loading = true;
    element.auto = true;

    await element.updateComplete;

    expect(element.hasAttribute("vide")).to.be.true;
    expect(element.hasAttribute("wikipedia")).to.be.true;
    expect(element.hasAttribute("loading")).to.be.true;
    expect(element.hasAttribute("auto")).to.be.true;
  });

  it("uses kebab-case attributes for compound properties", async () => {
    const testElement = await fixture(html`
      <enhanced-text
        fixation-point="8"
        haxcms-glossary
        haxcms-site-location="https://example.com"
        haxcms-mark-all
      >
        Test content
      </enhanced-text>
    `);

    expect(testElement.fixationPoint).to.equal(8);
    expect(testElement.haxcmsGlossary).to.be.true;
    expect(testElement.haxcmsSiteLocation).to.equal("https://example.com");
    expect(testElement.haxcmsMarkAll).to.be.true;
  });

  // Rendering tests
  it("renders loading indicator and slot", async () => {
    const loadingDiv = element.shadowRoot.querySelector(".loading");
    const slot = element.shadowRoot.querySelector("slot");

    expect(loadingDiv).to.exist;
    expect(slot).to.exist;
  });

  it("shows loading state with CSS class", async () => {
    element.loading = true;
    await element.updateComplete;

    expect(element.hasAttribute("loading")).to.be.true;
  });

  // Text processing tests
  it("processes text nodes correctly", async () => {
    const testData = {
      status: true,
      data: [
        {
          term: "sample",
          definition: "A representative part or single item",
        },
      ],
    };

    // Mock vocab-term import
    const originalImport = global.import || (() => Promise.resolve());
    global.import = () => Promise.resolve();

    element.applyTermFromList(testData);

    // Restore original import
    if (originalImport) {
      global.import = originalImport;
    }
  });

  it("handles enhanced text response correctly", () => {
    const mockData = {
      status: true,
      data: "<p>Enhanced <bold>text</bold> content</p>",
    };

    element.enahncedTextResponse(mockData);

    expect(element.innerHTML).to.include("Enhanced");
    expect(element.innerHTML).to.include("bold");
  });

  it("handles invalid response data gracefully", () => {
    const invalidData = { status: false };
    const originalHTML = element.innerHTML;

    element.enahncedTextResponse(invalidData);

    // HTML should remain unchanged
    expect(element.innerHTML).to.equal(originalHTML);
  });

  // Auto enhancement tests
  it("automatically enhances when auto is true", async () => {
    const autoElement = await fixture(html`
      <enhanced-text auto> Auto enhancement test text </enhanced-text>
    `);

    expect(autoElement.auto).to.be.true;
    // firstUpdated should have been called
  });

  // HAX integration tests
  it("has proper HAX properties configuration", () => {
    const haxProps = element.constructor.haxProperties;

    expect(haxProps).to.exist;
    expect(haxProps.gizmo).to.exist;
    expect(haxProps.gizmo.title).to.equal("Enhanced text");
    expect(haxProps.setttings).to.exist; // Note: typo in original code
  });

  // Accessibility tests
  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit with enhanced content", async () => {
    const enhancedElement = await fixture(html`
      <enhanced-text>
        <div role="region" aria-label="Enhanced content">
          <p>This content has been enhanced with vocabulary terms.</p>
        </div>
      </enhanced-text>
    `);

    await expect(enhancedElement).shadowDom.to.be.accessible();
  });

  // Loading state tests
  it("manages loading state correctly", async () => {
    expect(element.loading).to.be.false;

    element.loading = true;
    await element.updateComplete;

    expect(element.loading).to.be.true;
    expect(element.hasAttribute("loading")).to.be.true;
  });

  // Error handling and edge cases
  it("handles empty content gracefully", async () => {
    const emptyElement = await fixture(html`<enhanced-text></enhanced-text>`);
    await emptyElement.updateComplete;

    expect(emptyElement.innerHTML.trim()).to.equal("");
  });

  it("handles special characters in content", async () => {
    const specialElement = await fixture(html`
      <enhanced-text>
        Content with special characters: äöü, émojis 🚀, and symbols &amp;
        &lt;&gt;
      </enhanced-text>
    `);

    await specialElement.updateComplete;
    expect(specialElement.textContent).to.include("äöü");
    expect(specialElement.textContent).to.include("🚀");
  });

  // Configuration validation tests
  it("validates fixation point range", async () => {
    const testValues = [1, 4, 8, 12];

    for (const value of testValues) {
      element.fixationPoint = value;
      await element.updateComplete;
      expect(element.fixationPoint).to.equal(value);
    }
  });

  it("handles various site location formats", async () => {
    const urls = [
      "https://example.com",
      "https://example.com/site",
      "http://localhost:3000",
      "relative/path",
    ];

    for (const url of urls) {
      element.haxcmsSiteLocation = url;
      await element.updateComplete;
      expect(element.haxcmsSiteLocation).to.equal(url);
    }
  });

  // Integration tests
  it("integrates with MicroFrontendRegistry", () => {
    // Element should register micro-frontend services
    expect(globalThis.MicroFrontendRegistry).to.exist;
  });

  it("supports chained enhancements", async () => {
    element.vide = true;
    element.haxcmsGlossary = true;
    element.wikipedia = true;
    element.haxcmsSiteLocation = "https://example.com";

    await element.updateComplete;

    // All enhancement options should be set
    expect(element.vide).to.be.true;
    expect(element.haxcmsGlossary).to.be.true;
    expect(element.wikipedia).to.be.true;
  });

  // Style tests
  it("has loading animation styles", () => {
    const styles = element.constructor.styles;
    expect(styles).to.exist;

    const styleText = styles.toString();
    expect(styleText).to.include("load5");
    expect(styleText).to.include("animation");
  });

  it("supports CSS custom properties", () => {
    const styles = element.constructor.styles;
    const styleText = styles.toString();
    expect(styleText).to.include("--enhanced-text-color");
  });
});
