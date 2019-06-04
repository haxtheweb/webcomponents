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
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "data-viz";
  }

  static get template() {
    return html`
      <h2>header test</h2>
      <chartist-render
        id="line-chart"
        data='{ "labels": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], "series": [ [5, 5, 10, 8, 7, 5, 4, null, null, null, 10, 10, 7, 8, 6, 9], [10, 15, null, 12, null, 10, 12, 15, null, null, 12, null, 14, null, null, null], [null, null, null, null, 3, 4, 1, 3, 4,  6,  7,  9, 5, null, null, null] ] }'
        options='{"fullWidth": true, "low": 0}'
        scale="ct-quarter"
        type="line"
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

    alert("fire away");

    var bardata = {
      labels: queryData.labelsArray,
      series: queryData.resultsArray
    };

    var chart = document.getElementById("line-chart");
    chart.data =
      '{ "labels": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16], "series": [ [5, 5, 10, 8, 7, 5, 4, null, null, null, 10, 10, 7, 8, 6, 9], [10, 15, null, 12, null, 10, 12, 15, null, null, 12, null, 14, null, null, null], [null, null, null, null, 3, 4, 1, 3, 4,  6,  7,  9, 5, null, null, null] ] }';
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
