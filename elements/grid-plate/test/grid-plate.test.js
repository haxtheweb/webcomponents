import { fixture, expect, html } from "@open-wc/testing";
import "../grid-plate.js";

describe("GridPlate test", () => {
  let element;
  
  beforeEach(async () => {
    element = await fixture(html`
      <grid-plate layout="1-1">
        <p slot="col-1">First column content</p>
        <p slot="col-2">Second column content</p>
      </grid-plate>
    `);
    await element.updateComplete;
  });

  // Basic functionality tests
  it("instantiates the element correctly", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("grid-plate");
  });

  it("has correct default values", () => {
    expect(element.layout).to.equal("1-1");
    expect(element.columns).to.equal(4);
    expect(element.disableResponsive).to.be.false;
    expect(element.breakpointSm).to.equal(900);
    expect(element.breakpointMd).to.equal(1200);
    expect(element.breakpointLg).to.equal(1500);
    expect(element.breakpointXl).to.equal(1800);
  });

  // Layout tests
  it("applies different layout configurations", async () => {
    const layouts = ['1', '1-1', '2-1', '1-2', '1-1-1', '1-1-1-1'];
    
    for (const layout of layouts) {
      element.layout = layout;
      await element.updateComplete;
      expect(element.layout).to.equal(layout);
      expect(element.getAttribute('layout')).to.equal(layout);
    }
  });

  it("renders correct number of columns", () => {
    const columns = element.shadowRoot.querySelectorAll('.column');
    expect(columns.length).to.equal(6); // Always renders 6, but shows based on layout
  });

  it("shows/hides columns based on layout", async () => {
    element.layout = '1-1'; // 2 columns
    await element.updateComplete;
    
    const visibleColumns = element.shadowRoot.querySelectorAll('.column:not(.not-shown)');
    const hiddenColumns = element.shadowRoot.querySelectorAll('.column.not-shown');
    
    expect(visibleColumns.length).to.be.greaterThan(0);
    expect(hiddenColumns.length).to.be.greaterThan(0);
  });

  // Slot content tests
  it("renders slotted content correctly", () => {
    const col1Content = element.querySelector('[slot="col-1"]');
    const col2Content = element.querySelector('[slot="col-2"]');
    
    expect(col1Content).to.exist;
    expect(col2Content).to.exist;
    expect(col1Content.textContent).to.equal('First column content');
    expect(col2Content.textContent).to.equal('Second column content');
  });

  // Responsive behavior tests
  it("handles responsive size changes", async () => {
    element.responsiveSize = 'lg';
    await element.updateComplete;
    expect(element.responsiveSize).to.equal('lg');
  });

  it("can disable responsive behavior", async () => {
    element.disableResponsive = true;
    await element.updateComplete;
    
    expect(element.disableResponsive).to.be.true;
    expect(element.hasAttribute('disable-responsive')).to.be.true;
  });

  // Margin and padding tests
  it("applies custom item margins and padding", async () => {
    element.itemMargin = 20;
    element.itemPadding = 24;
    await element.updateComplete;
    
    expect(element.itemMargin).to.equal(20);
    expect(element.itemPadding).to.equal(24);
  });

  // Layout calculation tests
  it("calculates column widths correctly", () => {
    const widths = element._getColumnWidths('md', '1-1', element.layouts, false);
    expect(widths).to.be.an('array');
    expect(widths.length).to.equal(2);
    expect(widths[0]).to.equal('50%');
    expect(widths[1]).to.equal('50%');
  });

  it("gets individual column width", () => {
    const width = element._getColumnWidth(0, ['50%', '50%']);
    expect(width).to.equal('width:50%');
  });

  // HAX integration tests
  it("has proper HAX properties configuration", () => {
    const haxProps = element.constructor.haxProperties;
    
    expect(haxProps).to.exist;
    expect(haxProps.type).to.equal('grid');
    expect(haxProps.gizmo.title).to.equal('Column layout');
    expect(haxProps.settings.configure).to.be.an('array');
  });

  // Grid plate layout options tests
  it("has comprehensive layout options", () => {
    expect(element.layouts).to.exist;
    expect(element.layouts['1']).to.exist;
    expect(element.layouts['1-1']).to.exist;
    expect(element.layouts['1-1-1']).to.exist;
    expect(element.layouts['1-1-1-1']).to.exist;
  });

  // Accessibility tests
  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit with complex content", async () => {
    const complexElement = await fixture(html`
      <grid-plate layout="1-1-1">
        <div slot="col-1">
          <h2>Column 1 Header</h2>
          <p>Content for first column</p>
        </div>
        <div slot="col-2">
          <h2>Column 2 Header</h2>
          <p>Content for second column</p>
        </div>
        <div slot="col-3">
          <h2>Column 3 Header</h2>
          <p>Content for third column</p>
        </div>
      </grid-plate>
    `);
    
    await expect(complexElement).shadowDom.to.be.accessible();
  });

  // Edge cases
  it("handles empty layout gracefully", async () => {
    element.layout = '';
    await element.updateComplete;
    
    const widths = element._getColumnWidths('md', '', element.layouts, false);
    expect(widths).to.exist;
  });

  it("handles invalid responsive size", () => {
    const widths = element._getColumnWidths('invalid', '1-1', element.layouts, false);
    expect(widths).to.exist;
  });

  // Performance tests
  it("efficiently calculates layouts", async () => {
    const layouts = ['1', '1-1', '2-1', '1-2', '1-1-1', '1-1-1-1'];
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
    
    const startTime = performance.now();
    
    for (const layout of layouts) {
      for (const size of sizes) {
        element._getColumnWidths(size, layout, element.layouts, false);
      }
    }
    
    const endTime = performance.now();
    expect(endTime - startTime).to.be.lessThan(50); // Should be fast
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("grid-plate passes accessibility test", async () => {
    const el = await fixture(html` <grid-plate></grid-plate> `);
    await expect(el).to.be.accessible();
  });
  it("grid-plate passes accessibility negation", async () => {
    const el = await fixture(
      html`<grid-plate aria-labelledby="grid-plate"></grid-plate>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("grid-plate can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<grid-plate .foo=${'bar'}></grid-plate>`);
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
      const el = await fixture(html`<grid-plate ></grid-plate>`);
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
      const el = await fixture(html`<grid-plate></grid-plate>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<grid-plate></grid-plate>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
