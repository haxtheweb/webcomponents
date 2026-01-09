import { fixture, expect, html } from "@open-wc/testing";
import "../editable-table.js";

describe("EditableTable test", () => {
  let element;

  beforeEach(async () => {
    element = await fixture(
      html`<editable-table
        id="food-table"
        bordered
        condensed
        filter
        printable
        responsive
        sort
        striped
      >
        <table>
          <caption>
            Is it a
            <em>sandwich</em
            >? Food classification chart.
          </caption>
          <thead>
            <tr>
              <th scope="row">Food</th>
              <th scope="col">Enclosure</th>
              <th scope="col">Contents</th>
              <th scope="col">Orientation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Hamburger</th>
              <td>one bun, split into two</td>
              <td>meat, vegetables, cheese, <i>and/or</i> condiments</td>
              <td>horizontal</td>
            </tr>
            <tr>
              <th scope="row">Hoagie</th>
              <td>one bun</td>
              <td>meat, vegetables, cheese, <i>and/or</i> condiments</td>
              <td>vertical</td>
            </tr>
            <tr>
              <th scope="row">Hot Dog</th>
              <td>one bun</td>
              <td>meat, vegetables, cheese, <i>and/or</i> condiments</td>
              <td>vertical</td>
            </tr>
          </tbody>
        </table>
      </editable-table>`,
    );
    await element.updateComplete;
  });

  // Basic functionality tests
  it("instantiates the element correctly", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("editable-table");
  });

  it("has correct default property values", async () => {
    expect(element.editMode).to.be.false;
    expect(element.bordered).to.be.true;
    expect(element.condensed).to.be.true;
    expect(element.filter).to.be.true;
    expect(element.printable).to.be.true;
    expect(element.responsive).to.be.true;
    expect(element.sort).to.be.true;
    expect(element.striped).to.be.true;
  });

  // Mode switching tests
  it("toggles between display and edit modes", async () => {
    expect(element.editMode).to.be.false;

    element.toggleEditMode();
    await element.updateComplete;
    expect(element.editMode).to.be.true;

    element.toggleEditMode();
    await element.updateComplete;
    expect(element.editMode).to.be.false;
  });

  it("can set edit mode explicitly", async () => {
    element.toggleEditMode(true);
    await element.updateComplete;
    expect(element.editMode).to.be.true;

    element.toggleEditMode(false);
    await element.updateComplete;
    expect(element.editMode).to.be.false;
  });

  it("reflects edit-mode attribute", async () => {
    element.editMode = true;
    await element.updateComplete;
    expect(element.hasAttribute("edit-mode")).to.be.true;

    element.editMode = false;
    await element.updateComplete;
    expect(element.hasAttribute("edit-mode")).to.be.false;
  });

  // Component rendering tests
  it("renders display component when not in edit mode", () => {
    const displayComponent = element.shadowRoot.querySelector(
      "editable-table-display",
    );
    const editComponent = element.shadowRoot.querySelector(
      "editable-table-edit",
    );

    expect(displayComponent).to.exist;
    expect(editComponent).to.exist;
    expect(displayComponent.hasAttribute("hidden")).to.be.false;
    expect(editComponent.hasAttribute("hidden")).to.be.true;
  });

  it("renders edit component when in edit mode", async () => {
    element.editMode = true;
    await element.updateComplete;

    const displayComponent = element.shadowRoot.querySelector(
      "editable-table-display",
    );
    const editComponent = element.shadowRoot.querySelector(
      "editable-table-edit",
    );

    expect(displayComponent.hasAttribute("hidden")).to.be.true;
    expect(editComponent.hasAttribute("hidden")).to.be.false;
  });

  // Property binding tests
  it("passes properties to display component", () => {
    const displayComponent = element.shadowRoot.querySelector(
      "editable-table-display",
    );

    expect(displayComponent.bordered).to.equal(element.bordered);
    expect(displayComponent.condensed).to.equal(element.condensed);
    expect(displayComponent.filter).to.equal(element.filter);
    expect(displayComponent.printable).to.equal(element.printable);
    expect(displayComponent.responsive).to.equal(element.responsive);
    expect(displayComponent.sort).to.equal(element.sort);
    expect(displayComponent.striped).to.equal(element.striped);
  });

  it("passes properties to edit component", () => {
    const editComponent = element.shadowRoot.querySelector(
      "editable-table-edit",
    );

    expect(editComponent.bordered).to.equal(element.bordered);
    expect(editComponent.condensed).to.equal(element.condensed);
    expect(editComponent.filter).to.equal(element.filter);
    expect(editComponent.printable).to.equal(element.printable);
    expect(editComponent.responsive).to.equal(element.responsive);
    expect(editComponent.sort).to.equal(element.sort);
    expect(editComponent.striped).to.equal(element.striped);
  });

  // Slot content tests
  it("renders slotted table content", () => {
    const table = element.querySelector("table");
    const caption = element.querySelector("caption");
    const thead = element.querySelector("thead");
    const tbody = element.querySelector("tbody");

    expect(table).to.exist;
    expect(caption).to.exist;
    expect(thead).to.exist;
    expect(tbody).to.exist;

    expect(caption.textContent).to.include("sandwich");
    expect(thead.querySelectorAll("th").length).to.equal(4);
    expect(tbody.querySelectorAll("tr").length).to.equal(3);
  });

  // Focus management tests
  it("focuses display component when not in edit mode", (done) => {
    element.focus();

    setTimeout(() => {
      const displayComponent = element.shadowRoot.querySelector(
        "editable-table-display",
      );
      expect(document.activeElement).to.equal(displayComponent);
      done();
    }, 10);
  });

  it("focuses edit component when in edit mode", async (done) => {
    element.editMode = true;
    await element.updateComplete;

    element.focus();

    setTimeout(() => {
      const editComponent = element.shadowRoot.querySelector(
        "editable-table-edit",
      );
      expect(document.activeElement).to.equal(editComponent);
      done();
    }, 10);
  });

  // Event handling tests
  it("handles sync events from edit component", async () => {
    const editComponent = element.shadowRoot.querySelector(
      "editable-table-edit",
    );

    const syncEvent = new CustomEvent("change", {
      detail: "testProperty",
    });

    // Mock the editor property
    editComponent.testProperty = "testValue";

    editComponent.dispatchEvent(syncEvent);
    await element.updateComplete;

    // The sync method should have been called
    expect(element.testProperty).to.equal("testValue");
  });

  it("dispatches toggle-edit-mode event", (done) => {
    element.addEventListener("toggle-edit-mode", (e) => {
      expect(e.detail).to.equal(element);
      expect(e.bubbles).to.be.true;
      expect(e.cancelable).to.be.true;
      expect(e.composed).to.be.true;
      done();
    });

    element.toggleEditMode();
  });

  // Getter tests
  it("provides display component getter", () => {
    expect(element.display).to.exist;
    expect(element.display.tagName.toLowerCase()).to.equal(
      "editable-table-display",
    );
  });

  it("provides editor component getter", () => {
    expect(element.editor).to.exist;
    expect(element.editor.tagName.toLowerCase()).to.equal(
      "editable-table-edit",
    );
  });

  // HAX integration tests
  it("has proper HAX properties configuration", () => {
    expect(element.constructor.haxProperties).to.exist;
    expect(element.constructor.haxProperties).to.include("haxProperties.json");
  });

  it("provides HAX hooks", () => {
    const hooks = element.haxHooks();
    expect(hooks).to.exist;
    expect(hooks.preProcessNodeToContent).to.equal(
      "haxpreProcessNodeToContent",
    );
    expect(hooks.activeElementChanged).to.equal("haxactiveElementChanged");
  });

  it("handles HAX active element changes", async () => {
    const result = await element.haxactiveElementChanged(element, true);
    expect(element.editMode).to.be.true;
    expect(result).to.equal(element);

    await element.haxactiveElementChanged(element, false);
    expect(element.editMode).to.be.false;
  });

  // Accessibility tests
  it("passes the a11y audit in display mode", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  it("passes the a11y audit in edit mode", async () => {
    element.editMode = true;
    await element.updateComplete;
    await expect(element).shadowDom.to.be.accessible();
  });

  it("maintains table accessibility structure", () => {
    const table = element.querySelector("table");
    const caption = element.querySelector("caption");
    const headers = element.querySelectorAll("th[scope]");

    expect(table).to.exist;
    expect(caption).to.exist;
    expect(headers.length).to.be.greaterThan(0);

    // Check scope attributes
    const rowHeaders = element.querySelectorAll('th[scope="row"]');
    const colHeaders = element.querySelectorAll('th[scope="col"]');

    expect(rowHeaders.length).to.be.greaterThan(0);
    expect(colHeaders.length).to.be.greaterThan(0);
  });

  // DDD integration tests
  it("extends DDD class correctly", () => {
    expect(element.constructor.styles).to.exist;
    // Should inherit DDD styles and properties
  });

  // Feature flag tests
  it("handles all boolean feature flags", async () => {
    const flags = {
      bordered: false,
      condensed: false,
      filter: false,
      printable: false,
      responsive: false,
      sort: false,
      striped: false,
      columnHeader: true,
      columnStriped: true,
      footer: true,
      rowHeader: true,
      numericStyles: true,
      disabled: true,
    };

    Object.keys(flags).forEach((flag) => {
      element[flag] = flags[flag];
    });

    await element.updateComplete;

    Object.keys(flags).forEach((flag) => {
      expect(element[flag]).to.equal(flags[flag]);
    });
  });

  // Error handling and edge cases
  it("handles empty table gracefully", async () => {
    const emptyElement = await fixture(html`<editable-table></editable-table>`);
    await emptyElement.updateComplete;

    expect(emptyElement).to.exist;
    expect(emptyElement.display).to.exist;
    expect(emptyElement.editor).to.exist;
  });

  it("handles missing shadow root gracefully", () => {
    // Create element without rendering
    const testElement = document.createElement("editable-table");

    // These should return undefined without throwing
    expect(testElement.display).to.be.undefined;
    expect(testElement.editor).to.be.undefined;
  });

  it("handles sync with missing property", () => {
    // Should not throw when syncing undefined property
    expect(() => element.sync(undefined)).to.not.throw();
    expect(() => element.sync(null)).to.not.throw();
  });

  // Data handling tests
  it("initializes with data from table content", async () => {
    // The element should process the slotted table content into data
    expect(element.data).to.exist;
  });

  it("handles cell change events", async () => {
    const editComponent = element.shadowRoot.querySelector(
      "editable-table-edit",
    );

    const cellChangeEvent = new CustomEvent("cell-changed", {
      detail: {
        row: 0,
        col: 0,
        value: "New Value",
      },
    });

    editComponent.dispatchEvent(cellChangeEvent);
    await element.updateComplete;

    // Should handle the event without throwing
  });

  // Performance tests
  it("efficiently toggles between modes", async () => {
    const startTime = performance.now();

    for (let i = 0; i < 10; i++) {
      element.toggleEditMode();
      await element.updateComplete;
    }

    const endTime = performance.now();
    expect(endTime - startTime).to.be.lessThan(100); // Should be fast
  });

  // Complex table structure tests
  it("handles complex table with multiple sections", async () => {
    const complexElement = await fixture(html`
      <editable-table>
        <table>
          <caption>
            Complex table structure
          </caption>
          <thead>
            <tr>
              <th scope="col">Header 1</th>
              <th scope="col">Header 2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Row 1</th>
              <td>Data 1</td>
            </tr>
            <tr>
              <th scope="row">Row 2</th>
              <td>Data 2</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th scope="row">Total</th>
              <td>Sum</td>
            </tr>
          </tfoot>
        </table>
      </editable-table>
    `);

    await complexElement.updateComplete;

    const table = complexElement.querySelector("table");
    expect(table.querySelector("thead")).to.exist;
    expect(table.querySelector("tbody")).to.exist;
    expect(table.querySelector("tfoot")).to.exist;

    await expect(complexElement).shadowDom.to.be.accessible();
  });
});

/*
describe("A11y/chai axe tests", () => {
  it("editable-table passes accessibility test", async () => {
    const el = await fixture(html` <editable-table></editable-table> `);
    await expect(el).to.be.accessible();
  });
  it("editable-table passes accessibility negation", async () => {
    const el = await fixture(
      html`<editable-table aria-labelledby="editable-table"></editable-table>`
    );
    await assert.isNotAccessible(el);
  });
});

/*
// Custom properties test
describe("Custom Property Test", () => {
  it("editable-table can instantiate a element with custom properties", async () => {
    const el = await fixture(html`<editable-table .foo=${'bar'}></editable-table>`);
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
      const el = await fixture(html`<editable-table ></editable-table>`);
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
      const el = await fixture(html`<editable-table></editable-table>`);
      const width = getComputedStyle(el).width;
      expect(width).to.equal('410px');
    })
    it('hides mobile menu', async () => {
      const el await fixture(html`<editable-table></editable-table>`);
      const hidden = el.getAttribute('hidden');
      expect(hidden).to.equal(true);
    })
}) */
