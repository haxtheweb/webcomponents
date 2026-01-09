import { fixture, expect, html } from "@open-wc/testing";
import "../runkit-embed.js";

// Mock ESGlobalBridgeStore for testing
const mockESGlobalBridgeStore = {
  load: function (name, url) {
    return new Promise((resolve) => {
      // Simulate async loading
      setTimeout(() => {
        if (name === "runkit") {
          // Mock RunKit global after load
          globalThis.RunKit = mockRunKit;
        }
        resolve();
      }, 10);
    });
  },
};

// Mock RunKit API
const mockRunKit = {
  createNotebook: function (options) {
    const mockNotebook = {
      name: "mock-notebook-" + Date.now(),
      element: options.element,
      options: options,
    };

    // Simulate the notebook creation process
    setTimeout(() => {
      // Create a mock container element
      const mockContainer = document.createElement("div");
      mockContainer.setAttribute("name", mockNotebook.name);
      const parentDiv = document.createElement("div");
      parentDiv.appendChild(mockContainer);
      options.element.appendChild(parentDiv);

      if (options.onLoad) {
        options.onLoad(mockNotebook);
      }
    }, 5);

    return mockNotebook;
  },
};

describe("RunkitEmbed test", () => {
  let element;
  let originalRunKit;
  let originalESGlobalBridge;

  before(() => {
    // Store originals and set up mocks
    originalRunKit = globalThis.RunKit;
    originalESGlobalBridge = globalThis.ESGlobalBridgeStore;

    // Mock the ES Global Bridge Store
    globalThis.ESGlobalBridgeStore = mockESGlobalBridgeStore;
  });

  after(() => {
    // Restore originals
    if (originalRunKit !== undefined) {
      globalThis.RunKit = originalRunKit;
    } else {
      delete globalThis.RunKit;
    }
    if (originalESGlobalBridge !== undefined) {
      globalThis.ESGlobalBridgeStore = originalESGlobalBridge;
    }
  });

  beforeEach(async () => {
    // Clear RunKit before each test
    delete globalThis.RunKit;
    element = await fixture(html`<runkit-embed></runkit-embed>`);
    await element.updateComplete;
  });

  afterEach(() => {
    // Clean up any mutation observers
    if (element.__observer) {
      element.__observer.disconnect();
    }
  });

  // Basic functionality tests
  it("instantiates the element with default values", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("runkit-embed");
  });

  it("has correct default property values", async () => {
    expect(element.__runkitloaded).to.be.false;
    expect(element.loading).to.be.false;
    expect(element.source).to.equal("");
    expect(element.mode).to.equal("endpoint");
    expect(element.nodeVersion).to.equal("18.x.x");
  });

  it("extends DDD correctly", async () => {
    expect(element.constructor.name).to.equal("RunkitEmbed");
    expect(Object.getPrototypeOf(element.constructor).name).to.equal("DDD");
  });

  // Accessibility tests
  it("passes the a11y audit with default state", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit with code content", async () => {
    element.source = "console.log('Hello World');";
    await element.updateComplete;
    await expect(element).shadowDom.to.be.accessible();
  });

  // Property validation and reflection tests
  it("reflects nodeVersion property to node-version attribute", async () => {
    element.nodeVersion = "16.x.x";
    await element.updateComplete;

    expect(element.getAttribute("node-version")).to.equal("16.x.x");
  });

  it("reflects mode property to attribute", async () => {
    element.mode = "default";
    await element.updateComplete;

    expect(element.getAttribute("mode")).to.equal("default");
  });

  it("reflects loading property to attribute", async () => {
    element.loading = true;
    await element.updateComplete;

    expect(element.hasAttribute("loading")).to.be.true;

    element.loading = false;
    await element.updateComplete;

    expect(element.hasAttribute("loading")).to.be.false;
  });

  it("reflects dataHaxActive property to data-hax-active attribute", async () => {
    element.dataHaxActive = "true";
    await element.updateComplete;

    expect(element.getAttribute("data-hax-active")).to.equal("true");
  });

  it("updates properties when attributes change", async () => {
    element.setAttribute("node-version", "14.x.x");
    element.setAttribute("mode", "default");
    element.setAttribute("source", 'console.log("test");');
    await element.updateComplete;

    expect(element.nodeVersion).to.equal("14.x.x");
    expect(element.mode).to.equal("default");
    expect(element.source).to.equal('console.log("test");');
  });

  // Template content extraction tests
  it("extracts source from template element in constructor", async () => {
    const elementWithTemplate = await fixture(html`
      <runkit-embed>
        <template>console.log("Hello from template");</template>
      </runkit-embed>
    `);
    await elementWithTemplate.updateComplete;

    expect(elementWithTemplate.source).to.equal(
      'console.log("Hello from template");',
    );
  });

  it("handles missing template gracefully", async () => {
    const elementWithoutTemplate = await fixture(
      html`<runkit-embed></runkit-embed>`,
    );
    await elementWithoutTemplate.updateComplete;

    expect(elementWithoutTemplate.source).to.equal("");
  });

  it("updates source when template content changes", async () => {
    const elementWithTemplate = await fixture(html`
      <runkit-embed>
        <template>original code</template>
      </runkit-embed>
    `);
    await elementWithTemplate.updateComplete;

    expect(elementWithTemplate.source).to.equal("original code");

    // Update template content
    const template = elementWithTemplate.querySelector("template");
    template.content.textContent = "updated code";

    // Wait for mutation observer to fire
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(elementWithTemplate.source).to.equal("updated code");
  });

  it("sets up mutation observer correctly", async () => {
    expect(element.__observer).to.be.instanceOf(MutationObserver);
  });

  // External library loading tests
  it("loads RunKit library via ESGlobalBridgeStore", async () => {
    // The constructor should have called ESGlobalBridgeStore.load
    // Wait for the promise to resolve
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(globalThis.RunKit).to.exist;
    expect(element.__runkitloaded).to.be.true;
  });

  it("handles RunKit library loading failure gracefully", async () => {
    const elementWithFailedLoad = await fixture(
      html`<runkit-embed></runkit-embed>`,
    );

    // Mock a failed load by not setting RunKit global
    delete globalThis.RunKit;

    await elementWithFailedLoad.updateComplete;
    expect(elementWithFailedLoad.__runkitloaded).to.be.false;
  });

  // RunKit notebook creation and management tests
  it("builds RunKit notebook when conditions are met", async () => {
    // Set up element with required properties
    element.source = "console.log('test');";
    element.mode = "default";
    element.nodeVersion = "18.x.x";

    // Ensure RunKit is loaded
    globalThis.RunKit = mockRunKit;
    element.__runkitloaded = true;

    let notebookCreated = false;
    const originalCreateNotebook = mockRunKit.createNotebook;
    mockRunKit.createNotebook = function (options) {
      notebookCreated = true;
      expect(options.mode).to.equal("default");
      expect(options.nodeVersion).to.equal("18.x.x");
      expect(options.source).to.equal("console.log('test');");
      expect(options.element).to.equal(element);
      return originalCreateNotebook.call(this, options);
    };

    element.buildRunKit();

    expect(notebookCreated).to.be.true;

    // Restore original
    mockRunKit.createNotebook = originalCreateNotebook;
  });

  it("sets loading state during notebook creation", async () => {
    element.source = "console.log('test');";
    globalThis.RunKit = mockRunKit;
    element.__runkitloaded = true;

    expect(element.loading).to.be.false;

    element.buildRunKit();

    expect(element.loading).to.be.true;

    // Wait for onLoad callback
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(element.loading).to.be.false;
  });

  it("removes existing container before creating new notebook", async () => {
    element.source = "console.log('test');";
    globalThis.RunKit = mockRunKit;
    element.__runkitloaded = true;

    // Create a mock existing container
    const mockContainer = document.createElement("div");
    mockContainer.remove = function () {
      this.removed = true;
    };
    element.__rkContainer = mockContainer;

    element.buildRunKit();

    expect(mockContainer.removed).to.be.true;
  });

  it("does not build RunKit when not loaded", async () => {
    element.source = "console.log('test');";
    element.__runkitloaded = false;

    let notebookCreated = false;
    if (globalThis.RunKit) {
      const originalCreateNotebook = globalThis.RunKit.createNotebook;
      globalThis.RunKit.createNotebook = function () {
        notebookCreated = true;
        return originalCreateNotebook.apply(this, arguments);
      };
    }

    element.buildRunKit();

    expect(notebookCreated).to.be.false;
  });

  // Update lifecycle tests
  it("builds RunKit when properties change and conditions are met", async () => {
    // Set up initial state
    globalThis.RunKit = mockRunKit;
    element.__runkitloaded = true;
    element.source = "initial code";

    let notebookBuilt = false;
    const originalBuildRunKit = element.buildRunKit;
    element.buildRunKit = function () {
      notebookBuilt = true;
      return originalBuildRunKit.call(this);
    };

    // Change source to trigger update
    element.source = "updated code";
    await element.updateComplete;

    expect(notebookBuilt).to.be.true;

    // Restore original
    element.buildRunKit = originalBuildRunKit;
  });

  it("does not update when in HAX mode", async () => {
    globalThis.RunKit = mockRunKit;
    element.__runkitloaded = true;
    element._haxstate = true; // Simulate HAX edit mode

    let notebookBuilt = false;
    const originalBuildRunKit = element.buildRunKit;
    element.buildRunKit = function () {
      notebookBuilt = true;
      return originalBuildRunKit.call(this);
    };

    element.source = "updated code";
    await element.updateComplete;

    expect(notebookBuilt).to.be.false;

    // Restore original
    element.buildRunKit = originalBuildRunKit;
  });

  it("does not update when dataHaxActive is set", async () => {
    globalThis.RunKit = mockRunKit;
    element.__runkitloaded = true;
    element.dataHaxActive = "true";

    let notebookBuilt = false;
    const originalBuildRunKit = element.buildRunKit;
    element.buildRunKit = function () {
      notebookBuilt = true;
      return originalBuildRunKit.call(this);
    };

    element.source = "updated code";
    await element.updateComplete;

    expect(notebookBuilt).to.be.false;

    // Restore original
    element.buildRunKit = originalBuildRunKit;
  });

  // HAX integration tests
  it("has proper HAX properties configuration", async () => {
    expect(element.constructor.haxProperties).to.exist;
    expect(element.constructor.haxProperties).to.include("haxProperties.json");
  });

  it("supports HAX hooks", async () => {
    const hooks = element.haxHooks();
    expect(hooks).to.exist;
    expect(hooks.preProcessNodeToContent).to.equal(
      "haxpreProcessNodeToContent",
    );
    expect(hooks.editModeChanged).to.equal("haxeditModeChanged");
  });

  it("handles HAX edit mode changes", async () => {
    // Create a mock div element
    const mockDiv = document.createElement("div");
    mockDiv.remove = function () {
      this.removed = true;
    };
    element.appendChild(mockDiv);

    element.haxeditModeChanged(true);

    expect(element._haxstate).to.be.true;
    expect(mockDiv.removed).to.be.true;
  });

  it("handles HAX pre-process node to content", async () => {
    element.__runkitloaded = true;
    element.loading = true;

    // Create mock container and div
    const mockContainer = document.createElement("div");
    mockContainer.remove = function () {
      this.removed = true;
    };
    element.__rkContainer = mockContainer;

    const mockDiv = document.createElement("div");
    mockDiv.remove = function () {
      this.removed = true;
    };
    element.appendChild(mockDiv);
    element._haxstate = true;

    const testNode = document.createElement("div");
    const result = await element.haxpreProcessNodeToContent(testNode);

    expect(element.__runkitloaded).to.be.false;
    expect(element.loading).to.be.false;
    expect(mockContainer.removed).to.be.true;
    expect(mockDiv.removed).to.be.true;
    expect(result).to.equal(testNode);
  });

  // Rendering tests
  it("renders slot for content", async () => {
    await element.updateComplete;

    const slot = element.shadowRoot.querySelector("slot");
    expect(slot).to.exist;
  });

  it("renders template content in slot", async () => {
    const elementWithContent = await fixture(html`
      <runkit-embed>
        <template>console.log("Hello World");</template>
      </runkit-embed>
    `);
    await elementWithContent.updateComplete;

    const template = elementWithContent.querySelector("template");
    expect(template).to.exist;
    expect(template.content.textContent).to.equal(
      'console.log("Hello World");',
    );
  });

  // Mode and version handling tests
  it("handles different RunKit modes", async () => {
    const modes = ["default", "endpoint"];

    for (const mode of modes) {
      element.mode = mode;
      await element.updateComplete;
      expect(element.mode).to.equal(mode);
    }
  });

  it("handles different Node versions", async () => {
    const versions = ["16.x.x", "18.x.x", "20.x.x"];

    for (const version of versions) {
      element.nodeVersion = version;
      await element.updateComplete;
      expect(element.nodeVersion).to.equal(version);
    }
  });

  it("validates required properties for building RunKit", async () => {
    globalThis.RunKit = mockRunKit;
    element.__runkitloaded = true;

    let notebookBuilt = false;
    const originalBuildRunKit = element.buildRunKit;
    element.buildRunKit = function () {
      notebookBuilt = true;
      return originalBuildRunKit.call(this);
    };

    // Missing source
    element.source = "";
    element.mode = "default";
    element.nodeVersion = "18.x.x";
    await element.updateComplete;

    expect(notebookBuilt).to.be.false;

    // Missing mode
    element.source = "code";
    element.mode = "";
    element.nodeVersion = "18.x.x";
    await element.updateComplete;

    expect(notebookBuilt).to.be.false;

    // Missing nodeVersion
    element.source = "code";
    element.mode = "default";
    element.nodeVersion = "";
    await element.updateComplete;

    expect(notebookBuilt).to.be.false;

    // All present
    element.source = "code";
    element.mode = "default";
    element.nodeVersion = "18.x.x";
    await element.updateComplete;

    expect(notebookBuilt).to.be.true;

    // Restore original
    element.buildRunKit = originalBuildRunKit;
  });

  // Error handling and edge cases
  it("handles RunKit creation errors gracefully", async () => {
    element.source = "console.log('test');";
    globalThis.RunKit = {
      createNotebook: function () {
        throw new Error("RunKit creation failed");
      },
    };
    element.__runkitloaded = true;

    expect(() => element.buildRunKit()).to.throw("RunKit creation failed");
  });

  it("handles mutation observer disconnection", async () => {
    expect(element.__observer).to.exist;

    let disconnectCalled = false;
    const originalDisconnect = element.__observer.disconnect;
    element.__observer.disconnect = function () {
      disconnectCalled = true;
      return originalDisconnect.call(this);
    };

    element.__observer.disconnect();
    expect(disconnectCalled).to.be.true;
  });

  it("handles empty or invalid source code", async () => {
    const invalidSources = ["", null, undefined, "   ", "\n\n"];

    globalThis.RunKit = mockRunKit;
    element.__runkitloaded = true;

    for (const invalidSource of invalidSources) {
      element.source = invalidSource;
      await element.updateComplete;

      // Should not attempt to build with invalid source
      expect(element.loading).to.be.false;
    }
  });

  it("handles rapid property changes", async () => {
    globalThis.RunKit = mockRunKit;
    element.__runkitloaded = true;

    let buildCount = 0;
    const originalBuildRunKit = element.buildRunKit;
    element.buildRunKit = function () {
      buildCount++;
      return originalBuildRunKit.call(this);
    };

    // Rapid changes
    element.source = "code1";
    element.mode = "default";
    element.nodeVersion = "16.x.x";

    await element.updateComplete;

    element.source = "code2";
    element.mode = "endpoint";
    element.nodeVersion = "18.x.x";

    await element.updateComplete;

    // Should handle multiple updates
    expect(buildCount).to.be.greaterThan(0);

    // Restore original
    element.buildRunKit = originalBuildRunKit;
  });

  // Performance and lifecycle tests
  it("cleans up properly on disconnection", async () => {
    // Set up some state
    element.__runkitloaded = true;
    element.loading = true;

    const mockContainer = document.createElement("div");
    mockContainer.remove = function () {
      this.removed = true;
    };
    element.__rkContainer = mockContainer;

    // Simulate HAX pre-process (cleanup)
    await element.haxpreProcessNodeToContent(document.createElement("div"));

    expect(element.__runkitloaded).to.be.false;
    expect(element.loading).to.be.false;
    expect(mockContainer.removed).to.be.true;
  });

  it("maintains proper state during loading", async () => {
    element.source = "console.log('test');";
    globalThis.RunKit = mockRunKit;
    element.__runkitloaded = true;

    expect(element.loading).to.be.false;

    element.buildRunKit();
    expect(element.loading).to.be.true;

    // Wait for completion
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(element.loading).to.be.false;
    expect(element.__rkContainer).to.exist;
  });

  // Integration test using HAX demo schema
  it("works with HAX demoSchema configuration", async () => {
    const demoElement = await fixture(html`
      <runkit-embed mode="default" node-version="18.x.x">
        <template>console.log("Hello World");</template>
      </runkit-embed>
    `);
    await demoElement.updateComplete;

    expect(demoElement.mode).to.equal("default");
    expect(demoElement.nodeVersion).to.equal("18.x.x");
    expect(demoElement.source).to.equal('console.log("Hello World");');

    // Should have template content
    const template = demoElement.querySelector("template");
    expect(template).to.exist;
    expect(template.content.textContent).to.equal(
      'console.log("Hello World");',
    );
  });

  // CSS and styling tests
  it("applies proper styling", async () => {
    await element.updateComplete;

    const computedStyle = getComputedStyle(element);
    expect(computedStyle.display).to.equal("block");
  });

  it("sets minimum height for layout", async () => {
    await element.updateComplete;

    // The CSS sets min-height: 100px
    const styles = getComputedStyle(element);
    expect(parseInt(styles.minHeight)).to.be.at.least(100);
  });

  // Advanced functionality tests
  it("handles container name matching correctly", async () => {
    element.source = "console.log('test');";
    globalThis.RunKit = {
      createNotebook: function (options) {
        const mockNotebook = { name: "test-notebook-123" };

        setTimeout(() => {
          // Create proper container structure for name matching
          const mockContainer = document.createElement("div");
          mockContainer.setAttribute("name", mockNotebook.name);
          const parentDiv = document.createElement("div");
          parentDiv.appendChild(mockContainer);
          options.element.appendChild(parentDiv);

          if (options.onLoad) {
            options.onLoad(mockNotebook);
          }
        }, 5);

        return mockNotebook;
      },
    };
    element.__runkitloaded = true;

    element.buildRunKit();
    expect(element.loading).to.be.true;

    // Wait for onLoad
    await new Promise((resolve) => setTimeout(resolve, 10));

    expect(element.loading).to.be.false;
    expect(element.__rkContainer).to.exist;
  });

  it("does not update source during loading to prevent conflicts", async () => {
    const elementWithTemplate = await fixture(html`
      <runkit-embed>
        <template>original code</template>
      </runkit-embed>
    `);
    await elementWithTemplate.updateComplete;

    // Set loading state
    elementWithTemplate.loading = true;

    // Try to update template - should be ignored
    const template = elementWithTemplate.querySelector("template");
    template.content.textContent = "updated during loading";

    // Wait for potential mutation observer
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Source should not have changed
    expect(elementWithTemplate.source).to.equal("original code");
  });
});
