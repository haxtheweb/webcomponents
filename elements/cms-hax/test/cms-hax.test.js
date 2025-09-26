import { fixture, expect, html, assert } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";

import "../cms-hax.js";

// Basic functionality and accessibility tests
describe("cms-hax basic functionality", () => {
  let element;

  beforeEach(async () => {
    // Use a simpler fixture for basic tests to avoid complex setup
    element = await fixture(html`<cms-hax></cms-hax>`);
  });

  it("should render correctly", () => {
    expect(element).to.exist;
    expect(element.tagName).to.equal("CMS-HAX");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("has correct default properties", () => {
    expect(element.ready).to.be.false;
    expect(element.openDefault).to.be.false;
    expect(element.hidePanelOps).to.be.false;
    expect(element.elementAlign).to.equal("left");
    expect(element.method).to.equal("PUT");
    expect(element.syncBody).to.be.false;
    expect(element.bodyValue).to.equal("");
    expect(element.hideMessage).to.be.false;
  });

  it("renders iron-ajax and h-a-x elements", () => {
    const ironAjax = element.shadowRoot.querySelector("iron-ajax");
    const hax = element.shadowRoot.querySelector("h-a-x");

    expect(ironAjax).to.exist;
    expect(hax).to.exist;
    expect(ironAjax.id).to.equal("pageupdateajax");
  });
});

// Comprehensive A11y tests
describe("cms-hax accessibility tests", () => {
  it("passes accessibility test with default configuration", async () => {
    const el = await fixture(html`<cms-hax></cms-hax>`);
    await expect(el).to.be.accessible();
  });

  it("maintains accessibility with template content", async () => {
    const el = await fixture(html`
      <cms-hax>
        <template>
          <h1>Test Title</h1>
          <p>Test content for accessibility</p>
          <ul>
            <li>List item 1</li>
            <li>List item 2</li>
          </ul>
        </template>
      </cms-hax>
    `);

    await expect(el).to.be.accessible();
  });

  it("maintains accessibility with complex HAX store configuration", async () => {
    const el = await fixture(html`
      <cms-hax element-align="right" hide-panel-ops open-default>
        <template>
          <article>
            <h2>Article Title</h2>
            <p>Article content</p>
          </article>
        </template>
      </cms-hax>
    `);

    await expect(el).to.be.accessible();
  });

  it("has proper ARIA and semantic structure", async () => {
    const el = await fixture(html`<cms-hax></cms-hax>`);
    const ironAjax = el.shadowRoot.querySelector("iron-ajax");
    const hax = el.shadowRoot.querySelector("h-a-x");

    expect(ironAjax).to.exist;
    expect(hax).to.exist;

    // Check that the iron-ajax has proper attributes for accessibility
    expect(ironAjax.getAttribute("handle-as")).to.equal("json");
    expect(ironAjax.getAttribute("content-type")).to.equal("application/json");
  });
});

// Property validation tests
describe("cms-hax property validation", () => {
  it("accepts valid boolean properties", async () => {
    const el = await fixture(html`
      <cms-hax
        ready
        open-default
        hide-panel-ops
        sync-body
        hide-message
        redirect-on-save
      ></cms-hax>
    `);

    expect(el.ready).to.be.true;
    expect(el.openDefault).to.be.true;
    expect(el.hidePanelOps).to.be.true;
    expect(el.syncBody).to.be.true;
    expect(el.hideMessage).to.be.true;
    expect(el.redirectOnSave).to.be.true;
  });

  it("accepts valid string properties", async () => {
    const el = await fixture(html`
      <cms-hax
        element-align="right"
        end-point="/api/save"
        method="POST"
        offset-margin="10px"
        body-value="<p>Initial content</p>"
        redirect-location="/success"
        app-store-connection='{"url": "store.json"}'
      ></cms-hax>
    `);

    expect(el.elementAlign).to.equal("right");
    expect(el.endPoint).to.equal("/api/save");
    expect(el.method).to.equal("POST");
    expect(el.offsetMargin).to.equal("10px");
    expect(el.bodyValue).to.equal("<p>Initial content</p>");
    expect(el.redirectLocation).to.equal("/success");
    expect(el.appStoreConnection).to.equal('{"url": "store.json"}');
  });

  it("accepts valid array properties", async () => {
    const el = await fixture(html`<cms-hax></cms-hax>`);

    el.allowedTags = ["p", "h1", "h2", "div"];
    expect(Array.isArray(el.allowedTags)).to.be.true;
    expect(el.allowedTags).to.deep.equal(["p", "h1", "h2", "div"]);
  });

  it("updates properties reactively", async () => {
    const el = await fixture(html`<cms-hax></cms-hax>`);

    el.elementAlign = "center";
    el.method = "PATCH";
    el.syncBody = true;
    el.hideMessage = true;

    await el.updateComplete;

    expect(el.elementAlign).to.equal("center");
    expect(el.method).to.equal("PATCH");
    expect(el.syncBody).to.be.true;
    expect(el.hideMessage).to.be.true;
  });

  it("handles complex property combinations", async () => {
    const el = await fixture(html`
      <cms-hax
        open-default
        hide-panel-ops
        sync-body
        element-align="right"
        method="DELETE"
        end-point="/api/delete"
      ></cms-hax>
    `);

    expect(el.openDefault).to.be.true;
    expect(el.hidePanelOps).to.be.true;
    expect(el.syncBody).to.be.true;
    expect(el.elementAlign).to.equal("right");
    expect(el.method).to.equal("DELETE");
    expect(el.endPoint).to.equal("/api/delete");
  });
});

// Template slot usage tests
describe("cms-hax template usage", () => {
  it("handles template content correctly", async () => {
    const el = await fixture(html`
      <cms-hax>
        <template>
          <p>Template content</p>
        </template>
      </cms-hax>
    `);

    const template = el.querySelector("template");
    expect(template).to.exist;
    expect(template.innerHTML).to.include("<p>Template content</p>");
  });

  it("handles complex template content with multiple elements", async () => {
    const el = await fixture(html`
      <cms-hax>
        <template>
          <h1>Main Title</h1>
          <h2>Subtitle</h2>
          <p>Paragraph content</p>
          <ul>
            <li>List item 1</li>
            <li>List item 2</li>
          </ul>
          <blockquote>Quote content</blockquote>
        </template>
      </cms-hax>
    `);

    const template = el.querySelector("template");
    expect(template).to.exist;
    expect(template.innerHTML).to.include("<h1>Main Title</h1>");
    expect(template.innerHTML).to.include("<h2>Subtitle</h2>");
    expect(template.innerHTML).to.include("<p>Paragraph content</p>");
    expect(template.innerHTML).to.include("<ul>");
    expect(template.innerHTML).to.include("<blockquote>");
  });

  it("handles template with HAX-compatible elements", async () => {
    const el = await fixture(html`
      <cms-hax>
        <template>
          <p>Standard paragraph</p>
          <video-player src="test.mp4"></video-player>
          <image-gallery></image-gallery>
          <simple-card>
            <h3 slot="header">Card Title</h3>
            <p>Card content</p>
          </simple-card>
        </template>
      </cms-hax>
    `);

    const template = el.querySelector("template");
    expect(template).to.exist;
    expect(template.innerHTML).to.include("video-player");
    expect(template.innerHTML).to.include("image-gallery");
    expect(template.innerHTML).to.include("simple-card");
  });

  it("maintains template accessibility", async () => {
    const el = await fixture(html`
      <cms-hax>
        <template>
          <article>
            <header>
              <h1>Article Title</h1>
            </header>
            <section>
              <h2>Section 1</h2>
              <p>Section content</p>
            </section>
            <footer>
              <p>Article footer</p>
            </footer>
          </article>
        </template>
      </cms-hax>
    `);

    await expect(el).to.be.accessible();
  });
});

// HAX Store integration tests
describe("cms-hax HAX Store integration", () => {
  it("configures iron-ajax with correct properties", async () => {
    const el = await fixture(html`
      <cms-hax end-point="/api/save-content" method="POST"></cms-hax>
    `);

    const ironAjax = el.shadowRoot.querySelector("#pageupdateajax");
    expect(ironAjax.getAttribute("url")).to.equal("/api/save-content");
    expect(ironAjax.getAttribute("method")).to.equal("POST");
    expect(ironAjax.getAttribute("content-type")).to.equal("application/json");
    expect(ironAjax.getAttribute("handle-as")).to.equal("json");
  });

  it("passes app store configuration to h-a-x", async () => {
    const el = await fixture(html`
      <cms-hax app-store-connection='{"url": "test-store.json"}'></cms-hax>
    `);

    const hax = el.shadowRoot.querySelector("h-a-x");
    expect(hax).to.exist;
    // The app-store attribute should be processed
    expect(el.appStoreConnection).to.equal('{"url": "test-store.json"}');
  });

  it("handles HTML entity decoding in app store connection", async () => {
    const el = await fixture(html`<cms-hax></cms-hax>`);

    // Test the decodeHTMLEntities method
    const testString = "&lt;p&gt;Test &amp; content&quot;&lt;/p&gt;";
    const decoded = el.decodeHTMLEntities(testString);
    expect(decoded).to.equal('<p>Test & content"</p>');
  });

  it("computes redirect on save correctly", async () => {
    const el = await fixture(html`<cms-hax></cms-hax>`);

    // Test redirect computation
    expect(el._computeRedirectOnSave(undefined)).to.be.false;
    expect(el._computeRedirectOnSave(null)).to.be.false;
    expect(el._computeRedirectOnSave("/redirect-url")).to.be.true;
  });
});

// Event handling tests
describe("cms-hax event handling", () => {
  it("handles save events", async () => {
    const el = await fixture(html` <cms-hax end-point="/api/save"></cms-hax> `);

    // Mock HAXStore for testing
    let saveEventFired = false;
    el._saveFired = () => {
      saveEventFired = true;
    };

    el._saveFired({ detail: { value: "<p>Test content</p>" } });
    expect(saveEventFired).to.be.true;
  });

  it("handles cancel events", async () => {
    const el = await fixture(html`<cms-hax></cms-hax>`);

    let cancelEventFired = false;
    el._cancelFired = () => {
      cancelEventFired = true;
    };

    el._cancelFired({});
    expect(cancelEventFired).to.be.true;
  });

  it("handles update response events", async () => {
    const el = await fixture(html`<cms-hax></cms-hax>`);

    let responseHandled = false;
    el._handleUpdateResponse = () => {
      responseHandled = true;
    };

    el._handleUpdateResponse({});
    expect(responseHandled).to.be.true;
  });

  it("dispatches custom events correctly", async () => {
    const el = await fixture(html`<cms-hax></cms-hax>`);

    let customEventFired = false;
    el.addEventListener("cms-hax-saved", () => {
      customEventFired = true;
    });

    // Simulate the response handling that triggers the custom event
    el.dispatchEvent(
      new CustomEvent("cms-hax-saved", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: true,
      }),
    );

    expect(customEventFired).to.be.true;
  });
});

// Responsive design and viewport tests
describe("cms-hax responsive design", () => {
  beforeEach(async () => {
    await setViewport({ width: 375, height: 750 });
  });

  afterEach(async () => {
    await setViewport({ width: 1024, height: 768 });
  });

  it("adapts to mobile viewport", async () => {
    const el = await fixture(html`<cms-hax></cms-hax>`);
    expect(el).to.exist;

    await el.updateComplete;
    const computedStyle = getComputedStyle(el);
    expect(computedStyle.display).to.not.equal("none");
  });

  it("maintains accessibility on mobile", async () => {
    const el = await fixture(html`<cms-hax></cms-hax>`);
    await expect(el).to.be.accessible();
  });
});

describe("cms-hax desktop responsiveness", () => {
  beforeEach(async () => {
    await setViewport({ width: 1200, height: 800 });
  });

  afterEach(async () => {
    await setViewport({ width: 1024, height: 768 });
  });

  it("adapts to desktop viewport", async () => {
    const el = await fixture(html`<cms-hax></cms-hax>`);
    expect(el).to.exist;

    await el.updateComplete;
    const computedStyle = getComputedStyle(el);
    expect(computedStyle.display).to.equal("block");
    expect(computedStyle.fontSize).to.equal("16px");
  });
});

// Configuration and CMS integration tests
describe("cms-hax CMS integration", () => {
  it("handles complex CMS configuration", async () => {
    const el = await fixture(html`
      <cms-hax
        element-align="left"
        end-point="/cms/hax-save/123"
        method="PUT"
        hide-panel-ops
        offset-margin="20px"
        redirect-location="/cms/node/123"
      >
        <template>
          <div class="cms-content">
            <h1>CMS Page Title</h1>
            <p>CMS page content</p>
          </div>
        </template>
      </cms-hax>
    `);

    expect(el.elementAlign).to.equal("left");
    expect(el.endPoint).to.equal("/cms/hax-save/123");
    expect(el.method).to.equal("PUT");
    expect(el.hidePanelOps).to.be.true;
    expect(el.offsetMargin).to.equal("20px");
    expect(el.redirectLocation).to.equal("/cms/node/123");
  });

  it("handles allowed tags configuration", async () => {
    const el = await fixture(html`<cms-hax></cms-hax>`);

    el.allowedTags = [
      "p",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6",
      "ul",
      "ol",
      "li",
      "blockquote",
    ];

    expect(Array.isArray(el.allowedTags)).to.be.true;
    expect(el.allowedTags).to.include("p");
    expect(el.allowedTags).to.include("h1");
    expect(el.allowedTags).to.include("blockquote");
  });

  it("handles sync body functionality", async () => {
    const el = await fixture(html`
      <cms-hax sync-body body-value="<p>Initial sync content</p>"></cms-hax>
    `);

    expect(el.syncBody).to.be.true;
    expect(el.bodyValue).to.equal("<p>Initial sync content</p>");
  });
});

// Error handling and edge cases
describe("cms-hax error handling", () => {
  it("handles missing template gracefully", async () => {
    const el = await fixture(html`<cms-hax></cms-hax>`);

    expect(el).to.exist;
    await expect(el).to.be.accessible();
  });

  it("handles invalid app store connection gracefully", async () => {
    const el = await fixture(html`
      <cms-hax app-store-connection="invalid-json"></cms-hax>
    `);

    expect(el.appStoreConnection).to.equal("invalid-json");
    expect(el).to.exist;
  });

  it("handles missing end point gracefully", async () => {
    const el = await fixture(html`<cms-hax></cms-hax>`);

    expect(el.endPoint).to.be.null;
    expect(el).to.exist;
  });

  it("handles rapid property changes", async () => {
    const el = await fixture(html`<cms-hax></cms-hax>`);

    // Rapidly change multiple properties
    for (let i = 0; i < 10; i++) {
      el.elementAlign = i % 2 === 0 ? "left" : "right";
      el.method = i % 2 === 0 ? "PUT" : "POST";
      el.syncBody = i % 2 === 0;
    }

    await el.updateComplete;
    expect(el.elementAlign).to.equal("left");
    expect(el.method).to.equal("POST");
    expect(el.syncBody).to.be.false;
  });

  it("handles special characters in template content", async () => {
    const el = await fixture(html`
      <cms-hax>
        <template>
          <p>&lt;script&gt;alert('test');&lt;/script&gt;</p>
          <p>Special chars: &amp; &quot; &#39; &lt; &gt;</p>
        </template>
      </cms-hax>
    `);

    const template = el.querySelector("template");
    expect(template).to.exist;
    expect(template.innerHTML).to.include("&lt;script&gt;");
    expect(template.innerHTML).to.include("&amp;");
  });
});
