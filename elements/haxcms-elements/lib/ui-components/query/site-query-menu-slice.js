/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";

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
      /**
       * starting level for the menu items
       */
      start: {
        type: Number,
        value: 1
      },
      /**
       * ending level for the menu items
       */
      end: {
        type: Number,
        value: 1000
      },
      /**
       * parent for the menu id
       */
      parent: {
        type: String
      },
      /**
       * How we should obtain the parent who's children we should show
       * options are active, parent, or ancestor
       */
      dynamicMethodology: {
        type: String,
        value: "active"
      },
      /**
       * Use this boolean to force this to fix to 1 parent
       * Otherwise it will dynamically update (default behavior)
       */
      fixedId: {
        type: Boolean,
        value: false
      },
      /**
       * Allow disabling the dynamic leveling
       */
      noDynamicLevel: {
        type: Boolean,
        value: false
      },
      /**
       * Results which can be binded to something else
       */
      result: {
        type: Array,
        notify: true,
        computed:
          "_computeItems(start, end, parent, dynamicMethodology, _routerManifest, noDynamicLevel)"
      },
      _routerManifest: {
        type: Object
      }
    };
  }
  /**
   * Compute items leveraging the site query engine
   */
  _computeItems(
    start,
    end,
    parent,
    dynamicMethodology,
    _routerManifest,
    noDynamicLevel
  ) {
    if (_routerManifest) {
      return store.computeItems(
        start,
        end,
        parent,
        dynamicMethodology,
        _routerManifest,
        noDynamicLevel
      );
    }
  }
  connectedCallback() {
    super.connectedCallback();
    this.__disposer = autorun(() => {
      this._routerManifest = Object.assign({}, toJS(store.routerManifest));
    });
    if (!this.fixedId) {
      this.__disposer2 = autorun(() => {
        this.parent = toJS(store.activeId);
      });
    }
  }
  disconnectedCallback() {
    this.__disposer();
    if (!this.fixedId) {
      this.__disposer2();
    }
    super.disconnectedCallback();
  }
}
window.customElements.define(SiteQueryMenuSlice.tag, SiteQueryMenuSlice);
export { SiteQueryMenuSlice };
