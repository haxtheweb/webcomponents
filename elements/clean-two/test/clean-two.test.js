// local development and mobx
window.process = window.process || {
  env: {
    NODE_ENV: "development",
  },
};
import { fixture, expect, html, assert } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";

import "../clean-two.js";

// Basic functionality and accessibility tests
describe("clean-two basic functionality", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <clean-two></clean-two> `);
  });

  it("should render correctly", () => {
    expect(element).to.exist;
    expect(element.tagName).to.equal("CLEAN-TWO");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("has correct default properties", () => {
    expect(element.searchTerm).to.equal("");
    expect(element.prevPage).to.be.undefined;
    expect(element.nextPage).to.be.undefined;
    expect(element.pageTimestamp).to.be.undefined;
  });
});

// Comprehensive A11y tests
describe("clean-two accessibility tests", () => {
  it("passes accessibility test with default configuration", async () => {
    const el = await fixture(html` <clean-two></clean-two> `);
    await expect(el).to.be.accessible();
  });

  it("has proper semantic HTML structure", async () => {
    const el = await fixture(html` <clean-two></clean-two> `);
    const nav = el.shadowRoot.querySelector("nav");
    const main = el.shadowRoot.querySelector("main");
    const header = el.shadowRoot.querySelector("header");
    const footer = el.shadowRoot.querySelector("footer");
    const article = el.shadowRoot.querySelector("article");

    expect(nav).to.exist;
    expect(main).to.exist;
    expect(header).to.exist;
    expect(footer).to.exist;
    expect(article).to.exist;
  });

  it("maintains accessible navigation structure", async () => {
    const el = await fixture(html` <clean-two></clean-two> `);
    const prevButton = el.shadowRoot.querySelector(
      'site-menu-button[type="prev"]',
    );
    const nextButton = el.shadowRoot.querySelector(
      'site-menu-button[type="next"]',
    );
    const breadcrumb = el.shadowRoot.querySelector("site-breadcrumb");

    expect(prevButton).to.exist;
    expect(nextButton).to.exist;
    expect(breadcrumb).to.exist;
  });

  it("has proper search accessibility", async () => {
    const el = await fixture(html` <clean-two></clean-two> `);
    const searchModal = el.shadowRoot.querySelector("site-modal");
    const searchComponent = el.shadowRoot.querySelector("site-search");

    expect(searchModal).to.exist;
    expect(searchComponent).to.exist;
    expect(searchModal.getAttribute("title")).to.equal("Search site");
  });

  it("maintains accessibility with slotted content", async () => {
    const el = await fixture(html`
      <clean-two>
        <h1>Test Title</h1>
        <p>Test content for accessibility</p>
      </clean-two>
    `);

    await expect(el).to.be.accessible();
  });
});

// Property validation tests
describe("clean-two property validation", () => {
  it("accepts valid searchTerm string", async () => {
    const el = await fixture(
      html`<clean-two .searchTerm=${"test search"}></clean-two>`,
    );
    expect(el.searchTerm).to.equal("test search");
    expect(typeof el.searchTerm).to.equal("string");
  });

  it("accepts valid prevPage string", async () => {
    const el = await fixture(
      html`<clean-two .prevPage=${"Previous Page Title"}></clean-two>`,
    );
    expect(el.prevPage).to.equal("Previous Page Title");
    expect(typeof el.prevPage).to.equal("string");
  });

  it("accepts valid nextPage string", async () => {
    const el = await fixture(
      html`<clean-two .nextPage=${"Next Page Title"}></clean-two>`,
    );
    expect(el.nextPage).to.equal("Next Page Title");
    expect(typeof el.nextPage).to.equal("string");
  });

  it("accepts valid pageTimestamp number", async () => {
    const timestamp = Date.now();
    const el = await fixture(
      html`<clean-two .pageTimestamp=${timestamp}></clean-two>`,
    );
    expect(el.pageTimestamp).to.equal(timestamp);
    expect(typeof el.pageTimestamp).to.equal("number");
  });

  it("updates properties reactively", async () => {
    const el = await fixture(html`<clean-two></clean-two>`);

    el.searchTerm = "new search";
    el.prevPage = "Previous";
    el.nextPage = "Next";
    el.pageTimestamp = 1234567890;

    await el.updateComplete;

    expect(el.searchTerm).to.equal("new search");
    expect(el.prevPage).to.equal("Previous");
    expect(el.nextPage).to.equal("Next");
    expect(el.pageTimestamp).to.equal(1234567890);
  });

  it("validates inherited properties from theme mixins", async () => {
    const el = await fixture(html`<clean-two></clean-two>`);

    // Test that HAXCMSLitElementTheme properties exist
    expect(el.hasOwnProperty("editMode")).to.be.true;
    expect(el.hasOwnProperty("responsiveSize")).to.be.true;
    expect(el.HAXCMSThemeSettings).to.exist;
    expect(typeof el.HAXCMSThemeSettings).to.equal("object");
  });
});

// Slot usage and content tests
describe("clean-two slot usage", () => {
  it("renders default slot content correctly", async () => {
    const testContent = "<p>Test content in slot</p>";
    const el = await fixture(html`<clean-two>${testContent}</clean-two>`);

    const slot = el.shadowRoot.querySelector("#slot slot");
    expect(slot).to.exist;

    const slottedElements = slot.assignedNodes({ flatten: true });
    expect(slottedElements.length).to.be.greaterThan(0);
  });

  it("handles multiple slotted elements with proper structure", async () => {
    const el = await fixture(html`
      <clean-two>
        <h2>Article Title</h2>
        <p>First paragraph</p>
        <p>Second paragraph</p>
        <ul>
          <li>List item</li>
        </ul>
      </clean-two>
    `);

    const slot = el.shadowRoot.querySelector("#slot slot");
    const slottedElements = slot
      .assignedNodes({ flatten: true })
      .filter((node) => node.nodeType === Node.ELEMENT_NODE);
    expect(slottedElements.length).to.equal(4);
  });

  it("maintains slot accessibility with complex nested content", async () => {
    const el = await fixture(html`
      <clean-two>
        <article>
          <header><h1>Main Title</h1></header>
          <section>
            <h2>Section Title</h2>
            <p>Section content</p>
          </section>
          <footer>Footer content</footer>
        </article>
      </clean-two>
    `);

    await expect(el).to.be.accessible();
  });

  it("handles slot content visibility during search", async () => {
    const el = await fixture(html`
      <clean-two>
        <p>This content should be hidden during search</p>
      </clean-two>
    `);

    const contentContainer = el.shadowRoot.querySelector("#contentcontainer");
    expect(contentContainer.hasAttribute("hidden")).to.be.false;

    // Set search term
    el.searchTerm = "test search";
    await el.updateComplete;

    expect(contentContainer.hasAttribute("hidden")).to.be.true;
  });
});

// Search functionality tests
describe("clean-two search functionality", () => {
  it("handles search modal interaction", async () => {
    const el = await fixture(html`<clean-two></clean-two>`);
    const searchModal = el.shadowRoot.querySelector("site-modal");

    expect(searchModal).to.exist;
    expect(searchModal.getAttribute("icon")).to.equal("icons:search");
    expect(searchModal.getAttribute("title")).to.equal("Search site");
  });

  it("shows/hides search results appropriately", async () => {
    const el = await fixture(html`<clean-two></clean-two>`);

    // Initially search should be hidden
    const searchElement = el.shadowRoot.querySelector(
      "site-search[hide-input]",
    );
    expect(searchElement.hasAttribute("hidden")).to.be.true;

    // Set search term
    el.searchTerm = "test";
    await el.updateComplete;

    // Search should now be visible
    expect(searchElement.hasAttribute("hidden")).to.be.false;
    expect(searchElement.getAttribute("search")).to.equal("test");
  });

  it("handles search term changes", async () => {
    const el = await fixture(html`<clean-two></clean-two>`);

    expect(el.searchTerm).to.equal("");

    el.searchTerm = "new search term";
    await el.updateComplete;

    expect(el.searchTerm).to.equal("new search term");
  });
});

// Navigation and menu functionality
describe("clean-two navigation functionality", () => {
  it("renders navigation buttons correctly", async () => {
    const el = await fixture(html`<clean-two></clean-two>`);

    const prevButton = el.shadowRoot.querySelector(
      'site-menu-button[type="prev"]',
    );
    const nextButton = el.shadowRoot.querySelector(
      'site-menu-button[type="next"]',
    );

    expect(prevButton).to.exist;
    expect(nextButton).to.exist;
    expect(prevButton.getAttribute("position")).to.equal("right");
    expect(nextButton.getAttribute("position")).to.equal("left");
  });

  it("handles mobile menu correctly", async () => {
    const el = await fixture(html`<clean-two></clean-two>`);

    const leftCol = el.shadowRoot.querySelector(".left-col");
    expect(leftCol).to.exist;

    // Check that mobile menu button exists
    const mobileMenuButton = el.shadowRoot.querySelector(
      "#haxcmsmobilemenubutton",
    );
    expect(mobileMenuButton).to.exist;
  });

  it("displays menu content appropriately for different screen sizes", async () => {
    const el = await fixture(html`<clean-two></clean-two>`);

    // Test XL responsive size behavior
    el.responsiveSize = "xl";
    await el.updateComplete;

    const rightCol = el.shadowRoot.querySelector(".right-col");
    expect(rightCol).to.exist;
  });
});

// Mobile responsiveness tests
describe("clean-two mobile responsiveness", () => {
  beforeEach(async () => {
    await setViewport({ width: 375, height: 750 });
  });

  afterEach(async () => {
    await setViewport({ width: 1024, height: 768 });
  });

  it("adapts layout for mobile viewport", async () => {
    const el = await fixture(html`<clean-two></clean-two>`);
    expect(el).to.exist;

    await el.updateComplete;
    const computedStyle = getComputedStyle(el);
    expect(computedStyle.display).to.not.equal("none");
  });

  it("shows mobile menu content correctly", async () => {
    const el = await fixture(html`<clean-two></clean-two>`);
    const mobileMenuContent = el.shadowRoot.querySelector(
      "site-menu-content[mobile]",
    );

    // Mobile menu content should exist on smaller screens
    expect(mobileMenuContent).to.exist;
  });

  it("maintains accessibility on mobile", async () => {
    const el = await fixture(html`<clean-two></clean-two>`);
    await expect(el).to.be.accessible();
  });
});

// Desktop responsiveness tests
describe("clean-two desktop responsiveness", () => {
  beforeEach(async () => {
    await setViewport({ width: 1900, height: 1000 });
  });

  afterEach(async () => {
    await setViewport({ width: 1024, height: 768 });
  });

  it("shows right column on XL screens", async () => {
    const el = await fixture(html`<clean-two></clean-two>`);

    // Manually set XL responsive size to test XL behavior
    el.responsiveSize = "xl";
    await el.updateComplete;

    const rightCol = el.shadowRoot.querySelector(".right-col");
    expect(rightCol).to.exist;
  });

  it("adapts navigation for desktop", async () => {
    const el = await fixture(html`<clean-two></clean-two>`);
    const navigation = el.shadowRoot.querySelector(".link-actions");
    expect(navigation).to.exist;
  });
});

// Theme integration and DDD usage tests
describe("clean-two DDD integration", () => {
  it("uses DDD design system tokens", async () => {
    const el = await fixture(html`<clean-two></clean-two>`);

    // Check that DDD CSS custom properties are being used
    const cssText =
      el.constructor.styles[el.constructor.styles.length - 1].cssText;
    expect(cssText).to.include("--ddd-");
    expect(cssText).to.include("var(--ddd-accent-6)");
    expect(cssText).to.include("var(--ddd-primary-4)");
  });

  it("properly extends HAXCMSLitElementTheme with all mixins", async () => {
    const el = await fixture(html`<clean-two></clean-two>`);

    expect(el.HAXCMSThemeSettings).to.exist;
    expect(typeof el.HAXCMSThemeSettings).to.equal("object");

    // Test mixin functionality exists
    expect(typeof el.QRCodeButton).to.equal("function");
    expect(typeof el.PrintBranchButton).to.equal("function");
    expect(typeof el.PDFPageButton).to.equal("function");
  });
});

// Content and layout structure tests
describe("clean-two layout and structure", () => {
  it("renders proper page structure", async () => {
    const el = await fixture(html`<clean-two></clean-two>`);

    const bodyWrapper = el.shadowRoot.querySelector(".body-wrapper");
    const contentWrapper = el.shadowRoot.querySelector(".content-wrapper");
    const leftCol = el.shadowRoot.querySelector(".left-col");

    expect(bodyWrapper).to.exist;
    expect(contentWrapper).to.exist;
    expect(leftCol).to.exist;
  });

  it("includes all required page elements", async () => {
    const el = await fixture(html`<clean-two></clean-two>`);

    const breadcrumb = el.shadowRoot.querySelector("site-breadcrumb");
    const activeTitle = el.shadowRoot.querySelector("site-active-title");
    const activeTags = el.shadowRoot.querySelector("site-active-tags");

    expect(breadcrumb).to.exist;
    expect(activeTitle).to.exist;
    expect(activeTags).to.exist;
  });

  it("renders footer with timestamp correctly", async () => {
    const timestamp = Date.now();
    const el = await fixture(
      html`<clean-two .pageTimestamp=${timestamp}></clean-two>`,
    );

    const dateTime = el.shadowRoot.querySelector("simple-datetime");
    expect(dateTime).to.exist;
    expect(dateTime.hasAttribute("unix")).to.be.true;
    expect(parseInt(dateTime.getAttribute("timestamp"))).to.equal(timestamp);
  });
});

// Error handling and edge cases
describe("clean-two error handling", () => {
  it("handles missing or invalid content gracefully", async () => {
    const el = await fixture(html`<clean-two></clean-two>`);

    expect(el).to.exist;
    await expect(el).to.be.accessible();
  });

  it("maintains functionality with special characters in search", async () => {
    const el = await fixture(html`<clean-two></clean-two>`);

    const specialChars = "!@#$%^&*()[]{}\"'";
    el.searchTerm = specialChars;
    await el.updateComplete;

    expect(el.searchTerm).to.equal(specialChars);
  });

  it("handles rapid property changes", async () => {
    const el = await fixture(html`<clean-two></clean-two>`);

    // Rapidly change multiple properties
    for (let i = 0; i < 5; i++) {
      el.searchTerm = `search ${i}`;
      el.prevPage = `prev ${i}`;
      el.nextPage = `next ${i}`;
    }

    await el.updateComplete;
    expect(el.searchTerm).to.equal("search 4");
    expect(el.prevPage).to.equal("prev 4");
    expect(el.nextPage).to.equal("next 4");
  });

  it("handles undefined pageTimestamp gracefully", async () => {
    const el = await fixture(html`<clean-two></clean-two>`);

    expect(el.pageTimestamp).to.be.undefined;

    const dateTime = el.shadowRoot.querySelector("simple-datetime");
    expect(dateTime).to.exist;
  });
});
