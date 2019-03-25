/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { MutableData } from "@polymer/polymer/lib/mixins/mutable-data.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
/**
 * `site-query`
 * `Query the JSON Outline Schema manifest and return a resulting array`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteQuery extends MutableData(PolymerElement) {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "site-query";
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
       * result to help illustrate this only lives here
       */
      result: {
        type: Array,
        notify: true
      },
      __result: {
        type: Array,
        computed:
          "_computeResult(conditions, sort, routerManifest.items, activeId, forceRebuild)",
        observer: "_noticeResultChange"
      },
      /**
       * Conditions that can be used to slice the data differently in the manifest
       */
      conditions: {
        type: Object,
        notify: true,
        value: {}
      },
      /**
       * Establish the order items should be displayed in
       */
      sort: {
        type: Object,
        notify: true,
        value: {
          order: "ASC"
        }
      },
      /**
       * Boolean flag to force a repaint of what's in the item
       */
      forceRebuild: {
        type: Boolean,
        notify: true,
        value: false
      }
    };
  }
  /**
   * Compute what we should present as a slice of the real deal
   */
  _computeResult(conditions, sorts, realItems, activeId, forceRebuild) {
    // ensure no data references, clone object
    let items = Object.assign([], toJS(realItems));
    // if there are no conditions just do a 1 to 1 presentation
    if (conditions && items) {
      // apply conditions, this will automatically filter our items
      for (var i in conditions) {
        // apply the conditions in order
        items = items.filter(item => {
          // specialized condition for active id
          if (conditions[i] === "$activeId") {
            if (item[i] !== activeId) {
              return false;
            }
            return true;
          } else if (conditions[i] === "$firstId") {
            if (item[i] !== items[0].id) {
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
  /**
   * Try and get the value to skip dirty checks and do a full data rebind
   */
  _noticeResultChange(newValue) {
    this.set("result", newValue);
    this.notifyPath("result");
  }
  connectedCallback() {
    super.connectedCallback();
    this.__disposer = autorun(() => {
      this.routerManifest = Object.assign({}, toJS(store.routerManifest));
    });
    this.__disposer2 = autorun(() => {
      this.activeId = toJS(store.activeId);
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.__disposer();
    this.__disposer2();
  }
}
window.customElements.define(SiteQuery.tag, SiteQuery);
export { SiteQuery };
