/**
 * Copyright 2019
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/chartist-render/chartist-render.js";

// register globally so we can make sure there is only one
window.DataViz = window.DataViz || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same data-viz element, making it a singleton.
window.DataViz.requestAvailability = () => {
  // if there is no single instance, generate one and append it to end of the document
  if (!window.DataViz.instance) {
    window.DataViz.instance = document.createElement("data-viz");
    document.body.appendChild(window.DataViz.instance);
  }
  return window.DataViz.instance;
};

/**
 * `data-viz`
 * `display pouch-db data using graphs`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class DataViz extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }
      </style>
      <slot></slot>
      <div>[[title]]</div>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      title: {
        name: "title",
        type: String,
        value: "data-viz-default-value",
        reflectToAttribute: false,
        observer: false
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "data-viz";
  }

  static get template() {
    return html`
      <chartist-render
        id="barChart"
        type="bar"
        scale="ct-major-twelfth"
        chart-title="Quiz Distribution"
        chart-desc="A bar graph of quizzes completed by student"
      >
      </chartist-render>
    `;
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("show-data", this.showDataFunction.bind(this));
  }

  /**
   * Show the data based on user selecting the view and
   * that they want to see how they did.
   */
  showDataFunction(e) {
    var queryData = e.detail;
    var whatEvent = event.target.tagName;

    var bardata = {
      labels: queryData.labels,
      series: queryData.series
    };

    this.shadowRoot.querySelector("#barChart").data = bardata;
  }

  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("show-data", this.showDataFunction.bind(this));
  }
  /**
   * Hide callback
   */
  hideDataViz(e) {
    // add your code to run when the singleton hides
  }
  /**
   * Show / available callback
   */
  showDataViz(e) {
    // add your code to run when the singleton is called for
  }
}
window.customElements.define(DataViz.tag, DataViz);
export { DataViz };
