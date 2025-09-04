import { html, fixture, expect } from '@open-wc/testing';
import "../example-hax-element.js";

describe("ExampleHaxElement test", () => {
  let element;
  
  beforeEach(async () => {
    element = await fixture(html`
      <example-hax-element title="Test Title"></example-hax-element>
    `);
    await element.updateComplete;
  });

  // Basic functionality tests
  it("instantiates the element correctly", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("example-hax-element");
  });

  it("has correct default property values", async () => {
    const defaultElement = await fixture(html`<example-hax-element></example-hax-element>`);
    await defaultElement.updateComplete;
    
    expect(defaultElement.title).to.equal("");
    expect(defaultElement.t).to.exist;
    expect(defaultElement.t.title).to.equal("Title");
  });

  // Property validation tests
  it("sets and gets title property correctly", async () => {
    element.title = "New Test Title";
    await element.updateComplete;
    
    expect(element.title).to.equal("New Test Title");
  });

  it("handles empty title property", async () => {
    element.title = "";
    await element.updateComplete;
    
    expect(element.title).to.equal("");
  });

  it("handles special characters in title", async () => {
    const specialTitle = "Title with & < > \" ' symbols and émojis 🎉";
    element.title = specialTitle;
    await element.updateComplete;
    
    expect(element.title).to.equal(specialTitle);
  });

  // Rendering tests
  it("renders shadow DOM correctly", () => {
    expect(element.shadowRoot).to.exist;
    
    const wrapper = element.shadowRoot.querySelector('.wrapper');
    expect(wrapper).to.exist;
    
    const h3 = element.shadowRoot.querySelector('h3');
    expect(h3).to.exist;
    
    const slot = element.shadowRoot.querySelector('slot');
    expect(slot).to.exist;
  });

  it("displays title in template", async () => {
    element.title = "Rendered Title";
    await element.updateComplete;
    
    const h3 = element.shadowRoot.querySelector('h3');
    expect(h3.textContent).to.include("Rendered Title");
    expect(h3.textContent).to.include("Title:"); // Localized label
  });

  it("renders slot content correctly", async () => {
    const elementWithSlot = await fixture(html`
      <example-hax-element title="Slotted Test">
        <p>This is slotted content</p>
        <div>Multiple elements</div>
      </example-hax-element>
    `);
    await elementWithSlot.updateComplete;
    
    const slotElement = elementWithSlot.shadowRoot.querySelector('slot');
    expect(slotElement).to.exist;
    
    // Check that slotted content is accessible
    const slottedP = elementWithSlot.querySelector('p');
    const slottedDiv = elementWithSlot.querySelector('div');
    expect(slottedP).to.exist;
    expect(slottedDiv).to.exist;
    expect(slottedP.textContent).to.equal("This is slotted content");
    expect(slottedDiv.textContent).to.equal("Multiple elements");
  });

  // DDD integration tests
  it("extends DDDSuper correctly", () => {
    expect(element.constructor.name).to.equal('ExampleHaxElement');
    // Should inherit DDD properties
    expect(element.constructor.properties).to.exist;
  });

  it("uses DDD CSS custom properties", () => {
    const styles = element.constructor.styles;
    expect(styles).to.exist;
    
    const stylesText = styles.toString();
    expect(stylesText).to.include('--ddd-theme-primary');
    expect(stylesText).to.include('--ddd-theme-accent');
    expect(stylesText).to.include('--ddd-font-navigation');
    expect(stylesText).to.include('--ddd-spacing-2');
    expect(stylesText).to.include('--ddd-spacing-4');
  });

  it("has correct display property from CSS", () => {
    const computedStyle = getComputedStyle(element);
    expect(computedStyle.display).to.equal('block');
  });

  // I18N integration tests
  it("extends I18NMixin correctly", () => {
    expect(element.t).to.exist;
    expect(element.t.title).to.equal("Title");
  });

  it("registers localization correctly", () => {
    expect(element.t).to.be.an('object');
    expect(element.t.title).to.be.a('string');
  });

  it("has localization configuration", () => {
    // The registerLocalization call should have been made during construction
    expect(element.t).to.exist;
    // Default title should be set
    expect(element.t.title).to.equal("Title");
  });

  // HAX integration tests
  it("provides haxProperties", () => {
    const haxProps = element.constructor.haxProperties;
    expect(haxProps).to.exist;
    expect(haxProps).to.be.a('string');
    expect(haxProps).to.include('.haxProperties.json');
  });

  it("has correct tag name", () => {
    expect(element.constructor.tag).to.equal("example-hax-element");
  });

  // Accessibility tests
  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit with different titles", async () => {
    element.title = "Accessibility Test Title";
    await element.updateComplete;
    
    await expect(element).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit with slotted content", async () => {
    const accessibleElement = await fixture(html`
      <example-hax-element title="Accessible Test">
        <p role="complementary">Accessible slotted content</p>
        <button type="button">Accessible button</button>
      </example-hax-element>
    `);
    await accessibleElement.updateComplete;
    
    await expect(accessibleElement).shadowDom.to.be.accessible();
  });

  // Style integration tests
  it("supports CSS custom properties", () => {
    const styles = element.constructor.styles;
    const styleText = styles.toString();
    
    expect(styleText).to.include('var(--example-hax-element-label-font-size');
    expect(styleText).to.include('var(--ddd-font-size-s)');
  });

  it("has proper wrapper styling", () => {
    const wrapper = element.shadowRoot.querySelector('.wrapper');
    expect(wrapper).to.exist;
    
    const styles = getComputedStyle(wrapper);
    // Verify margin and padding are applied (though exact values depend on DDD)
    expect(styles.margin).to.not.equal('');
    expect(styles.padding).to.not.equal('');
  });

  // Edge cases and error handling
  it("handles null/undefined title gracefully", async () => {
    element.title = null;
    await element.updateComplete;
    expect(element.title).to.be.null;
    
    element.title = undefined;
    await element.updateComplete;
    expect(element.title).to.be.undefined;
  });

  it("handles very long titles", async () => {
    const longTitle = "This is a very long title that might cause layout issues if not handled properly ".repeat(10);
    element.title = longTitle;
    await element.updateComplete;
    
    expect(element.title).to.equal(longTitle);
    
    const h3 = element.shadowRoot.querySelector('h3');
    expect(h3.textContent).to.include(longTitle);
  });

  it("handles HTML entities in title", async () => {
    const entityTitle = "Title with &amp; &lt; &gt; &quot; entities";
    element.title = entityTitle;
    await element.updateComplete;
    
    expect(element.title).to.equal(entityTitle);
  });

  // Performance tests
  it("handles rapid property changes efficiently", async () => {
    const titles = ['Title 1', 'Title 2', 'Title 3', 'Title 4', 'Title 5'];
    
    const startTime = performance.now();
    
    for (const title of titles) {
      element.title = title;
      await element.updateComplete;
    }
    
    const endTime = performance.now();
    expect(endTime - startTime).to.be.lessThan(100); // Should be fast
    expect(element.title).to.equal('Title 5');
  });

  // Integration tests
  it("works with different instantiation methods", async () => {
    // Direct creation
    const directElement = document.createElement('example-hax-element');
    directElement.title = "Direct Creation";
    expect(directElement.title).to.equal("Direct Creation");
    
    // HTML instantiation
    const htmlElement = await fixture(html`
      <example-hax-element title="HTML Creation"></example-hax-element>
    `);
    expect(htmlElement.title).to.equal("HTML Creation");
  });

  it("maintains state during DOM operations", async () => {
    element.title = "Persistent Title";
    await element.updateComplete;
    
    // Simulate DOM operations
    const parent = element.parentNode;
    parent.removeChild(element);
    parent.appendChild(element);
    
    await element.updateComplete;
    expect(element.title).to.equal("Persistent Title");
  });

  // Complex scenarios
  it("handles complex nested slotted content", async () => {
    const complexElement = await fixture(html`
      <example-hax-element title="Complex Content">
        <div class="nested">
          <h4>Nested Heading</h4>
          <p>Nested paragraph with <strong>strong text</strong></p>
          <ul>
            <li>List item 1</li>
            <li>List item 2</li>
          </ul>
        </div>
        <footer>Footer content</footer>
      </example-hax-element>
    `);
    await complexElement.updateComplete;
    
    expect(complexElement.querySelector('.nested')).to.exist;
    expect(complexElement.querySelector('h4')).to.exist;
    expect(complexElement.querySelector('footer')).to.exist;
    
    await expect(complexElement).shadowDom.to.be.accessible();
  });

  it("maintains functionality with multiple instances", async () => {
    const element1 = await fixture(html`<example-hax-element title="Instance 1"></example-hax-element>`);
    const element2 = await fixture(html`<example-hax-element title="Instance 2"></example-hax-element>`);
    
    await element1.updateComplete;
    await element2.updateComplete;
    
    expect(element1.title).to.equal("Instance 1");
    expect(element2.title).to.equal("Instance 2");
    
    // Modify one and ensure the other is unaffected
    element1.title = "Modified Instance 1";
    await element1.updateComplete;
    
    expect(element1.title).to.equal("Modified Instance 1");
    expect(element2.title).to.equal("Instance 2");
  });

  // Localization edge cases
  it("handles missing localization gracefully", () => {
    // Even if localization fails, the element should still function
    expect(element.t).to.exist;
    expect(element.t.title).to.be.a('string');
  });
});

describe("ExampleHaxElement A11y tests", () => {
  it("passes accessibility test with minimal configuration", async () => {
    const el = await fixture(html`<example-hax-element></example-hax-element>`);
    await expect(el).shadowDom.to.be.accessible();
  });

  it("passes accessibility with complex configuration", async () => {
    const el = await fixture(html`
      <example-hax-element title="Accessibility Test">
        <div role="main">
          <h2>Main Content</h2>
          <p>This is the main content area.</p>
        </div>
      </example-hax-element>
    `);
    await expect(el).shadowDom.to.be.accessible();
  });
});
