/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";

export { IconsetDemoSnippet };
/**
 * `iconset-demo`
 * `iterates through an iconset array to generate a demo of all of the icons`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class IconsetDemoSnippet extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "iconset-demo";
  }
  /**
   * Store the template name to make it easier to obtain directly.
   */
  static get template() {
    return html`<iron-icon icon="SET_NAME_HERE:ICON_NAME_HERE"></iron-icon>`;
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
}
window.customElements.define(IconsetDemo.tag, IconsetDemoSnippet);
