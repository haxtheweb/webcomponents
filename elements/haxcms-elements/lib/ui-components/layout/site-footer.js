/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
/**
 * `site-footer`
 * `A basic site footer`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteFooter extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "site-footer";
  }
  constructor() {
    super();
    import("@lrnwebcomponents/license-element/license-element.js");
  }
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
      </style>
      <div class="wrapper">
        <license-element
          title="[[siteTitle]]"
          creator="[[manifest.author]]"
          source="[[manifest.domain]]"
          license="[[manifest.license]]"
        >
        </license-element>
      </div>
    `;
  }
  static get properties() {
    return {
      siteTitle: {
        type: String
      },
      manifest: {
        type: Object
      }
    };
  }
  connectedCallback() {
    super.connectedCallback();
    this.__disposer = autorun(() => {
      this.manifest = toJS(store.manifest);
    });
    this.__disposer2 = autorun(() => {
      this.siteTitle = toJS(store.siteTitle);
    });
  }
  disconnectedCallback() {
    this.__disposer();
    this.__disposer2();
    super.disconnectedCallback();
  }
}
window.customElements.define(SiteFooter.tag, SiteFooter);
export { SiteFooter };
