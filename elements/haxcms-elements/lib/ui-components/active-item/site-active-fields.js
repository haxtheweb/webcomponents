/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
/**
 * `site-active-fields`
 * `Title of the active page in the site`
 *

 * @demo demo/index.html
 */
class SiteActiveFields extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "site-active-fields";
  }
  /**
   * LitElement properties decorator
   */
  static get properties() {
    return {
      fields: {
        type: Object,
      },
    };
  }
  /**
   * LitElement life cycle callback
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "fields") {
        this.dispatchEvent(
          new CustomEvent("fields-changed", {
            detail: this[propName],
          }),
        );
      }
    });
  }
  /**
   * VanillaJS life cycle callback
   */
  connectedCallback() {
    super.connectedCallback();
    this.__disposer = autorun(() => {
      this.fields = toJS(store.activeItemFields);
    });
  }
  /**
   * VanillaJS life cycle callback
   */
  disconnectedCallback() {
    this.__disposer();
    super.disconnectedCallback();
  }
}
customElements.define(SiteActiveFields.tag, SiteActiveFields);
export { SiteActiveFields };
