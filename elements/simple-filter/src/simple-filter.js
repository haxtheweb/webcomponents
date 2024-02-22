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
      this.multiMatch = false;
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
         * Enable multi match when filtering so that space separated words are matched
         * as separate words as opposed to a single phrase
         */
        multiMatch: {
          type: Boolean,
          attribute: "multi-match",
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
          ["items", "where", "like", "caseSensitive", "multiMatch"].includes(
            propName,
          ) &&
          this.shadowRoot
        ) {
          clearTimeout(this.__debounce);
          this.__debounce = setTimeout(() => {
            this.filtered = this._computeFiltered(
              this.items,
              this.where,
              this.like,
              this.caseSensitive,
              this.multiMatch,
            );
          }, 250);
        }
        if (propName == "filtered" && this.shadowRoot) {
          this.dispatchEvent(
            new CustomEvent("filter", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: true,
            }),
          );
          this.dispatchEvent(
            new CustomEvent("filtered-changed", {
              bubbles: true,
              cancelable: true,
              composed: true,
              detail: {
                value: this.filtered,
              },
            }),
          );
        }
      });
    }

    /**
     * Filters the items using the f function provided. Recommended when f function is provided
     */
    filter() {
      //This forces filter function to do its job :-)
      this.where = "";
    }
    // helper function to escape special characters when regex is the comparison tool but input is user string
    escapeRegExp(text) {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
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
    _computeFiltered(items, where, like, caseSensitive, multiMatch) {
      like = this.escapeRegExp(like);
      let regex = null;
      // most logical for search results but not our default for legacy api reasons
      if (multiMatch) {
        const multiPat = like.split("\\ ");
        var patterns = [];
        // support multiple patterns based on space separated words
        multiPat.forEach((pat) => {
          pat = pat
            .replace("\\", "")
            .replace("\\?", "")
            .replace("\\.", "")
            .replace("\\!", "");
          if (pat.length > 0) {
            patterns.push(`(\\s${pat}|^${pat})`);
          }
        });
        // rejoin them for a combined or statement regex for start of a word or space after word
        // this way we don't get things like "join" matching on "rejoin party"
        like = patterns.join("|");
      }
      var filtered = [];
      //Filter by `like`
      filtered = items.filter((item) => {
        // regex is going to run multiple times against the same object
        // but we have multiple regex patterns to apply against multiple
        // textual targets. So, we have to rebuild it EVERY run or we get
        // really inconsistent results
        regex = null;
        if (caseSensitive) {
          regex = new RegExp(like, "g");
        } else {
          regex = new RegExp(like, "ig");
        }
        //This is when a complex object is provided
        if (typeof item == "object") {
          //Decompose where incase it is represented in . notation for complex objects
          var decomposed = this._decomposeWhere(where, item);
          //Check if the items specified are defined
          if (typeof decomposed == "undefined" && where != "") {
            //Do what I know best
            console.warn(
              "simple-filter was unable to find a property in '" + where + "'",
            );
          }
          // every call to .test will iterate against the same regex
          // so we can't console log without causing discrepancies in output
          // classic monitoring of a value deforms the experiment
          let result = regex.test(decomposed);
          return result;
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
