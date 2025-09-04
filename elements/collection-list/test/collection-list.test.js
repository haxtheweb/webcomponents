import { fixture, expect, html, assert } from "@open-wc/testing";
import { setViewport } from "@web/test-runner-commands";
import "../collection-list.js";

// Basic functionality and accessibility tests
describe("collection-list basic functionality", () => {
  let element;
  beforeEach(async () => {
    element = await fixture(html`<collection-list></collection-list>`);
  });

  it("should render correctly", () => {
    expect(element).to.exist;
    expect(element.tagName).to.equal("COLLECTION-LIST");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("has correct default properties", () => {
    expect(element.responsiveSize).to.equal("lg");
  });

  it("renders wrapper element with proper structure", () => {
    const wrapper = element.shadowRoot.querySelector('.wrapper');
    const slot = element.shadowRoot.querySelector('slot');
    
    expect(wrapper).to.exist;
    expect(slot).to.exist;
    expect(wrapper.contains(slot)).to.be.true;
  });
});

// Comprehensive A11y tests
describe("collection-list accessibility tests", () => {
  it("passes accessibility test with default configuration", async () => {
    const el = await fixture(html`<collection-list></collection-list>`);
    await expect(el).to.be.accessible();
  });

  it("maintains accessibility with slotted content", async () => {
    const el = await fixture(html`
      <collection-list>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </collection-list>
    `);
    
    await expect(el).to.be.accessible();
  });

  it("maintains accessibility with complex slotted content", async () => {
    const el = await fixture(html`
      <collection-list>
        <article>
          <h3>Article 1</h3>
          <p>Content for article 1</p>
        </article>
        <article>
          <h3>Article 2</h3>
          <p>Content for article 2</p>
        </article>
      </collection-list>
    `);
    
    await expect(el).to.be.accessible();
  });

  it("maintains accessibility across different responsive sizes", async () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
    
    for (const size of sizes) {
      const el = await fixture(html`
        <collection-list responsive-size="${size}">
          <div>Item</div>
        </collection-list>
      `);
      
      await expect(el).to.be.accessible();
    }
  });
});

// Property validation tests
describe("collection-list property validation", () => {
  it("accepts valid responsive size values", async () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
    
    for (const size of sizes) {
      const el = await fixture(html`
        <collection-list responsive-size="${size}"></collection-list>
      `);
      
      expect(el.responsiveSize).to.equal(size);
      expect(typeof el.responsiveSize).to.equal('string');
    }
  });

  it("updates responsiveSize property reactively", async () => {
    const el = await fixture(html`<collection-list></collection-list>`);
    
    expect(el.responsiveSize).to.equal('lg');
    
    el.responsiveSize = 'sm';
    await el.updateComplete;
    
    expect(el.responsiveSize).to.equal('sm');
  });

  it("reflects responsiveSize attribute", async () => {
    const el = await fixture(html`
      <collection-list responsive-size="xs"></collection-list>
    `);
    
    expect(el.getAttribute('responsive-size')).to.equal('xs');
    
    el.responsiveSize = 'xl';
    await el.updateComplete;
    
    expect(el.getAttribute('responsive-size')).to.equal('xl');
  });

  it("handles invalid responsive size values gracefully", async () => {
    const el = await fixture(html`
      <collection-list responsive-size="invalid"></collection-list>
    `);
    
    expect(el.responsiveSize).to.equal('invalid');
    expect(el).to.exist;
  });
});

// Slot usage and content tests
describe("collection-list slot usage", () => {
  it("renders slotted content correctly", async () => {
    const el = await fixture(html`
      <collection-list>
        <div class="test-item">Test Item 1</div>
        <div class="test-item">Test Item 2</div>
      </collection-list>
    `);
    
    const slot = el.shadowRoot.querySelector('slot');
    const slottedElements = slot.assignedNodes({flatten: true}).filter(node => node.nodeType === Node.ELEMENT_NODE);
    
    expect(slottedElements.length).to.equal(2);
    expect(slottedElements[0].textContent).to.include('Test Item 1');
    expect(slottedElements[1].textContent).to.include('Test Item 2');
  });

  it("handles multiple types of slotted content", async () => {
    const el = await fixture(html`
      <collection-list>
        <h2>Header</h2>
        <p>Paragraph</p>
        <div>Div content</div>
        <article>Article content</article>
        <section>Section content</section>
      </collection-list>
    `);
    
    const slot = el.shadowRoot.querySelector('slot');
    const slottedElements = slot.assignedNodes({flatten: true}).filter(node => node.nodeType === Node.ELEMENT_NODE);
    
    expect(slottedElements.length).to.equal(5);
    expect(slottedElements[0].tagName).to.equal('H2');
    expect(slottedElements[1].tagName).to.equal('P');
    expect(slottedElements[2].tagName).to.equal('DIV');
    expect(slottedElements[3].tagName).to.equal('ARTICLE');
    expect(slottedElements[4].tagName).to.equal('SECTION');
  });

  it("handles complex nested slotted content", async () => {
    const el = await fixture(html`
      <collection-list>
        <div class="card">
          <h3>Card Title 1</h3>
          <p>Card content 1</p>
          <button>Action</button>
        </div>
        <div class="card">
          <h3>Card Title 2</h3>
          <p>Card content 2</p>
          <a href="#">Link</a>
        </div>
      </collection-list>
    `);
    
    const slot = el.shadowRoot.querySelector('slot');
    const slottedElements = slot.assignedNodes({flatten: true}).filter(node => node.nodeType === Node.ELEMENT_NODE);
    
    expect(slottedElements.length).to.equal(2);
    expect(slottedElements[0].querySelector('h3')).to.exist;
    expect(slottedElements[0].querySelector('button')).to.exist;
    expect(slottedElements[1].querySelector('a')).to.exist;
  });

  it("handles empty slot gracefully", async () => {
    const el = await fixture(html`<collection-list></collection-list>`);
    
    const slot = el.shadowRoot.querySelector('slot');
    expect(slot).to.exist;
    
    const slottedElements = slot.assignedNodes({flatten: true}).filter(node => node.nodeType === Node.ELEMENT_NODE);
    expect(slottedElements.length).to.equal(0);
  });
});

// CSS Grid and responsive behavior tests
describe("collection-list responsive grid behavior", () => {
  it("applies correct CSS grid structure", async () => {
    const el = await fixture(html`
      <collection-list>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </collection-list>
    `);
    
    const wrapper = el.shadowRoot.querySelector('.wrapper');
    const computedStyle = getComputedStyle(wrapper);
    
    expect(computedStyle.display).to.equal('grid');
    expect(wrapper.style.getPropertyValue('--cssIdealSize')).to.exist;
  });

  it("has proper container query support", async () => {
    const el = await fixture(html`<collection-list></collection-list>`);
    
    const hostStyle = getComputedStyle(el);
    expect(hostStyle.containerType).to.equal('inline-size');
  });

  it("applies grid template columns based on container size", async () => {
    const el = await fixture(html`
      <collection-list>
        <div>Item</div>
      </collection-list>
    `);
    
    const wrapper = el.shadowRoot.querySelector('.wrapper');
    expect(wrapper).to.exist;
    
    // Test that CSS includes container queries for different breakpoints
    const styles = el.constructor.styles;
    const cssText = styles[1].cssText;
    
    expect(cssText).to.include('@container');
    expect(cssText).to.include('360px');
    expect(cssText).to.include('768px');
    expect(cssText).to.include('1080px');
    expect(cssText).to.include('1440px');
  });
});

// Mobile responsiveness tests
describe("collection-list mobile responsiveness", () => {
  beforeEach(async () => {
    await setViewport({width: 375, height: 750});
  });

  afterEach(async () => {
    await setViewport({width: 1024, height: 768});
  });

  it("adapts to mobile viewport", async () => {
    const el = await fixture(html`
      <collection-list responsive-size="xs">
        <div>Mobile Item 1</div>
        <div>Mobile Item 2</div>
      </collection-list>
    `);
    
    expect(el).to.exist;
    await el.updateComplete;
    
    const computedStyle = getComputedStyle(el);
    expect(computedStyle.display).to.equal('block');
  });

  it("maintains accessibility on mobile", async () => {
    const el = await fixture(html`
      <collection-list responsive-size="xs">
        <article>
          <h3>Mobile Article</h3>
          <p>Mobile content</p>
        </article>
      </collection-list>
    `);
    
    await expect(el).to.be.accessible();
  });
});

// Desktop responsiveness tests
describe("collection-list desktop responsiveness", () => {
  beforeEach(async () => {
    await setViewport({width: 1200, height: 800});
  });

  afterEach(async () => {
    await setViewport({width: 1024, height: 768});
  });

  it("adapts to desktop viewport", async () => {
    const el = await fixture(html`
      <collection-list responsive-size="xl">
        <div>Desktop Item 1</div>
        <div>Desktop Item 2</div>
        <div>Desktop Item 3</div>
      </collection-list>
    `);
    
    expect(el).to.exist;
    await el.updateComplete;
    
    const computedStyle = getComputedStyle(el);
    expect(computedStyle.display).to.equal('block');
  });

  it("handles large collections on desktop", async () => {
    const items = Array.from({length: 12}, (_, i) => `<div>Item ${i + 1}</div>`).join('');
    
    const el = await fixture(html`
      <collection-list responsive-size="xl">
        ${html([items])}
      </collection-list>
    `);
    
    expect(el).to.exist;
    const slot = el.shadowRoot.querySelector('slot');
    const slottedElements = slot.assignedNodes({flatten: true}).filter(node => node.nodeType === Node.ELEMENT_NODE);
    expect(slottedElements.length).to.be.greaterThan(10);
  });
});

// DDD integration tests
describe("collection-list DDD integration", () => {
  it("extends DDD properly", async () => {
    const el = await fixture(html`<collection-list></collection-list>`);
    
    // Check that it has DDD functionality
    expect(el.responsiveSize).to.exist;
    expect(typeof el.responsiveSize).to.equal('string');
  });

  it("uses DDD design system tokens in CSS", async () => {
    const el = await fixture(html`<collection-list></collection-list>`);
    
    // Check that the styles include DDD patterns
    const styles = el.constructor.styles;
    expect(styles).to.be.an('array');
    expect(styles.length).to.be.greaterThan(1); // Should have super.styles + own styles
  });
});

// HAX integration tests
describe("collection-list HAX integration", () => {
  it("has haxProperties configuration", async () => {
    const el = await fixture(html`<collection-list></collection-list>`);
    const haxProps = el.constructor.haxProperties;
    
    expect(haxProps).to.exist;
    expect(typeof haxProps).to.equal('string');
    expect(haxProps).to.include('.haxProperties.json');
  });

  it("has correct tag name", async () => {
    const el = await fixture(html`<collection-list></collection-list>`);
    expect(el.constructor.tag).to.equal('collection-list');
  });
});

// Error handling and edge cases
describe("collection-list error handling", () => {
  it("handles rapid property changes", async () => {
    const el = await fixture(html`<collection-list></collection-list>`);
    
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
    
    // Rapidly change responsive size
    for(let i = 0; i < 20; i++) {
      el.responsiveSize = sizes[i % sizes.length];
    }
    
    await el.updateComplete;
    expect(el.responsiveSize).to.equal('xl'); // Last value
  });

  it("handles mixed content types in slots", async () => {
    const el = await fixture(html`
      <collection-list>
        <div>Text content</div>
        <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="Test">
        <video width="100" height="50" muted>
          <source src="data:video/mp4;base64," type="video/mp4">
        </video>
        <audio controls>
          <source src="data:audio/mpeg;base64," type="audio/mpeg">
        </audio>
        Text node
      </collection-list>
    `);
    
    expect(el).to.exist;
    await expect(el).to.be.accessible();
  });

  it("handles extremely large number of items", async () => {
    const manyItems = Array.from({length: 100}, (_, i) => `<div>Item ${i}</div>`).join('');
    
    const el = await fixture(html`
      <collection-list>
        ${html([manyItems])}
      </collection-list>
    `);
    
    expect(el).to.exist;
    const wrapper = el.shadowRoot.querySelector('.wrapper');
    expect(wrapper).to.exist;
  });

  it("maintains functionality with dynamic content changes", async () => {
    const el = await fixture(html`
      <collection-list>
        <div>Initial Item</div>
      </collection-list>
    `);
    
    // Add more content dynamically
    const newItem = document.createElement('div');
    newItem.textContent = 'Dynamic Item';
    el.appendChild(newItem);
    
    await el.updateComplete;
    
    const slot = el.shadowRoot.querySelector('slot');
    const slottedElements = slot.assignedNodes({flatten: true}).filter(node => node.nodeType === Node.ELEMENT_NODE);
    expect(slottedElements.length).to.equal(2);
  });

  it("handles responsive size changes at runtime", async () => {
    const el = await fixture(html`<collection-list responsive-size="xs"></collection-list>`);
    
    expect(el.responsiveSize).to.equal('xs');
    expect(el.getAttribute('responsive-size')).to.equal('xs');
    
    el.setAttribute('responsive-size', 'xl');
    await el.updateComplete;
    
    expect(el.responsiveSize).to.equal('xl');
    expect(el.getAttribute('responsive-size')).to.equal('xl');
  });
});
