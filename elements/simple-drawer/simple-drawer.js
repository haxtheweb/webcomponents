/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";

export { SimpleDrawer };
/**
 * `simple-drawer`
 * `a singleton drawer element`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SimpleDrawer extends PolymerElement {
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
    return {
      /**
       * open state
       */
      opened: {
        name: "opened",
        type: Boolean,
        value: false,
        reflectToAttribute: true,
        observer: "_openedChanged"
      },
      /**
       * Close label
       */
      closeLabel: {
        name: "closeLabel",
        type: String,
        value: "Close"
      },
      /**
       * Close icon
       */
      closeIcon: {
        name: "closeIcon",
        type: String,
        value: "cancel"
      },
      /**
       * The element that invoked this. This way we can track our way back accessibly
       */
      invokedBy: {
        name: "invokedBy",
        type: Object
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-drawer";
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
window.customElements.define(SimpleDrawer.tag, SimpleDrawer);
