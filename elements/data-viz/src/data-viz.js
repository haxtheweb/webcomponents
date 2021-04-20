/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
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
 * @demo demo/index.html
 * @element data-viz
 */
class DataViz extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "data-viz";
  }
  constructor() {
    super();
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    window.addEventListener(
      "pouch-db-show-data",
      this.showDataFunction.bind(this)
    );
  }

  /**
   * Show the data based on user selecting the view and
   * that they want to see how they did.
   */
  showDataFunction(e) {
    var queryData = e.detail;

    var bardata = {
      labels: queryData.labels,
      series: queryData.series,
    };
    this.shadowRoot.querySelector("#barchart").data = bardata;
  }

  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    window.removeEventListener(
      "pouch-db-show-data",
      this.showDataFunction.bind(this)
    );
    super.disconnectedCallback();
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
