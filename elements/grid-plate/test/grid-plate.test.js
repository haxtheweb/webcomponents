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
    expect(element.breakpointSm).to.equal(600);
    expect(element.breakpointMd).to.equal(900);
    expect(element.breakpointLg).to.equal(1200);
    expect(element.breakpointXl).to.equal(1500);
  });

  // Layout tests
  it("applies different layout configurations", async () => {
    const layouts = ["1", "1-1", "2-1", "1-2", "1-1-1", "1-1-1-1"];

    for (const layout of layouts) {
      element.layout = layout;
      await element.updateComplete;
      expect(element.layout).to.equal(layout);
      expect(element.getAttribute("layout")).to.equal(layout);
    }
  });

  it("renders correct number of columns", () => {
    const columns = element.shadowRoot.querySelectorAll(".column");
    expect(columns.length).to.equal(6); // Always renders 6, but shows based on layout
  });

  it("shows/hides columns based on layout", async () => {
    element.layout = "1-1"; // 2 columns
    await element.updateComplete;

    const visibleColumns = element.shadowRoot.querySelectorAll(
      ".column:not(.not-shown)",
    );
    const hiddenColumns =
      element.shadowRoot.querySelectorAll(".column.not-shown");

    expect(visibleColumns.length).to.be.greaterThan(0);
    expect(hiddenColumns.length).to.be.greaterThan(0);
  });

  // Slot content tests
  it("renders slotted content correctly", () => {
    const col1Content = element.querySelector('[slot="col-1"]');
    const col2Content = element.querySelector('[slot="col-2"]');

    expect(col1Content).to.exist;
    expect(col2Content).to.exist;
    expect(col1Content.textContent).to.equal("First column content");
    expect(col2Content.textContent).to.equal("Second column content");
  });

  // Responsive behavior tests
  it("handles responsive size changes", async () => {
    element.responsiveSize = "lg";
    await element.updateComplete;
    expect(element.responsiveSize).to.equal("lg");
  });

  it("can disable responsive behavior", async () => {
    element.disableResponsive = true;
    await element.updateComplete;

    expect(element.disableResponsive).to.be.true;
    expect(element.hasAttribute("disable-responsive")).to.be.true;
  });

  it("stacks at xs breakpoint when responsive behavior is disabled", () => {
    const widths = element._getColumnWidths("xs", "1-1", element.layouts, true);

    expect(widths).to.deep.equal(["100%", "100%"]);
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
    const widths = element._getColumnWidths(
      "md",
      "1-1",
      element.layouts,
      false,
    );
    expect(widths).to.be.an("array");
    expect(widths.length).to.equal(2);
    expect(widths[0]).to.equal("50%");
    expect(widths[1]).to.equal("50%");
  });

  it("gets individual column width", () => {
    const width = element._getColumnWidth(0, ["50%", "50%"]);
    expect(width).to.equal("width:50%");
  });

  // HAX integration tests
  it("has proper HAX properties configuration", () => {
    const haxProps = element.constructor.haxProperties;

    expect(haxProps).to.exist;
    expect(haxProps.type).to.equal("grid");
    expect(haxProps.gizmo.title).to.equal("Column layout");
    expect(haxProps.settings.configure).to.be.an("array");
  });

  // Grid plate layout options tests
  it("has comprehensive layout options", () => {
    expect(element.layouts).to.exist;
    expect(element.layouts["1"]).to.exist;
    expect(element.layouts["1-1"]).to.exist;
    expect(element.layouts["1-1-1"]).to.exist;
    expect(element.layouts["1-1-1-1"]).to.exist;
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
    element.layout = "";
    await element.updateComplete;

    const widths = element._getColumnWidths("md", "", element.layouts, false);
    expect(widths).to.exist;
  });

  it("handles invalid responsive size", () => {
    const widths = element._getColumnWidths(
      "invalid",
      "1-1",
      element.layouts,
      false,
    );
    expect(widths).to.exist;
  });

  // Performance tests
  it("efficiently calculates layouts", async () => {
    const layouts = ["1", "1-1", "2-1", "1-2", "1-1-1", "1-1-1-1"];
    const sizes = ["xs", "sm", "md", "lg", "xl"];

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

describe("GridPlate drag and drop handlers", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`
      <grid-plate layout="1-1" data-hax-ray="test">
        <p slot="col-1">First column content</p>
        <p slot="col-2">Second column content</p>
      </grid-plate>
    `);
    await element.updateComplete;
  });

  it("_dragEnter adds active class to target when dataHaxRay is set", () => {
    const col = element.shadowRoot.querySelector("#col1");
    element._dragEnter({ target: col });
    expect(col.classList.contains("active")).to.be.true;
  });

  it("_dragEnter does nothing when dataHaxRay is not set", async () => {
    const el = await fixture(html`
      <grid-plate layout="1-1">
        <p slot="col-1">content</p>
      </grid-plate>
    `);
    await el.updateComplete;
    const col = el.shadowRoot.querySelector("#col1");
    el._dragEnter({ target: col });
    expect(col.classList.contains("active")).to.be.false;
  });

  it("_dragleave removes active class from target when dataHaxRay is set", () => {
    const col = element.shadowRoot.querySelector("#col1");
    col.classList.add("active");
    element._dragleave({ target: col });
    expect(col.classList.contains("active")).to.be.false;
  });

  it("_dragleave does nothing when dataHaxRay is not set", async () => {
    const el = await fixture(html`
      <grid-plate layout="1-1">
        <p slot="col-1">content</p>
      </grid-plate>
    `);
    await el.updateComplete;
    const col = el.shadowRoot.querySelector("#col1");
    col.classList.add("active");
    el._dragleave({ target: col });
    expect(col.classList.contains("active")).to.be.true;
  });

  it("_drop removes active classes from light DOM when dataHaxRay is set", () => {
    const slotted = element.querySelector('[slot="col-1"]');
    slotted.classList.add("active");
    element._drop({});
    expect(slotted.classList.contains("active")).to.be.false;
  });

  it("_drop removes active classes from shadow DOM when dataHaxRay is set", () => {
    const col = element.shadowRoot.querySelector("#col1");
    col.classList.add("active");
    element._drop({});
    expect(col.classList.contains("active")).to.be.false;
  });

  it("_drop does nothing when dataHaxRay is not set", async () => {
    const el = await fixture(html`
      <grid-plate layout="1-1">
        <p slot="col-1" class="active">content</p>
      </grid-plate>
    `);
    await el.updateComplete;
    el._drop({});
    // active class should still be there since dataHaxRay is not set
    expect(el.querySelector('[slot="col-1"]').classList.contains("active")).to.be.true;
  });
});

describe("GridPlate _getColumns and haxactiveElementChanged", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`
      <grid-plate layout="1-1">
        <p slot="col-1">content</p>
      </grid-plate>
    `);
    await element.updateComplete;
  });

  it("_getColumns returns length of column widths array", () => {
    const widths = ["50%", "50%"];
    expect(element._getColumns(widths)).to.equal(2);
  });

  it("_getColumns returns 3 for three-column layout", () => {
    const widths = ["33.33%", "33.33%", "33.33%"];
    expect(element._getColumns(widths)).to.equal(3);
  });

  it("haxactiveElementChanged does not throw", () => {
    expect(() => element.haxactiveElementChanged(null, false)).to.not.throw();
  });
});

describe("GridPlate updated lifecycle branches", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`
      <grid-plate layout="1-1">
        <p slot="col-1">content</p>
      </grid-plate>
    `);
    await element.updateComplete;
  });

  it("sets --grid-plate-item-margin when itemMargin is not 16", async () => {
    element.itemMargin = 24;
    await element.updateComplete;
    const val = element.style.getPropertyValue("--grid-plate-item-margin");
    expect(val).to.equal("24px");
  });

  it("removes --grid-plate-item-margin when itemMargin is 16", async () => {
    element.itemMargin = 24;
    await element.updateComplete;
    element.itemMargin = 16;
    await element.updateComplete;
    const val = element.style.getPropertyValue("--grid-plate-item-margin");
    expect(val).to.equal("");
  });

  it("sets --grid-plate-item-padding when itemPadding is not 16", async () => {
    element.itemPadding = 32;
    await element.updateComplete;
    const val = element.style.getPropertyValue("--grid-plate-item-padding");
    expect(val).to.equal("32px");
  });

  it("removes --grid-plate-item-padding when itemPadding is 16", async () => {
    element.itemPadding = 32;
    await element.updateComplete;
    element.itemPadding = 16;
    await element.updateComplete;
    const val = element.style.getPropertyValue("--grid-plate-item-padding");
    expect(val).to.equal("");
  });

  it("dispatches disable-responsive-changed event when disableResponsive changes", async () => {
    let eventDetail = null;
    element.addEventListener("disable-responsive-changed", (e) => {
      eventDetail = e.detail;
    });
    element.disableResponsive = true;
    await element.updateComplete;
    expect(eventDetail).to.be.true;
  });

  it("does not set margin property when itemMargin is falsy", async () => {
    element.itemMargin = 0;
    await element.updateComplete;
    // 0 is falsy, so it should remove the property
    const val = element.style.getPropertyValue("--grid-plate-item-margin");
    expect(val).to.equal("");
  });
});

describe("GridPlate _getColumnWidths edge cases", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`
      <grid-plate layout="1-1">
        <p slot="col-1">content</p>
      </grid-plate>
    `);
    await element.updateComplete;
  });

  it("returns undefined when layouts is falsy", () => {
    const widths = element._getColumnWidths("md", "1-1", null, false);
    expect(widths).to.be.undefined;
  });

  it("falls back to old layout mapping for 12", () => {
    const widths = element._getColumnWidths("md", 12, element.layouts, false);
    expect(widths).to.exist;
    // 12 maps to "1" which is full width
    expect(widths[0]).to.equal("100%");
  });

  it("falls back to old layout mapping for 8/4", () => {
    const widths = element._getColumnWidths("md", "8/4", element.layouts, false);
    expect(widths).to.exist;
    // 8/4 maps to "2-1" which is 66.66/33.33
    expect(widths.length).to.equal(2);
  });

  it("falls back to old layout mapping for 6/6", () => {
    const widths = element._getColumnWidths("md", "6/6", element.layouts, false);
    expect(widths).to.exist;
    expect(widths[0]).to.equal("50%");
  });

  it("falls back to old layout mapping for 4/8", () => {
    const widths = element._getColumnWidths("md", "4/8", element.layouts, false);
    expect(widths).to.exist;
    expect(widths.length).to.equal(2);
  });

  it("falls back to old layout mapping for 4/4/4", () => {
    const widths = element._getColumnWidths(
      "md",
      "4/4/4",
      element.layouts,
      false,
    );
    expect(widths).to.exist;
    expect(widths.length).to.equal(3);
  });

  it("falls back to old layout mapping for 3/3/3/3", () => {
    const widths = element._getColumnWidths(
      "md",
      "3/3/3/3",
      element.layouts,
      false,
    );
    expect(widths).to.exist;
    expect(widths.length).to.equal(4);
  });

  it("falls back to 1-1 layout for unknown layout name", () => {
    const widths = element._getColumnWidths(
      "md",
      "unknown-layout",
      element.layouts,
      false,
    );
    expect(widths).to.exist;
    expect(widths[0]).to.equal("50%");
  });

  it("uses xl size when disableResponsive is not false and size is not xs", () => {
    const widths = element._getColumnWidths("sm", "1-1", element.layouts, true);
    // disableResponsive=true and size=sm (not xs), so size becomes xl
    const xlWidths = element.layouts["1-1"].xl;
    expect(widths).to.deep.equal(xlWidths);
  });

  it("keeps xs size when disableResponsive and size is xs", () => {
    const widths = element._getColumnWidths("xs", "1-1", element.layouts, true);
    // disableResponsive=true but size is xs, so it stays xs
    const xsWidths = element.layouts["1-1"].xs;
    expect(widths).to.deep.equal(xsWidths);
  });

  it("falls back to md when size is invalid", () => {
    const widths = element._getColumnWidths(
      "huge",
      "1-1",
      element.layouts,
      false,
    );
    const mdWidths = element.layouts["1-1"].md;
    expect(widths).to.deep.equal(mdWidths);
  });
});

describe("GridPlate _getColumnWidth edge cases", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(html`
      <grid-plate layout="1-1">
        <p slot="col-1">content</p>
      </grid-plate>
    `);
    await element.updateComplete;
  });

  it("returns min-height unset when __columnWidths is undefined", () => {
    const width = element._getColumnWidth(0, undefined);
    expect(width).to.equal("min-height: unset");
  });

  it("returns min-height unset when column index is out of bounds", () => {
    const width = element._getColumnWidth(10, ["50%", "50%"]);
    expect(width).to.equal("min-height: unset");
  });

  it("returns width for valid column index", () => {
    const width = element._getColumnWidth(1, ["50%", "50%"]);
    expect(width).to.equal("width:50%");
  });
});

describe("GridPlate layout options", () => {
  it("GridPlateLayoutOptions creates correct options mapping", async () => {
    const el = await fixture(html`<grid-plate></grid-plate>`);
    await el.updateComplete;
    // Verify that haxProperties uses the options
    const haxProps = el.constructor.haxProperties;
    const configureSettings = haxProps.settings.configure;
    const layoutSetting = configureSettings.find(
      (s) => s.property === "layout",
    );
    expect(layoutSetting).to.exist;
    expect(layoutSetting.options).to.exist;
    expect(layoutSetting.options["1"]).to.exist;
    expect(layoutSetting.options["1-1"]).to.exist;
  });

  it("supports all documented layout names", async () => {
    const el = await fixture(html`<grid-plate></grid-plate>`);
    await el.updateComplete;
    const layoutNames = [
      "1",
      "1-1",
      "2-1",
      "1-2",
      "3-1",
      "1-3",
      "1-1-1",
      "2-1-1",
      "1-2-1",
      "1-1-2",
      "1-1-1-1",
    ];
    for (const name of layoutNames) {
      expect(el.layouts[name]).to.exist;
      expect(el.layouts[name].columnLayout).to.exist;
      expect(el.layouts[name].xs).to.exist;
      expect(el.layouts[name].sm).to.exist;
      expect(el.layouts[name].md).to.exist;
      expect(el.layouts[name].lg).to.exist;
      expect(el.layouts[name].xl).to.exist;
    }
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
