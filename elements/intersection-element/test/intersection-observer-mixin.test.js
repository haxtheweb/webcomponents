import { fixture, expect, html } from "@open-wc/testing";
import { LitElement } from "lit";
import { IntersectionObserverMixin } from "../lib/IntersectionObserverMixin.js";

// Create test elements using the mixin with different base classes
class TestLitElement extends IntersectionObserverMixin(LitElement) {
  static get tag() {
    return "test-lit-element";
  }
  
  render() {
    return html`<div>Test LitElement with IntersectionObserver</div>`;
  }
}
globalThis.customElements.define(TestLitElement.tag, TestLitElement);

class TestHTMLElement extends IntersectionObserverMixin(HTMLElement) {
  static get tag() {
    return "test-html-element";
  }
  
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = '<div>Test HTMLElement with IntersectionObserver</div>';
  }
}
globalThis.customElements.define(TestHTMLElement.tag, TestHTMLElement);

// Mock IntersectionObserver for testing
class MockIntersectionObserver {
  constructor(callback, options) {
    this.callback = callback;
    this.options = options;
    this.observedElements = new Set();
    MockIntersectionObserver.instances.push(this);
  }

  observe(element) {
    this.observedElements.add(element);
    MockIntersectionObserver.observedElements.add(element);
  }

  unobserve(element) {
    this.observedElements.delete(element);
    MockIntersectionObserver.observedElements.delete(element);
  }

  disconnect() {
    this.observedElements.clear();
    MockIntersectionObserver.instances = MockIntersectionObserver.instances.filter(
      instance => instance !== this
    );
  }

  // Helper method to trigger intersection callback
  triggerIntersection(element, intersectionRatio) {
    const entry = {
      target: element,
      intersectionRatio: intersectionRatio,
      isIntersecting: intersectionRatio > 0,
      boundingClientRect: element.getBoundingClientRect(),
      intersectionRect: element.getBoundingClientRect(),
      rootBounds: { top: 0, left: 0, bottom: window.innerHeight, right: window.innerWidth },
      time: Date.now()
    };
    this.callback([entry]);
  }

  static reset() {
    MockIntersectionObserver.instances = [];
    MockIntersectionObserver.observedElements = new Set();
  }
}

MockIntersectionObserver.instances = [];
MockIntersectionObserver.observedElements = new Set();

describe("IntersectionObserverMixin test", () => {
  let originalIntersectionObserver;
  let element;

  before(() => {
    // Store original and replace with mock
    originalIntersectionObserver = globalThis.IntersectionObserver;
    globalThis.IntersectionObserver = MockIntersectionObserver;
  });

  after(() => {
    // Restore original
    globalThis.IntersectionObserver = originalIntersectionObserver;
  });

  beforeEach(async () => {
    MockIntersectionObserver.reset();
    element = await fixture(html`<test-lit-element></test-lit-element>`);
    await element.updateComplete;
  });

  afterEach(() => {
    MockIntersectionObserver.reset();
  });

  // Basic mixin functionality tests
  it("applies mixin to LitElement correctly", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("test-lit-element");
    expect(element.elementVisible).to.be.false;
  });

  it("applies mixin to HTMLElement correctly", async () => {
    const htmlElement = await fixture(html`<test-html-element></test-html-element>`);
    expect(htmlElement).to.exist;
    expect(htmlElement.tagName.toLowerCase()).to.equal("test-html-element");
    expect(htmlElement.elementVisible).to.be.false;
  });

  it("has correct default property values", async () => {
    expect(element.elementVisible).to.be.false;
    expect(element.IOThresholds).to.deep.equal([0.0, 0.25, 0.5, 0.75, 1.0]);
    expect(element.IORootMargin).to.equal("0px");
    expect(element.IOVisibleLimit).to.equal(0.5);
    expect(element.IORemoveOnVisible).to.be.true;
    expect(element.IODelay).to.equal(100);
    expect(element.IORoot).to.be.null;
  });

  // Property reflection tests
  it("reflects elementVisible property to attribute", async () => {
    element.elementVisible = true;
    await element.updateComplete;
    
    expect(element.hasAttribute('element-visible')).to.be.true;
    
    element.elementVisible = false;
    await element.updateComplete;
    
    expect(element.hasAttribute('element-visible')).to.be.false;
  });

  it("updates elementVisible when attribute changes", async () => {
    element.setAttribute('element-visible', '');
    await element.updateComplete;
    
    expect(element.elementVisible).to.be.true;
    
    element.removeAttribute('element-visible');
    await element.updateComplete;
    
    expect(element.elementVisible).to.be.false;
  });

  // IntersectionObserver setup tests
  it("creates IntersectionObserver on connectedCallback", async () => {
    expect(MockIntersectionObserver.instances).to.have.length(1);
    expect(element.intersectionObserver).to.be.instanceOf(MockIntersectionObserver);
  });

  it("observes the element itself", async () => {
    expect(MockIntersectionObserver.observedElements.has(element)).to.be.true;
  });

  it("uses correct IntersectionObserver options", async () => {
    const observer = element.intersectionObserver;
    expect(observer.options.root).to.equal(element.IORoot);
    expect(observer.options.rootMargin).to.equal(element.IORootMargin);
    expect(observer.options.threshold).to.deep.equal(element.IOThresholds);
    expect(observer.options.delay).to.equal(element.IODelay);
  });

  it("does not create observer if already visible", async () => {
    MockIntersectionObserver.reset();
    
    const visibleElement = await fixture(html`<test-lit-element element-visible></test-lit-element>`);
    await visibleElement.updateComplete;
    
    expect(MockIntersectionObserver.instances).to.have.length(0);
    expect(visibleElement.intersectionObserver).to.be.undefined;
  });

  // Intersection callback tests
  it("sets elementVisible to true when intersection ratio exceeds limit", async () => {
    const observer = element.intersectionObserver;
    observer.triggerIntersection(element, 0.6);
    
    expect(element.elementVisible).to.be.true;
  });

  it("keeps elementVisible false when intersection ratio is below limit", async () => {
    const observer = element.intersectionObserver;
    observer.triggerIntersection(element, 0.3);
    
    expect(element.elementVisible).to.be.false;
  });

  it("sets elementVisible to false when intersection ratio drops below limit", async () => {
    // First make it visible
    const observer = element.intersectionObserver;
    observer.triggerIntersection(element, 0.8);
    expect(element.elementVisible).to.be.true;
    
    // Then make it invisible
    observer.triggerIntersection(element, 0.2);
    expect(element.elementVisible).to.be.false;
  });

  it("handles exact visibility limit threshold", async () => {
    const observer = element.intersectionObserver;
    observer.triggerIntersection(element, 0.5); // Exactly at limit
    
    expect(element.elementVisible).to.be.true;
  });

  it("disconnects observer when visible if IORemoveOnVisible is true", async () => {
    const observer = element.intersectionObserver;
    let disconnectCalled = false;
    const originalDisconnect = observer.disconnect;
    observer.disconnect = function() {
      disconnectCalled = true;
      originalDisconnect.call(this);
    };
    
    observer.triggerIntersection(element, 0.8);
    
    expect(element.elementVisible).to.be.true;
    expect(disconnectCalled).to.be.true;
  });

  it("keeps observer when visible if IORemoveOnVisible is false", async () => {
    element.IORemoveOnVisible = false;
    
    // Need to reconnect to apply new setting
    element.disconnectedCallback();
    element.connectedCallback();
    
    const observer = element.intersectionObserver;
    let disconnectCalled = false;
    const originalDisconnect = observer.disconnect;
    observer.disconnect = function() {
      disconnectCalled = true;
      originalDisconnect.call(this);
    };
    
    observer.triggerIntersection(element, 0.8);
    
    expect(element.elementVisible).to.be.true;
    expect(disconnectCalled).to.be.false;
  });

  // Configuration option tests
  it("respects custom IOVisibleLimit", async () => {
    element.IOVisibleLimit = 0.8;
    element.disconnectedCallback();
    element.connectedCallback();
    
    const observer = element.intersectionObserver;
    
    // Below custom limit - should stay false
    observer.triggerIntersection(element, 0.7);
    expect(element.elementVisible).to.be.false;
    
    // At custom limit - should become true
    observer.triggerIntersection(element, 0.8);
    expect(element.elementVisible).to.be.true;
  });

  it("respects custom IOThresholds", async () => {
    element.IOThresholds = [0.0, 0.5, 1.0];
    element.disconnectedCallback();
    element.connectedCallback();
    
    const observer = element.intersectionObserver;
    expect(observer.options.threshold).to.deep.equal([0.0, 0.5, 1.0]);
  });

  it("respects custom IORootMargin", async () => {
    element.IORootMargin = "10px 20px";
    element.disconnectedCallback();
    element.connectedCallback();
    
    const observer = element.intersectionObserver;
    expect(observer.options.rootMargin).to.equal("10px 20px");
  });

  it("respects custom IORoot", async () => {
    const customRoot = document.createElement('div');
    element.IORoot = customRoot;
    element.disconnectedCallback();
    element.connectedCallback();
    
    const observer = element.intersectionObserver;
    expect(observer.options.root).to.equal(customRoot);
  });

  it("respects custom IODelay", async () => {
    element.IODelay = 200;
    element.disconnectedCallback();
    element.connectedCallback();
    
    const observer = element.intersectionObserver;
    expect(observer.options.delay).to.equal(200);
  });

  // Lifecycle method tests
  it("calls super.connectedCallback if it exists", async () => {
    class TestElementWithSuper extends IntersectionObserverMixin(LitElement) {
      connectedCallback() {
        this.superCalled = true;
        super.connectedCallback();
      }
    }
    
    globalThis.customElements.define('test-element-super', TestElementWithSuper);
    const testElement = await fixture(html`<test-element-super></test-element-super>`);
    
    expect(testElement.superCalled).to.be.true;
  });

  it("calls super.disconnectedCallback if it exists", async () => {
    class TestElementWithSuper extends IntersectionObserverMixin(LitElement) {
      disconnectedCallback() {
        this.superDisconnectedCalled = true;
        super.disconnectedCallback();
      }
    }
    
    globalThis.customElements.define('test-element-super-disconnect', TestElementWithSuper);
    const testElement = await fixture(html`<test-element-super-disconnect></test-element-super-disconnect>`);
    
    testElement.disconnectedCallback();
    expect(testElement.superDisconnectedCalled).to.be.true;
  });

  it("disconnects observer on disconnectedCallback", async () => {
    const observer = element.intersectionObserver;
    let disconnectCalled = false;
    const originalDisconnect = observer.disconnect;
    observer.disconnect = function() {
      disconnectCalled = true;
      originalDisconnect.call(this);
    };
    
    element.disconnectedCallback();
    
    expect(disconnectCalled).to.be.true;
    expect(element.elementVisible).to.be.false;
  });

  it("resets elementVisible to false on disconnect", async () => {
    // Make element visible first
    const observer = element.intersectionObserver;
    element.IORemoveOnVisible = false;
    observer.triggerIntersection(element, 0.8);
    expect(element.elementVisible).to.be.true;
    
    // Disconnect should reset visibility
    element.disconnectedCallback();
    expect(element.elementVisible).to.be.false;
  });

  it("handles DOM movement correctly", async () => {
    // Make element visible first
    const observer = element.intersectionObserver;
    observer.triggerIntersection(element, 0.8);
    expect(element.elementVisible).to.be.true;
    
    // Simulate DOM movement (disconnect then reconnect)
    element.disconnectedCallback();
    expect(element.elementVisible).to.be.false;
    
    element.connectedCallback();
    expect(MockIntersectionObserver.instances.length).to.be.greaterThan(0);
    expect(element.elementVisible).to.be.false; // Should start false again
  });

  // Error handling and edge cases
  it("handles multiple intersection entries", async () => {
    // This tests the for loop in handleIntersectionCallback
    const observer = element.intersectionObserver;
    const entry1 = {
      target: element,
      intersectionRatio: 0.3,
      isIntersecting: true
    };
    const entry2 = {
      target: element,
      intersectionRatio: 0.7,
      isIntersecting: true
    };
    
    // Call with multiple entries - should use the last one processed
    observer.callback([entry1, entry2]);
    expect(element.elementVisible).to.be.true;
  });

  it("handles zero intersection ratio", async () => {
    const observer = element.intersectionObserver;
    observer.triggerIntersection(element, 0.0);
    
    expect(element.elementVisible).to.be.false;
  });

  it("handles full intersection ratio", async () => {
    const observer = element.intersectionObserver;
    observer.triggerIntersection(element, 1.0);
    
    expect(element.elementVisible).to.be.true;
  });

  it("handles fractional intersection ratios correctly", async () => {
    const observer = element.intersectionObserver;
    
    // Test precision - should round to 2 decimal places
    observer.triggerIntersection(element, 0.4999);
    expect(element.elementVisible).to.be.false;
    
    observer.triggerIntersection(element, 0.5001);
    expect(element.elementVisible).to.be.true;
  });

  it("works with custom visibility limits", async () => {
    element.IOVisibleLimit = 0.1; // Very low threshold
    element.disconnectedCallback();
    element.connectedCallback();
    
    const observer = element.intersectionObserver;
    observer.triggerIntersection(element, 0.15);
    
    expect(element.elementVisible).to.be.true;
  });

  it("works with high visibility limits", async () => {
    element.IOVisibleLimit = 0.9; // Very high threshold
    element.disconnectedCallback();
    element.connectedCallback();
    
    const observer = element.intersectionObserver;
    observer.triggerIntersection(element, 0.85);
    
    expect(element.elementVisible).to.be.false;
    
    observer.triggerIntersection(element, 0.95);
    expect(element.elementVisible).to.be.true;
  });

  // Property inheritance tests
  it("preserves parent class properties", async () => {
    // LitElement should still work
    expect(element.updateComplete).to.be.a('promise');
    expect(typeof element.requestUpdate).to.equal('function');
  });

  it("extends properties correctly", async () => {
    const props = TestLitElement.properties;
    expect(props.elementVisible).to.exist;
    expect(props.elementVisible.type).to.equal(Boolean);
    expect(props.elementVisible.attribute).to.equal('element-visible');
    expect(props.elementVisible.reflect).to.be.true;
  });

  it("handles base class without properties", async () => {
    class MinimalBase {}
    class TestMinimal extends IntersectionObserverMixin(MinimalBase) {}
    
    const props = TestMinimal.properties;
    expect(props.elementVisible).to.exist;
    expect(Object.keys(props)).to.include('elementVisible');
  });

  // Performance and optimization tests
  it("only creates one observer per element", async () => {
    const initialCount = MockIntersectionObserver.instances.length;
    
    // Multiple calls to connectedCallback shouldn't create multiple observers
    element.connectedCallback();
    element.connectedCallback();
    
    expect(MockIntersectionObserver.instances.length).to.equal(initialCount);
  });

  it("cleans up properly on disconnect", async () => {
    const initialCount = MockIntersectionObserver.instances.length;
    
    element.disconnectedCallback();
    
    // Should have one fewer instance
    expect(MockIntersectionObserver.instances.length).to.equal(initialCount - 1);
  });

  // Accessibility considerations
  it("maintains element accessibility when visibility changes", async () => {
    // Element should remain in DOM and accessible even when not visible
    expect(element.isConnected).to.be.true;
    
    const observer = element.intersectionObserver;
    observer.triggerIntersection(element, 0.1);
    expect(element.elementVisible).to.be.false;
    expect(element.isConnected).to.be.true;
    
    observer.triggerIntersection(element, 0.8);
    expect(element.elementVisible).to.be.true;
    expect(element.isConnected).to.be.true;
  });

  // Integration tests
  it("works with different threshold arrays", async () => {
    const customThresholds = [0.0, 0.33, 0.66, 1.0];
    element.IOThresholds = customThresholds;
    element.disconnectedCallback();
    element.connectedCallback();
    
    const observer = element.intersectionObserver;
    expect(observer.options.threshold).to.deep.equal(customThresholds);
  });

  it("handles rapid visibility changes", async () => {
    element.IORemoveOnVisible = false; // Keep observer active
    element.disconnectedCallback();
    element.connectedCallback();
    
    const observer = element.intersectionObserver;
    
    // Rapid changes
    observer.triggerIntersection(element, 0.8);
    expect(element.elementVisible).to.be.true;
    
    observer.triggerIntersection(element, 0.1);
    expect(element.elementVisible).to.be.false;
    
    observer.triggerIntersection(element, 0.9);
    expect(element.elementVisible).to.be.true;
    
    observer.triggerIntersection(element, 0.0);
    expect(element.elementVisible).to.be.false;
  });

  it("maintains state consistency across reconnections", async () => {
    // Start visible
    element.elementVisible = true;
    
    // Disconnect and reconnect
    element.disconnectedCallback();
    expect(element.elementVisible).to.be.false; // Should reset
    
    element.connectedCallback();
    expect(element.elementVisible).to.be.false; // Should stay false
    expect(element.intersectionObserver).to.exist; // Should have new observer
  });
});
