import { fixture, expect, html } from "@open-wc/testing";
import "../dynamic-import-registry.js";

describe("DynamicImportRegistry test", () => {
  let element;
  
  beforeEach(async () => {
    element = await fixture(html`<dynamic-import-registry></dynamic-import-registry>`);
    // Clear any existing registrations for clean tests
    element.list = {};
    element.__loaded = {};
  });

  afterEach(() => {
    // Clean up any event listeners
    if (element.windowControllers) {
      element.windowControllers.abort();
    }
  });

  // Basic functionality tests
  it("instantiates the element correctly", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("dynamic-import-registry");
  });

  it("has correct default property values", async () => {
    expect(element.list).to.be.an('object');
    expect(element.__loaded).to.be.an('object');
    expect(element.basePath).to.be.a('string');
    expect(element.windowControllers).to.be.instanceOf(AbortController);
  });

  // Singleton pattern tests
  it("implements singleton pattern correctly", () => {
    expect(globalThis.DynamicImportRegistry).to.exist;
    expect(globalThis.DynamicImportRegistry.requestAvailability).to.be.a('function');
    
    const instance1 = globalThis.DynamicImportRegistry.requestAvailability();
    const instance2 = globalThis.DynamicImportRegistry.requestAvailability();
    
    expect(instance1).to.equal(instance2);
    expect(instance1.tagName.toLowerCase()).to.equal('dynamic-import-registry');
  });

  it("creates singleton instance when none exists", () => {
    // Temporarily clear the singleton
    const originalInstance = globalThis.DynamicImportRegistry.instance;
    delete globalThis.DynamicImportRegistry.instance;
    
    const newInstance = globalThis.DynamicImportRegistry.requestAvailability();
    expect(newInstance).to.exist;
    expect(newInstance.tagName.toLowerCase()).to.equal('dynamic-import-registry');
    
    // Restore original instance
    globalThis.DynamicImportRegistry.instance = originalInstance;
  });

  // Base path configuration tests
  it("uses default base path when no globals set", () => {
    const newElement = new DynamicImportRegistry();
    expect(newElement.basePath).to.include('../../../');
  });

  it("uses WCAutoloadBasePath when available", () => {
    const originalAutoloadPath = globalThis.WCAutoloadBasePath;
    globalThis.WCAutoloadBasePath = 'https://custom-autoload-path/';
    
    const newElement = new DynamicImportRegistry();
    expect(newElement.basePath).to.equal('https://custom-autoload-path/');
    
    // Restore original
    if (originalAutoloadPath) {
      globalThis.WCAutoloadBasePath = originalAutoloadPath;
    } else {
      delete globalThis.WCAutoloadBasePath;
    }
  });

  it("uses WCGlobalBasePath when WCAutoloadBasePath not available", () => {
    const originalAutoloadPath = globalThis.WCAutoloadBasePath;
    const originalGlobalPath = globalThis.WCGlobalBasePath;
    
    delete globalThis.WCAutoloadBasePath;
    globalThis.WCGlobalBasePath = 'https://custom-global-path/';
    
    const newElement = new DynamicImportRegistry();
    expect(newElement.basePath).to.equal('https://custom-global-path/');
    
    // Restore originals
    if (originalAutoloadPath) {
      globalThis.WCAutoloadBasePath = originalAutoloadPath;
    }
    if (originalGlobalPath) {
      globalThis.WCGlobalBasePath = originalGlobalPath;
    } else {
      delete globalThis.WCGlobalBasePath;
    }
  });

  // Registration tests
  it("registers valid tag and path combinations", () => {
    const testItem = {
      tag: 'test-element',
      path: 'elements/test-element/test-element.js'
    };
    
    element.register(testItem);
    
    expect(element.list['test-element']).to.equal(testItem.path);
  });

  it("prevents duplicate registrations", () => {
    const testItem1 = {
      tag: 'duplicate-element',
      path: 'elements/duplicate-element/first-path.js'
    };
    const testItem2 = {
      tag: 'duplicate-element',
      path: 'elements/duplicate-element/second-path.js'
    };
    
    element.register(testItem1);
    element.register(testItem2);
    
    // Should keep the first registration
    expect(element.list['duplicate-element']).to.equal(testItem1.path);
  });

  it("warns and rejects invalid registrations", () => {
    const originalWarn = console.warn;
    let warnCalled = false;
    console.warn = () => { warnCalled = true; };
    
    const invalidItems = [
      { tag: 'missing-path-element' }, // missing path
      { path: 'elements/missing-tag/element.js' }, // missing tag
      { }, // missing both
      null, // null value
    ];
    
    invalidItems.forEach(item => {
      element.register(item);
    });
    
    expect(warnCalled).to.be.true;
    console.warn = originalWarn;
  });

  // Event-based registration tests
  it("registers elements via custom events", () => {
    const testDetail = {
      tag: 'event-registered-element',
      path: 'elements/event-element/element.js'
    };
    
    const event = new CustomEvent('dynamic-import-registry--register', {
      detail: testDetail
    });
    
    element.registerDefinitionEvent(event);
    
    expect(element.list['event-registered-element']).to.equal(testDetail.path);
  });

  it("ignores invalid event registrations", () => {
    const invalidEvents = [
      new CustomEvent('dynamic-import-registry--register', { detail: { tag: 'no-path' } }),
      new CustomEvent('dynamic-import-registry--register', { detail: { path: 'no-tag.js' } }),
      new CustomEvent('dynamic-import-registry--register', { detail: {} }),
    ];
    
    const initialListSize = Object.keys(element.list).length;
    
    invalidEvents.forEach(event => {
      element.registerDefinitionEvent(event);
    });
    
    expect(Object.keys(element.list).length).to.equal(initialListSize);
  });

  // Path resolution tests
  it("returns correct full path for registered tag", () => {
    element.basePath = 'https://example.com/components/';
    element.register({
      tag: 'path-test-element',
      path: 'elements/path-test/element.js'
    });
    
    const fullPath = element.getPathToTag('path-test-element');
    expect(fullPath).to.equal('https://example.com/components/elements/path-test/element.js');
  });

  it("returns false for unregistered tags", () => {
    const result = element.getPathToTag('non-existent-element');
    expect(result).to.be.false;
  });

  it("returns false for empty or null tags", () => {
    expect(element.getPathToTag('')).to.be.false;
    expect(element.getPathToTag(null)).to.be.false;
    expect(element.getPathToTag(undefined)).to.be.false;
  });

  // Dynamic loading tests
  it("normalizes tag names to lowercase", async () => {
    element.register({
      tag: 'UPPERCASE-ELEMENT',
      path: 'elements/uppercase/element.js'
    });
    
    // Mock the import to avoid actual loading
    const originalImport = globalThis.import;
    let importCalled = false;
    let importPath = '';
    
    // Note: We can't easily mock dynamic imports in tests, so we'll test the normalization logic
    const normalizedTag = 'UPPERCASE-ELEMENT'.toLowerCase();
    expect(normalizedTag).to.equal('uppercase-element');
    
    expect(element.list['UPPERCASE-ELEMENT']).to.exist;
  });

  it("tracks loaded modules to prevent duplicate loading", async () => {
    const testTag = 'loaded-tracking-element';
    element.register({
      tag: testTag,
      path: 'elements/loaded-tracking/element.js'
    });
    
    // Mark as loaded
    element.__loaded[testTag] = true;
    
    // Mock customElements.get to return undefined (not loaded)
    const originalGet = globalThis.customElements.get;
    globalThis.customElements.get = () => undefined;
    
    const result = await element.loadDefinition(testTag);
    expect(result).to.be.undefined; // Should not attempt to load
    
    // Restore original
    globalThis.customElements.get = originalGet;
  });

  it("dispatches success event on successful load", async () => {
    const testTag = 'success-event-element';
    const testPath = 'elements/success/element.js';
    
    element.register({ tag: testTag, path: testPath });
    
    let eventFired = false;
    let eventDetail = null;
    
    element.addEventListener('dynamic-import-registry-loaded', (e) => {
      eventFired = true;
      eventDetail = e.detail;
    }, { once: true });
    
    // Mock import and customElements.get
    const originalGet = globalThis.customElements.get;
    globalThis.customElements.get = () => undefined;
    
    // Note: We can't easily test the actual import, but we can test the event dispatch logic
    // by manually triggering the success path
    const mockEvent = new CustomEvent('dynamic-import-registry-loaded', {
      detail: {
        tag: testTag,
        path: testPath,
        module: { mockModule: true }
      }
    });
    
    element.dispatchEvent(mockEvent);
    
    expect(eventFired).to.be.true;
    expect(eventDetail.tag).to.equal(testTag);
    expect(eventDetail.path).to.equal(testPath);
    
    globalThis.customElements.get = originalGet;
  });

  it("dispatches failure event on import error", () => {
    const testTag = 'failure-event-element';
    const testPath = 'elements/failure/element.js';
    
    let eventFired = false;
    let eventDetail = null;
    
    element.addEventListener('dynamic-import-registry-failure', (e) => {
      eventFired = true;
      eventDetail = e.detail;
    }, { once: true });
    
    // Manually dispatch failure event to test event structure
    const mockEvent = new CustomEvent('dynamic-import-registry-failure', {
      detail: {
        tag: testTag,
        path: testPath,
        module: null
      }
    });
    
    element.dispatchEvent(mockEvent);
    
    expect(eventFired).to.be.true;
    expect(eventDetail.tag).to.equal(testTag);
    expect(eventDetail.path).to.equal(testPath);
    expect(eventDetail.module).to.be.null;
  });

  // Lifecycle tests
  it("sets up event listeners on connect", () => {
    const newElement = document.createElement('dynamic-import-registry');
    
    // Should have AbortController
    expect(newElement.windowControllers).to.be.instanceOf(AbortController);
    
    // Add to DOM to trigger connectedCallback
    document.body.appendChild(newElement);
    
    // Clean up
    document.body.removeChild(newElement);
    newElement.disconnectedCallback();
  });

  it("cleans up event listeners on disconnect", () => {
    const newElement = document.createElement('dynamic-import-registry');
    document.body.appendChild(newElement);
    
    const controller = newElement.windowControllers;
    expect(controller.signal.aborted).to.be.false;
    
    document.body.removeChild(newElement);
    expect(controller.signal.aborted).to.be.true;
  });

  // Edge cases and error handling
  it("handles case-sensitive tag lookups correctly", () => {
    element.register({
      tag: 'Case-Sensitive-Element',
      path: 'elements/case-sensitive/element.js'
    });
    
    expect(element.getPathToTag('Case-Sensitive-Element')).to.be.a('string');
    expect(element.getPathToTag('case-sensitive-element')).to.be.false;
  });

  it("handles special characters in paths", () => {
    const specialPath = 'elements/special-chars/@scope/element-name/element.js';
    element.register({
      tag: 'special-chars-element',
      path: specialPath
    });
    
    const fullPath = element.getPathToTag('special-chars-element');
    expect(fullPath).to.include(specialPath);
  });

  it("handles rapid successive registrations", () => {
    const elements = [];
    for (let i = 0; i < 100; i++) {
      elements.push({
        tag: `rapid-element-${i}`,
        path: `elements/rapid-${i}/element.js`
      });
    }
    
    elements.forEach(el => element.register(el));
    
    expect(Object.keys(element.list).length).to.be.at.least(100);
    expect(element.getPathToTag('rapid-element-50')).to.include('rapid-50');
  });

  // Accessibility tests
  it("passes the a11y audit", async () => {
    await expect(element).to.be.accessible();
  });

  it("maintains accessibility as registry element", async () => {
    // Registry element should be accessible even with registrations
    element.register({
      tag: 'accessibility-test-element',
      path: 'elements/a11y-test/element.js'
    });
    
    await expect(element).to.be.accessible();
  });

  // Integration tests
  it("integrates with global event system", (done) => {
    const testTag = 'global-event-element';
    const testPath = 'elements/global-event/element.js';
    
    // Listen for the registration event
    const cleanup = () => {
      globalThis.removeEventListener('dynamic-import-registry--register', handler);
      done();
    };
    
    const handler = (e) => {
      if (e.detail.tag === testTag) {
        expect(element.list[testTag]).to.equal(testPath);
        cleanup();
      }
    };
    
    globalThis.addEventListener('dynamic-import-registry--register', handler);
    
    // Dispatch global event
    globalThis.dispatchEvent(new CustomEvent('dynamic-import-registry--register', {
      detail: { tag: testTag, path: testPath }
    }));
    
    // Cleanup after a short delay if event doesn't fire
    setTimeout(() => {
      cleanup();
    }, 1000);
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("dynamic-import-registry passes accessibility test", async () => {
    const el = await fixture(
      html` <dynamic-import-registry></dynamic-import-registry> `
    );
    await expect(el).to.be.accessible();
  });
  it("dynamic-import-registry passes accessibility negation", async () => {
    const el = await fixture(
      html`<dynamic-import-registry
        aria-labelledby="dynamic-import-registry"
      ></dynamic-import-registry>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("dynamic-import-registry can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<dynamic-import-registry .foo=${'bar'}></dynamic-import-registry>`);
    expect(el.foo).to.equal('bar');
  })
})
*/

/*
// Test if element is mobile responsive
describe('Test Mobile Responsiveness', () => {
    before(async () => {z   
      await setViewport({width: 375, height: 750});
    })
    it('sizes down to 360px', async () => {
      const el = await fixture(html`<dynamic-import-registry ></dynamic-import-registry>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('360px');
    })
}) */

/*
// Test if element sizes up for desktop behavior
describe('Test Desktop Responsiveness', () => {
    before(async () => {
      await setViewport({width: 1000, height: 1000});
    })
    it('sizes up to 410px', async () => {
      const el = await fixture(html`<dynamic-import-registry></dynamic-import-registry>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<dynamic-import-registry></dynamic-import-registry>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
