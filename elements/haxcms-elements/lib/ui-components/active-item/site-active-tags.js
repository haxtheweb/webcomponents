/**
 * Copyright 2023 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html } from "lit";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import "@lrnwebcomponents/simple-fields/lib/simple-tags.js";

/**
 * `site-active-tags`
 * `Tags of the active page`
 *
 * @demo demo/index.html
 */
class SiteActiveTags extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "site-active-tags";
  }
  /**
   * LitElement
   */
  render() {
    return html`${this.tags && this.tags!='' ? this.tags.split(',').map(tag => html`
<simple-tag value="${tag.trim()}" accent-color="${this.accentColor}"></simple-tag>`) : ``}`;
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      tags: {
        type: String,
      },
      accentColor: {
        type: String,
        attribute: "accent-color",
      },
    };
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.accentColor = "orange";
    this.tags = null;
    this.__disposer = [];
    autorun((reaction) => {
      this.tags = toJS(store.activeTags);
      this.__disposer.push(reaction);
    });
  }
  /**
   * HTMLElement
   */
  disconnectedCallback() {
    // clean up state
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }
  /**
   * Break shadowRoot
   */
  createRenderRoot() {
    return this;
  }
}
customElements.define(SiteActiveTags.tag, SiteActiveTags);
export { SiteActiveTags };
