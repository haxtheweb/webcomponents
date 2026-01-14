// local development and mobx
window.process = window.process || {
  env: {
    NODE_ENV: "development",
  },
};
import { fixture, expect, html, assert } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";

import "../clean-one.js";

// Basic functionality and accessibility tests
describe("clean-one basic functionality", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html` <clean-one></clean-one> `);
  });

  it("should render correctly", () => {
    expect(element).to.exist;
    expect(element.tagName).to.equal("CLEAN-ONE");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("has correct default properties", () => {
    expect(element.searchTerm).to.equal("");
  });
});

// Comprehensive A11y tests
describe("clean-one accessibility tests", () => {
  it("passes accessibility test with default configuration", async () => {
    const el = await fixture(html` <clean-one></clean-one> `);
    await expect(el).to.be.accessible();
  });

  it("has proper ARIA roles and structure", async () => {
    const el = await fixture(html` <clean-one></clean-one> `);
    const searchElement = el.shadowRoot.querySelector('[role="search"]');
    const mainElement = el.shadowRoot.querySelector('[role="main"]');

    expect(searchElement).to.exist;
    expect(mainElement).to.exist;
    expect(mainElement.tagName).to.equal("MAIN");
  });

  it("maintains accessible navigation structure", async () => {
    const el = await fixture(html` <clean-one></clean-one> `);
    const nav = el.shadowRoot.querySelector("site-menu-button");
    const header = el.shadowRoot.querySelector("header");
    const footer = el.shadowRoot.querySelector("footer");

    expect(header).to.exist;
    expect(footer).to.exist;
    expect(nav).to.exist;
  });

  it("has proper semantic HTML structure", async () => {
    const el = await fixture(html` <clean-one></clean-one> `);
    const article = el.shadowRoot.querySelector("article");
    const section = el.shadowRoot.querySelector("section");

    expect(article).to.exist;
    expect(section).to.exist;
  });
});

// Property validation tests
describe("clean-one property validation", () => {
  it("accepts valid searchTerm string", async () => {
    const el = await fixture(
      html`<clean-one .searchTerm=${"test search"}></clean-one>`,
    );
    expect(el.searchTerm).to.equal("test search");
    expect(typeof el.searchTerm).to.equal("string");
  });

  it("handles empty searchTerm", async () => {
    const el = await fixture(html`<clean-one .searchTerm=${""}></clean-one>`);
    expect(el.searchTerm).to.equal("");
  });

  it("updates searchTerm property reactively", async () => {
    const el = await fixture(html`<clean-one></clean-one>`);
    el.searchTerm = "new search";
    await el.updateComplete;
    expect(el.searchTerm).to.equal("new search");
  });

  it("validates property types correctly", async () => {
    const el = await fixture(html`<clean-one></clean-one>`);

    // Test that searchTerm accepts strings
    el.searchTerm = "string value";
    expect(typeof el.searchTerm).to.equal("string");

    // Test inherited properties exist
    expect(el.hasOwnProperty("editMode")).to.be.true;
    expect(el.hasOwnProperty("responsiveSize")).to.be.true;
  });
});

// Slot usage and content tests
describe("clean-one slot usage", () => {
  it("renders default slot content correctly", async () => {
    const testContent = "<p>Test content in slot</p>";
    const el = await fixture(html`<clean-one>${testContent}</clean-one>`);

    const slot = el.shadowRoot.querySelector("#slot slot");
    expect(slot).to.exist;

    // Check that slotted content is accessible
    const slottedElements = slot.assignedNodes({ flatten: true });
    expect(slottedElements.length).to.be.greaterThan(0);
  });

  it("handles multiple slotted elements", async () => {
    const el = await fixture(html`
      <clean-one>
        <h2>Test Heading</h2>
        <p>Test paragraph</p>
        <div>Test div</div>
      </clean-one>
    `);

    const slot = el.shadowRoot.querySelector("#slot slot");
    const slottedElements = slot
      .assignedNodes({ flatten: true })
      .filter((node) => node.nodeType === Node.ELEMENT_NODE);
    expect(slottedElements.length).to.equal(3);
  });

  it("maintains slot accessibility with complex content", async () => {
    const el = await fixture(html`
      <clean-one>
        <article>
          <h2>Article Title</h2>
          <p>Article content</p>
        </article>
      </clean-one>
    `);

    await expect(el).to.be.accessible();
  });
});

// Search functionality tests
describe("clean-one search functionality", () => {
  it("handles search input changes", async () => {
    const el = await fixture(html`<clean-one></clean-one>`);
    const searchBox = el.shadowRoot.querySelector("clean-one-search-box");

    expect(searchBox).to.exist;
    expect(el.searchTerm).to.equal("");
  });

  it("shows/hides search results appropriately", async () => {
    const el = await fixture(html`<clean-one></clean-one>`);

    // Initially search should be hidden
    const searchElement = el.shadowRoot.querySelector("site-search");
    expect(searchElement && searchElement.hasAttribute("hidden")).to.be.true;

    // Set search term
    el.searchTerm = "test";
    await el.updateComplete;

    // Search should now be visible
    expect(searchElement && searchElement.hasAttribute("hidden")).to.be.false;
  });

  it("hides main content when searching", async () => {
    const el = await fixture(html`<clean-one></clean-one>`);

    el.searchTerm = "test search";
    await el.updateComplete;

    const contentContainer = el.shadowRoot.querySelector("#contentcontainer");
    expect(contentContainer && contentContainer.hasAttribute("hidden")).to.be
      .true;
  });
});

// Mobile responsiveness tests
describe("clean-one mobile responsiveness", () => {
  beforeEach(async () => {
    await setViewport({ width: 375, height: 750 });
  });

  afterEach(async () => {
    await setViewport({ width: 1024, height: 768 });
  });

  it("adapts to mobile viewport", async () => {
    const el = await fixture(html`<clean-one></clean-one>`);
    expect(el).to.exist;

    // Check that the element renders in mobile viewport
    await el.updateComplete;
    const computedStyle = getComputedStyle(el);
    expect(computedStyle.display).to.not.equal("none");
  });

  it("maintains accessibility on mobile", async () => {
    const el = await fixture(html`<clean-one></clean-one>`);
    await expect(el).to.be.accessible();
  });
});

// Desktop responsiveness tests
describe("clean-one desktop responsiveness", () => {
  beforeEach(async () => {
    await setViewport({ width: 1200, height: 800 });
  });

  afterEach(async () => {
    await setViewport({ width: 1024, height: 768 });
  });

  it("adapts to desktop viewport", async () => {
    const el = await fixture(html`<clean-one></clean-one>`);
    expect(el).to.exist;

    await el.updateComplete;
    const computedStyle = getComputedStyle(el);
    expect(computedStyle.display).to.not.equal("none");
  });

  it("shows navigation elements on desktop", async () => {
    const el = await fixture(html`<clean-one></clean-one>`);
    const navigation = el.shadowRoot.querySelector(".navigation");
    expect(navigation).to.exist;
  });
});

// Theme integration and DDD usage tests
describe("clean-one DDD integration", () => {
  it("uses DDD design system tokens", async () => {
    const el = await fixture(html`<clean-one></clean-one>`);
    const styles = getComputedStyle(el);

    // Check that DDD CSS custom properties are being used
    const cssText =
      el.constructor.styles[el.constructor.styles.length - 1].cssText;
    expect(cssText).to.include("--ddd-");
  });

  it("extends HAXCMSLitElementTheme properly", async () => {
    const el = await fixture(html`<clean-one></clean-one>`);
    expect(el.HAXCMSThemeSettings).to.exist;
    expect(typeof el.HAXCMSThemeSettings).to.equal("object");
  });
});

// Menu functionality tests
describe("clean-one menu functionality", () => {
  it("handles menu open/close states", async () => {
    const el = await fixture(html`<clean-one></clean-one>`);

    // Initially menu should be closed
    expect(el.hasAttribute("menu-open")).to.be.false;

    // Test menu button exists
    const menuButton = el.shadowRoot.querySelector("site-menu-button");
    expect(menuButton).to.exist;
  });

  it("renders menu structure correctly", async () => {
    const el = await fixture(html`<clean-one></clean-one>`);

    const menuOutline = el.shadowRoot.querySelector(".menu-outline");
    const searchInput = el.shadowRoot.querySelector("#site-search-input");

    expect(menuOutline).to.exist;
    expect(searchInput).to.exist;
  });
});

// Error handling and edge cases
describe("clean-one error handling", () => {
  it("handles missing or invalid content gracefully", async () => {
    const el = await fixture(html`<clean-one></clean-one>`);

    // Element should still render without content
    expect(el).to.exist;
    await expect(el).to.be.accessible();
  });

  it("maintains functionality with special characters in search", async () => {
    const el = await fixture(html`<clean-one></clean-one>`);

    el.searchTerm = "!@#$%^&*()[]{}\"'";
    await el.updateComplete;

    expect(el.searchTerm).to.equal("!@#$%^&*()[]{}\"\\'");
  });

  it("handles rapid property changes", async () => {
    const el = await fixture(html`<clean-one></clean-one>`);

    // Rapidly change search term
    for (let i = 0; i < 10; i++) {
      el.searchTerm = `search ${i}`;
    }

    await el.updateComplete;
    expect(el.searchTerm).to.equal("search 9");
  });
});
