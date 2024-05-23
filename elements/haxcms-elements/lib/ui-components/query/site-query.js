/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { objectValFromStringPos } from "@haxtheweb/utils/utils.js";
import { autorun, toJS } from "mobx";
/**
 * `site-query`
 * `Query the JSON Outline Schema manifest and return a resulting array`
 *
 * @demo demo/index.html
 */
// helper to use strings for index in Objects
Object.byString = function (o, s) {
  return objectValFromStringPos(o, s);
};

class SiteQuery extends LitElement {
  /**
   * Store the tag name to make it easier to obtain directly.
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
        type: Object,
      },
      /**
       * activeId
       */
      activeId: {
        type: String,
        attribute: "active-id",
      },
      /**
       * result to help illustrate this only lives here
       */
      result: {
        type: Array,
      },
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
       * Boolean flag to force a repaint of what's in the item
       */
      forceRebuild: {
        type: Boolean,
        attribute: "force-rebuild",
      },
      /**
       * Limit the number of results returned
       */
      limit: {
        type: Number,
      },
      /**
       * Where to start returning results from
       */
      startIndex: {
        type: Number,
        attribute: "start-index",
      },
      /**
       * Randomize results
       */
      random: {
        type: Boolean,
      },
      /**
       * Entity to focus on
       */
      entity: {
        type: String,
      },
    };
  }
  constructor() {
    super();
    this.entity = "node";
    this.conditions = {};
    this.random = false;
    this.sort = {
      order: "ASC",
    };
    this.forceRebuild = false;
    this.limit = 0;
    this.startIndex = 0;
  }
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      let notifiedProps = ["result", "conditions", "sort", "forceRebuild"];
      if (notifiedProps.includes(propName)) {
        // notify
        let eventName = `${propName
          .replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, "$1-$2")
          .toLowerCase()}-changed`;
        this.dispatchEvent(
          new CustomEvent(eventName, {
            detail: {
              value: this[propName],
            },
          }),
        );
      }
      if (
        [
          "entity",
          "conditions",
          "sort",
          "routerManifest",
          "activeId",
          "limit",
          "startIndex",
          "random",
          "forceRebuild",
        ].includes(propName)
      ) {
        this.result = [
          ...this._computeResult(
            this.entity,
            this.conditions,
            this.sort,
            this.routerManifest,
            this.activeId,
            this.limit,
            this.startIndex,
            this.random,
            this.forceRebuild,
          ),
        ];
      }
    });
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
    forceRebuild,
  ) {
    if (routerManifest && routerManifest.items) {
      // ensure no data references, clone object
      var items = [...toJS(routerManifest.items)];
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
                    value: tmp[i],
                  };
                  newItems.push(tmp2);
                }
              }
            } else {
              let tmp2 = {
                _node: Object.assign({}, items[i]),
                value: tmp,
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
          if (conditions[i] === null) {
            conditions[i] = {
              value: [conditions[i]],
              operator: "=",
            };
          } else if (typeof conditions[i] !== "object") {
            conditions[i] = {
              value: conditions[i],
              operator: "=",
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
          items = items.filter((item) => {
            switch (conditions[i].operator) {
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
              case "!=":
                if (
                  typeof evaluate === "object" &&
                  !evaluate.includes(Object.byString(item, i))
                ) {
                  return true;
                } else if (
                  typeof evaluate === "string" &&
                  Object.byString(item, i) !== evaluate
                ) {
                  return true;
                }
                return false;
                break;
              // most common
              case "=":
              default:
                if (
                  typeof evaluate === "object" &&
                  !evaluate.includes(Object.byString(item, i))
                ) {
                  return false;
                } else if (
                  typeof evaluate === "string" &&
                  Object.byString(item, i) !== evaluate
                ) {
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
      if (limit !== 0 && limit > 0) {
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
    this.__disposer();
    this.__disposer2();
    super.disconnectedCallback();
  }
}
customElements.define(SiteQuery.tag, SiteQuery);
export { SiteQuery };
