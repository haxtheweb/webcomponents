/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";

/**
 * `extensible-toolbar`
 * `a toolbar UI that can be customized and extended`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class ExtensibleToolbar extends PolymerElement {
  
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
<slot></slot>
<div>[[hidden]]</div>
<div>[[buttons]]</div>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
  "hidden": {
    "name": "hidden",
    "type": "Boolean",
    "value": "false",
    "reflectToAttribute": true,
    "observer": false
  },
  "buttons": {
    "name": "buttons",
    "type": "Array",
    "value": "[]",
    "reflectToAttribute": false,
    "observer": "_buttonsChanged"
  }
}
;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "extensible-toolbar";
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
  // Observer buttons for changes
  _buttonsChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      console.log(newValue);
    }
  }
}
window.customElements.define(ExtensibleToolbar.tag, ExtensibleToolbar);
export { ExtensibleToolbar };
