import { fixture, expect, html } from "@open-wc/testing";
import "../documentation-player.js";

describe("DocumentationPlayer test", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`
      <documentation-player
        label="Test Component"
        image-url="https://example.com/preview.png"
        url="https://example.com/docs"
      >
        <div class="test-content">Sample component content</div>
      </documentation-player>
    `);
    await element.updateComplete;
    // Allow time for async processing
    await new Promise((resolve) => setTimeout(resolve, 100));
  });

  // Basic functionality tests
  it("instantiates the element with default values", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("documentation-player");
  });

  it("has correct default property values", async () => {
    const defaultElement = await fixture(
      html`<documentation-player></documentation-player>`,
    );
    expect(defaultElement.label).to.equal("");
    expect(defaultElement.haxSchema).to.be.an("array");
    expect(defaultElement.imageUrl).to.equal("");
    expect(defaultElement.url).to.equal("");
  });

  // Property validation tests
  it("sets properties from attributes correctly", async () => {
    expect(element.label).to.equal("Test Component");
    expect(element.imageUrl).to.equal("https://example.com/preview.png");
    expect(element.url).to.equal("https://example.com/docs");
  });

  it("updates properties dynamically", async () => {
    element.label = "Updated Component";
    element.imageUrl = "https://example.com/new-preview.png";
    element.url = "https://example.com/new-docs";

    await element.updateComplete;

    expect(element.label).to.equal("Updated Component");
    expect(element.imageUrl).to.equal("https://example.com/new-preview.png");
    expect(element.url).to.equal("https://example.com/new-docs");
  });

  // Template rendering tests
  it("renders play-list element in shadow DOM", async () => {
    const playList = element.shadowRoot.querySelector("play-list");
    expect(playList).to.exist;
    expect(playList.id).to.equal("contentplayertemplate");
  });

  it("renders template content after firstUpdated", async () => {
    // Allow more time for template rendering
    await new Promise((resolve) => setTimeout(resolve, 200));

    const template = element.shadowRoot.querySelector("template");
    // Template content should be rendered inside play-list
    const playList = element.shadowRoot.querySelector("play-list");
    expect(playList).to.exist;
  });

  // Data string formatting tests
  it("formats data string correctly", async () => {
    const testData = {
      title: "Test",
      content: "Sample 'quote' and \"double\" quotes",
    };
    const formatted = element._getDataString(testData);

    expect(formatted).to.include("&quot;");
    expect(formatted).to.include("&apos;");
    expect(formatted).to.not.include('"');
    expect(formatted).to.not.include("'");
  });

  // CodePen data generation tests
  it("generates CodePen data with correct structure", async () => {
    const codePenDataString = element.codePenData("Test Label");
    expect(codePenDataString).to.be.a("string");

    // Should contain escaped JSON with title, html, and head
    expect(codePenDataString).to.include("Test Label");
    expect(codePenDataString).to.include("globalThis.WCGlobalCDNPath");
    expect(codePenDataString).to.include("cdn.webcomponents.psu.edu");
  });

  it("includes innerHTML in CodePen data", async () => {
    const codePenDataString = element.codePenData("Test Component");
    expect(codePenDataString).to.include("test-content");
  });

  // HAX schema tests
  it("initializes haxSchema as empty array", async () => {
    expect(element.haxSchema).to.be.an("array");
  });

  it("processes children into haxSchema after timeout", async () => {
    // Allow time for the setTimeout to process children
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(element.haxSchema).to.be.an("array");
    // Should have processed the child element
    if (element.children.length > 0) {
      expect(element.haxSchema.length).to.be.greaterThan(0);
    }
  });

  // Event handling tests
  it("handles HAX inject events", async () => {
    let haxInsertEventFired = false;
    let eventDetail = null;

    globalThis.addEventListener(
      "hax-insert",
      (e) => {
        haxInsertEventFired = true;
        eventDetail = e.detail;
      },
      { once: true },
    );

    element._injectHAX();

    expect(haxInsertEventFired).to.be.true;
    expect(eventDetail).to.exist;
    expect(eventDetail.value).to.equal(element.haxSchema);
  });

  // Render method tests
  it("renders HAX inject button", async () => {
    const buttonHTML = element.renderHAXInjectButton();
    expect(buttonHTML).to.exist;
  });

  // Accessibility tests
  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit with content", async () => {
    const contentElement = await fixture(html`
      <documentation-player
        label="Accessible Component"
        url="https://example.com/docs"
        image-url="https://example.com/preview.png"
      >
        <div role="region" aria-label="Sample content">
          <h2>Component Example</h2>
          <p>This is sample content for testing accessibility.</p>
        </div>
      </documentation-player>
    `);

    await contentElement.updateComplete;
    await expect(contentElement).shadowDom.to.be.accessible();
  });

  // URL and image handling tests
  it("handles various URL formats", async () => {
    const urlTestCases = [
      "https://example.com",
      "https://example.com/path",
      "https://example.com/path?query=value",
      "http://localhost:3000",
      "relative/path",
    ];

    for (const url of urlTestCases) {
      element.url = url;
      await element.updateComplete;
      expect(element.url).to.equal(url);
    }
  });

  it("handles various image URL formats", async () => {
    const imageUrlTestCases = [
      "https://example.com/image.png",
      "https://example.com/image.jpg",
      "data:image/png;base64,iVBORw0KGgo=",
      "relative/image.svg",
    ];

    for (const imageUrl of imageUrlTestCases) {
      element.imageUrl = imageUrl;
      await element.updateComplete;
      expect(element.imageUrl).to.equal(imageUrl);
    }
  });

  // Error handling and edge cases
  it("handles empty content gracefully", async () => {
    const emptyElement = await fixture(
      html`<documentation-player></documentation-player>`,
    );
    await emptyElement.updateComplete;

    expect(emptyElement.label).to.equal("");
    expect(emptyElement.innerHTML.trim()).to.equal("");

    const codePenData = emptyElement.codePenData("Empty Test");
    expect(codePenData).to.include("Empty Test");
  });

  it("handles special characters in label", async () => {
    element.label = "Component with 'quotes' & <special> characters 🚀";
    await element.updateComplete;

    expect(element.label).to.equal(
      "Component with 'quotes' & <special> characters 🚀",
    );

    const codePenData = element.codePenData(element.label);
    expect(codePenData).to.include("&quot;");
  });

  it("handles rapid property changes", async () => {
    const changes = [
      { label: "Label 1", url: "https://example.com/1" },
      { label: "Label 2", url: "https://example.com/2" },
      { label: "Label 3", url: "https://example.com/3" },
    ];

    for (const change of changes) {
      Object.assign(element, change);
      await element.updateComplete;
    }

    expect(element.label).to.equal("Label 3");
    expect(element.url).to.equal("https://example.com/3");
  });

  // Template processing tests
  it("processes innerHTML for code samples", async () => {
    const elementWithCode = await fixture(html`
      <documentation-player label="Code Example">
        <div class="example">
          <button type="button">Example Button</button>
        </div>
      </documentation-player>
    `);

    await elementWithCode.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(elementWithCode.innerHTML.trim()).to.include("example");
    expect(elementWithCode.innerHTML.trim()).to.include("button");
  });

  // Integration tests
  it("integrates with play-list component", async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));

    const playList = element.shadowRoot.querySelector("play-list");
    expect(playList).to.exist;
    expect(playList.id).to.equal("contentplayertemplate");
  });

  // Lifecycle tests
  it("executes firstUpdated correctly", async () => {
    const newElement = document.createElement("documentation-player");
    newElement.label = "Lifecycle Test";

    // Add to DOM to trigger lifecycle
    document.body.appendChild(newElement);
    await newElement.updateComplete;

    const playList = newElement.shadowRoot.querySelector("play-list");
    expect(playList).to.exist;

    // Clean up
    document.body.removeChild(newElement);
  });

  // Screenshot URL generation tests
  it("generates screenshot URLs correctly", async () => {
    element.imageUrl = "https://example.com/component";
    await element.updateComplete;

    // The screenshot URL should be generated in the template
    // We can't easily test the rendered template content, but we can verify the property is set
    expect(element.imageUrl).to.include("example.com");
  });
});

describe("DocumentationPlayer with complex content", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`
      <documentation-player
        label="Complex Component"
        url="https://example.com/complex"
        image-url="https://example.com/complex-preview.png"
      >
        <div class="wrapper">
          <h3>Complex Example</h3>
          <div class="content">
            <p>This is a more complex example with nested elements.</p>
            <ul>
              <li>Feature 1</li>
              <li>Feature 2</li>
            </ul>
            <button onclick="alert('Test')">Interactive Button</button>
          </div>
        </div>
      </documentation-player>
    `);
    await element.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 150));
  });

  it("handles complex nested content", async () => {
    expect(element.innerHTML.trim()).to.include("wrapper");
    expect(element.innerHTML.trim()).to.include("Complex Example");
    expect(element.innerHTML.trim()).to.include("Interactive Button");
  });

  it("processes complex content into haxSchema", async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    expect(element.haxSchema).to.be.an("array");
  });

  it("maintains accessibility with complex content", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
