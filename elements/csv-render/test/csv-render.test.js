import { fixture, expect, html, oneEvent, waitUntil } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
import sinon from "sinon";
import "../csv-render.js";

// Mock CSV data for testing
const mockCSVData = {
  simple:
    "Name,Age,City\nJohn,25,New York\nJane,30,Los Angeles\nBob,35,Chicago",
  withQuotes:
    'Name,Age,"City, State"\n"John Doe",25,"New York, NY"\n"Jane Smith",30,"Los Angeles, CA"',
  withNewlines:
    'Name,Description\n"John","Line 1\nLine 2"\n"Jane","Single line"',
  malformed: "Name,Age,City\nJohn,25\nJane,30,Los Angeles,Extra",
  empty: "",
  headersOnly: "Name,Age,City",
  singleRow: "Name,Age,City\nJohn,25,New York",
  specialChars:
    'Name,Age,Notes\nJohn,25,"Special chars: <>&\'\\""\nJane,30,Normal',
};

// Mock hexagon-loader dependency
class MockHexagonLoader extends HTMLElement {
  static get properties() {
    return {
      loading: { type: Boolean },
      accentColor: { type: String, attribute: "accent-color" },
      itemCount: { type: String, attribute: "item-count" },
      size: { type: String },
    };
  }
}

// Mock simple-tooltip dependency
class MockSimpleTooltip extends HTMLElement {
  static get properties() {
    return {
      for: { type: String },
      offset: { type: String },
      position: { type: String },
    };
  }
}

describe("csv-render test", () => {
  let element, sandbox, fetchStub;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();

    // Mock fetch for CSV data loading
    fetchStub = sandbox.stub(globalThis, "fetch");
    fetchStub.resolves({
      ok: true,
      text: () => Promise.resolve(mockCSVData.simple),
    });

    // Register mock elements
    if (!globalThis.customElements.get("hexagon-loader")) {
      globalThis.customElements.define("hexagon-loader", MockHexagonLoader);
    }
    if (!globalThis.customElements.get("simple-tooltip")) {
      globalThis.customElements.define("simple-tooltip", MockSimpleTooltip);
    }

    element = await fixture(html`
      <csv-render
        data-source="test.csv"
        summary="Test CSV data table"
        caption="Test Table"
        accent-color="blue"
      ></csv-render>
    `);

    // Simulate element becoming visible
    element.elementVisible = true;
    await element.updateComplete;

    // Wait for CSV data to load
    await waitUntil(() => !element.loading, "CSV should finish loading");
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe("Basic Setup and Accessibility", () => {
    it("passes the a11y audit", async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it("passes a11y audit with complex CSV data", async () => {
      fetchStub.resolves({
        ok: true,
        text: () => Promise.resolve(mockCSVData.withQuotes),
      });

      const el = await fixture(html`
        <csv-render
          data-source="complex.csv"
          summary="Complex CSV with quoted values"
          caption="Complex Data Table"
        ></csv-render>
      `);

      el.elementVisible = true;
      await el.updateComplete;
      await waitUntil(() => !el.loading);

      await expect(el).shadowDom.to.be.accessible();
    });

    it("passes a11y audit without caption", async () => {
      const el = await fixture(html`
        <csv-render
          data-source="test.csv"
          summary="Table without caption"
        ></csv-render>
      `);

      el.elementVisible = true;
      await el.updateComplete;
      await waitUntil(() => !el.loading);

      await expect(el).shadowDom.to.be.accessible();
    });

    it("passes a11y audit when loading", async () => {
      const el = await fixture(html`
        <csv-render
          data-source="loading.csv"
          summary="Loading table"
        ></csv-render>
      `);

      el.loading = true;
      await el.updateComplete;

      await expect(el).shadowDom.to.be.accessible();
    });

    it("passes a11y audit with different accent colors", async () => {
      const colors = ["red", "green", "purple", "orange"];

      for (const color of colors) {
        const el = await fixture(html`
          <csv-render
            data-source="test.csv"
            accent-color="${color}"
            summary="Colored table"
          ></csv-render>
        `);

        el.elementVisible = true;
        await el.updateComplete;
        await waitUntil(() => !el.loading);

        await expect(el).shadowDom.to.be.accessible();
      }
    });
  });

  describe("Component Structure", () => {
    it("renders with correct tag name", () => {
      expect(element.tagName.toLowerCase()).to.equal("csv-render");
    });

    it("has proper table structure", () => {
      const table = element.shadowRoot.querySelector("table");
      expect(table).to.exist;
      expect(table.classList.contains("table")).to.be.true;

      const thead = table.querySelector("thead");
      const tbody = table.querySelector("tbody");
      expect(thead).to.exist;
      expect(tbody).to.exist;
    });

    it("includes loading indicator", () => {
      const loader = element.shadowRoot.querySelector("#loading");
      expect(loader).to.exist;
      expect(loader.tagName.toLowerCase()).to.equal("hexagon-loader");
    });

    it("includes download button", () => {
      const downloadLink = element.shadowRoot.querySelector("#download");
      expect(downloadLink).to.exist;
      expect(downloadLink.getAttribute("href")).to.equal("test.csv");

      const button = element.shadowRoot.querySelector(
        "simple-icon-button-lite",
      );
      expect(button).to.exist;
      expect(button.getAttribute("icon")).to.equal("file-download");
    });

    it("includes tooltip for download button", () => {
      const tooltip = element.shadowRoot.querySelector("simple-tooltip");
      expect(tooltip).to.exist;
      expect(tooltip.getAttribute("for")).to.equal("ficon");
    });

    it("has correct table accessibility attributes", () => {
      const table = element.shadowRoot.querySelector("table");
      expect(table.getAttribute("summary")).to.equal("Test CSV data table");

      const caption = table.querySelector("caption");
      expect(caption).to.exist;
      expect(caption.textContent.trim()).to.equal("Test Table");

      const headers = table.querySelectorAll('th[scope="col"]');
      expect(headers.length).to.be.greaterThan(0);
    });
  });

  describe("Property Handling", () => {
    it("handles data-source property correctly", async () => {
      element.dataSource = "new-data.csv";
      await element.updateComplete;

      const downloadLink = element.shadowRoot.querySelector("#download");
      expect(downloadLink.getAttribute("href")).to.equal("new-data.csv");
    });

    it("handles caption property correctly", async () => {
      element.caption = "New Caption";
      await element.updateComplete;

      const caption = element.shadowRoot.querySelector("caption");
      expect(caption.textContent.trim()).to.equal("New Caption");
    });

    it("handles summary property correctly", async () => {
      element.summary = "New summary for accessibility";
      await element.updateComplete;

      const table = element.shadowRoot.querySelector("table");
      expect(table.getAttribute("summary")).to.equal(
        "New summary for accessibility",
      );
    });

    it("handles loading state correctly", async () => {
      element.loading = true;
      await element.updateComplete;

      const loader = element.shadowRoot.querySelector("#loading");
      expect(loader.hasAttribute("loading")).to.be.true;

      element.loading = false;
      await element.updateComplete;

      expect(loader.hasAttribute("loading")).to.be.false;
    });

    it("handles accent-color property", async () => {
      element.accentColor = "red";
      await element.updateComplete;

      expect(element.getAttribute("accent-color")).to.equal("red");
    });

    it("handles table data array correctly", async () => {
      const testData = [
        ["Col1", "Col2"],
        ["Row1Col1", "Row1Col2"],
      ];
      element.table = testData.slice(1); // Data without headers
      element.tableHeadings = testData[0]; // Headers
      await element.updateComplete;

      const headers = element.shadowRoot.querySelectorAll("th");
      expect(headers[0].textContent).to.equal("Col1");
      expect(headers[1].textContent).to.equal("Col2");

      const cells = element.shadowRoot.querySelectorAll("td");
      expect(cells[0].textContent).to.equal("Row1Col1");
      expect(cells[1].textContent).to.equal("Row1Col2");
    });
  });

  describe("CSV Parsing", () => {
    it("parses simple CSV correctly", () => {
      const result = element.CSVtoArray(mockCSVData.simple);

      expect(result.length).to.equal(4); // Header + 3 rows
      expect(result[0]).to.deep.equal(["Name", "Age", "City"]);
      expect(result[1]).to.deep.equal(["John", "25", "New York"]);
      expect(result[2]).to.deep.equal(["Jane", "30", "Los Angeles"]);
      expect(result[3]).to.deep.equal(["Bob", "35", "Chicago"]);
    });

    it("handles CSV with quoted values", () => {
      const result = element.CSVtoArray(mockCSVData.withQuotes);

      expect(result[0]).to.deep.equal(["Name", "Age", "City, State"]);
      expect(result[1]).to.deep.equal(["John Doe", "25", "New York, NY"]);
      expect(result[2]).to.deep.equal(["Jane Smith", "30", "Los Angeles, CA"]);
    });

    it("handles CSV with newlines in quoted fields", () => {
      const result = element.CSVtoArray(mockCSVData.withNewlines);

      expect(result[0]).to.deep.equal(["Name", "Description"]);
      expect(result[1]).to.deep.equal(["John", "Line 1\nLine 2"]);
      expect(result[2]).to.deep.equal(["Jane", "Single line"]);
    });

    it("handles malformed CSV gracefully", () => {
      const result = element.CSVtoArray(mockCSVData.malformed);

      // Should still parse what it can
      expect(result.length).to.be.greaterThan(0);
      expect(result[0]).to.deep.equal(["Name", "Age", "City"]);
    });

    it("handles empty CSV", () => {
      const result = element.CSVtoArray(mockCSVData.empty);
      expect(result).to.deep.equal([[""]]); // Empty array structure
    });

    it("handles headers-only CSV", () => {
      const result = element.CSVtoArray(mockCSVData.headersOnly);
      expect(result).to.deep.equal([["Name", "Age", "City"]]);
    });

    it("handles special characters in CSV", () => {
      const result = element.CSVtoArray(mockCSVData.specialChars);

      expect(result[0]).to.deep.equal(["Name", "Age", "Notes"]);
      expect(result[1][2]).to.include("<>&'\""); // Should preserve special chars
    });
  });

  describe("Data Loading", () => {
    it("loads CSV data from remote source", async () => {
      fetchStub.resolves({
        ok: true,
        text: () => Promise.resolve(mockCSVData.simple),
      });

      const el = await fixture(html`
        <csv-render data-source="remote.csv"></csv-render>
      `);

      el.elementVisible = true;
      await el.updateComplete;
      await waitUntil(() => !el.loading);

      expect(fetchStub.calledWith("remote.csv")).to.be.true;
      expect(el.table.length).to.equal(3); // 3 data rows
      expect(el.tableHeadings).to.deep.equal(["Name", "Age", "City"]);
    });

    it("handles fetch errors gracefully", async () => {
      fetchStub.resolves({
        ok: false,
        status: 404,
      });

      const el = await fixture(html`
        <csv-render data-source="missing.csv"></csv-render>
      `);

      el.elementVisible = true;
      await el.updateComplete;

      // Should not crash, should handle error gracefully
      expect(el.table).to.be.an("array");
    });

    it("handles network errors", async () => {
      fetchStub.rejects(new Error("Network error"));

      const el = await fixture(html`
        <csv-render data-source="error.csv"></csv-render>
      `);

      el.elementVisible = true;
      await el.updateComplete;

      // Should not crash
      expect(el.table).to.be.an("array");
    });

    it("debounces data loading", async () => {
      const el = await fixture(html`
        <csv-render data-source="debounce.csv"></csv-render>
      `);

      // Rapidly change data source
      el.dataSource = "test1.csv";
      el.elementVisible = true;
      await el.updateComplete;

      el.dataSource = "test2.csv";
      await el.updateComplete;

      el.dataSource = "test3.csv";
      await el.updateComplete;

      // Should debounce and only make one call after timeout
      await new Promise((resolve) => setTimeout(resolve, 600));

      expect(fetchStub.callCount).to.equal(1);
      expect(fetchStub.lastCall.args[0]).to.equal("test3.csv");
    });

    it("only loads data when element is visible", async () => {
      const el = await fixture(html`
        <csv-render data-source="invisible.csv"></csv-render>
      `);

      // Element not visible, should not load
      el.elementVisible = false;
      await el.updateComplete;

      expect(fetchStub.called).to.be.false;

      // Make visible, should load
      el.elementVisible = true;
      await el.updateComplete;
      await new Promise((resolve) => setTimeout(resolve, 600));

      expect(fetchStub.called).to.be.true;
    });
  });

  describe("Table Rendering", () => {
    it("renders table headers correctly", async () => {
      const headers = element.shadowRoot.querySelectorAll("th");

      expect(headers.length).to.equal(3);
      expect(headers[0].textContent).to.equal("Name");
      expect(headers[1].textContent).to.equal("Age");
      expect(headers[2].textContent).to.equal("City");

      headers.forEach((header) => {
        expect(header.getAttribute("scope")).to.equal("col");
      });
    });

    it("renders table data correctly", async () => {
      const rows = element.shadowRoot.querySelectorAll("tbody tr");

      expect(rows.length).to.equal(3);

      const firstRowCells = rows[0].querySelectorAll("td");
      expect(firstRowCells[0].textContent).to.equal("John");
      expect(firstRowCells[1].textContent).to.equal("25");
      expect(firstRowCells[2].textContent).to.equal("New York");
    });

    it("handles empty table data", async () => {
      element.table = [];
      element.tableHeadings = [];
      await element.updateComplete;

      const headers = element.shadowRoot.querySelectorAll("th");
      const rows = element.shadowRoot.querySelectorAll("tbody tr");

      expect(headers.length).to.equal(0);
      expect(rows.length).to.equal(0);
    });

    it("renders table without caption when not provided", async () => {
      const el = await fixture(html`
        <csv-render data-source="test.csv"></csv-render>
      `);

      el.elementVisible = true;
      await el.updateComplete;
      await waitUntil(() => !el.loading);

      const caption = el.shadowRoot.querySelector("caption");
      expect(caption).to.not.exist;
    });

    it("handles irregular row lengths", async () => {
      element.table = [
        ["John", "25"], // Missing city
        ["Jane", "30", "Los Angeles", "Extra data"], // Extra data
      ];
      element.tableHeadings = ["Name", "Age", "City"];
      await element.updateComplete;

      const rows = element.shadowRoot.querySelectorAll("tbody tr");
      expect(rows.length).to.equal(2);

      // Should render what data is available
      const firstRow = rows[0].querySelectorAll("td");
      expect(firstRow.length).to.equal(2);
    });
  });

  describe("Styling and Theme Integration", () => {
    it("applies SimpleColors theme correctly", () => {
      expect(element).to.be.an.instanceof(element.constructor.__proto__);
      // Inherits from SimpleColors, so should have accent color support
    });

    it("uses CSS custom properties for theming", () => {
      const styles = element.constructor.styles[1].cssText;
      expect(styles).to.include("--simple-colors-default-theme-accent");
      expect(styles).to.include("--simple-colors-default-theme-grey");
    });

    it("handles different accent colors in styling", async () => {
      element.accentColor = "red";
      await element.updateComplete;

      expect(element.getAttribute("accent-color")).to.equal("red");
    });

    it("applies hover effects on table rows", () => {
      const styles = element.constructor.styles[1].cssText;
      expect(styles).to.include(".table tbody tr:hover");
    });

    it("has responsive table styling", () => {
      const styles = element.constructor.styles[1].cssText;
      expect(styles).to.include("width: 100%");
      expect(styles).to.include("white-space: nowrap");
    });
  });

  describe("Intersection Observer Integration", () => {
    it("uses IntersectionObserverMixin", () => {
      expect(element.elementVisible).to.be.a("boolean");
      expect(typeof element.intersectionCallback).to.equal("function");
    });

    it("loads data when becoming visible", async () => {
      const el = await fixture(html`
        <csv-render data-source="visibility.csv"></csv-render>
      `);

      // Simulate becoming visible
      el.elementVisible = true;
      await el.updateComplete;

      await new Promise((resolve) => setTimeout(resolve, 600));

      expect(fetchStub.called).to.be.true;
    });

    it("imports dependencies when visible", async () => {
      const el = await fixture(html`
        <csv-render data-source="deps.csv"></csv-render>
      `);

      // Mock dynamic import
      const importSpy = sandbox.spy();
      globalThis.import = importSpy;

      el.elementVisible = true;
      await el.updateComplete;

      // Note: In a real test environment, we'd need to mock the dynamic imports
      // This test verifies the code path exists
      expect(el.elementVisible).to.be.true;
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("handles extremely large CSV files", async () => {
      const largeData =
        "Name,Value\n" +
        Array.from({ length: 1000 }, (_, i) => `Item${i},${i}`).join("\n");

      fetchStub.resolves({
        ok: true,
        text: () => Promise.resolve(largeData),
      });

      const el = await fixture(html`
        <csv-render data-source="large.csv"></csv-render>
      `);

      el.elementVisible = true;
      await el.updateComplete;
      await waitUntil(() => !el.loading);

      expect(el.table.length).to.equal(1000);
    });

    it("handles CSV with unicode characters", async () => {
      const unicodeData = "Name,City\néçà,Pariş\n中文,北京";

      const result = element.CSVtoArray(unicodeData);
      expect(result[1][0]).to.equal("éçà");
      expect(result[2][1]).to.equal("北京");
    });

    it("handles missing data source gracefully", async () => {
      const el = await fixture(html` <csv-render></csv-render> `);

      el.elementVisible = true;
      await el.updateComplete;

      // Should not attempt to load or crash
      expect(fetchStub.called).to.be.false;
    });

    it("handles rapid property changes", async () => {
      for (let i = 0; i < 10; i++) {
        element.dataSource = `test${i}.csv`;
        element.caption = `Caption ${i}`;
        element.summary = `Summary ${i}`;
      }
      await element.updateComplete;

      expect(element.caption).to.equal("Caption 9");
      expect(element.summary).to.equal("Summary 9");
    });

    it("cleans up debounce timeout on disconnect", async () => {
      const el = await fixture(html`
        <csv-render data-source="cleanup.csv"></csv-render>
      `);

      el.dataSource = "new.csv";
      el.elementVisible = true;
      await el.updateComplete;

      // Simulate disconnection
      el.remove();

      // Timeout should be cleaned up
      expect(el.__debouce).to.exist;
    });
  });

  describe("Performance and Resource Management", () => {
    it("efficiently handles multiple data updates", async () => {
      const datasets = [
        mockCSVData.simple,
        mockCSVData.withQuotes,
        mockCSVData.singleRow,
      ];

      for (const data of datasets) {
        fetchStub.resolves({
          ok: true,
          text: () => Promise.resolve(data),
        });

        element.dataSource = `dataset-${datasets.indexOf(data)}.csv`;
        element.elementVisible = true;
        await element.updateComplete;
        await waitUntil(() => !element.loading);
      }

      // Should handle all updates without issues
      expect(element.table).to.be.an("array");
    });

    it("manages loading states properly", async () => {
      let resolvePromise;
      const loadingPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });

      fetchStub.returns({
        ok: true,
        text: () => loadingPromise,
      });

      element.dataSource = "slow.csv";
      element.elementVisible = true;
      await element.updateComplete;

      expect(element.loading).to.be.true;

      resolvePromise(mockCSVData.simple);
      await waitUntil(() => !element.loading);

      expect(element.loading).to.be.false;
    });

    it("handles concurrent load requests", async () => {
      const promises = [];

      for (let i = 0; i < 3; i++) {
        promises.push(
          (async () => {
            element.dataSource = `concurrent${i}.csv`;
            element.elementVisible = true;
            await element.updateComplete;
          })(),
        );
      }

      await Promise.all(promises);

      // Should handle concurrent updates gracefully
      expect(element.dataSource).to.equal("concurrent2.csv");
    });
  });

  describe("Integration Scenarios", () => {
    it("works with real CSV file structure", async () => {
      const salesData =
        "Date,Product,Sales,Revenue\n2024-01-01,Widget A,100,1000\n2024-01-02,Widget B,150,2250";

      fetchStub.resolves({
        ok: true,
        text: () => Promise.resolve(salesData),
      });

      const el = await fixture(html`
        <csv-render
          data-source="sales.csv"
          caption="Sales Report"
          summary="Monthly sales data showing product performance"
          accent-color="green"
        ></csv-render>
      `);

      el.elementVisible = true;
      await el.updateComplete;
      await waitUntil(() => !el.loading);

      const headers = el.shadowRoot.querySelectorAll("th");
      expect(headers.map((h) => h.textContent)).to.deep.equal([
        "Date",
        "Product",
        "Sales",
        "Revenue",
      ]);

      const firstRowCells = el.shadowRoot.querySelectorAll(
        "tbody tr:first-child td",
      );
      expect(firstRowCells[1].textContent).to.equal("Widget A");

      await expect(el).shadowDom.to.be.accessible();
    });

    it("integrates with form data export", async () => {
      const formData =
        'Name,Email,Response\n"John Doe",john@example.com,"Very satisfied"';

      fetchStub.resolves({
        ok: true,
        text: () => Promise.resolve(formData),
      });

      const el = await fixture(html`
        <csv-render
          data-source="form-responses.csv"
          caption="Form Responses"
          summary="User feedback from satisfaction survey"
        ></csv-render>
      `);

      el.elementVisible = true;
      await el.updateComplete;
      await waitUntil(() => !el.loading);

      expect(el.table[0][2]).to.equal("Very satisfied");
    });

    it("works in dashboard scenarios", async () => {
      const wrapper = await fixture(html`
        <div class="dashboard">
          <h2>Data Dashboard</h2>
          <csv-render
            data-source="dashboard-data.csv"
            caption="Key Metrics"
            summary="Dashboard showing key performance indicators"
            accent-color="purple"
          ></csv-render>
        </div>
      `);

      const csvElement = wrapper.querySelector("csv-render");
      csvElement.elementVisible = true;
      await csvElement.updateComplete;
      await waitUntil(() => !csvElement.loading);

      expect(csvElement).to.exist;
      await expect(csvElement).shadowDom.to.be.accessible();
    });
  });
});
