/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
/**
 * `site-active-title`
 * `Title of the active page in the site`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteActiveTitle extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "site-active-title";
  }
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          transition: 0.2s opacity linear;
          opacity: 1;
        }
        :host([edit-mode]) {
          opacity: 0.2;
        }
        h2 {
          text-rendering: optimizelegibility;
          font-family: sans-serif;
          color: var(--site-active-title-color, #383f45);
          @apply --site-active-title-heading;
        }
      </style>
      <h2>[[__title]]</h2>
    `;
  }
  /**
   * Props
   */
  static get properties() {
    return {
      /**
       * Turn off the title fallback to avoid empty titles
       */
      noFallback: {
        type: Boolean,
        value: false
      },
      /**
       * How we should obtain the parent who's children we should show
       * options are active, parent, or ancestor
       */
      dynamicMethodology: {
        type: String,
        value: "active"
      },
      __title: {
        type: String,
        computed:
          "_makeTitle(dynamicMethodology, activeTitle, parentTitle, ancestorTitle)"
      },
      editMode: {
        type: Boolean,
        reflectToAttribute: true
      }
    };
  }
  _makeTitle(dynamicMethodology, activeTitle, parentTitle, ancestorTitle) {
    switch (dynamicMethodology) {
      case "above":
        if (parentTitle === "" && !this.noFallback) {
          return activeTitle;
        }
        return parentTitle;
        break;
      case "ancestor":
        if (ancestorTitle === "" && !this.noFallback) {
          return activeTitle;
        }
        return ancestorTitle;
        break;
      default:
        return activeTitle;
        break;
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.__disposer = [];
    autorun(reaction => {
      this.editMode = toJS(store.editMode);
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this.activeTitle = toJS(store.activeTitle);
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this.ancestorTitle = toJS(store.ancestorTitle);
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this.parentTitle = toJS(store.parentTitle);
      this.__disposer.push(reaction);
    });
  }
  disconnectedCallback() {
    // clean up state
    for (var i in this.__disposer) {
      this.__disposer[i].dispose();
    }
    super.disconnectedCallback();
  }
}
window.customElements.define(SiteActiveTitle.tag, SiteActiveTitle);
export { SiteActiveTitle };
