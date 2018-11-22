/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SimpleColors } from "../simple-colors.js"; //import the shared styles

export { SimpleColorsDemoChild };
/**
 * `simple-colors-demo-child`
 * `used inside simple-colors-demo to demontrate how nested elements use simple-colors as behaviors`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @see "./simple-colors-child.js"
 * @see "../simple-colors.js"
 * @polymer
 */
class SimpleColorsDemoChild extends SimpleColors {
  // render function
  static get template() {
    return html`
<style is="custom-style" include="simple-colors">
:host {
  background-color: var(--simple-colors-default-theme-accent-1); 
  color: var(--simple-colors-default-theme-grey-12); 
  border: 1px solid var(--simple-colors-default-theme-accent-3); 
  padding: 15px 30px;
  display: block;
}
:host([hidden]){
  display: none;
}</style>
<slot></slot>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {};
  }

  /**
   * gets simple-colors behaviors
   */
  static get behaviors() {
    return [SimpleColors];
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-colors-demo-child";
  }
  /**
   * The the parent know the child is ready.
   */
  ready() {
    super.ready();
    console.log("child-attached");
    this.dispatchEvent(new CustomEvent("child-attached"));
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
window.customElements.define(SimpleColorsDemoChild.tag, SimpleColorsDemoChild);
