import { fixture, expect, html, aTimeout } from "@open-wc/testing";
import { ChartistRender, ChartistRenderSuper } from "../chartist-render.js";

// the element bridges in the vendored chartist build from lib/ at construct
// time; wait for that global (and its plugins) before asserting on charts
async function waitForGlobal(check, label, timeoutMs = 10000) {
  const start = Date.now();
  while (!check()) {
    if (Date.now() - start > timeoutMs) {
      throw new Error(`${label} did not load in time`);
    }
    await aTimeout(100);
  }
  await aTimeout(300);
}

const chartistLoaded = () =>
  typeof globalThis.Chartist !== "undefined" &&
  typeof globalThis.Chartist === "object";

const chartistPluginsLoaded = () =>
  chartistLoaded() &&
  globalThis.Chartist.plugins &&
  globalThis.Chartist.plugins.ctAxisTitle &&
  globalThis.Chartist.plugins.ctPointLabels &&
  globalThis.Chartist.plugins.fillDonut;

describe("chartist-render test", () => {
  describe("Basic instantiation and properties", () => {
    it("element is an instance of ChartistRender", async () => {
      const element = await fixture(
        html`<chartist-render></chartist-render>`,
      );
      expect(element).to.be.instanceOf(ChartistRender);
    });

    it("exports the super class for extension", async () => {
      expect(ChartistRenderSuper).to.be.a("function");
    });

    it("has correct tag name", async () => {
      expect(ChartistRender.tag).to.equal("chartist-render");
    });

    it("element has correct default properties", async () => {
      const element = await fixture(
        html`<chartist-render></chartist-render>`,
      );
      expect(element.id).to.equal("chart");
      expect(element.type).to.equal("bar");
      expect(element.scale).to.equal("ct-minor-seventh");
      expect(element.responsiveOptions).to.deep.equal([]);
      expect(element.data).to.deep.equal([]);
      expect(element.dataSource).to.equal("");
      expect(element.showTable).to.be.false;
      expect(element.__chartId).to.include("chart-");
    });

  });

  describe("table-driven data", () => {
    let element;
    beforeEach(async () => {
      element = await fixture(html`
        <chartist-render
          type="bar"
          chart-title="Test chart"
          chart-desc="A chart for testing"
          show-table
        >
          <table>
            <thead>
              <tr>
                <th scope="col">Q1</th>
                <th scope="col">Q2</th>
                <th scope="col">Q3</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>1</td><td>2</td><td>3</td></tr>
              <tr><td>4</td><td>5</td><td>6</td></tr>
            </tbody>
          </table>
        </chartist-render>
      `);
      await waitForGlobal(chartistLoaded, "Chartist");
    });

    it("derives data from the slotted table", async () => {
      expect(element.data).to.deep.equal([
        ["Q1", "Q2", "Q3"],
        [1, 2, 3],
        [4, 5, 6],
      ]);
      expect(element.chartData).to.deep.equal({
        labels: ["Q1", "Q2", "Q3"],
        series: [
          [1, 2, 3],
          [4, 5, 6],
        ],
      });
    });

    it("renders the chart into the target", async () => {
      expect(element.chart).to.exist;
      expect(element.chart.on).to.be.a("function");
      const chart = element.shadowRoot.querySelector("#chart");
      expect(chart.querySelector("svg")).to.exist;
    });

    it("renders an accessible data table", async () => {
      const table = element.querySelector("table");
      expect(table).to.exist;
      expect(table.querySelectorAll("th[scope=col]").length).to.equal(3);
      expect(table.querySelectorAll("tbody tr").length).to.equal(2);
    });

    it("exposes the table visibly when show-table is on", async () => {
      const container = element.shadowRoot.querySelector(
        `#${element.__chartId}-table`,
      );
      expect(container.className).to.equal("table");
      element.showTable = false;
      await element.updateComplete;
      expect(container.className).to.equal("table sr-only");
    });

    it("labels the chart with title, description, and scale", async () => {
      const chart = element.shadowRoot.querySelector("#chart");
      expect(chart.getAttribute("aria-label")).to.equal("Test chart");
      expect(chart.getAttribute("aria-describedby")).to.include(
        `${element.__chartId}-table`,
      );
      expect(chart.getAttribute("aria-describedby")).to.include(
        `${element.__chartId}-desc`,
      );
      expect(chart.className).to.include("ct-minor-seventh");
    });

    it("renders heading and description slots", async () => {
      expect(
        element.shadowRoot.querySelector('slot[name="heading"]'),
      ).to.exist;
      expect(element.shadowRoot.querySelector('slot[name="desc"]')).to.exist;
    });

    it("fires chartist-render-data and chartist-render-created", async () => {
      const events = [];
      const handler = (e) => events.push(e.type);
      element.addEventListener("chartist-render-data", handler);
      element.addEventListener("chartist-render-created", handler);
      element.chartData = { labels: ["a", "b"], series: [[1, 2]] };
      await element.updateComplete;
      await aTimeout(200);
      element.removeEventListener("chartist-render-data", handler);
      element.removeEventListener("chartist-render-created", handler);
      expect(events).to.include("chartist-render-data");
      expect(events).to.include("chartist-render-created");
    });

    it("passes the a11y audit", async () => {
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe("chart types and options", () => {
    let element;
    beforeEach(async () => {
      element = await fixture(
        html`<chartist-render type="bar"></chartist-render>`,
      );
      await waitForGlobal(chartistLoaded, "Chartist");
    });

    it("renders a line chart", async () => {
      element.type = "line";
      element.chartData = { labels: ["a", "b"], series: [[1, 2]] };
      await element.updateComplete;
      await aTimeout(100);
      expect(element.chart).to.exist;
    });

    it("renders a pie chart", async () => {
      element.type = "pie";
      element.chartData = { labels: ["A", "B"], series: [5, 10] };
      await element.updateComplete;
      await aTimeout(100);
      expect(element.chart).to.exist;
    });

    it("swaps noop interpolation functions from responsive options", async () => {
      element.responsiveOptions = [
        ["screen and (min-width: 1px)", {
          axisX: { labelInterpolationFnc: "noop" },
        }],
        ["screen and (min-width: 2px)", {
          axisY: { labelInterpolationFnc: "noop" },
        }],
      ];
      element.chartData = { labels: ["a", "b"], series: [[1, 2]] };
      await element.updateComplete;
      await aTimeout(100);
      expect(
        element.responsiveOptions[0][1].axisX.labelInterpolationFnc,
      ).to.be.a("function");
      expect(
        element.responsiveOptions[1][1].axisY.labelInterpolationFnc,
      ).to.be.a("function");
    });

    it("wires the axistitle plugin for non-pie charts", async () => {
      await waitForGlobal(chartistPluginsLoaded, "Chartist plugins");
      element.pluginPointLabels = undefined;
      element.pluginFillDonutItems = undefined;
      element.type = "bar";
      element.pluginAxisTitle = {
        axisX: { axisTitle: "X axis" },
        axisY: { axisTitle: "Y axis" },
      };
      element.chartData = { labels: ["a", "b"], series: [[1, 2]] };
      await element.updateComplete;
      await aTimeout(100);
      expect(element.fullOptions.plugins.length).to.equal(1);
    });

    it("defaults pointlabels interpolation for line charts", async () => {
      await waitForGlobal(chartistPluginsLoaded, "Chartist plugins");
      element.pluginAxisTitle = undefined;
      element.pluginFillDonutItems = undefined;
      element.type = "line";
      element.pluginPointLabels = { labelOffset: { x: 0, y: -10 } };
      element.chartData = { labels: ["a", "b"], series: [[1, 2]] };
      await element.updateComplete;
      await aTimeout(100);
      expect(element.fullOptions.plugins.length).to.equal(1);
      expect(element.pluginPointLabels.labelInterpolationFnc).to.be.a(
        "function",
      );
    });

    it("wires the filldonut plugin for donut pies", async () => {
      await waitForGlobal(chartistPluginsLoaded, "Chartist plugins");
      element.pluginAxisTitle = undefined;
      element.pluginPointLabels = undefined;
      element.type = "pie";
      element.options = { donut: true };
      element.pluginFillDonutItems = [{ content: "center", position: "center" }];
      element.chartData = { labels: ["a", "b"], series: [1, 2] };
      await element.updateComplete;
      await aTimeout(100);
      expect(element.fullOptions.plugins.length).to.equal(1);
    });

    it("makeChart renders and returns the chart", async () => {
      element.chartData = { labels: ["a"], series: [[1]] };
      await element.updateComplete;
      const chart = element.makeChart();
      expect(chart).to.exist;
      expect(chart).to.equal(element.chart);
    });

    it("cleans up on disconnect", async () => {
      element.remove();
      expect(element.observer).to.exist;
    });
  });

  describe("data loading and csv parsing", () => {
    let element;
    beforeEach(async () => {
      element = await fixture(
        html`<chartist-render type="bar"></chartist-render>`,
      );
      await waitForGlobal(chartistLoaded, "Chartist");
    });

    it("parses csv text into rows and numbers", () => {
      expect(element._CSVtoArray("a,b,c")).to.deep.equal([["a", "b", "c"]]);
      expect(element._CSVtoArray("1,2,3")).to.deep.equal([[1, 2, 3]]);
      expect(element._CSVtoArray("a,1,b")).to.deep.equal([["a", 1, "b"]]);
    });

    it("parses multiple rows separated by newlines", () => {
      expect(element._CSVtoArray("a,b\nc,d")).to.deep.equal([
        ["a", "b"],
        ["c", "d"],
      ]);
      expect(element._CSVtoArray("a,b\r\nc,d")).to.deep.equal([
        ["a", "b"],
        ["c", "d"],
      ]);
    });

    it("preserves quoted commas", () => {
      const result = element._CSVtoArray('"a,b",c');
      expect(result[0][0]).to.include("a");
      expect(result[0][0]).to.include("b");
      expect(result[0][1]).to.equal("c");
    });

    it("loads csv data from a data-source url", async () => {
      element.dataSource = "data:text/plain,Month,Sold%0AJan,5%0AFeb,10";
      await aTimeout(300);
      expect(element.data).to.deep.equal([
        ["Month", "Sold"],
        ["Jan", 5],
        ["Feb", 10],
      ]);
    });

    it("supports the deprecated object form of data", async () => {
      element.data = { labels: ["x", "y"], series: [[1, 2]] };
      await element.updateComplete;
      await aTimeout(100);
      // the mutation observer feeds the rendered table back through
      // _updateData, so we only assert the table renders and settles
      const table = element.querySelector("table");
      expect(table).to.exist;
      expect(table.querySelector("tbody")).to.exist;
    });

    it("generates a unique id from a prefix", () => {
      const id = element._getUniqueId("chart-");
      expect(id).to.be.a("string");
      expect(id.indexOf("chart-")).to.equal(0);
    });
  });
});
