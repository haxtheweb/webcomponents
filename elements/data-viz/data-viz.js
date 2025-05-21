/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/chartist-render/chartist-render.js";

// register globally so we can make sure there is only one
globalThis.DataViz = globalThis.DataViz || {};
// request if this exists. This helps invoke the element existing in the dom
// as well as that there is only one of them. That way we can ensure everything
// is rendered through the same data-viz element, making it a singleton.
globalThis.DataViz.requestAvailability = () => {
  // if there is no single instance, generate one and append it to end of the document
  if (
    !globalThis.DataViz.instance &&
    globalThis.document &&
    globalThis.document.body
  ) {
    globalThis.DataViz.instance = globalThis.document.createElement("data-viz");
    globalThis.document.body.appendChild(globalThis.DataViz.instance);
  }
  return globalThis.DataViz.instance;
};

/**
 * `data-viz`
 * `display pouch-db data using graphs`
 * @demo demo/index.html
 * @element data-viz
 */
class DataViz extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        :host([hidden]) {
          display: none;
        }
      `,
    ];
  }

  // render function
  render() {
    return html` <chartist-render
      id="barchart"
      type="bar"
      scale="ct-major-twelfth"
      chart-title="Quiz Distribution"
      chart-desc="A bar graph of quizzes completed by student"
    >
    </chartist-render>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return { ...super.properties };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "data-viz";
  }
  constructor() {
    super();
    this.windowControllers = new AbortController();
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    globalThis.addEventListener(
      "pouch-db-show-data",
      this.showDataFunction.bind(this),
      { signal: this.windowControllers.signal },
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
    this.windowControllers.abort();
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
globalThis.customElements.define(DataViz.tag, DataViz);
export { DataViz };
