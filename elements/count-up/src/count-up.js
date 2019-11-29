/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
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
class CountUpElement extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "count-up";
  }
  /**
   * life cycle, element is afixed to the DOM
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
    for (let entry of entries) {
      this._setRatio(Number(entry.intersectionRatio).toFixed(2));
      if (this.ratio >= this.visibleLimit) {
        // now we care
        this._countUp.start();
      }
    }
  }
}
customElements.define(CountUpElement.tag, CountUpElement);
export { CountUpElement, CountUp };
