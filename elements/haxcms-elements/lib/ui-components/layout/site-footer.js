/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
/**
 * `site-footer`
 * `A basic site footer`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteFooter extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
          transition: 0.2s opacity linear;
          opacity: 1;
        }
        :host([edit-mode]) {
          opacity: 0.2;
          pointer-events: none;
        }
      `
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "site-footer";
  }
  constructor() {
    super();
    this.__disposer = [];
    autorun(reaction => {
      this.manifest = toJS(store.manifest);
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this.editMode = toJS(store.editMode);
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this.siteTitle = toJS(store.siteTitle);
      this.__disposer.push(reaction);
    });
    import("@lrnwebcomponents/license-element/license-element.js");
  }
  // render function
  render() {
    return html`
      <div class="wrapper">
        <license-element
          .title="${this.siteTitle}"
          .creator="${this.manifest.author}"
          .source="${this.manifest.domain}"
          .license="${this.manifest.license}"
        >
        </license-element>
      </div>
    `;
  }
  static get properties() {
    return {
      siteTitle: {
        type: String,
        attribute: "site-title"
      },
      manifest: {
        type: Object
      },
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode"
      }
    };
  }
  disconnectedCallback() {
    // clean up state
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }
}
window.customElements.define(SiteFooter.tag, SiteFooter);
export { SiteFooter };
