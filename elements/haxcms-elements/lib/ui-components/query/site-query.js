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
// helper to use strings for index in Objects
Object.byString = function(o, s) {
  s = s.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  s = s.replace(/^\./, ""); // strip a leading dot
  var a = s.split(".");
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in o) {
      o = o[k];
    } else {
      return;
    }
  }
  return o;
};

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
          "_computeResult(entityType, conditions, sort, routerManifest, activeId, limit, startIndex, random, forceRebuild)",
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
      },
      /**
       * Limit the number of results returned
       */
      limit: {
        type: Number,
        value: 0
      },
      /**
       * Where to start returning results from
       */
      startIndex: {
        type: Number,
        value: 0
      },
      /**
       * Randomize results
       */
      random: {
        type: Boolean,
        value: false
      },
      /**
       * Entity to focus on
       */
      entityType: {
        type: String,
        value: "node"
      }
    };
  }
  /**
   * Compute what we should present as a slice of the real deal
   */
  _computeResult(
    entityType,
    conditions,
    sorts,
    routerManifest,
    activeId,
    limit,
    startIndex,
    random,
    forceRebuild
  ) {
    if (routerManifest && routerManifest.items) {
      // ensure no data references, clone object
      let items = Object.assign([], toJS(routerManifest.items));
      // ohhh.... boy.... let's completely alter how this thing works
      if (entityType !== "node") {
        let oldItems = Object.assign([], items);
        for (var i in oldItems) {
          // we found a match...
          // for example maybe this is metadata.files
          // so now you've got things files centric as opposed to item centric
          if (typeof oldItems[i][entityType] !== typeof undefined) {
            oldItems[i] = oldItems[i][entityType];
            // store reference to the original item structure here
            // this could let you do things like give me all tags
            // then total up the unique references to those tags
            // or to present the title of everything that has tag X
            oldItems[i]._node = items[i];
          }
        }
        items = oldItems;
      }
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
              if (Object.byString(item, i) !== conditions[i]) {
                return false;
              }
              return true;
            }
          });
        }
      }
      // @todo need to support multi-facetted sort
      // right now this will just sort one way then undo it with another
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
      // randomize the results, this would goof up the usefulness of sorts
      if (random) {
        items.sort((item1, item2) => {
          if (Math.random() < Math.random()) {
            return -1;
          } else if (Math.random() > Math.random()) {
            return 1;
          } else {
            return 0;
          }
        });
      }
      // Start at this index...
      if (startIndex !== 0 && items.length > startIndex) {
        //start-index=5
        // remove last item while there's more items then the limit
        while (startIndex > 0) {
          items.shift();
          startIndex--;
        }
      } else if (items.length < startIndex) {
        return [];
      }
      // reduce results if we need to
      if (limit !== 0) {
        // remove last item while there's more items then the limit
        while (items.length > limit) {
          items.pop();
        }
      }
      return items;
    }
    return [];
  }
  /**
   * Try and get the value to skip dirty checks and do a full data rebind
   */
  _noticeResultChange(newValue) {
    this.set("result", newValue);
    this.notifyPath("result");
  }
  /**
   * Connected life cycle
   */
  connectedCallback() {
    super.connectedCallback();
    this.__disposer = autorun(() => {
      this.routerManifest = Object.assign({}, toJS(store.routerManifest));
    });
    this.__disposer2 = autorun(() => {
      this.activeId = toJS(store.activeId);
    });
  }
  /**
   * Disconnected life cycle
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    this.__disposer();
    this.__disposer2();
  }
}
window.customElements.define(SiteQuery.tag, SiteQuery);
export { SiteQuery };
