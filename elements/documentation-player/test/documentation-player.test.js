import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import { render } from "lit";
import { DocumentationPlayer } from "../documentation-player.js";
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

  // Children are documented the original way
  it("shows children in the Video tab", async () => {
    const panel = element.shadowRoot.querySelector("#p-video");
    expect(panel).to.exist;
    expect(panel.querySelector("slot")).to.exist;
  });

  it("shows the children markup in the Demo tab", async () => {
    const pre = element.shadowRoot.querySelector("#p-demo pre");
    expect(pre.textContent).to.include("test-content");
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

  it("derives the CodePen head base from globalThis.WCGlobalCDNPath", async () => {
    const originalValue = globalThis.WCGlobalCDNPath;
    // unescape the data string back into the object it was built from
    const parseCodePenData = (label) =>
      JSON.parse(
        element
          .codePenData(label)
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'"),
      );
    try {
      // a base that already carries a trailing slash is used as-is
      globalThis.WCGlobalCDNPath = "https://onprem.example.com/cdn/";
      let parsed = parseCodePenData("Derivation Test");
      expect(parsed.head).to.include(
        'globalThis.WCGlobalCDNPath="https://onprem.example.com/cdn/"',
      );
      expect(parsed.head).to.include(
        'src="https://onprem.example.com/cdn/build.js"',
      );
      expect(parsed.head).to.not.include("cdn.webcomponents.psu.edu");

      // a base without a trailing slash gets one appended
      globalThis.WCGlobalCDNPath = "https://onprem.example.com/cdn";
      parsed = parseCodePenData("Derivation Test");
      expect(parsed.head).to.include(
        'globalThis.WCGlobalCDNPath="https://onprem.example.com/cdn/"',
      );
      expect(parsed.head).to.include(
        'src="https://onprem.example.com/cdn/build.js"',
      );
    } finally {
      // restore so every other test sees the PSU fallback
      if (originalValue === undefined) {
        delete globalThis.WCGlobalCDNPath;
      } else {
        globalThis.WCGlobalCDNPath = originalValue;
      }
    }
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

  // Lifecycle tests
  it("renders tabs once connected", async () => {
    const newElement = document.createElement("documentation-player");
    newElement.label = "Lifecycle Test";
    document.body.appendChild(newElement);
    await newElement.updateComplete;
    expect(newElement.shadowRoot.querySelector('[role="tablist"]')).to.exist;
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

describe("documentation-player cheap gap coverage", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(
      html`<documentation-player label="Gap Test"></documentation-player>`,
    );
    await element.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 50));
  });

  it("renders the HAX inject button markup", () => {
    // the label comes from this.t, so check what actually renders
    const div = document.createElement("div");
    render(element.renderHAXInjectButton(), div);
    const button = div.querySelector("button");
    expect(button).to.exist;
    expect(button.textContent).to.include("Insert into your site");
    expect(button.textContent).to.not.include("Insert into your side");
  });
});

const docs = {
  tag: "x-demo",
  folder: "x-demo",
  package: "@haxtheweb/x-demo",
  version: "1.0.0",
  license: "Apache-2.0",
  title: "X demo",
  description: "A demo element",
  import: "@haxtheweb/x-demo/x-demo.js",
  cdn: "https://cdn.hax.cloud/cdn/build/es6/node_modules/@haxtheweb/x-demo/x-demo.js",
  install: "npm i @haxtheweb/x-demo",
  demoHtml: "<x-demo></x-demo>",
  attributes: [],
  slots: [],
  events: [],
  hax: {},
  surfaceHash: "abc123abc123",
  source: { path: "elements/x-demo", file: "x-demo.js" },
};

const scene = {
  surfaceHash: "abc123abc123",
  duration: 2,
  beats: [{ t: 0, title: "One" }],
  objects: [],
};

const tabNames = (el) =>
  [...el.shadowRoot.querySelectorAll('[role="tab"]')].map((t) =>
    t.textContent.trim(),
  );

describe("DocumentationPlayer with docs data", () => {
  it("omits the walkthrough tab when there is no storyboard", async () => {
    const element = await fixture(
      html`<documentation-player .docs="${docs}"></documentation-player>`,
    );
    await element.updateComplete;
    expect(tabNames(element)).to.not.include("Walkthrough");
    expect(tabNames(element).length).to.be.greaterThan(0);
  });

  it("shows the walkthrough tab when a storyboard is supplied", async () => {
    const element = await fixture(
      html`<documentation-player
        .docs="${docs}"
        .scene="${scene}"
      ></documentation-player>`,
    );
    await element.updateComplete;
    expect(tabNames(element)).to.include("Walkthrough");
  });

  it("flags a storyboard written for a different element surface as stale", async () => {
    const element = await fixture(
      html`<documentation-player
        .docs="${docs}"
        .scene="${{ ...scene, surfaceHash: "000000000000" }}"
      ></documentation-player>`,
    );
    expect(element.reviewState).to.equal("stale");
  });

  it("reports review state from the storyboard review block", async () => {
    const element = await fixture(
      html`<documentation-player
        .docs="${docs}"
        .scene="${scene}"
      ></documentation-player>`,
    );
    expect(element.reviewState).to.equal("awaiting");
    element.scene = {
      ...scene,
      review: { status: "approved", hash: docs.surfaceHash },
    };
    expect(element.reviewState).to.equal("reviewed");
  });

  it("builds copy snippets from the docs data", async () => {
    const element = await fixture(
      html`<documentation-player .docs="${docs}"></documentation-player>`,
    );
    expect(element.snippets.html).to.equal("<x-demo></x-demo>");
    expect(element.snippets.import).to.equal(
      'import "@haxtheweb/x-demo/x-demo.js";',
    );
    expect(element.snippets.npm).to.equal("npm i @haxtheweb/x-demo");
  });

  it("passes the a11y audit", async () => {
    const element = await fixture(
      html`<documentation-player .docs="${docs}"></documentation-player>`,
    );
    await aTimeout(50);
    await expect(element).shadowDom.to.be.accessible();
  });
});

describe("DocumentationPlayer video tutorial", () => {
  it("adds a Video tab from video-src", async () => {
    const element = await fixture(
      html`<documentation-player
        .docs="${docs}"
        video-src="https://www.youtube.com/watch?v=LrS7dqokTLE"
      ></documentation-player>`,
    );
    await element.updateComplete;
    expect(tabNames(element)).to.include("Video");
    expect(element.video.source).to.include("youtube");
  });

  it("reads the video from the docs data", async () => {
    const element = await fixture(
      html`<documentation-player
        .docs="${{
          ...docs,
          video: { source: "https://example.com/v.mp4", title: "How to" },
        }}"
      ></documentation-player>`,
    );
    await element.updateComplete;
    expect(tabNames(element)).to.include("Video");
    expect(element.video.title).to.equal("How to");
  });

  it("adds captions and a link to the full tutorial", async () => {
    const element = await fixture(
      html`<documentation-player
        docs-src="https://cdn.example.com/x-demo/lib/x-demo.docs.json"
        .docs="${{
          ...docs,
          video: {
            source: "https://www.youtube.com/watch?v=LrS7dqokTLE",
            title: "How to",
            captions: "x-demo.captions.vtt",
            tutorial: "https://tutorial.example.com/",
          },
        }}"
        tab="video"
      ></documentation-player>`,
    );
    await element.updateComplete;
    expect(element.video.captions).to.equal(
      "https://cdn.example.com/x-demo/lib/x-demo.captions.vtt",
    );
    const link = element.shadowRoot.querySelector("#p-video a");
    expect(link.getAttribute("href")).to.equal("https://tutorial.example.com/");
    expect(link.textContent).to.include("Open the full tutorial");
  });

  it("leaves the Video tab out when there is nothing to play", async () => {
    const element = await fixture(
      html`<documentation-player .docs="${docs}"></documentation-player>`,
    );
    await element.updateComplete;
    expect(tabNames(element)).to.not.include("Video");
  });

  it("offers the demo schema to HAX when there are no children", async () => {
    const element = await fixture(
      html`<documentation-player
        .docs="${{
          ...docs,
          hax: { demoSchema: [{ tag: "x-demo", properties: {}, content: "" }] },
        }}"
      ></documentation-player>`,
    );
    expect(element.insertSchema[0].tag).to.equal("x-demo");
  });
});

describe("DocumentationPlayer topics", () => {
  const until = async (check, ms = 3000) => {
    const start = Date.now();
    while (!check()) {
      if (Date.now() - start > ms) {
        throw new Error("timed out");
      }
      await aTimeout(25);
    }
  };

  it("lists every walkthrough and loads the one picked", async () => {
    const element = await fixture(
      html`<documentation-player
        docs-src="/elements/haxcms-elements/lib/haxcms-elements.docs.json"
      ></documentation-player>`,
    );
    await until(() => element.scene && element.scene.title === "Edit a page");
    await element.updateComplete;
    const buttons = element.shadowRoot.querySelectorAll(".topics button");
    expect(buttons.length).to.equal(element.docs.walkthroughs.length);
    expect(buttons.length).to.be.greaterThan(1);
    buttons[1].click();
    await until(() => element.scene && element.scene.title === "Add blocks");
    expect(element.topic).to.equal("add-blocks");
  });

  it("opens on the topic attribute", async () => {
    const element = await fixture(
      html`<documentation-player
        docs-src="/elements/haxcms-elements/lib/haxcms-elements.docs.json"
        topic="theme"
      ></documentation-player>`,
    );
    await until(
      () => element.scene && element.scene.title === "Change the theme",
    );
    expect(element.activeTopic).to.equal("theme");
  });

  it("shows no topic picker for a single walkthrough", async () => {
    const element = await fixture(
      html`<documentation-player
        docs-src="/elements/meme-maker/lib/meme-maker.docs.json"
      ></documentation-player>`,
    );
    await until(() => Boolean(element.scene));
    await element.updateComplete;
    expect(
      element.shadowRoot.querySelectorAll(".topics button").length,
    ).to.equal(0);
  });
});
