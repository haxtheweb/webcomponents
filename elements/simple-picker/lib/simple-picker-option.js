/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
export { SimplePickerOption };
/**
 * `simple-picker-option`
 * `a simple picker for options, icons, etc.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @see ../simple-picker.js
 * @see ../simple-color-picker-row.js
 */
class SimplePickerOption extends PolymerElement {
  // render function
  static get template() {
    return html`<span class="label">[[item.text]]</span>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Is the option active?
       */
      active: {
        name: "active",
        type: "Boolean",
        value: null,
        reflectToAttribute: true,
        observer: false
      },

      /**
       * The id of the option
       */
      id: {
        name: "order",
        type: "String",
        value: null,
        reflectToAttribute: true,
        observer: false
      },

      /**
       * Is the option selected?
       */
      selected: {
        name: "selected",
        type: "Boolean",
        value: false,
        reflectToAttribute: true,
        observer: false
      },

      /**
       * The text of the option. (Required for accessibility.)
       */
      text: {
        name: "text",
        type: "String",
        value: null,
        reflectToAttribute: true,
        observer: false
      },

      /**
       * The value of the option.
       */
      value: {
        name: "label",
        type: "Object",
        value: null,
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
    return "simple-picker-option";
  }
  _handleFocus() {
    this.dispatchEvent(new CustomEvent("option-focus", { detail: this }));
  }
  _handleHover() {
    this.dispatchEvent(new CustomEvent("option-focus", { detail: this }));
  }

  /**
   * Set event listeners
   */
  ready() {
    super.ready();
    let root = this;
    this.addEventListener("focus", function(e) {
      root._handleFocus();
    });
    this.addEventListener("mouseover", function(e) {
      root._handleHover();
    });
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
window.customElements.define(SimplePickerOption.tag, SimplePickerOption);
