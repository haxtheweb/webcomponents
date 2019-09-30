/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "./extensible-toolbar-button-styles.js";
/**
 * `extensible-toolbar-group`
 * ` a button group for extensible-toolbar (custom buttons can extend this)`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class ExtensibleToolbarGroup extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style include="extensible-toolbar-button-styles"></style>
      <div class="group-label" hidden$="[[!label]]">[[label]]</div>
      <slot></slot>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * The minimum breakpoint where the group appears, expressed as `xs`, `sm`, `md`, `lg`, or `xl`
       */
      collapsedUntil: {
        name: "collapsedUntil",
        type: String,
        value: "xs"
      },
      /**
       * Label for the group.
       */
      label: {
        name: "label",
        type: String,
        value: null
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "extensible-toolbar-group";
  }
}
window.customElements.define(
  ExtensibleToolbarGroup.tag,
  ExtensibleToolbarGroup
);
export { ExtensibleToolbarGroup };
