/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement } from "lit";
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";

/**
 * `site-query-menu-slice`
 * `A slice / 1 level within the hierarchy, via relative parent or deep parent`
 *
 * @demo demo/index.html
 */
class SiteQueryMenuSlice extends LitElement {
  /**
   * Convention our team prefers
   */
  static get tag() {
    return "site-query-menu-slice";
  }
  /**
   * HTMLElement life cycle
   */
  constructor() {
    super();
    this.__disposer = [];
    this.start = 0;
    this.end = 1000;
    this.dynamicMethodology = "active";
    this.fixedId = false;
    this.noDynamicLevel = false;
  }
  /**
   * LitElement / popular convention
   */
  static get properties() {
    return {
      /**
       * starting level for the menu items
       */
      start: {
        type: Number,
      },
      /**
       * ending level for the menu items
       */
      end: {
        type: Number,
      },
      /**
       * parent for the menu id
       */
      parent: {
        type: String,
      },
      /**
       * How we should obtain the parent who's children we should show
       * options are active, parent, or ancestor
       */
      dynamicMethodology: {
        type: String,
        attribute: "dynamic-methodology",
      },
      /**
       * Use this boolean to force this to fix to 1 parent
       * Otherwise it will dynamically update (default behavior)
       */
      fixedId: {
        type: Boolean,
        attribute: "fixed-id",
      },
      /**
       * Allow disabling the dynamic leveling
       */
      noDynamicLevel: {
        type: Boolean,
        attribute: "no-dynamic-level",
      },
      /**
       * Results which can be binded to something else
       */
      result: {
        type: Array,
      },
      _routerManifest: {
        type: Object,
      },
    };
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (
        [
          "start",
          "end",
          "parent",
          "dynamicMethodology",
          "_routerManifest",
          "noDynamicLevel",
        ].includes(propName)
      ) {
        this.result = this._computeItems(
          this.start,
          this.end,
          this.parent,
          this.dynamicMethodology,
          this._routerManifest,
          this.noDynamicLevel,
        );
        // fire an event that this is a core piece of the system
        this.dispatchEvent(
          new CustomEvent("result-changed", {
            detail: this.result,
          }),
        );
      }
    });
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
    noDynamicLevel,
  ) {
    if (_routerManifest) {
      return store.computeItems(
        start,
        end,
        parent,
        dynamicMethodology,
        _routerManifest,
        noDynamicLevel,
      );
    }
  }
  /**
   * LitElement life cycle
   */
  firstUpdated(changedProperties) {
    this.__disposer.push(
      autorun((reaction) => {
        const _mobx_val_0 = toJS(store.routerManifest);
        Promise.resolve().then(() => {
          this._routerManifest = Object.assign({}, _mobx_val_0);
        });
      }),
    );
    if (!this.fixedId) {
      this.__disposer.push(
        autorun((reaction) => {
          const _mobx_val_0 = toJS(store.activeId);
          Promise.resolve().then(() => {
            this.parent = _mobx_val_0;
          });
        }),
      );
    }
  }
  /**
   * HTMLElement life cycle
   */
  disconnectedCallback() {
    for (var i in this.__disposer) {
      const disposer = this.__disposer[i];
      if (typeof disposer === "function") {
        disposer();
      } else if (disposer && typeof disposer.dispose === "function") {
        disposer.dispose();
      }
    }
    super.disconnectedCallback();
  }
}
globalThis.customElements.define(SiteQueryMenuSlice.tag, SiteQueryMenuSlice);
export { SiteQueryMenuSlice };
