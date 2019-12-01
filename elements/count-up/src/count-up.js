/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { CountUp } from "countup.js";

/**
 * `count-up`
 * @customElement count-up
 * `count up js wrapper with minimal styling`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @lit-element
 * @demo demo/index.html
 */
class CountUpElement extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "count-up";
  }
  constructor() {
    super();
    this.start = 0;
    this.end = 100;
    this.duration = 2.5;
    this.noeasing = false;
    this.decimalplaces = 0;
    this.separator = ",";
    this.decimal = ".";
    this.prefixtext = " ";
    this.suffixtext = " ";
    this.thresholds = [0.0, 0.25, 0.5, 0.75, 1.0];
    this.rootMargin = "0px";
    this.visibleLimit = 0.5;
  }
  /**
   * HTMLElement
   */
  connectedCallback() {
    super.connectedCallback();
    // setup the intersection observer
    this.observer = new IntersectionObserver(
      this.handleIntersectionCallback.bind(this),
      {
        root: document.rootElement,
        rootMargin: this.rootMargin,
        threshold: this.thresholds
      }
    );
    this.observer.observe(this);
  }
  /**
   * HTMLElement
   */
  disconnectedCallback() {
    this.observer.disconnect();
    super.disconnectedCallback();
  }
  /**
   * LitElement ready
   */
  firstUpdated() {
    const options = {
      startVal: this.start,
      decimalPlaces: this.decimalplaces,
      duration: this.duration,
      useEasing: !this.noeasing,
      separator: this.separator,
      decimal: this.decimal,
      prefix: this.prefixtext,
      suffix: this.suffixtext
    };
    this._countUp = new CountUp(
      this.shadowRoot.querySelector("#counter"),
      this.end,
      options
    );
  }
  handleIntersectionCallback(entries) {
    if (this._countUp) {
      for (let entry of entries) {
        this.ratio = Number(entry.intersectionRatio).toFixed(2);
        if (this.ratio >= this.visibleLimit) {
          // now we care
          this._countUp.start();
        }
      }
    }
  }
}
customElements.define(CountUpElement.tag, CountUpElement);
export { CountUpElement, CountUp };
