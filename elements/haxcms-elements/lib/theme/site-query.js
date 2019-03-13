/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/haxcms-site-store.js";
import "@polymer/iron-list/iron-list.js";
import { autorun, toJS } from "mobx";
/**
 * `site-query`
 * `Query the JSON Outline Schema manifest list of items and render only select ones`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteQuery extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "site-query";
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
      <iron-list items="[[localItems]]" as="item" grid="[[grid]]">
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
       * Manifest with router / location enhancements
       */
      routerManifest: {
        type: Object
      },
      /**
       * activeId
       */
      activeId: {
        type: String
      },
      /**
       * localManifest to help illustrate this only lives here
       */
      localItems: {
        type: Array,
        computed:
          "_computeLocalItems(conditions, sort, routerManifest.items, activeId, forceRebuild)"
      },
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
       * Boolean flag to force a repaint of what's in the item
       */
      forceRebuild: {
        type: Boolean,
        value: false
      },
      /**
       * iron-list helper for this 1 flag
       */
      grid: {
        type: Boolean,
        value: false
      }
    };
  }
  /**
   * Compute what we should present as a slice of the real deal
   */
  _computeLocalItems(conditions, sorts, realItems, activeId, forceRebuild) {
    // ensure no data references, clone object
    let items = Object.assign([], toJS(realItems));
    // if there are no conditions just do a 1 to 1 presentation
    if (conditions && items) {
      // apply conditions, this will automatically filter our list
      for (var i in conditions) {
        // apply the conditions in order
        items = items.filter(item => {
          // specialized condition for active id
          if (conditions[i] === "$activeId") {
            if (item[i] !== activeId) {
              return false;
            }
            return true;
          } else {
            if (item[i] !== conditions[i]) {
              return false;
            }
            return true;
          }
        });
      }
    }
    if (sorts) {
      for (var i in sorts) {
        items.sort((item1, item2) => {
          if (sorts[i] === "ASC") {
            if (item1[i] < item2[i]) {
              return -1;
            } else if (item1[i] > item2[i]) {
              return 1;
            } else {
              return 0;
            }
          } else {
            if (item1[i] > item2[i]) {
              return -1;
            } else if (item1[i] < item2[i]) {
              return 1;
            } else {
              return 0;
            }
          }
        });
      }
    }
    return items;
  }
  connectedCallback() {
    super.connectedCallback();
    this.__disposer = autorun(() => {
      this.routerManifest = Object.assign({}, toJS(store.routerManifest));
    });
    this.__disposer = autorun(() => {
      this.activeId = toJS(store.activeId);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.__disposer();
  }
}
window.customElements.define(SiteQuery.tag, SiteQuery);
export { SiteQuery };
