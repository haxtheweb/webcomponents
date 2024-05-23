/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@polymer/iron-list/iron-list.js";
import "@haxtheweb/haxcms-elements/lib/ui-components/query/site-query.js";
/**
 * `site-render-query`
 * `Render a query result as an iron-list`
 *
 * @demo demo/index.html
 */
class SiteRenderQuery extends LitElement {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
      `,
    ];
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "site-render-query";
  }
  // render function, this is non-visual
  render() {
    return html`
      <site-query
        .result="${this.result}"
        @result-changed="${this.resultEvent}"
        .sort="${this.sort}"
        .conditions="${this.conditions}"
      ></site-query>
      <iron-list
        id="list"
        .items="${this.__items}"
        ?grid="${this.grid}"
        mutable-data
      >
        <slot></slot>
      </iron-list>
    `;
  }
  resultEvent(e) {
    this.result = [...e.detail.value];
  }
  /**
   * Props
   */
  static get properties() {
    return {
      /**
       * Conditions that can be used to slice the data differently in the manifest
       */
      conditions: {
        type: Object,
      },
      /**
       * Establish the order items should be displayed in
       */
      sort: {
        type: Object,
      },
      /**
       * iron-list helper for this 1 flag
       */
      grid: {
        type: Boolean,
      },
      result: {
        type: Array,
      },
      __items: {
        type: Array,
      },
    };
  }
  constructor() {
    super();
    this.conditions = {};
    this.sort = {};
    this.grid = false;
    this.result = [];
    this.__items = [];
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "result") {
        this.dispatchEvent(
          new CustomEvent("result-changed", {
            detail: {
              value: this[propName],
            },
          }),
        );
        this.__items = [...newValue];
      }
    });
  }
}
customElements.define(SiteRenderQuery.tag, SiteRenderQuery);
export { SiteRenderQuery };
