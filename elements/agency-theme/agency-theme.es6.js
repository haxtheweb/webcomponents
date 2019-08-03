/**
 * Copyright 2019 Gotham University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "./lib/agency-theme-band.js";
import "./lib/agency-theme-spotlight.js";

export { AgencyTheme };
/**
 * `agency-theme`
 * ``
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class AgencyTheme extends PolymerElement {
  
  // render function
  static get template() {
    return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}
</style>
<slot></slot>`;
  }

  // properties available to the custom element for data binding
    static get properties() {
    let props = {}
;
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "agency-theme";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(AgencyTheme.tag, AgencyTheme);
