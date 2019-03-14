/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { SiteQuery } from "@lrnwebcomponents/haxcms-elements/lib/theme/query/site-query.js";
import "@polymer/paper-button/paper-button.js";

/**
 * `site-query-menu-slice`
 * `A slice / 1 level within the hierarchy, via relative parent or deep parent`
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SiteQueryMenuSlice extends PolymerElement {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "site-query-menu-slice";
  }
  static get properties() {
    return {
      start: {
        type: Number
      },
      end: {
        type: Number
      },
      parent: {
        type: String
      },
      _routerManifest: {
        type: Object
      },
      result: {
        type: Array,
        notify: true,
        computed: "_computeItems(start, end, parent, _routerManifest)"
      }
    };
  }
  /**
   * Compute items leveraging the site query engine
   */
  _computeItems(start, end, parent, _routerManifest) {
    if (_routerManifest) {
      let items = [];
      let data = [];
      _routerManifest.items.forEach(element => {
        // find top level parents
        if (!element.parent) {
          items.push(element);
        }
      });
      // Recursively find and set children
      items.forEach((item, i) => {
        this._setChildren(item, _routerManifest.items);
      });
      items.forEach((item, i) => {
        this._spiderChildren(item, data, start, end, parent, false);
      });
      console.log(data);
      return data;
    }
  }
  _spiderChildren(item, data, start, end, parent, parentFound) {
    // see if we have the parent... or keep going
    if (item.id === parent || parentFound) {
      // set parent to current so it's gaurenteed to match on next one
      if (!parentFound) {
        parentFound = true;
        // support sliding scales, meaning that start / end is relative to active
        if (item.indent >= start) {
          start += item.indent;
          end += item.indent;
        }
      }
      // only add on what we're between
      if (item.indent >= start && item.indent <= end) {
        data.push(item);
      }
      // we've found it. Now everyone below here should match
      if (item.children.length > 0) {
        item.children.forEach(child => {
          // recursively call itself
          this._spiderChildren(child, data, start, end, parent, parentFound);
        });
      }
    } else {
      if (item.children.length > 0) {
        item.children.forEach(child => {
          // recursively call itself
          this._spiderChildren(child, data, start, end, parent, parentFound);
        });
      }
    }
  }
  /**
   * Recursively search through a data to find children
   * of a specified item.
   * @param {object} item item of an array to search on. Passed by reference.
   * @param {array} data linear array of the data set.
   * @return {void}
   */
  _setChildren(item, data) {
    // find all children
    const children = data.filter(d => item.id === d.parent);
    item.children = children;
    if (item.children.length > 0) {
      item.children.forEach(child => {
        // recursively call itself
        this._setChildren(child, data);
      });
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.__disposer = autorun(() => {
      this.parent = toJS(store.activeId);
    });
    this.__disposer2 = autorun(() => {
      this._routerManifest = Object.assign({}, toJS(store.routerManifest));
    });
  }
  disconnectedCallback() {
    this.__disposer();
    this.__disposer2();
    super.disconnectedCallback();
  }
}
window.customElements.define(SiteQueryMenuSlice.tag, SiteQueryMenuSlice);
export { SiteQueryMenuSlice };
