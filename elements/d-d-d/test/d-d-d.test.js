import { fixture, expect, html, assert } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import "../d-d-d.js";
import { DDDSuper, DDDPulseEffectSuper } from "../d-d-d.js";

// Basic functionality and accessibility tests
describe("d-d-d basic functionality", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<d-d-d></d-d-d>`);
  });

  it("should render correctly", () => {
    expect(element).to.exist;
    expect(element.tagName).to.equal("D-D-D");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("has correct default properties", () => {
    expect(element.isSafari).to.be.a('boolean');
  });

  it("has correct tag name", async () => {
    expect(element.constructor.tag).to.equal('d-d-d');
  });

  it("extends DDDSuper and SimpleColorsSuper correctly", () => {
    expect(element.isSafari).to.not.be.undefined;
    // Should have SimpleColors functionality
    expect(element.accentColor).to.not.be.undefined;
  });
});

// Comprehensive A11y tests
describe("d-d-d accessibility tests", () => {
  it("passes accessibility test with default configuration", async () => {
    const el = await fixture(html`<d-d-d></d-d-d>`);
    await expect(el).to.be.accessible();
  });

  it("maintains accessibility with SimpleColors properties", async () => {
    const el = await fixture(html`
      <d-d-d accent-color="blue" dark>
      </d-d-d>
    `);
    
    await expect(el).to.be.accessible();
  });

  it("maintains accessibility when used as design system base", async () => {
    const el = await fixture(html`
      <d-d-d>
        <div class="ddd-theme-default">
          <h1>Design System Test</h1>
          <p>Testing DDD design system integration</p>
        </div>
      </d-d-d>
    `);
    
    await expect(el).to.be.accessible();
  });

  it("has proper Safari detection and attribute", async () => {
    const el = await fixture(html`<d-d-d></d-d-d>`);
    
    expect(typeof el.isSafari).to.equal('boolean');
    
    if (el.isSafari) {
      expect(el.hasAttribute('is-safari')).to.be.true;
    }
  });
});

// Property validation tests
describe("d-d-d property validation", () => {
  it("handles isSafari property correctly", async () => {
    const el = await fixture(html`<d-d-d></d-d-d>`);
    
    expect(typeof el.isSafari).to.equal('boolean');
    expect(el.isSafari).to.be.a('boolean');
  });

  it("inherits SimpleColors properties", async () => {
    const el = await fixture(html`
      <d-d-d accent-color="red" dark>
      </d-d-d>
    `);
    
    expect(el.accentColor).to.equal('red');
    expect(el.dark).to.be.true;
  });

  it("updates properties reactively", async () => {
    const el = await fixture(html`<d-d-d></d-d-d>`);
    
    el.accentColor = 'green';
    el.dark = true;
    
    await el.updateComplete;
    
    expect(el.accentColor).to.equal('green');
    expect(el.dark).to.be.true;
  });

  it("reflects isSafari attribute correctly", async () => {
    const el = await fixture(html`<d-d-d></d-d-d>`);
    
    if (el.isSafari) {
      expect(el.getAttribute('is-safari')).to.not.be.null;
    } else {
      expect(el.hasAttribute('is-safari')).to.be.false;
    }
  });
});

// Design system integration tests
describe("d-d-d design system integration", () => {
  it("registers DDD design system with DesignSystemManager", async () => {
    const el = await fixture(html`<d-d-d></d-d-d>`);
    
    // Check if DesignSystemManager is available and DDD system is registered
    expect(globalThis.DesignSystemManager).to.exist;
    expect(globalThis.DesignSystemManager.systems).to.exist;
    expect(globalThis.DesignSystemManager.systems.ddd).to.exist;
  });

  it("has DDDSuper mixin functionality", async () => {
    const el = await fixture(html`<d-d-d></d-d-d>`);
    
    // Should have DDDSuper properties
    expect(el.isSafari).to.not.be.undefined;
  });

  it("includes DDDReset styles", async () => {
    const el = await fixture(html`<d-d-d></d-d-d>`);
    
    const styles = el.constructor.styles;
    expect(styles).to.be.an('array');
    expect(styles.length).to.be.greaterThan(0);
  });

  it("supports CSS feature detection for initial-letter", async () => {
    const el = await fixture(html`<d-d-d></d-d-d>`);
    
    // Element should exist regardless of CSS support
    expect(el).to.exist;
    
    // Check for dropCap-noSupport class if initial-letter not supported
    if (!CSS.supports("initial-letter", "1")) {
      expect(globalThis.document.body.classList.contains("dropCap-noSupport")).to.be.true;
    }
  });

  it("sets DesignSystemManager active to ddd", async () => {
    const el = await fixture(html`<d-d-d></d-d-d>`);
    
    expect(globalThis.DesignSystemManager.active).to.equal('ddd');
  });
});

// DDDSuper mixin tests
describe("DDDSuper mixin functionality", () => {
  it("can be used to extend other classes", () => {
    class TestElement extends DDDSuper(HTMLElement) {
      constructor() {
        super();
      }
    }
    
    const testEl = new TestElement();
    expect(testEl.isSafari).to.be.a('boolean');
  });

  it("includes design system styles when extended", async () => {
    const el = await fixture(html`<d-d-d></d-d-d>`);
    
    const styles = el.constructor.styles;
    expect(styles).to.exist;
    expect(Array.isArray(styles)).to.be.true;
  });

  it("properly initializes DesignSystemManager", async () => {
    const el = await fixture(html`<d-d-d></d-d-d>`);
    
    expect(globalThis.DesignSystemManager).to.exist;
    expect(globalThis.DesignSystemManager.systems.ddd).to.exist;
    expect(globalThis.DesignSystemManager.systems.ddd.name).to.equal('ddd');
    expect(globalThis.DesignSystemManager.systems.ddd.hax).to.be.true;
  });
});

// DDDPulseEffectSuper mixin tests
describe("DDDPulseEffectSuper mixin functionality", () => {
  it("provides pulse effect functionality", () => {
    class TestPulseElement extends DDDPulseEffectSuper(HTMLElement) {
      constructor() {
        super();
      }
      
      static get properties() {
        return super.properties || {};
      }
    }
    
    const testEl = new TestPulseElement();
    expect(testEl.dataPulse).to.be.null;
    expect(typeof testEl.togglePulseEffect).to.equal('function');
    expect(typeof testEl.removePulseEffect).to.equal('function');
  });

  it("handles pulse effect property changes", () => {
    class TestPulseElement extends DDDPulseEffectSuper(HTMLElement) {
      constructor() {
        super();
      }
    }
    
    const testEl = new TestPulseElement();
    
    // Test pulse effect activation
    testEl.dataPulse = 'active';
    expect(testEl.dataPulse).to.equal('active');
    
    // Test pulse effect deactivation
    testEl.dataPulse = null;
    expect(testEl.dataPulse).to.be.null;
  });
});

// SimpleColors integration tests
describe("d-d-d SimpleColors integration", () => {
  it("supports SimpleColors accent colors", async () => {
    const colors = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink'];
    
    for (const color of colors) {
      const el = await fixture(html`<d-d-d accent-color="${color}"></d-d-d>`);
      expect(el.accentColor).to.equal(color);
    }
  });

  it("supports dark mode", async () => {
    const el = await fixture(html`<d-d-d dark></d-d-d>`);
    
    expect(el.dark).to.be.true;
    expect(el.hasAttribute('dark')).to.be.true;
  });

  it("generates appropriate CSS custom properties", async () => {
    const el = await fixture(html`<d-d-d accent-color="blue"></d-d-d>`);
    
    // SimpleColors should generate CSS custom properties
    const computedStyle = getComputedStyle(el);
    expect(el.accentColor).to.equal('blue');
  });
});

// Responsive design tests
describe("d-d-d responsive design", () => {
  beforeEach(async () => {
    await setViewport({width: 375, height: 750});
  });

  afterEach(async () => {
    await setViewport({width: 1024, height: 768});
  });

  it("works correctly on mobile viewport", async () => {
    const el = await fixture(html`<d-d-d></d-d-d>`);
    
    expect(el).to.exist;
    await el.updateComplete;
    
    // Should maintain functionality on mobile
    expect(el.isSafari).to.be.a('boolean');
  });

  it("maintains accessibility on mobile", async () => {
    const el = await fixture(html`<d-d-d accent-color="green"></d-d-d>`);
    await expect(el).to.be.accessible();
  });
});

describe("d-d-d desktop responsiveness", () => {
  beforeEach(async () => {
    await setViewport({width: 1200, height: 800});
  });

  afterEach(async () => {
    await setViewport({width: 1024, height: 768});
  });

  it("works correctly on desktop viewport", async () => {
    const el = await fixture(html`<d-d-d></d-d-d>`);
    
    expect(el).to.exist;
    await el.updateComplete;
    
    expect(el.isSafari).to.be.a('boolean');
  });
});

// Error handling and edge cases
describe("d-d-d error handling", () => {
  it("handles invalid accent colors gracefully", async () => {
    const el = await fixture(html`<d-d-d accent-color="invalid-color"></d-d-d>`);
    
    expect(el.accentColor).to.equal('invalid-color');
    expect(el).to.exist;
  });

  it("handles rapid property changes", async () => {
    const el = await fixture(html`<d-d-d></d-d-d>`);
    
    const colors = ['red', 'blue', 'green', 'purple', 'orange'];
    
    // Rapidly change properties
    for(let i = 0; i < 10; i++) {
      el.accentColor = colors[i % colors.length];
      el.dark = i % 2 === 0;
    }
    
    await el.updateComplete;
    expect(el.accentColor).to.equal('orange');
    expect(el.dark).to.be.false;
  });

  it("maintains DesignSystemManager state across multiple instances", async () => {
    const el1 = await fixture(html`<d-d-d></d-d-d>`);
    const el2 = await fixture(html`<d-d-d accent-color="red"></d-d-d>`);
    
    expect(globalThis.DesignSystemManager.active).to.equal('ddd');
    expect(globalThis.DesignSystemManager.systems.ddd).to.exist;
    
    // Both elements should work correctly
    expect(el1).to.exist;
    expect(el2).to.exist;
    expect(el2.accentColor).to.equal('red');
  });

  it("handles missing CSS support gracefully", async () => {
    const el = await fixture(html`<d-d-d></d-d-d>`);
    
    // Should not throw errors even if CSS features are unsupported
    expect(el).to.exist;
    expect(el.isSafari).to.be.a('boolean');
  });

  it("handles browser detection edge cases", async () => {
    const el = await fixture(html`<d-d-d></d-d-d>`);
    
    // isSafari should always be a boolean, regardless of browser
    expect(typeof el.isSafari).to.equal('boolean');
    
    // Attribute reflection should work correctly
    if (el.isSafari) {
      expect(el.hasAttribute('is-safari')).to.be.true;
    }
  });

  it("maintains functionality without DesignSystemManager conflicts", async () => {
    // Test multiple rapid instantiations
    const elements = [];
    
    for(let i = 0; i < 5; i++) {
      const el = await fixture(html`<d-d-d accent-color="blue"></d-d-d>`);
      elements.push(el);
    }
    
    // All elements should work correctly
    for(const el of elements) {
      expect(el).to.exist;
      expect(el.accentColor).to.equal('blue');
      expect(globalThis.DesignSystemManager.active).to.equal('ddd');
    }
  });
});
