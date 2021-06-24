/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement } from "lit";
/**
 * `simple-filter`
 * `a super class element to provide filtering capabilities`

 * @demo demo/index.html
 * @element simple-filter
 */
export const SimpleFilterMixin = function (SuperClass) {
  return class extends SuperClass {
    constructor() {
      super();
      this.caseSensitive = false;
      this.filtered = [];
      this.resetList();
    }
    /**
     * Reset this browser.
     */
    resetList(list = []) {
      this.items = [...list];
      this.where = "title";
      this.value = "";
      this.like = "";
    }
    static get properties() {
      return {
        ...super.properties,
        /**
         * These are the items to be filtered
         */
        items: {
          type: Array,
        },
        /**
         * Filter regular expression string
         */
        like: {
          type: String,
        },
        /**
         * The filter-by field of your items array of objects
         */
        where: {
          type: String,
        },
        /**
         * Enable case sensitivity when filtering
         */
        caseSensitive: {
          type: Boolean,
          attribute: "case-sensitive",
          reflect: true,
        },
        /**
         * Filtered items
         */
        filtered: {
          type: Array,
        },
      };
    }
    update(changedProperties) {
      super.update(changedProperties);
      changedProperties.forEach((oldValue, propName) => {
        if (
          ["items", "where", "like", "caseSensitive"].includes(propName) &&
          this.shadowRoot
        ) {
          clearTimeout(this.__debounce);
          this.__debounce = setTimeout(() => {
            this.filtered = this._computeFiltered(
              this.items,
              this.where,
              this.like,
              this.caseSensitive
            );
          }, 0);
        }
        if (propName == "filtered" && this.shadowRoot) {
          this.dispatchEvent(
            new CustomEvent("filter", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: true,
            })
          );
          this.dispatchEvent(
            new CustomEvent("filtered-changed", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: {
                value: this.filtered,
              },
            })
          );
        }
      });
    }

    /**
     * Filters the items using the f function provided. Recommended when f function is provided
     */
    filter() {
      //This forces _computeFiltered function to do its job :-)
      this.where = "";
    }

    /**
     * This filters the items provided
     *
     * @param {array} items These are the items to be filtered.
     * @param {string} where The filterby string.
     * @param {string} like The filter string.
     * @param {boolean} capital This is a flag to determine whether filter should be case sensitive or not.
     * @return array} Filter results.
     */
    _computeFiltered(items, where, like, caseSensitive) {
      if (like[0] === "\\" || like === "\\") {
        like = "\\" + like;
      }
      var regex = null;
      if (caseSensitive) {
        regex = new RegExp(like);
      } else {
        regex = new RegExp(like, "i");
      }
      var filtered = [];
      //Save a reference to this object
      var decompose = this._decomposeWhere.bind(this);
      //Filter by `like`
      filtered = items.filter(function (item) {
        //This is when a complex object is provided
        if (typeof item == "object") {
          //Decompose where incase it is represented in . notation for complex objects
          var decomposed = decompose(where, item);
          //Check if the items specified are defined
          if (typeof decomposed == "undefined" && where != "") {
            //Do what I know best
            console.warn(
              "grafitto-filter was unable to find a property in '" + where + "'"
            );
          }
          return regex.test(decomposed);
        }

        //When a simple object of strings is provided
        if (typeof item == "string") {
          return regex.test(item);
        }
        //When a simple object of numbers is provided
        if (typeof item == "number") {
          return regex.test(item.toString());
        }
      });
      return filtered;
    }

    /**
     * This decomposes `where` property to object attributes using . notation
     */
    _decomposeWhere(where, item) {
      return where.split(".").reduce(function (a, b) {
        return a && a[b];
      }, item);
    }
  };
};

class SimpleFilter extends SimpleFilterMixin(LitElement) {
  constructor() {
    super();
  }
  static get tag() {
    return "simple-filter";
  }
}
export { SimpleFilter };
