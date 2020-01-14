/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";
/**
 * `site-active-title`
 * `Title of the active page in the site`
 *

 * @demo demo/index.html
 */
class SiteActiveTitle extends LitElement {
  /**
   * LitElement
   */
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
        }
        h2 {
          text-rendering: optimizelegibility;
          font-family: sans-serif;
          color: var(--site-active-title-color, #383f45);
        }
      `
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "site-active-title";
  }
  /**
   * LitElement
   */
  render() {
    return html`
      <custom-style>
        <style>
          h2 {
            @apply --site-active-title-heading;
          }
        </style>
      </custom-style>
      <h2>${this.__title}</h2>
    `;
  }
  /**
   * LitElement life cycle - property changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "dynamicMethodology") {
        this.__title = this._makeTitle(
          this.dynamicMethodology,
          this.activeTitle,
          this.parentTitle,
          this.ancestorTitle
        );
      }
    });
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      __title: {
        type: String
      },
      dynamicMethodology: {
        type: String
      },
      editMode: {
        type: Boolean,
        reflect: true,
        attribute: "edit-mode"
      }
    };
  }
  /**
   * Generate title based on context
   */
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
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.noFallback = false;
    this.dynamicMethodology = "active";
    this.__title = "";
    this.__disposer = [];
    autorun(reaction => {
      this.editMode = toJS(store.editMode);
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this.activeTitle = toJS(store.activeTitle);
      this.__title = this._makeTitle(
        this.dynamicMethodology,
        this.activeTitle,
        this.parentTitle,
        this.ancestorTitle
      );
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this.ancestorTitle = toJS(store.ancestorTitle);
      this.__title = this._makeTitle(
        this.dynamicMethodology,
        this.activeTitle,
        this.parentTitle,
        this.ancestorTitle
      );
      this.__disposer.push(reaction);
    });
    autorun(reaction => {
      this.parentTitle = toJS(store.parentTitle);
      this.__title = this._makeTitle(
        this.dynamicMethodology,
        this.activeTitle,
        this.parentTitle,
        this.ancestorTitle
      );
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
}
window.customElements.define(SiteActiveTitle.tag, SiteActiveTitle);
export { SiteActiveTitle };
