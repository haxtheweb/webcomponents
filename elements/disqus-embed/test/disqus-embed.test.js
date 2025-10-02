import { fixture, expect, html } from "@open-wc/testing";
import "../disqus-embed.js";

describe("DisqusEmbed test", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<disqus-embed></disqus-embed>`);
    await element.updateComplete;
    // Clear any global DISQUS instance
    if (globalThis.DISQUS) {
      delete globalThis.DISQUS;
    }
  });

  afterEach(() => {
    // Clean up any timeouts
    if (element._timeout) {
      clearTimeout(element._timeout);
    }
  });

  // Basic functionality tests
  it("instantiates the element with default values", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("disqus-embed");
  });

  it("has correct default property values", async () => {
    expect(element.loadingText).to.equal("Loading comments..");
    expect(element.pageURL).to.be.null;
    expect(element.pageIdentifier).to.be.null;
    expect(element.pageTitle).to.be.null;
    expect(element.shortName).to.be.null;
    expect(element.lang).to.equal("en");
  });

  // Accessibility tests
  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit with loading text", async () => {
    element.loadingText = "Custom loading message";
    await element.updateComplete;
    await expect(element).shadowDom.to.be.accessible();
  });

  it("renders loading text in slot", async () => {
    expect(element.shadowRoot.textContent.trim()).to.include(
      "Loading comments..",
    );
  });

  it("updates loading text when property changes", async () => {
    element.loadingText = "Custom loading message";
    await element.updateComplete;

    expect(element.shadowRoot.textContent.trim()).to.include(
      "Custom loading message",
    );
  });

  // Property validation tests
  it("sets loadingText with kebab-case attribute", async () => {
    const testElement = await fixture(
      html`<disqus-embed loading-text="Custom loading"></disqus-embed>`,
    );
    expect(testElement.loadingText).to.equal("Custom loading");
  });

  it("sets pageURL with kebab-case attribute", async () => {
    const testElement = await fixture(
      html`<disqus-embed page-url="https://example.com/page"></disqus-embed>`,
    );
    expect(testElement.pageURL).to.equal("https://example.com/page");
  });

  it("sets pageIdentifier with kebab-case attribute", async () => {
    const testElement = await fixture(
      html`<disqus-embed page-identifier="unique-123"></disqus-embed>`,
    );
    expect(testElement.pageIdentifier).to.equal("unique-123");
  });

  it("sets pageTitle with kebab-case attribute", async () => {
    const testElement = await fixture(
      html`<disqus-embed page-title="My Article Title"></disqus-embed>`,
    );
    expect(testElement.pageTitle).to.equal("My Article Title");
  });

  it("sets shortName with kebab-case attribute", async () => {
    const testElement = await fixture(
      html`<disqus-embed short-name="my-site"></disqus-embed>`,
    );
    expect(testElement.shortName).to.equal("my-site");
  });

  it("sets lang property correctly", async () => {
    const testElement = await fixture(
      html`<disqus-embed lang="fr"></disqus-embed>`,
    );
    expect(testElement.lang).to.equal("fr");
  });

  // Property update tests
  it("updates properties dynamically", async () => {
    element.loadingText = "New loading text";
    element.pageURL = "https://example.com";
    element.pageIdentifier = "test-id";
    element.pageTitle = "Test Title";
    element.lang = "es";

    await element.updateComplete;

    expect(element.loadingText).to.equal("New loading text");
    expect(element.pageURL).to.equal("https://example.com");
    expect(element.pageIdentifier).to.equal("test-id");
    expect(element.pageTitle).to.equal("Test Title");
    expect(element.lang).to.equal("es");
  });

  // Slot content tests
  it("displays default loading text in slot", async () => {
    const slot = element.shadowRoot.querySelector("slot");
    expect(slot).to.exist;
    expect(slot.textContent).to.equal("Loading comments..");
  });

  it("allows custom slotted content to override loading text", async () => {
    const customElement = await fixture(html`
      <disqus-embed>
        <div class="custom-loader">Custom loading content</div>
      </disqus-embed>
    `);

    const slottedContent = customElement.querySelector(".custom-loader");
    expect(slottedContent).to.exist;
    expect(slottedContent.textContent).to.equal("Custom loading content");
  });

  // Styling tests
  it("has default styling applied", async () => {
    const styles = getComputedStyle(element);
    expect(styles.display).to.equal("block");
    // Additional style checks would need to be done with actual rendered element
  });

  // DisqusInstance integration tests (mocked)
  it("calls DisqusInstance.createEmbedScript when shortName is set", async () => {
    // Mock DisqusInstance
    const originalCreateEmbedScript =
      globalThis.DisqusInstance?.createEmbedScript;
    let createEmbedScriptCalled = false;

    if (globalThis.DisqusInstance) {
      globalThis.DisqusInstance.createEmbedScript = (target, shortName) => {
        createEmbedScriptCalled = true;
        expect(target).to.equal(element);
        expect(shortName).to.equal("my-disqus-site");
      };
    }

    element.shortName = "my-disqus-site";
    await element.updateComplete;

    if (globalThis.DisqusInstance) {
      expect(createEmbedScriptCalled).to.be.true;
      // Restore original function
      if (originalCreateEmbedScript) {
        globalThis.DisqusInstance.createEmbedScript = originalCreateEmbedScript;
      }
    }
  });

  // Timeout and lifecycle tests
  it("sets up timeout on property changes", async () => {
    // Mock global DISQUS
    globalThis.DISQUS = {
      reset: () => {},
    };

    element.pageURL = "https://example.com";
    await element.updateComplete;

    expect(element._timeout).to.exist;

    // Clean up
    delete globalThis.DISQUS;
  });

  it("handles connectedCallback properly", async () => {
    // Test that connectedCallback sets up timeout
    const disconnectedElement = document.createElement("disqus-embed");
    document.body.appendChild(disconnectedElement);

    // Should have timeout after connection
    expect(disconnectedElement._timeout).to.exist;

    // Clean up
    document.body.removeChild(disconnectedElement);
  });

  // Error handling and edge cases
  it("handles null and undefined property values", async () => {
    element.pageURL = null;
    element.pageIdentifier = null;
    element.pageTitle = null;
    element.shortName = null;

    await element.updateComplete;

    expect(element.pageURL).to.be.null;
    expect(element.pageIdentifier).to.be.null;
    expect(element.pageTitle).to.be.null;
    expect(element.shortName).to.be.null;
  });

  it("handles empty string property values", async () => {
    element.loadingText = "";
    element.pageURL = "";
    element.pageIdentifier = "";
    element.pageTitle = "";
    element.shortName = "";
    element.lang = "";

    await element.updateComplete;

    expect(element.loadingText).to.equal("");
    expect(element.pageURL).to.equal("");
    expect(element.pageIdentifier).to.equal("");
    expect(element.pageTitle).to.equal("");
    expect(element.shortName).to.equal("");
    expect(element.lang).to.equal("");
  });

  it("handles special characters in properties", async () => {
    element.loadingText = "Loading comments... 🔄";
    element.pageTitle = "Article with 'quotes' & <special> chars";
    element.pageIdentifier = "id-with-unicode-café-naïve";
    element.pageURL = "https://example.com/path?query=value&test=1";

    await element.updateComplete;

    expect(element.loadingText).to.equal("Loading comments... 🔄");
    expect(element.pageTitle).to.equal(
      "Article with 'quotes' & <special> chars",
    );
    expect(element.pageIdentifier).to.equal("id-with-unicode-café-naïve");
    expect(element.pageURL).to.equal(
      "https://example.com/path?query=value&test=1",
    );
  });

  it("handles rapid property changes", async () => {
    const changes = [
      { loadingText: "Loading 1" },
      { loadingText: "Loading 2" },
      { pageURL: "https://example.com/1" },
      { pageURL: "https://example.com/2" },
      { lang: "fr" },
      { lang: "es" },
    ];

    for (const change of changes) {
      Object.assign(element, change);
      await element.updateComplete;
    }

    expect(element.loadingText).to.equal("Loading 2");
    expect(element.pageURL).to.equal("https://example.com/2");
    expect(element.lang).to.equal("es");
  });

  // Language support tests
  it("supports various language codes", async () => {
    const languages = ["en", "fr", "es", "de", "it", "ja", "ko", "zh-cn"];

    for (const lang of languages) {
      element.lang = lang;
      await element.updateComplete;
      expect(element.lang).to.equal(lang);
    }
  });

  // URL validation tests
  it("accepts valid URL formats", async () => {
    const validUrls = [
      "https://example.com",
      "https://example.com/path",
      "https://example.com/path?query=value",
      "https://example.com/path#hash",
      "http://localhost:3000/test",
    ];

    for (const url of validUrls) {
      element.pageURL = url;
      await element.updateComplete;
      expect(element.pageURL).to.equal(url);
    }
  });

  // Configuration tests
  it("maintains global disqus_config function", () => {
    expect(globalThis.disqus_config).to.be.a("function");
  });

  it("has DisqusInstance available globally", () => {
    expect(globalThis.DisqusSingleton).to.exist;
    expect(globalThis.DisqusSingleton.requestAvailability).to.be.a("function");
  });
});

describe("DisqusBroker test", () => {
  let broker;

  beforeEach(() => {
    // Create broker instance for testing
    broker = globalThis.DisqusSingleton.requestAvailability();
  });

  afterEach(() => {
    // Clean up any timeouts
    if (broker._timeout) {
      clearTimeout(broker._timeout);
    }
  });

  it("creates DisqusBroker instance", () => {
    expect(broker).to.exist;
    expect(broker.tagName.toLowerCase()).to.equal("disqus-broker");
  });

  it("has correct default properties", () => {
    expect(broker.renderTarget).to.be.null;
  });

  it("sets disqus_thread id on firstUpdated", async () => {
    await broker.updateComplete;
    expect(broker.getAttribute("id")).to.equal("disqus_thread");
  });

  it("handles API callbacks", () => {
    // Mock console.log to verify it's called
    const originalLog = console.log;
    let logCalled = false;
    let logMessage = "";

    console.log = (message) => {
      logCalled = true;
      logMessage = message;
    };

    broker.apiCallback("onNewComment");
    expect(logCalled).to.be.true;
    expect(logMessage).to.equal("onNewComment");

    // Restore original console.log
    console.log = originalLog;
  });

  it("creates embed script with correct attributes", () => {
    const mockTarget = { appendChild: () => {} };
    broker.createEmbedScript(mockTarget, "test-site");

    expect(broker.renderTarget).to.equal(mockTarget);
    expect(broker.innerHTML).to.equal("");
  });
});
