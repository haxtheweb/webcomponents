import { fixture, expect, html } from "@open-wc/testing";
import "../fluid-type.js";

describe("FluidType test", () => {
  let element;
  
  beforeEach(async () => {
    element = await fixture(html`
      <fluid-type>
        <p>This is fluid typography content that scales with viewport size.</p>
      </fluid-type>
    `);
  });

  // Basic functionality tests
  it("instantiates the element correctly", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("fluid-type");
  });

  it("has shadow DOM attached", () => {
    expect(element.shadowRoot).to.exist;
    expect(element.shadowRoot.mode).to.equal('open');
  });

  // CSS custom properties tests
  it("defines default CSS custom properties", () => {
    const template = element.shadowRoot.querySelector('style');
    expect(template).to.exist;
    
    const cssText = template.textContent;
    expect(cssText).to.include('--fluid-type-min-size: 1');
    expect(cssText).to.include('--fluid-type-max-size: 2');
    expect(cssText).to.include('--fluid-type-min-screen: 20');
    expect(cssText).to.include('--fluid-type-max-screen: 88');
  });

  it("uses calc() function for fluid font sizing", () => {
    const style = element.shadowRoot.querySelector('style');
    const cssText = style.textContent;
    
    expect(cssText).to.include('font-size: calc(');
    expect(cssText).to.include('100vw');
    expect(cssText).to.include('1rem');
  });

  // Template and rendering tests
  it("renders slot for content", () => {
    const slot = element.shadowRoot.querySelector('slot');
    expect(slot).to.exist;
  });

  it("displays slotted content", () => {
    const slottedContent = element.querySelector('p');
    expect(slottedContent).to.exist;
    expect(slottedContent.textContent).to.include('fluid typography content');
  });

  it("creates and uses template element", () => {
    expect(element.template).to.exist;
    expect(element.template.tagName.toLowerCase()).to.equal('template');
  });

  // Lifecycle tests
  it("renders on construction by default", () => {
    const newElement = new FluidType();
    expect(newElement.shadowRoot.innerHTML).to.not.equal('');
  });

  it("can delay rendering when specified", () => {
    const delayedElement = new FluidType(true);
    expect(delayedElement.shadowRoot.innerHTML).to.equal('');
    
    delayedElement.render();
    expect(delayedElement.shadowRoot.innerHTML).to.not.equal('');
  });

  it("has correct tag property", () => {
    expect(element.tag).to.equal('fluid-type');
    expect(FluidType.tag).to.equal('fluid-type');
  });

  // Shadow DOM content tests
  it("contains style element in shadow DOM", () => {
    const style = element.shadowRoot.querySelector('style');
    expect(style).to.exist;
  });

  it("re-renders when render method called", () => {
    const originalHTML = element.shadowRoot.innerHTML;
    element.render();
    expect(element.shadowRoot.innerHTML).to.equal(originalHTML);
  });

  // CSS custom property integration tests
  it("allows customization of fluid type parameters via CSS custom properties", async () => {
    const customElement = await fixture(html`
      <fluid-type style="--fluid-type-min-size: 1.5; --fluid-type-max-size: 3;">
        <h2>Custom sized heading</h2>
      </fluid-type>
    `);
    
    const style = customElement.shadowRoot.querySelector('style');
    expect(style).to.exist;
  });

  // Accessibility tests
  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit with heading content", async () => {
    const headingElement = await fixture(html`
      <fluid-type>
        <h1>Fluid Typography Heading</h1>
        <p>Paragraph with fluid sizing.</p>
      </fluid-type>
    `);
    
    await expect(headingElement).shadowDom.to.be.accessible();
  });

  // Content type tests
  it("works with various content types", async () => {
    const contentTypes = [
      html`<h1>Heading 1</h1>`,
      html`<p>Paragraph text</p>`,
      html`<span>Inline text</span>`,
      html`<div><strong>Bold text</strong> and <em>italic text</em></div>`
    ];
    
    for (const content of contentTypes) {
      const testElement = await fixture(html`<fluid-type>${content}</fluid-type>`);
      
      const slot = testElement.shadowRoot.querySelector('slot');
      expect(slot).to.exist;
      
      const slottedElement = testElement.querySelector('*');
      expect(slottedElement).to.exist;
    }
  });

  // ShadyCSS integration tests
  it("handles ShadyCSS when available", () => {
    // Mock ShadyCSS
    const originalShadyCSS = globalThis.ShadyCSS;
    let prepareTemplateCalled = false;
    let styleElementCalled = false;
    
    globalThis.ShadyCSS = {
      prepareTemplate: () => { prepareTemplateCalled = true; },
      styleElement: () => { styleElementCalled = true; }
    };
    
    const shadyCSSElement = new FluidType();
    document.body.appendChild(shadyCSSElement);
    
    expect(prepareTemplateCalled).to.be.true;
    expect(styleElementCalled).to.be.true;
    
    // Cleanup
    document.body.removeChild(shadyCSSElement);
    globalThis.ShadyCSS = originalShadyCSS;
  });

  // Responsive behavior tests
  it("provides responsive font scaling formula", () => {
    const style = element.shadowRoot.querySelector('style');
    const cssText = style.textContent;
    
    // Should contain the fluid typography formula
    expect(cssText).to.include('var(--fluid-type-min-size) * 1rem');
    expect(cssText).to.include('var(--fluid-type-max-size) - var(--fluid-type-min-size)');
    expect(cssText).to.include('var(--fluid-type-max-screen) - var(--fluid-type-min-screen)');
  });

  // Edge cases and error handling
  it("handles empty content gracefully", async () => {
    const emptyElement = await fixture(html`<fluid-type></fluid-type>`);
    
    const slot = emptyElement.shadowRoot.querySelector('slot');
    expect(slot).to.exist;
  });

  it("handles multiple renders correctly", () => {
    const originalHTML = element.shadowRoot.innerHTML;
    
    element.render();
    element.render();
    element.render();
    
    expect(element.shadowRoot.innerHTML).to.equal(originalHTML);
  });

  // Custom property validation
  it("uses reasonable default values for fluid scaling", () => {
    const style = element.shadowRoot.querySelector('style');
    const cssText = style.textContent;
    
    // Check default values are reasonable
    expect(cssText).to.include('--fluid-type-min-size: 1'); // 1rem minimum
    expect(cssText).to.include('--fluid-type-max-size: 2'); // 2rem maximum
    expect(cssText).to.include('--fluid-type-min-screen: 20'); // 20rem min screen
    expect(cssText).to.include('--fluid-type-max-screen: 88'); // 88rem max screen
  });

  // Integration tests
  it("works as a wrapper for any content", async () => {
    const wrapperElement = await fixture(html`
      <fluid-type>
        <article>
          <header>
            <h1>Article Title</h1>
          </header>
          <section>
            <p>Article content with fluid typography.</p>
          </section>
        </article>
      </fluid-type>
    `);
    
    const article = wrapperElement.querySelector('article');
    expect(article).to.exist;
    
    const header = wrapperElement.querySelector('header');
    expect(header).to.exist;
    
    await expect(wrapperElement).shadowDom.to.be.accessible();
  });

  // Performance tests
  it("efficiently re-renders when needed", () => {
    const renderCount = 10;
    const startTime = performance.now();
    
    for (let i = 0; i < renderCount; i++) {
      element.render();
    }
    
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    // Should complete renders quickly (arbitrary threshold for test)
    expect(renderTime).to.be.lessThan(100);
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("fluid-type passes accessibility test", async () => {
    const el = await fixture(html` <fluid-type></fluid-type> `);
    await expect(el).to.be.accessible();
  });
  it("fluid-type passes accessibility negation", async () => {
    const el = await fixture(
      html`<fluid-type aria-labelledby="fluid-type"></fluid-type>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("fluid-type can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<fluid-type .foo=${'bar'}></fluid-type>`);
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
      const el = await fixture(html`<fluid-type ></fluid-type>`);
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
      const el = await fixture(html`<fluid-type></fluid-type>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<fluid-type></fluid-type>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
