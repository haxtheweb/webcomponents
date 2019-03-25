/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { MutableData } from "@polymer/polymer/lib/mixins/mutable-data.js";
import "@polymer/iron-list/iron-list.js";
import "@lrnwebcomponents/haxcms-elements/lib/ui-components/query/site-query.js";
/**
 * `site-render-query`
 * `Render a query result as an iron-list`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteRenderQuery extends MutableData(PolymerElement) {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "site-render-query";
  }
  // render function, this is non-visual
  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        iron-list {
          @apply --site-query-iron-list;
        }
      </style>
      <site-query
        result="{{result}}"
        sort="[[sort]]"
        conditions="[[conditions]]"
      ></site-query>
      <iron-list id="list" items="[[__items]]" grid="[[grid]]" mutable-data>
        <slot></slot>
      </iron-list>
    `;
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
        value: {}
      },
      /**
       * Establish the order items should be displayed in
       */
      sort: {
        type: Object,
        value: {}
      },
      /**
       * iron-list helper for this 1 flag
       */
      grid: {
        type: Boolean,
        value: false
      },
      result: {
        type: Array,
        notify: true,
        observer: "_resultChanged"
      },
      __items: {
        type: Array,
        value: []
      }
    };
  }
  _resultChanged(newValue) {
    this.set("__items", newValue);
    this.notifyPath("__items");
  }
}
window.customElements.define(SiteRenderQuery.tag, SiteRenderQuery);
export { SiteRenderQuery };
