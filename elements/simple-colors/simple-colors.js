/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "../lib/simple-colors-shared-styles.js"; //import the shared styles

export { SimpleColors };
/**
 * `simple-colors`
 * `a utilty that provides a global set of color classes and variables based on theme and accent color attributes`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SimpleColors extends PolymerElement {
  // render function
  static get template() {
    return html`
<style>:host {
  display: block;
}

:host([hidden]) {
  display: none;
}</style>
<style include="simple-colors-shared-styles"></style>
HELLO
<p class="simple-colors-default-theme-accent-12">Testing</p>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      accentColor: {
        name: "accentColor",
        type: "String",
        value: null,
        reflectToAttribute: true,
        observer: false
      },
      dark: {
        name: "dark",
        type: "Boolean",
        value: null,
        reflectToAttribute: true,
        observer: false
      }
    };
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-colors";
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
window.customElements.define(SimpleColors.tag, SimpleColors);
