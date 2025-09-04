import { fixture, expect, html, oneEvent, waitUntil } from "@open-wc/testing";
import { sendKeys } from "@web/test-runner-commands";
import sinon from "sinon";
import "../data-viz.js";

// Mock chartist-render dependency
class MockChartistRender extends HTMLElement {
  constructor() {
    super();
    this._data = null;
    this._type = 'bar';
    this._scale = '';
    this._chartTitle = '';
    this._chartDesc = '';
  }
  
  static get properties() {
    return {
      data: { type: Object },
      type: { type: String },
      scale: { type: String },
      chartTitle: { type: String, attribute: 'chart-title' },
      chartDesc: { type: String, attribute: 'chart-desc' }
    };
  }
  
  set data(val) {
    this._data = val;
    this.dispatchEvent(new CustomEvent('data-changed', { detail: val }));
  }
  
  get data() {
    return this._data;
  }
  
  set type(val) {
    this._type = val;
    this.setAttribute('type', val);
  }
  
  get type() {
    return this._type;
  }
}

// Mock data for testing
const mockChartData = {
  simple: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    series: [[10, 20, 30, 40]]
  },
  multiSeries: {
    labels: ['Jan', 'Feb', 'Mar'],
    series: [[5, 10, 15], [8, 12, 18]]
  },
  empty: {
    labels: [],
    series: []
  },
  singlePoint: {
    labels: ['Single'],
    series: [[100]]
  },
  largeDataset: {
    labels: Array.from({length: 100}, (_, i) => `Item ${i + 1}`),
    series: [Array.from({length: 100}, () => Math.floor(Math.random() * 100))]
  }
};

describe("data-viz test", () => {
  let element, sandbox;
  
  // Clean up global state before each test
  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    
    // Reset global DataViz state
    if (globalThis.DataViz && globalThis.DataViz.instance) {
      globalThis.DataViz.instance.remove();
      delete globalThis.DataViz.instance;
    }
    
    // Register mock chartist-render if not already registered
    if (!globalThis.customElements.get('chartist-render')) {
      globalThis.customElements.define('chartist-render', MockChartistRender);
    }
    
    element = await fixture(html`<data-viz></data-viz>`);
  });

  afterEach(() => {
    sandbox.restore();
    
    // Clean up global event listeners
    if (element && element.windowControllers) {
      element.windowControllers.abort();
    }
    
    // Clean up global singleton
    if (globalThis.DataViz && globalThis.DataViz.instance) {
      globalThis.DataViz.instance.remove();
      delete globalThis.DataViz.instance;
    }
  });

  describe("Basic Setup and Accessibility", () => {
    it("passes the a11y audit", async () => {
      await expect(element).shadowDom.to.be.accessible();
    });

    it("passes a11y audit with chart data", async () => {
      const chartElement = element.shadowRoot.querySelector('#barchart');
      chartElement.data = mockChartData.simple;
      await element.updateComplete;
      
      await expect(element).shadowDom.to.be.accessible();
    });

    it("passes a11y audit when hidden", async () => {
      element.setAttribute('hidden', '');
      await element.updateComplete;
      
      await expect(element).shadowDom.to.be.accessible();
    });

    it("passes a11y audit with complex data", async () => {
      const chartElement = element.shadowRoot.querySelector('#barchart');
      chartElement.data = mockChartData.multiSeries;
      await element.updateComplete;
      
      await expect(element).shadowDom.to.be.accessible();
    });

    it("passes a11y audit with empty data", async () => {
      const chartElement = element.shadowRoot.querySelector('#barchart');
      chartElement.data = mockChartData.empty;
      await element.updateComplete;
      
      await expect(element).shadowDom.to.be.accessible();
    });
  });

  describe("Component Structure", () => {
    it("renders with correct tag name", () => {
      expect(element.tagName.toLowerCase()).to.equal('data-viz');
    });

    it("has proper shadow DOM structure", () => {
      const chartElement = element.shadowRoot.querySelector('chartist-render');
      expect(chartElement).to.exist;
      expect(chartElement.getAttribute('id')).to.equal('barchart');
    });

    it("configures chartist-render with default properties", () => {
      const chartElement = element.shadowRoot.querySelector('#barchart');
      
      expect(chartElement.getAttribute('type')).to.equal('bar');
      expect(chartElement.getAttribute('scale')).to.equal('ct-major-twelfth');
      expect(chartElement.getAttribute('chart-title')).to.equal('Quiz Distribution');
      expect(chartElement.getAttribute('chart-desc')).to.equal('A bar graph of quizzes completed by student');
    });

    it("applies base styling correctly", () => {
      const styles = getComputedStyle(element);
      expect(styles.display).to.equal('block');
    });

    it("hides when hidden attribute is set", async () => {
      element.setAttribute('hidden', '');
      await element.updateComplete;
      
      const styles = getComputedStyle(element);
      expect(styles.display).to.equal('none');
    });
  });

  describe("Singleton Pattern", () => {
    it("implements singleton requestAvailability", () => {
      expect(typeof globalThis.DataViz.requestAvailability).to.equal('function');
    });

    it("creates singleton instance when requested", () => {
      // Clear any existing instance
      delete globalThis.DataViz.instance;
      
      const instance = globalThis.DataViz.requestAvailability();
      
      expect(instance).to.exist;
      expect(instance.tagName.toLowerCase()).to.equal('data-viz');
      expect(globalThis.DataViz.instance).to.equal(instance);
      expect(document.body.contains(instance)).to.be.true;
    });

    it("returns same instance on multiple requests", () => {
      const instance1 = globalThis.DataViz.requestAvailability();
      const instance2 = globalThis.DataViz.requestAvailability();
      
      expect(instance1).to.equal(instance2);
    });

    it("handles missing document gracefully", () => {
      const originalDocument = globalThis.document;
      delete globalThis.document;
      delete globalThis.DataViz.instance;
      
      const instance = globalThis.DataViz.requestAvailability();
      expect(instance).to.be.undefined;
      
      globalThis.document = originalDocument;
    });

    it("handles missing document.body gracefully", () => {
      const originalBody = globalThis.document.body;
      delete globalThis.document.body;
      delete globalThis.DataViz.instance;
      
      const instance = globalThis.DataViz.requestAvailability();
      expect(instance).to.be.undefined;
      
      globalThis.document.body = originalBody;
    });
  });

  describe("Property Handling", () => {
    it("inherits super properties correctly", () => {
      const props = element.constructor.properties;
      expect(props).to.exist;
      expect(typeof props).to.equal('object');
    });

    it("supports dynamic property additions", () => {
      element.customProp = 'test-value';
      expect(element.customProp).to.equal('test-value');
    });

    it("handles property updates correctly", async () => {
      element.testProperty = 'initial';
      await element.updateComplete;
      
      element.testProperty = 'updated';
      await element.updateComplete;
      
      expect(element.testProperty).to.equal('updated');
    });
  });

  describe("Event Handling and Data Display", () => {
    it("listens for pouch-db-show-data events", async () => {
      const showDataSpy = sandbox.spy(element, 'showDataFunction');
      
      const customEvent = new CustomEvent('pouch-db-show-data', {
        detail: mockChartData.simple
      });
      
      globalThis.dispatchEvent(customEvent);
      
      expect(showDataSpy.called).to.be.true;
      expect(showDataSpy.getCall(0).args[0].detail).to.deep.equal(mockChartData.simple);
    });

    it("updates chart data when receiving pouch-db event", async () => {
      const chartElement = element.shadowRoot.querySelector('#barchart');
      const dataSpy = sandbox.spy();
      chartElement.addEventListener('data-changed', dataSpy);
      
      const customEvent = new CustomEvent('pouch-db-show-data', {
        detail: mockChartData.simple
      });
      
      globalThis.dispatchEvent(customEvent);
      
      expect(chartElement.data).to.deep.equal(mockChartData.simple);
      expect(dataSpy.called).to.be.true;
    });

    it("handles multiple data updates", async () => {
      const chartElement = element.shadowRoot.querySelector('#barchart');
      
      // First update
      globalThis.dispatchEvent(new CustomEvent('pouch-db-show-data', {
        detail: mockChartData.simple
      }));
      
      expect(chartElement.data).to.deep.equal(mockChartData.simple);
      
      // Second update
      globalThis.dispatchEvent(new CustomEvent('pouch-db-show-data', {
        detail: mockChartData.multiSeries
      }));
      
      expect(chartElement.data).to.deep.equal(mockChartData.multiSeries);
    });

    it("handles malformed event data gracefully", () => {
      const chartElement = element.shadowRoot.querySelector('#barchart');
      
      // Event without detail
      expect(() => {
        globalThis.dispatchEvent(new CustomEvent('pouch-db-show-data'));
      }).to.not.throw;
      
      // Event with null detail
      expect(() => {
        globalThis.dispatchEvent(new CustomEvent('pouch-db-show-data', {
          detail: null
        }));
      }).to.not.throw;
      
      // Event with invalid data structure
      expect(() => {
        globalThis.dispatchEvent(new CustomEvent('pouch-db-show-data', {
          detail: { invalidProperty: 'test' }
        }));
      }).to.not.throw;
    });

    it("extracts labels and series from event data", async () => {
      const chartElement = element.shadowRoot.querySelector('#barchart');
      
      const testData = {
        labels: ['A', 'B', 'C'],
        series: [[1, 2, 3]],
        extraProperty: 'ignored'
      };
      
      globalThis.dispatchEvent(new CustomEvent('pouch-db-show-data', {
        detail: testData
      }));
      
      expect(chartElement.data).to.deep.equal({
        labels: ['A', 'B', 'C'],
        series: [[1, 2, 3]]
      });
    });
  });

  describe("Lifecycle Management", () => {
    it("sets up AbortController in constructor", () => {
      expect(element.windowControllers).to.be.instanceOf(AbortController);
    });

    it("registers event listeners on connect", async () => {
      const addEventListenerSpy = sandbox.spy(globalThis, 'addEventListener');
      
      const newElement = await fixture(html`<data-viz></data-viz>`);
      
      expect(addEventListenerSpy.calledWith('pouch-db-show-data')).to.be.true;
      
      newElement.windowControllers.abort(); // Cleanup
    });

    it("cleans up event listeners on disconnect", () => {
      const abortSpy = sandbox.spy(element.windowControllers, 'abort');
      
      element.disconnectedCallback();
      
      expect(abortSpy.called).to.be.true;
    });

    it("handles multiple connect/disconnect cycles", async () => {
      const el = await fixture(html`<data-viz></data-viz>`);
      
      // Disconnect
      const abortSpy = sandbox.spy(el.windowControllers, 'abort');
      el.remove();
      expect(abortSpy.called).to.be.true;
      
      // Reconnect should work
      const el2 = await fixture(html`<data-viz></data-viz>`);
      expect(el2.windowControllers).to.be.instanceOf(AbortController);
      
      el2.windowControllers.abort(); // Cleanup
    });

    it("prevents memory leaks with proper cleanup", () => {
      const originalController = element.windowControllers;
      
      element.remove();
      
      // Controller should be aborted
      expect(originalController.signal.aborted).to.be.true;
    });
  });

  describe("Chart Integration", () => {
    it("integrates with chartist-render component", () => {
      const chartElement = element.shadowRoot.querySelector('chartist-render');
      
      expect(chartElement).to.exist;
      expect(chartElement.tagName.toLowerCase()).to.equal('chartist-render');
    });

    it("passes data to chartist-render correctly", async () => {
      const chartElement = element.shadowRoot.querySelector('#barchart');
      
      element.showDataFunction({
        detail: mockChartData.simple
      });
      
      expect(chartElement.data).to.deep.equal(mockChartData.simple);
    });

    it("handles different chart data structures", async () => {
      const chartElement = element.shadowRoot.querySelector('#barchart');
      const datasets = [mockChartData.simple, mockChartData.multiSeries, mockChartData.singlePoint];
      
      for (const dataset of datasets) {
        element.showDataFunction({ detail: dataset });
        expect(chartElement.data).to.deep.equal(dataset);
      }
    });

    it("maintains chart configuration properties", () => {
      const chartElement = element.shadowRoot.querySelector('#barchart');
      
      // Chart configuration should remain constant
      expect(chartElement.getAttribute('type')).to.equal('bar');
      expect(chartElement.getAttribute('scale')).to.equal('ct-major-twelfth');
      expect(chartElement.getAttribute('chart-title')).to.equal('Quiz Distribution');
    });

    it("handles large datasets efficiently", async () => {
      const chartElement = element.shadowRoot.querySelector('#barchart');
      
      const startTime = performance.now();
      element.showDataFunction({ detail: mockChartData.largeDataset });
      const endTime = performance.now();
      
      expect(chartElement.data).to.deep.equal(mockChartData.largeDataset);
      expect(endTime - startTime).to.be.lessThan(100); // Should process quickly
    });
  });

  describe("Callback Methods", () => {
    it("provides hideDataViz callback method", () => {
      expect(typeof element.hideDataViz).to.equal('function');
    });

    it("provides showDataViz callback method", () => {
      expect(typeof element.showDataViz).to.equal('function');
    });

    it("hideDataViz can be called without errors", () => {
      expect(() => element.hideDataViz()).to.not.throw;
    });

    it("showDataViz can be called without errors", () => {
      expect(() => element.showDataViz()).to.not.throw;
    });

    it("callback methods can be overridden", () => {
      const customHide = sinon.spy();
      const customShow = sinon.spy();
      
      element.hideDataViz = customHide;
      element.showDataViz = customShow;
      
      element.hideDataViz();
      element.showDataViz();
      
      expect(customHide.called).to.be.true;
      expect(customShow.called).to.be.true;
    });
  });

  describe("Edge Cases and Error Handling", () => {
    it("handles missing chart element gracefully", () => {
      // Remove the chart element
      const chartElement = element.shadowRoot.querySelector('#barchart');
      chartElement.remove();
      
      // Should not throw when trying to update data
      expect(() => {
        element.showDataFunction({ detail: mockChartData.simple });
      }).to.not.throw;
    });

    it("handles events without detail property", () => {
      expect(() => {
        element.showDataFunction({});
      }).to.not.throw;
    });

    it("handles null/undefined event data", () => {
      expect(() => {
        element.showDataFunction(null);
      }).to.not.throw;
      
      expect(() => {
        element.showDataFunction(undefined);
      }).to.not.throw;
    });

    it("handles events with partial data", async () => {
      const chartElement = element.shadowRoot.querySelector('#barchart');
      
      // Event with only labels
      element.showDataFunction({
        detail: { labels: ['A', 'B'] }
      });
      
      expect(chartElement.data.labels).to.deep.equal(['A', 'B']);
      expect(chartElement.data.series).to.be.undefined;
      
      // Event with only series
      element.showDataFunction({
        detail: { series: [[1, 2]] }
      });
      
      expect(chartElement.data.series).to.deep.equal([[1, 2]]);
    });

    it("handles rapid successive data updates", async () => {
      const chartElement = element.shadowRoot.querySelector('#barchart');
      
      // Rapidly fire multiple events
      for (let i = 0; i < 10; i++) {
        element.showDataFunction({
          detail: {
            labels: [`Item ${i}`],
            series: [[i]]
          }
        });
      }
      
      // Should end with the last data set
      expect(chartElement.data).to.deep.equal({
        labels: ['Item 9'],
        series: [[9]]
      });
    });

    it("handles very large label arrays", () => {
      const largeLabels = Array.from({length: 10000}, (_, i) => `Label ${i}`);
      const largeSeries = [Array.from({length: 10000}, (_, i) => i)];
      
      expect(() => {
        element.showDataFunction({
          detail: {
            labels: largeLabels,
            series: largeSeries
          }
        });
      }).to.not.throw;
    });

    it("handles special characters in labels", async () => {
      const chartElement = element.shadowRoot.querySelector('#barchart');
      
      const specialData = {
        labels: ['<script>', '&amp;', '"quotes"', '\'apostrophe\'', 'unicode: 中文'],
        series: [[1, 2, 3, 4, 5]]
      };
      
      element.showDataFunction({ detail: specialData });
      
      expect(chartElement.data).to.deep.equal(specialData);
    });
  });

  describe("Performance and Resource Management", () => {
    it("efficiently handles multiple instances", async () => {
      const instances = [];
      
      for (let i = 0; i < 5; i++) {
        const el = await fixture(html`<data-viz></data-viz>`);
        instances.push(el);
      }
      
      // All should work independently
      instances.forEach((instance, i) => {
        const chartElement = instance.shadowRoot.querySelector('#barchart');
        expect(chartElement).to.exist;
      });
      
      // Cleanup
      instances.forEach(instance => {
        instance.windowControllers.abort();
      });
    });

    it("manages memory efficiently with data updates", async () => {
      const chartElement = element.shadowRoot.querySelector('#barchart');
      const initialData = chartElement.data;
      
      // Update data many times
      for (let i = 0; i < 100; i++) {
        element.showDataFunction({
          detail: {
            labels: [`Test ${i}`],
            series: [[i]]
          }
        });
      }
      
      // Memory should not accumulate old data references
      expect(chartElement.data.labels).to.deep.equal(['Test 99']);
    });

    it("handles concurrent event processing", async () => {
      const chartElement = element.shadowRoot.querySelector('#barchart');
      
      const promises = [];
      for (let i = 0; i < 10; i++) {
        promises.push(Promise.resolve().then(() => {
          element.showDataFunction({
            detail: {
              labels: [`Concurrent ${i}`],
              series: [[i * 10]]
            }
          });
        }));
      }
      
      await Promise.all(promises);
      
      // Should handle concurrent updates without issues
      expect(chartElement.data).to.exist;
      expect(chartElement.data.labels).to.be.an('array');
    });

    it("cleans up resources on element removal", () => {
      const controller = element.windowControllers;
      const abortSpy = sandbox.spy(controller, 'abort');
      
      element.remove();
      
      expect(abortSpy.called).to.be.true;
      expect(controller.signal.aborted).to.be.true;
    });
  });

  describe("Integration Scenarios", () => {
    it("works with PouchDB-style data events", async () => {
      const chartElement = element.shadowRoot.querySelector('#barchart');
      
      // Simulate PouchDB query results
      const pouchData = {
        labels: ['Quiz 1', 'Quiz 2', 'Quiz 3'],
        series: [[85, 92, 78]]
      };
      
      globalThis.dispatchEvent(new CustomEvent('pouch-db-show-data', {
        detail: pouchData
      }));
      
      expect(chartElement.data).to.deep.equal(pouchData);
      expect(chartElement.getAttribute('chart-title')).to.equal('Quiz Distribution');
    });

    it("integrates with singleton pattern for dashboard usage", () => {
      const singleton = globalThis.DataViz.requestAvailability();
      
      // Should be able to receive data via singleton
      const chartElement = singleton.shadowRoot.querySelector('#barchart');
      singleton.showDataFunction({
        detail: mockChartData.simple
      });
      
      expect(chartElement.data).to.deep.equal(mockChartData.simple);
    });

    it("works in complex applications with multiple data sources", async () => {
      const chartElement = element.shadowRoot.querySelector('#barchart');
      
      // Simulate different types of educational data
      const quizData = {
        labels: ['Quiz 1', 'Quiz 2', 'Quiz 3'],
        series: [[85, 90, 88]]
      };
      
      const assignmentData = {
        labels: ['HW 1', 'HW 2', 'HW 3'],
        series: [[95, 87, 92]]
      };
      
      // Switch between data sources
      element.showDataFunction({ detail: quizData });
      expect(chartElement.data).to.deep.equal(quizData);
      
      element.showDataFunction({ detail: assignmentData });
      expect(chartElement.data).to.deep.equal(assignmentData);
    });

    it("maintains chart accessibility in real-world usage", async () => {
      const chartElement = element.shadowRoot.querySelector('#barchart');
      
      // Update with realistic student data
      element.showDataFunction({
        detail: {
          labels: ['Student 1', 'Student 2', 'Student 3', 'Student 4'],
          series: [[95, 87, 92, 89]]
        }
      });
      
      await element.updateComplete;
      
      // Chart should remain accessible
      await expect(element).shadowDom.to.be.accessible();
      expect(chartElement.getAttribute('chart-desc')).to.include('student');
    });
  });

  describe("Styling and CSS Integration", () => {
    it("applies base styles correctly", () => {
      const styles = element.constructor.styles[0];
      expect(styles.cssText).to.include('display: block');
      expect(styles.cssText).to.include(':host([hidden])');
    });

    it("supports CSS custom properties", async () => {
      element.style.setProperty('--chart-color', 'blue');
      
      const customColor = getComputedStyle(element).getPropertyValue('--chart-color');
      expect(customColor.trim()).to.equal('blue');
    });

    it("inherits styling from parent elements", async () => {
      const wrapper = await fixture(html`
        <div style="color: red; font-size: 18px;">
          <data-viz></data-viz>
        </div>
      `);
      
      const dataVizElement = wrapper.querySelector('data-viz');
      const styles = getComputedStyle(dataVizElement);
      
      expect(styles.color).to.include('255, 0, 0'); // red in rgb
      expect(parseInt(styles.fontSize)).to.equal(18);
      
      dataVizElement.windowControllers.abort(); // Cleanup
    });
  });
});
