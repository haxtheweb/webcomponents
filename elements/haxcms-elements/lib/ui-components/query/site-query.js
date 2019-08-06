/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { MutableData } from "@polymer/polymer/lib/mixins/mutable-data.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
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
          "_computeResult(entity, conditions, sort, routerManifest, activeId, limit, startIndex, random, forceRebuild)",
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
      entity: {
        type: String,
        value: "node"
      }
    };
  }
  /**
   * Compute what we should present as a slice of the real deal
   */
  _computeResult(
    entity,
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
      var items = Object.assign([], toJS(routerManifest.items));
      // ohhh.... boy.... let's completely alter how this thing works
      if (entity !== "node") {
        var newItems = [];
        for (var i in items) {
          // we found a match...
          // for example maybe this is metadata.files
          // so now you've got things files centric as opposed to item centric
          if (typeof Object.byString(items[i], entity) !== typeof undefined) {
            let tmp;
            let val = Object.byString(items[i], entity);
            if (typeof val === "object" || typeof val === "array") {
              tmp = Object.assign([], Object.byString(items[i], entity));
            } else {
              tmp = val;
            }
            if (typeof tmp === "object" || typeof tmp === "array") {
              for (var i in tmp) {
                // we can push this onto objects, meaning full entities
                // if the user queries for something weird like by title
                // it's still valid but can't push the node onto it in the
                // same way
                if (typeof tmp[i] === "object" || typeof tmp[i] === "array") {
                  // check for singular keys which could be grouped
                  tmp[i]._node = Object.assign({}, items[i]);
                  newItems.push(tmp[i]);
                } else {
                  let tmp2 = {
                    _node: Object.assign({}, items[i]),
                    value: tmp[i]
                  };
                  newItems.push(tmp2);
                }
              }
            } else {
              let tmp2 = {
                _node: Object.assign({}, items[i]),
                value: tmp
              };
              newItems.push(tmp2);
            }
          }
        }
        items = Object.assign([], newItems);
        // group things that are the same so that nodes can be merged together
        /*for (var i in newItems) {
          if (newItems[i].length === 2) {
            let tmpItemsFound = newItems.find(j => newItems[i][Object.keys(newItems[i])[0]] === j[Object.keys(newItems[i])[0]]);
            items[i] = Object.assign({}, tmpItemsFound);
          }
          else {
            items[i] = Object.assign({}, newItems[i]);
          }
        }*/
      }
      // if there are no conditions just do a 1 to 1 presentation
      if (conditions && items) {
        // apply conditions, this will automatically filter our items
        for (var i in conditions) {
          // test for object vs direct form of condition
          if (typeof conditions[i] !== "object" || conditions[i] === null) {
            conditions[i] = {
              value: conditions[i],
              operator: "="
            };
          }
          // normalize special case evaluations
          var evaluate = conditions[i].value;
          if (conditions[i].value === "$activeId") {
            evaluate = activeId;
          } else if (conditions[i].value === "$firstId") {
            evaluate = items[0].id;
          }
          // apply the conditions in order
          items = items.filter(item => {
            switch (conditions[i].operator) {
              case "!=":
                if (Object.byString(item, i) !== evaluate) {
                  return true;
                }
                return false;
                break;
              case ">":
                if (Object.byString(item, i) > evaluate) {
                  return true;
                }
                return false;
                break;
              case "<":
                if (Object.byString(item, i) < evaluate) {
                  return true;
                }
                return false;
                break;
              // most common
              case "=":
              default:
                if (Object.byString(item, i) !== evaluate) {
                  return false;
                }
                return true;
                break;
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
              if (Object.byString(item1, i) < Object.byString(item2, i)) {
                return -1;
              } else if (
                Object.byString(item1, i) > Object.byString(item2, i)
              ) {
                return 1;
              } else {
                return 0;
              }
            } else {
              if (Object.byString(item1, i) > Object.byString(item2, i)) {
                return -1;
              } else if (
                Object.byString(item1, i) < Object.byString(item2, i)
              ) {
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
