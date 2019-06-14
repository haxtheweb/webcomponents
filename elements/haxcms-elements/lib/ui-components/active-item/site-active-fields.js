/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
/**
 * `site-active-fields`
 * `Title of the active page in the site`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteActiveFields extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "site-active-fields";
  }
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
    `;
  }
  /**
   * Props
   */
  static get properties() {
    return {
      fields: {
        type: Object,
        notify: true
      }
      // @todo support item being passed in
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.__disposer = autorun(() => {
      this.fields = toJS(store.activeItemFields);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.__disposer();
  }
}
window.customElements.define(SiteActiveFields.tag, SiteActiveFields);
export { SiteActiveFields };
