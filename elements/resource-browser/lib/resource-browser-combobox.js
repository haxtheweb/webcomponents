/**
 * Copyright 2021 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";

/**
 * `resource-browser-combobox`
 * `displays a selectable list of resources as a grid or combobox`
 * @demo demo/index.html
 * @element resource-browser-combobox
 */
class ResourceBrowserCombobox extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          align-items: center;
          padding: 5px;
        }

        :host([hidden]) {
          display: none;
        }
      `,
    ];
  }

  // Template return function
  render() {
    return html`<slot></slot>`;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
    };
  }

  /**
   * Convention we use
   */
  static get tag() {
    return "resource-browser-combobox";
  }

  /**
   * HTMLElement
   */
  constructor() {
    super();
  }
  /**
   * LitElement ready
   */
  firstUpdated(changedProperties) {}
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {});
  }
}
customElements.define(ResourceBrowserCombobox.tag, ResourceBrowserCombobox);
export { ResourceBrowserCombobox };
