import { fixture, expect, html } from "@open-wc/testing";
import "../figure-label.js";

describe("FigureLabel test", () => {
  let element;
  
  beforeEach(async () => {
    element = await fixture(html`
      <figure-label title="Figure 1.1" description="Sample figure description"></figure-label>
    `);
    await element.updateComplete;
  });

  // Basic functionality tests
  it("instantiates the element with default values", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("figure-label");
  });

  it("has correct default property values", async () => {
    const defaultElement = await fixture(html`<figure-label></figure-label>`);
    expect(defaultElement.title).to.be.undefined;
    expect(defaultElement.description).to.be.undefined;
  });

  // Property validation tests
  it("sets title property correctly", async () => {
    expect(element.title).to.equal("Figure 1.1");
    
    element.title = "Updated Title";
    await element.updateComplete;
    expect(element.title).to.equal("Updated Title");
  });

  it("sets description property correctly", async () => {
    expect(element.description).to.equal("Sample figure description");
    
    element.description = "Updated description";
    await element.updateComplete;
    expect(element.description).to.equal("Updated description");
  });

  // Rendering tests
  it("renders title and description in correct elements", async () => {
    const titleDiv = element.shadowRoot.querySelector('#title');
    const descriptionDiv = element.shadowRoot.querySelector('#description');
    
    expect(titleDiv).to.exist;
    expect(descriptionDiv).to.exist;
    expect(titleDiv.textContent).to.equal('Figure 1.1');
    expect(descriptionDiv.textContent).to.equal('Sample figure description');
  });

  it("updates DOM when properties change", async () => {
    element.title = "New Figure Title";
    element.description = "New figure description";
    await element.updateComplete;
    
    const titleDiv = element.shadowRoot.querySelector('#title');
    const descriptionDiv = element.shadowRoot.querySelector('#description');
    
    expect(titleDiv.textContent).to.equal('New Figure Title');
    expect(descriptionDiv.textContent).to.equal('New figure description');
  });

  // DDD integration tests
  it("extends DDD class correctly", () => {
    expect(element.constructor.styles).to.exist;
    const styleText = element.constructor.styles.toString();
    expect(styleText).to.include('--ddd-');
  });

  it("uses DDD design tokens for styling", () => {
    const styles = element.constructor.styles.toString();
    expect(styles).to.include('--ddd-spacing');
    expect(styles).to.include('--ddd-font-primary');
    expect(styles).to.include('--ddd-theme-accent');
    expect(styles).to.include('--ddd-border-sm');
  });

  // HAX integration tests
  it("has proper HAX properties configuration", () => {
    const haxProps = element.constructor.haxProperties;
    
    expect(haxProps).to.exist;
    expect(haxProps.gizmo.title).to.equal('Figure label');
    expect(haxProps.gizmo.tags).to.include('figure');
    expect(haxProps.gizmo.tags).to.include('a11y');
    expect(haxProps.settings.configure).to.have.length(2);
  });

  it("configures title and description in HAX settings", () => {
    const haxProps = element.constructor.haxProperties;
    const configure = haxProps.settings.configure;
    
    const titleConfig = configure.find(c => c.property === 'title');
    const descriptionConfig = configure.find(c => c.property === 'description');
    
    expect(titleConfig).to.exist;
    expect(titleConfig.inputMethod).to.equal('textfield');
    expect(descriptionConfig).to.exist;
    expect(descriptionConfig.inputMethod).to.equal('textfield');
  });

  // Accessibility tests
  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit with various content", async () => {
    const testCases = [
      { title: "Figure 1", description: "Chart showing data trends" },
      { title: "Table 2.1", description: "Summary statistics" },
      { title: "Image A", description: "Photograph of the research site" }
    ];
    
    for (const testCase of testCases) {
      const testElement = await fixture(html`
        <figure-label title="${testCase.title}" description="${testCase.description}"></figure-label>
      `);
      
      await expect(testElement).shadowDom.to.be.accessible();
    }
  });

  // Layout and styling tests
  it("has correct flexbox layout structure", async () => {
    const wrap = element.shadowRoot.querySelector('#wrap');
    const titleDiv = element.shadowRoot.querySelector('#title');
    const descriptionDiv = element.shadowRoot.querySelector('#description');
    
    expect(wrap).to.exist;
    expect(titleDiv).to.exist;
    expect(descriptionDiv).to.exist;
    
    // Check that elements are children of wrap
    expect(wrap.contains(titleDiv)).to.be.true;
    expect(wrap.contains(descriptionDiv)).to.be.true;
  });

  // Edge cases and error handling
  it("handles empty title and description gracefully", async () => {
    element.title = "";
    element.description = "";
    await element.updateComplete;
    
    const titleDiv = element.shadowRoot.querySelector('#title');
    const descriptionDiv = element.shadowRoot.querySelector('#description');
    
    expect(titleDiv.textContent).to.equal('');
    expect(descriptionDiv.textContent).to.equal('');
  });

  it("handles special characters in title and description", async () => {
    element.title = "Figure 1.1: Data & Analysis (2023)";
    element.description = "Chart showing 'trends' with <special> characters & émojis 📊";
    await element.updateComplete;
    
    const titleDiv = element.shadowRoot.querySelector('#title');
    const descriptionDiv = element.shadowRoot.querySelector('#description');
    
    expect(titleDiv.textContent).to.include('&');
    expect(titleDiv.textContent).to.include('(2023)');
    expect(descriptionDiv.textContent).to.include("'trends'");
    expect(descriptionDiv.textContent).to.include('📊');
  });

  it("handles long title and description text", async () => {
    const longTitle = "Figure 1.1: This is a very long title that might wrap to multiple lines in the figure label component";
    const longDescription = "This is a very detailed description of the figure that provides comprehensive information about what the figure contains, how it was created, and what insights can be drawn from it. The description continues with additional details.";
    
    element.title = longTitle;
    element.description = longDescription;
    await element.updateComplete;
    
    const titleDiv = element.shadowRoot.querySelector('#title');
    const descriptionDiv = element.shadowRoot.querySelector('#description');
    
    expect(titleDiv.textContent).to.equal(longTitle);
    expect(descriptionDiv.textContent).to.equal(longDescription);
  });

  // Rapid property changes
  it("handles rapid property changes", async () => {
    const changes = [
      { title: "Title 1", description: "Description 1" },
      { title: "Title 2", description: "Description 2" },
      { title: "Title 3", description: "Description 3" }
    ];
    
    for (const change of changes) {
      element.title = change.title;
      element.description = change.description;
      await element.updateComplete;
    }
    
    const titleDiv = element.shadowRoot.querySelector('#title');
    const descriptionDiv = element.shadowRoot.querySelector('#description');
    
    expect(titleDiv.textContent).to.equal('Title 3');
    expect(descriptionDiv.textContent).to.equal('Description 3');
  });

  // CSS custom property integration
  it("supports CSS custom property theming", () => {
    const styles = element.constructor.styles.toString();
    
    expect(styles).to.include('--ddd-component-figure-label-title');
    expect(styles).to.include('--ddd-component-figure-label-title-text');
    expect(styles).to.include('--ddd-component-figure-label-description-background');
    expect(styles).to.include('--ddd-component-figure-label-description-text');
  });

  // Hidden state test
  it("handles hidden attribute correctly", async () => {
    element.hidden = true;
    await element.updateComplete;
    
    expect(element.hasAttribute('hidden')).to.be.true;
  });

  // Integration with figure/media elements
  it("works as a caption for figure elements", async () => {
    const figureWithLabel = await fixture(html`
      <figure>
        <img src="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='50'><rect width='100' height='50' fill='gray'/></svg>" alt="Test image" />
        <figure-label title="Figure 1" description="Test image for figure labeling"></figure-label>
      </figure>
    `);
    
    const label = figureWithLabel.querySelector('figure-label');
    expect(label).to.exist;
    expect(label.title).to.equal('Figure 1');
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("figure-label passes accessibility test", async () => {
    const el = await fixture(html` <figure-label></figure-label> `);
    await expect(el).to.be.accessible();
  });
  it("figure-label passes accessibility negation", async () => {
    const el = await fixture(
      html`<figure-label aria-labelledby="figure-label"></figure-label>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("figure-label can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<figure-label .foo=${'bar'}></figure-label>`);
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
      const el = await fixture(html`<figure-label ></figure-label>`);
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
      const el = await fixture(html`<figure-label></figure-label>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<figure-label></figure-label>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
