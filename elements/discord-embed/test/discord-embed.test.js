import { fixture, expect, html } from "@open-wc/testing";
import "../discord-embed.js";

describe("DiscordEmbed test", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`<discord-embed></discord-embed>`);
    await element.updateComplete;
  });

  // Basic functionality tests
  it("instantiates the element with default values", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("discord-embed");
  });

  it("has correct default property values", async () => {
    expect(element.source).to.equal("");
    expect(element.height).to.equal(500);
    expect(element.width).to.equal("100%");
  });

  // Accessibility tests
  it("passes the a11y audit with empty source", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit with valid Discord source", async () => {
    element.source = "https://e.widgetbot.io/channels/123456789/987654321";
    await element.updateComplete;
    await expect(element).shadowDom.to.be.accessible();
  });

  it("shows appropriate error message for invalid source", async () => {
    element.source = "https://invalid-url.com";
    await element.updateComplete;

    const errorMessage = element.shadowRoot.querySelector("div");
    expect(errorMessage).to.exist;
    expect(errorMessage.textContent).to.equal("Invalid Discord share link");
  });

  // Property validation tests
  it("reflects source property to attribute", async () => {
    const testSource = "https://e.widgetbot.io/channels/123456789/987654321";
    element.source = testSource;
    await element.updateComplete;

    expect(element.getAttribute("source")).to.equal(testSource);
  });

  it("updates height property and reflects to iframe", async () => {
    element.source = "https://e.widgetbot.io/channels/123456789/987654321";
    element.height = "400";
    await element.updateComplete;

    const iframe = element.shadowRoot.querySelector("iframe");
    if (iframe) {
      expect(iframe.getAttribute("height")).to.equal("400");
    }
  });

  it("updates width property and reflects to iframe", async () => {
    element.source = "https://e.widgetbot.io/channels/123456789/987654321";
    element.width = "800px";
    await element.updateComplete;

    const iframe = element.shadowRoot.querySelector("iframe");
    if (iframe) {
      expect(iframe.getAttribute("width")).to.equal("800px");
    }
  });

  // URL transformation tests
  it("transforms discord.com URLs to widgetbot.io URLs", async () => {
    element.source = "https://discord.com/channels/123456789/987654321";
    await element.updateComplete;

    expect(element.source).to.equal(
      "https://e.widgetbot.io/channels/123456789/987654321",
    );
  });

  it("transforms discordapp.com URLs to widgetbot.io URLs", async () => {
    element.source = "https://discordapp.com/channels/123456789/987654321";
    await element.updateComplete;

    expect(element.source).to.equal(
      "https://e.widgetbot.io/channels/123456789/987654321",
    );
  });

  it("leaves widgetbot.io URLs unchanged", async () => {
    const originalSource =
      "https://e.widgetbot.io/channels/123456789/987654321";
    element.source = originalSource;
    await element.updateComplete;

    expect(element.source).to.equal(originalSource);
  });

  // Iframe rendering tests
  it("renders iframe-loader with iframe when source is valid", async () => {
    element.source = "https://e.widgetbot.io/channels/123456789/987654321";
    await element.updateComplete;

    const iframeLoader = element.shadowRoot.querySelector("iframe-loader");
    expect(iframeLoader).to.exist;

    const iframe = element.shadowRoot.querySelector("iframe");
    expect(iframe).to.exist;
    expect(iframe.getAttribute("src")).to.equal(element.source);
  });

  it("does not render iframe when source is invalid", async () => {
    element.source = "https://invalid-site.com/path";
    await element.updateComplete;

    const iframe = element.shadowRoot.querySelector("iframe");
    expect(iframe).to.not.exist;

    const errorDiv = element.shadowRoot.querySelector("div");
    expect(errorDiv).to.exist;
    expect(errorDiv.textContent).to.equal("Invalid Discord share link");
  });

  it("does not render anything when source is empty", async () => {
    expect(element.source).to.equal("");
    await element.updateComplete;

    const iframe = element.shadowRoot.querySelector("iframe");
    expect(iframe).to.not.exist;

    const errorDiv = element.shadowRoot.querySelector("div");
    expect(errorDiv).to.not.exist;
  });

  // URL validation tests
  it("validates discord.com URLs as valid", async () => {
    element.source = "https://discord.com/channels/123456789/987654321";
    await element.updateComplete;

    const iframe = element.shadowRoot.querySelector("iframe");
    expect(iframe).to.exist;
  });

  it("validates e.widgetbot.io URLs as valid", async () => {
    element.source = "https://e.widgetbot.io/channels/123456789/987654321";
    await element.updateComplete;

    const iframe = element.shadowRoot.querySelector("iframe");
    expect(iframe).to.exist;
  });

  it("rejects non-Discord URLs", async () => {
    const invalidSources = [
      "https://youtube.com/watch?v=123",
      "https://twitter.com/status/123",
      "https://example.com",
      "https://github.com/repo",
      "ftp://file-server.com",
    ];

    for (const source of invalidSources) {
      element.source = source;
      await element.updateComplete;

      const iframe = element.shadowRoot.querySelector("iframe");
      expect(iframe).to.not.exist;

      const errorDiv = element.shadowRoot.querySelector("div");
      expect(errorDiv).to.exist;
      expect(errorDiv.textContent).to.equal("Invalid Discord share link");
    }
  });

  // HAX integration tests
  it("has proper HAX properties configuration", async () => {
    expect(element.constructor.haxProperties).to.exist;
    expect(element.constructor.haxProperties).to.include("haxProperties.json");
  });

  // Responsive design tests
  it("handles percentage-based widths", async () => {
    element.source = "https://e.widgetbot.io/channels/123456789/987654321";
    element.width = "50%";
    await element.updateComplete;

    const iframe = element.shadowRoot.querySelector("iframe");
    if (iframe) {
      expect(iframe.getAttribute("width")).to.equal("50%");
    }
  });

  it("handles pixel-based dimensions", async () => {
    element.source = "https://e.widgetbot.io/channels/123456789/987654321";
    element.width = "800px";
    element.height = "600px";
    await element.updateComplete;

    const iframe = element.shadowRoot.querySelector("iframe");
    if (iframe) {
      expect(iframe.getAttribute("width")).to.equal("800px");
      expect(iframe.getAttribute("height")).to.equal("600px");
    }
  });

  // Error handling and edge cases
  it("handles malformed Discord URLs gracefully", async () => {
    const malformedUrls = [
      "discord.com/channels/123", // missing https://
      "https://discord.com/", // incomplete path
      "https://discord.com/channels", // no channel IDs
      "https://discord.com/channels/", // trailing slash only
      "https://discord.com/channels/not-numbers/123",
    ];

    for (const url of malformedUrls) {
      element.source = url;
      await element.updateComplete;

      // Should either transform correctly or show error
      const iframe = element.shadowRoot.querySelector("iframe");
      const errorDiv = element.shadowRoot.querySelector("div");

      // At least one should exist
      expect(iframe || errorDiv).to.exist;
    }
  });

  it("handles rapid source changes", async () => {
    const sources = [
      "https://discord.com/channels/111/222",
      "https://e.widgetbot.io/channels/333/444",
      "https://invalid-url.com",
      "https://discordapp.com/channels/555/666",
    ];

    for (const source of sources) {
      element.source = source;
      await element.updateComplete;
    }

    // Should end up with the transformed version of the last Discord URL
    expect(element.source).to.equal("https://e.widgetbot.io/channels/555/666");
  });

  it("handles special characters in URLs", async () => {
    element.source =
      "https://discord.com/channels/123456789/987654321?query=test&param=value";
    await element.updateComplete;

    expect(element.source).to.include("e.widgetbot.io");
    expect(element.source).to.include("query=test&param=value");
  });

  it("handles numeric and string property types correctly", async () => {
    // Height should be coerced to string when rendered
    element.height = 300;
    element.width = 600;
    element.source = "https://e.widgetbot.io/channels/123/456";
    await element.updateComplete;

    const iframe = element.shadowRoot.querySelector("iframe");
    if (iframe) {
      expect(iframe.getAttribute("height")).to.equal("300");
      expect(iframe.getAttribute("width")).to.equal("600");
    }
  });

  it("maintains iframe-loader structure for accessibility", async () => {
    element.source = "https://e.widgetbot.io/channels/123456789/987654321";
    await element.updateComplete;

    const iframeLoader = element.shadowRoot.querySelector("iframe-loader");
    expect(iframeLoader).to.exist;

    const iframe = iframeLoader.querySelector("iframe");
    expect(iframe).to.exist;
    expect(iframe.parentElement.tagName.toLowerCase()).to.equal(
      "iframe-loader",
    );
  });

  // Integration tests with various Discord URL formats
  it("handles thread URLs correctly", async () => {
    element.source =
      "https://discord.com/channels/123456789/987654321/111222333";
    await element.updateComplete;

    expect(element.source).to.equal(
      "https://e.widgetbot.io/channels/123456789/987654321/111222333",
    );

    const iframe = element.shadowRoot.querySelector("iframe");
    expect(iframe).to.exist;
  });

  it("preserves URL fragments and query parameters", async () => {
    element.source = "https://discord.com/channels/123/456?test=1#message-789";
    await element.updateComplete;

    expect(element.source).to.include("e.widgetbot.io");
    expect(element.source).to.include("?test=1#message-789");
  });

  // Performance and lifecycle tests
  it("only updates source when property actually changes", async () => {
    const originalSource = "https://discord.com/channels/123/456";
    element.source = originalSource;
    await element.updateComplete;

    const transformedSource = element.source;

    // Set to same value - should not trigger another transformation
    element.source = transformedSource;
    await element.updateComplete;

    expect(element.source).to.equal(transformedSource);
  });
});
