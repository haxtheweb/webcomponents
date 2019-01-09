/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-input/paper-textarea.js";

/**
 * `json-editor`
 * `simple JSON blob data binding to a text area`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class JsonEditor extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "json-editor";
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
  // Observer value for changes
  _valueChanged(newValue, oldValue) {
    // try to evaluate this as json, otherwise return an error
    try {
      let v = JSON.parse(newValue);
      if (v) {
        this.error = false;
      }
    } catch (e) {
      this.error = true;
    }
  }
  _computeFormattedValue(value) {
    try {
      let formatted = JSON.stringify(JSON.parse(formatted), null, 2);
      if (formatted !== value) {
        this.value = formatted;
      }
    } catch (e) {}
  }
  /**
   * Computed value based on parsing the value in question
   */
  _computeCurrentData(value) {
    try {
      return JSON.parse(value);
    } catch (e) {}
  }
}
window.customElements.define(JsonEditor.tag, JsonEditor);
export { JsonEditor };
