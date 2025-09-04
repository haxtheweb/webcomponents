import { fixture, expect, html } from "@open-wc/testing";
import "../chartist-render.js";

// Mock Chartist.js library and dependencies
beforeEach(() => {
  // Mock global Chartist library
  globalThis.Chartist = {
    Bar: (target, data, options, responsiveOptions) => ({
      type: 'Bar',
      target,
      data,
      options,
      responsiveOptions,
      on: (event, callback) => {
        setTimeout(() => {
          if (event === 'created' || event === 'draw') {
            callback({ type: event, target, data });
          }
        }, 10);
      }
    }),
    Line: (target, data, options, responsiveOptions) => ({
      type: 'Line',
      target,
      data,
      options,
      responsiveOptions,
      on: (event, callback) => {
        setTimeout(() => {
          if (event === 'created' || event === 'draw') {
            callback({ type: event, target, data });
          }
        }, 10);
      }
    }),
    Pie: (target, data, options, responsiveOptions) => ({
      type: 'Pie',
      target,
      data,
      options,
      responsiveOptions,
      on: (event, callback) => {
        setTimeout(() => {
          if (event === 'created' || event === 'draw') {
            callback({ type: event, target, data });
          }
        }, 10);
      }
    }),
    noop: () => {},
    plugins: {
      ctAxisTitle: (options) => ({ type: 'ctAxisTitle', options }),
      ctPointLabels: (options) => ({ type: 'ctPointLabels', options }),
      fillDonut: (options) => ({ type: 'fillDonut', options })
    }
  };
  
  // Mock ESGlobalBridge
  globalThis.ESGlobalBridge = {
    requestAvailability: () => ({
      load: (name, url) => {
        setTimeout(() => {
          globalThis.dispatchEvent(new CustomEvent(`es-bridge-${name}-loaded`));
        }, 10);
      }
    })
  };
  
  // Mock fetch for CSV loading
  globalThis.fetch = (url) => {
    const csvData = 'Label A,Label B,Label C\n10,20,30\n40,50,60';
    return Promise.resolve({
      text: () => Promise.resolve(csvData)
    });
  };
  
  // Mock AbortController
  if (!globalThis.AbortController) {
    globalThis.AbortController = class {
      constructor() {
        this.signal = { aborted: false };
      }
      abort() {
        this.signal.aborted = true;
      }
    };
  }
});

aftereEach(() => {
  // Clean up mocks
  delete globalThis.Chartist;
  delete globalThis.fetch;
});

describe("chartist-render test", () => {
  let element;
  
  beforeEach(async () => {
    element = await fixture(
      html`<chartist-render id="pie-chart" type="pie" scale="ct-square">
        <h3 slot="heading">A pie chart of favorite pies (chart)</h3>
        <table>
          <caption>A pie chart of favorite pies (table)</caption>
          <thead>
            <tr>
              <th scope="col">Key Lime</th>
              <th scope="col">Lemon Merangue</th>
              <th scope="col">Apple</th>
              <th scope="col">Pumpkin</th>
              <th scope="col">Cherry</th>
              <th scope="col">Pecan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>23</td>
              <td>15</td>
              <td>40</td>
              <td>30</td>
              <td>12</td>
              <td>20</td>
            </tr>
          </tbody>
        </table>
      </chartist-render>`
    );
    await element.updateComplete;
  });

  it("basic setup", async () => {
    expect(element).to.exist;
    expect(element.tagName.toLowerCase()).to.equal("chartist-render");
  });

  it("passes the a11y audit", async () => {
    await expect(element).shadowDom.to.be.accessible();
  });

  describe("Component structure and properties", () => {
    it("should have correct tag name", () => {
      expect(element.constructor.tag).to.equal("chartist-render");
    });

    it("should initialize with default properties", () => {
      expect(element.id).to.equal("pie-chart");
      expect(element.type).to.equal("pie");
      expect(element.scale).to.equal("ct-square");
      expect(element.showTable).to.be.false;
      expect(element.data).to.be.an('array');
      expect(element.responsiveOptions).to.be.an('array');
    });

    it("should have required chart structure elements", () => {
      const chartDiv = element.shadowRoot.querySelector('#chart');
      const titleDiv = element.shadowRoot.querySelector('.title');
      const descDiv = element.shadowRoot.querySelector('.desc');
      const tableDiv = element.shadowRoot.querySelector('.table');
      const slot = element.shadowRoot.querySelector('slot');
      
      expect(chartDiv).to.exist;
      expect(titleDiv).to.exist;
      expect(descDiv).to.exist;
      expect(tableDiv).to.exist;
      expect(slot).to.exist;
    });

    it("should have proper ARIA attributes", () => {
      const chartDiv = element.shadowRoot.querySelector('#chart');
      
      expect(chartDiv.getAttribute('role')).to.equal('presentation');
      expect(chartDiv.hasAttribute('aria-label')).to.be.true;
      expect(chartDiv.hasAttribute('aria-describedby')).to.be.true;
    });
  });

  describe("Property validation with accessibility", () => {
    describe("type property", () => {
      it("should handle different chart types and maintain accessibility", async () => {
        const chartTypes = ['bar', 'line', 'pie'];
        
        for (const type of chartTypes) {
          element.type = type;
          await element.updateComplete;
          
          expect(element.type).to.equal(type);
          await expect(element).shadowDom.to.be.accessible();
        }
      });
    });

    describe("scale property", () => {
      it("should handle different scale values and maintain accessibility", async () => {
        const scales = [
          'ct-square',
          'ct-minor-second',
          'ct-major-second', 
          'ct-minor-third',
          'ct-perfect-fourth',
          'ct-golden-section',
          'ct-octave'
        ];
        
        for (const scale of scales) {
          element.scale = scale;
          await element.updateComplete;
          
          expect(element.scale).to.equal(scale);
          const chartDiv = element.shadowRoot.querySelector('#chart');
          expect(chartDiv.className).to.include(scale);
          await expect(element).shadowDom.to.be.accessible();
        }
      });
    });

    describe("showTable property", () => {
      it("should control table visibility and maintain accessibility", async () => {
        // Table hidden by default
        expect(element.showTable).to.be.false;
        let tableDiv = element.shadowRoot.querySelector('.table');
        expect(tableDiv.className).to.include('sr-only');
        
        // Show table
        element.showTable = true;
        await element.updateComplete;
        
        expect(element.showTable).to.be.true;
        tableDiv = element.shadowRoot.querySelector('.table');
        expect(tableDiv.className).to.not.include('sr-only');
        await expect(element).shadowDom.to.be.accessible();
      });
    });

    describe("chartTitle property", () => {
      it("should handle chart titles and maintain accessibility", async () => {
        const titles = [
          'Test Chart',
          'Sales Data 2023',
          'Performance Metrics',
          ''
        ];
        
        for (const title of titles) {
          element.chartTitle = title;
          await element.updateComplete;
          
          expect(element.chartTitle).to.equal(title);
          const chartDiv = element.shadowRoot.querySelector('#chart');
          expect(chartDiv.getAttribute('aria-label')).to.equal(title);
          await expect(element).shadowDom.to.be.accessible();
        }
      });
    });
  });

  describe("Data handling and processing", () => {
    it("should process table data correctly", async () => {
      // Element already has table data from fixture
      await new Promise(resolve => setTimeout(resolve, 100)); // Allow data processing
      
      expect(element.data).to.be.an('array');
      expect(element.data.length).to.be.greaterThan(0);
      expect(element.chartData).to.exist;
      expect(element.chartData.labels).to.be.an('array');
      expect(element.chartData.series).to.be.an('array');
    });

    it("should handle CSV data loading", async () => {
      element.dataSource = 'test.csv';
      await element.updateComplete;
      
      // Wait for fetch to complete
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(element.data).to.be.an('array');
    });

    it("should convert CSV text to array correctly", () => {
      const csvText = 'A,B,C\n1,2,3\n4,5,6';
      const result = element._CSVtoArray(csvText);
      
      expect(result).to.be.an('array');
      expect(result.length).to.equal(3);
      expect(result[0]).to.deep.equal(['A', 'B', 'C']);
      expect(result[1]).to.deep.equal([1, 2, 3]);
      expect(result[2]).to.deep.equal([4, 5, 6]);
    });

    it("should handle CSV with quoted values", () => {
      const csvText = '"Label A","Label B","Label C"\n"Value 1",10,20';
      const result = element._CSVtoArray(csvText);
      
      expect(result[0]).to.deep.equal(['Label A', 'Label B', 'Label C']);
      expect(result[1]).to.deep.equal(['Value 1', 10, 20]);
    });

    it("should update chart data when data changes", async () => {
      const newData = [
        ['Label 1', 'Label 2', 'Label 3'],
        [10, 20, 30]
      ];
      
      element.data = newData;
      await element.updateComplete;
      
      expect(element.chartData.labels).to.deep.equal(['Label 1', 'Label 2', 'Label 3']);
      expect(element.chartData.series).to.deep.equal([10, 20, 30]);
    });
  });

  describe("Chart rendering functionality", () => {
    beforeEach(async () => {
      // Wait for Chartist to be "loaded"
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it("should create bar chart correctly", async () => {
      element.type = 'bar';
      await element.updateComplete;
      
      const chart = element.makeChart();
      expect(chart).to.exist;
      expect(chart.type).to.equal('Bar');
    });

    it("should create line chart correctly", async () => {
      element.type = 'line';
      await element.updateComplete;
      
      const chart = element.makeChart();
      expect(chart).to.exist;
      expect(chart.type).to.equal('Line');
    });

    it("should create pie chart correctly", async () => {
      element.type = 'pie';
      await element.updateComplete;
      
      const chart = element.makeChart();
      expect(chart).to.exist;
      expect(chart.type).to.equal('Pie');
    });

    it("should handle chart options", async () => {
      const customOptions = {
        showArea: true,
        low: 0,
        high: 100
      };
      
      element.options = customOptions;
      element.type = 'line';
      await element.updateComplete;
      
      const chart = element.makeChart();
      expect(chart.options).to.include(customOptions);
    });

    it("should handle responsive options", async () => {
      const responsiveOptions = [
        ['screen and (max-width: 640px)', {
          showLine: false,
          axisX: {
            labelInterpolationFnc: 'noop'
          }
        }]
      ];
      
      element.responsiveOptions = responsiveOptions;
      element.type = 'bar';
      await element.updateComplete;
      
      const chart = element.makeChart();
      expect(chart.responsiveOptions).to.deep.equal(responsiveOptions);
    });
  });

  describe("Plugin integration", () => {
    it("should support axis title plugin", async () => {
      element.pluginAxisTitle = {
        axisX: {
          axisTitle: 'X Axis',
          offset: { x: 0, y: 50 },
          textAnchor: 'middle'
        }
      };
      element.type = 'bar';
      await element.updateComplete;
      
      expect(element.fullOptions.plugins).to.be.an('array');
      expect(element.fullOptions.plugins[0].type).to.equal('ctAxisTitle');
    });

    it("should support point labels plugin for line charts", async () => {
      element.pluginPointLabels = {
        labelOffset: { x: 0, y: -10 },
        textAnchor: 'middle'
      };
      element.type = 'line';
      await element.updateComplete;
      
      expect(element.fullOptions.plugins).to.be.an('array');
      expect(element.fullOptions.plugins[0].type).to.equal('ctPointLabels');
    });

    it("should support fill donut plugin for pie charts", async () => {
      element.pluginFillDonutItems = [
        {
          class: 'center-text',
          content: 'Total: 100',
          position: 'center'
        }
      ];
      element.type = 'pie';
      element.options = { donut: true };
      await element.updateComplete;
      
      expect(element.fullOptions.plugins).to.be.an('array');
      expect(element.fullOptions.plugins[0].type).to.equal('fillDonut');
    });

    it("should load plugins correctly", () => {
      const plugins = element.plugins;
      expect(plugins).to.be.an('array');
      expect(plugins.length).to.equal(3);
      expect(plugins[0][0]).to.equal('Chartist.plugins.ctAxisTitle');
      expect(plugins[1][0]).to.equal('Chartist.plugins.CtPointLabels');
      expect(plugins[2][0]).to.equal('Chartist.plugins.fillDonut');
    });
  });

  describe("Event handling", () => {
    it("should dispatch chartist-render-ready event on creation", (done) => {
      element.addEventListener('chartist-render-ready', (e) => {
        expect(e.detail).to.equal(element);
        expect(e.bubbles).to.be.true;
        expect(e.composed).to.be.true;
        done();
      });
      
      // Event is dispatched in constructor, so create new element
      fixture(html`<chartist-render type="bar"></chartist-render>`);
    });

    it("should dispatch data change events", async () => {
      let dataChangedFired = false;
      let chartDataChangedFired = false;
      
      element.addEventListener('data-changed', () => {
        dataChangedFired = true;
      });
      
      element.addEventListener('chart-data-changed', () => {
        chartDataChangedFired = true;
      });
      
      element.data = [['A', 'B'], [1, 2]];
      await element.updateComplete;
      
      expect(dataChangedFired).to.be.true;
      expect(chartDataChangedFired).to.be.true;
    });

    it("should dispatch data-source-changed event", async () => {
      let eventFired = false;
      
      element.addEventListener('data-source-changed', () => {
        eventFired = true;
      });
      
      element.dataSource = 'new-data.csv';
      await element.updateComplete;
      
      expect(eventFired).to.be.true;
    });

    it("should dispatch chart render events", (done) => {
      let renderDataFired = false;
      let renderCreatedFired = false;
      
      element.addEventListener('chartist-render-data', () => {
        renderDataFired = true;
      });
      
      element.addEventListener('chartist-render-created', () => {
        renderCreatedFired = true;
        expect(renderDataFired).to.be.true;
        done();
      });
      
      element.type = 'bar';
      element._getChart();
    });
  });

  describe("Table rendering and accessibility", () => {
    it("should render table from data", () => {
      const testData = [
        ['Product', 'Sales', 'Profit'],
        ['A', 100, 20],
        ['B', 150, 35]
      ];
      
      element.data = testData;
      element._renderTable();
      
      const table = element.querySelector('table');
      expect(table).to.exist;
      
      const headers = table.querySelectorAll('th');
      expect(headers.length).to.equal(3);
      expect(headers[0].textContent).to.equal('Product');
    });

    it("should handle table with row headers", () => {
      const testData = [
        ['', 'Q1', 'Q2', 'Q3'],
        ['Product A', 100, 120, 140],
        ['Product B', 80, 90, 110]
      ];
      
      element.data = testData;
      element._renderTable();
      
      const table = element.querySelector('table');
      const rowHeaders = table.querySelectorAll('tbody th[scope="row"]');
      expect(rowHeaders.length).to.equal(2);
    });

    it("should update data from table changes", async () => {
      // Add a table to test mutation observer
      const table = globalThis.document.createElement('table');
      table.innerHTML = `
        <tr><th>A</th><th>B</th></tr>
        <tr><td>10</td><td>20</td></tr>
      `;
      element.appendChild(table);
      
      element._updateData();
      
      expect(element.data).to.be.an('array');
      expect(element.data[0]).to.deep.equal(['A', 'B']);
      expect(element.data[1]).to.deep.equal([10, 20]);
    });
  });

  describe("Accessibility scenarios", () => {
    it("should remain accessible with different chart types", async () => {
      const types = ['bar', 'line', 'pie'];
      
      for (const type of types) {
        element.type = type;
        await element.updateComplete;
        await expect(element).shadowDom.to.be.accessible();
      }
    });

    it("should remain accessible when table is shown", async () => {
      element.showTable = true;
      await element.updateComplete;
      
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should have proper heading structure", () => {
      const headingSlot = element.shadowRoot.querySelector('slot[name="heading"]');
      expect(headingSlot).to.exist;
      
      // Check for slotted heading
      const heading = element.querySelector('h3[slot="heading"]');
      expect(heading).to.exist;
      expect(heading.textContent).to.include('pie chart');
    });

    it("should maintain accessibility with custom titles", async () => {
      element.chartTitle = 'Custom Accessibility Title';
      element.chartDesc = 'This chart shows test data for accessibility';
      await element.updateComplete;
      
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe("Edge cases and error handling", () => {
    it("should handle empty data gracefully", async () => {
      element.data = [];
      await element.updateComplete;
      
      expect(element.chartData).to.exist;
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should handle invalid chart type", async () => {
      element.type = 'invalid-type';
      await element.updateComplete;
      
      // Should not break the component
      expect(element.type).to.equal('invalid-type');
      await expect(element).shadowDom.to.be.accessible();
    });

    it("should handle malformed CSV data", () => {
      const malformedCSV = 'A,B\n1,2,3\n4';
      const result = element._CSVtoArray(malformedCSV);
      
      expect(result).to.be.an('array');
      // Should handle gracefully without throwing errors
    });

    it("should handle missing Chartist library gracefully", async () => {
      const originalChartist = globalThis.Chartist;
      delete globalThis.Chartist;
      
      element.type = 'bar';
      element._getChart();
      
      // Should not throw errors
      expect(element.chart).to.be.undefined;
      
      globalThis.Chartist = originalChartist;
    });

    it("should handle fetch errors for data source", async () => {
      globalThis.fetch = () => Promise.reject(new Error('Network error'));
      
      element.dataSource = 'nonexistent.csv';
      await element.updateComplete;
      
      // Should handle error gracefully
      expect(element.dataSource).to.equal('nonexistent.csv');
    });

    it("should handle undefined options", async () => {
      element.options = undefined;
      element.type = 'bar';
      await element.updateComplete;
      
      const fullOptions = element.fullOptions;
      expect(fullOptions).to.be.an('object');
    });

    it("should handle extremely large datasets", async () => {
      const largeData = [];
      const labels = [];
      const series = [];
      
      for (let i = 0; i < 100; i++) {
        labels.push(`Label ${i}`);
        series.push(Math.random() * 100);
      }
      
      largeData.push(labels);
      largeData.push(series);
      
      element.data = largeData;
      await element.updateComplete;
      
      expect(element.chartData.labels.length).to.equal(100);
      expect(element.chartData.series.length).to.equal(100);
    });
  });

  describe("Lifecycle methods", () => {
    it("should handle constructor properly", () => {
      const newElement = new (element.constructor)();
      
      expect(newElement.type).to.equal('bar');
      expect(newElement.scale).to.equal('ct-minor-seventh');
      expect(newElement.showTable).to.be.false;
      expect(newElement.windowControllers).to.exist;
    });

    it("should handle disconnectedCallback", () => {
      element.windowControllers = new AbortController();
      element.observer = {
        disconnect: () => {}
      };
      
      element.disconnectedCallback();
      
      expect(element.windowControllers.signal.aborted).to.be.true;
    });

    it("should handle updated lifecycle with property changes", async () => {
      let eventFired = false;
      
      element.addEventListener('data-changed', () => {
        eventFired = true;
      });
      
      element.data = [['New', 'Data'], [1, 2]];
      await element.updateComplete;
      
      expect(eventFired).to.be.true;
    });
  });

  describe("Utility methods", () => {
    it("should generate unique IDs", () => {
      const id1 = element._getUniqueId('test-');
      const id2 = element._getUniqueId('test-');
      
      expect(id1).to.include('test-');
      expect(id2).to.include('test-');
      expect(id1).to.not.equal(id2);
    });

    it("should load scripts correctly", () => {
      let scriptLoaded = false;
      
      globalThis.addEventListener('es-bridge-testScript-loaded', () => {
        scriptLoaded = true;
      });
      
      element._loadScripts('testScript', 'test/path.js');
      
      // Script loading should be initiated
      expect(scriptLoaded).to.be.false; // Will be true after async load
    });
  });

  describe("Styling and theming", () => {
    it("should apply scale classes correctly", async () => {
      element.scale = 'ct-perfect-fifth';
      await element.updateComplete;
      
      const chartDiv = element.shadowRoot.querySelector('#chart');
      expect(chartDiv.className).to.include('ct-perfect-fifth');
    });

    it("should support CSS custom properties", () => {
      element.style.setProperty('--chartist-color-1', '#ff0000');
      element.style.setProperty('--chartist-text-color', '#333333');
      
      const computedStyle = globalThis.getComputedStyle(element);
      // Custom properties should be available for use
      expect(element.style.getPropertyValue('--chartist-color-1')).to.equal('#ff0000');
    });

    it("should handle sr-only class for table accessibility", async () => {
      // Table should be screen-reader only by default
      element.showTable = false;
      await element.updateComplete;
      
      const tableDiv = element.shadowRoot.querySelector('.table');
      expect(tableDiv.className).to.include('sr-only');
      
      // Table should be visible when showTable is true
      element.showTable = true;
      await element.updateComplete;
      
      expect(tableDiv.className).to.not.include('sr-only');
    });
  });

  describe("Integration scenarios", () => {
    it("should handle complete workflow from table to chart", async () => {
      // Start with table data
      const table = element.querySelector('table');
      expect(table).to.exist;
      
      // Wait for data processing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Should have processed data
      expect(element.data).to.be.an('array');
      expect(element.chartData).to.exist;
      
      // Should be able to create chart
      const chart = element.makeChart();
      expect(chart).to.exist;
    });

    it("should handle CSV to chart workflow", async () => {
      element.dataSource = 'test-data.csv';
      await element.updateComplete;
      
      // Wait for fetch and processing
      await new Promise(resolve => setTimeout(resolve, 100));
      
      expect(element.data).to.be.an('array');
      expect(element.chartData).to.exist;
    });

    it("should work with all chart types and plugins", async () => {
      const configs = [
        { 
          type: 'bar',
          plugin: 'pluginAxisTitle',
          pluginData: { axisX: { axisTitle: 'X Axis' } }
        },
        { 
          type: 'line',
          plugin: 'pluginPointLabels',
          pluginData: { labelOffset: { x: 0, y: -10 } }
        },
        {
          type: 'pie',
          plugin: 'pluginFillDonutItems',
          pluginData: [{ content: 'Center', position: 'center' }],
          options: { donut: true }
        }
      ];
      
      for (const config of configs) {
        element.type = config.type;
        element[config.plugin] = config.pluginData;
        if (config.options) element.options = config.options;
        await element.updateComplete;
        
        const chart = element.makeChart();
        expect(chart).to.exist;
        expect(chart.type).to.equal(config.type.charAt(0).toUpperCase() + config.type.slice(1));
        
        await expect(element).shadowDom.to.be.accessible();
      }
    });
  });

  describe("Performance considerations", () => {
    it("should handle rapid property changes efficiently", async () => {
      const startTime = performance.now();
      
      for (let i = 0; i < 10; i++) {
        element.type = i % 2 === 0 ? 'bar' : 'line';
        element.scale = i % 2 === 0 ? 'ct-square' : 'ct-octave';
        await element.updateComplete;
      }
      
      const endTime = performance.now();
      const totalTime = endTime - startTime;
      
      expect(totalTime).to.be.lessThan(1000);
    });

    it("should cleanup observers and controllers properly", () => {
      const mockObserver = {
        disconnect: () => {},
        observe: () => {}
      };
      
      element.observer = mockObserver;
      element.windowControllers = new AbortController();
      
      expect(element.observer).to.equal(mockObserver);
      expect(element.windowControllers.signal.aborted).to.be.false;
      
      element.disconnectedCallback();
      
      expect(element.windowControllers.signal.aborted).to.be.true;
    });
  });
});
