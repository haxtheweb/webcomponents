/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-card/paper-card.js";
import "@polymer/iron-ajax/iron-ajax.js";
import "@polymer/iron-list/iron-list.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/paper-progress/paper-progress.js";
import "@polymer/app-layout/app-toolbar/app-toolbar.js";
import "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
/**
 * `outline-designer`
 * `tools to modify and visualize JSON Outline Schema for editing`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class OutlineDesigner extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "outline-designer";
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
  // Observer layoutMode for changes
  _layoutModeChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      console.log(newValue);
    }
  }

  // Observer editMode for changes
  _editModeChanged(newValue, oldValue) {
    if (typeof newValue !== typeof undefined) {
      console.log(newValue);
    }
  }
}
window.customElements.define(OutlineDesigner.tag, OutlineDesigner);
export { OutlineDesigner };
