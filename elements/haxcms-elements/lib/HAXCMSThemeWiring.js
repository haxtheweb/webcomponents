/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { store } from "@lrnwebcomponents/haxcms-elements/lib/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
/**
 * `HAXCMSTheme` mixin class to automatically apply HAXcms theme state
 * Typically an element will be extended from this and while not all,
 * many will want to customize the `contentContainer` property in order
 * to ensure the editable layer is correctly applied visually.
 */
export const HAXCMSTheme = function(SuperClass) {
  return class extends SuperClass {
    // leverage the wiring class element; this helps us clean things up smoothly later
    // while still keeping it abstract enough for direct usage in PolymerLegacy elements
    // as well as those wanting a custom integration methodology
    constructor() {
      super();
      this.HAXCMSThemeWiring = new HAXCMSThemeWiring(this);
    }
    /**
     * This is a render function example. All new HAXcms capable themes need
     * to define a contentcontainer and a slot id wrapper. this allows HAXcms
     * to correctly target the area that will display the HAXeditor when in
     * edit-mode and correctly hide the editor when in normal content presentation.
     * static get template() {
     *  return html`
     *  <style>
     *   :host {
     *     display: block;
     *     background-color: var(--haxcms-color, white);
     *   }
     *   :host([edit-mode]) #slot {
     *     display: none;
     *   }
     *  </style>
     *  <div id="contentcontainer">
     *    <div id="slot"><slot></slot></div>
     *  </div>`;
     *  }
     */
    static get properties() {
      return {
        /**
         * editting state for the page
         */
        editMode: {
          type: Boolean,
          reflectToAttribute: true
        },
        /**
         * Active item which is in JSON Outline Schema
         */
        activeItem: {
          type: Object
        },
        /**
         * a manifest json file decoded, in JSON Outline Schema format
         */
        manifest: {
          type: Object
        },
        /**
         * DOM node that wraps the slot
         */
        contentContainer: {
          type: Object,
          value: null,
          observer: "_contentContainerChanged"
        },
        /**
         * active manifest index, key to location in the manifest itemsarray
         */
        activeManifestIndex: {
          type: Number,
          value: -1
        }
      };
    }
    /**
     * private: Notice content container has changed
     */
    _contentContainerChanged(newValue, oldValue) {
      // test that this hasn't been connected previously
      if (newValue && oldValue === null) {
        this.HAXCMSThemeWiring.connect(this, newValue);
      }
      // previously connected, needs to change to new connection
      // this is an edge case at best...
      else if (newValue && oldValue) {
        this.HAXCMSThemeWiring.disconnect(this);
        this.HAXCMSThemeWiring.connect(this, newValue);
      }
      // no longer connected
      else if (oldValue && newValue === null) {
        this.HAXCMSThemeWiring.disconnect(this);
      }
    }
    /**
     * Connect state and theme wiring
     */
    connectedCallback() {
      super.connectedCallback();
      // we don't have a content container, establish one
      if (this.contentContainer === null) {
        this.contentContainer = this.shadowRoot.querySelector(
          "#contentcontainer"
        );
      }
      // store disposer so we can clean up later
      this.__disposer = autorun(() => {
        this.manifest = toJS(store.routerManifest);
      });
    }
    /**
     * Disconnect the wiring for the theme and clean up state
     */
    disconnectedCallback() {
      super.disconnectedCallback();
      // remove our content container var which will disconnect the wiring
      delete this.contentContainer;
      // clean up state
      this.__disposer();
    }
    /**
     * Return the active item given a uuid and runs event
     * @param {String} activeId
     */
    setActiveItemFromID(activeId) {
      let item = this.manifest.items
        .filter((d, i) => {
          if (activeId === d.id) {
            return d;
          }
        })
        .pop();
      this.dispatchEvent(
        new CustomEvent("haxcms-active-item-changed", {
          bubbles: true,
          cancelable: true,
          detail: item
        })
      );
      return item;
    }
    /**
     * Correctly reset state and dispatch event to notify of active item change
     */
    resetActive() {
      window.history.pushState(null, null, store.location.baseUrl);
      window.dispatchEvent(new PopStateEvent("popstate"));
      this.dispatchEvent(
        new CustomEvent("haxcms-active-item-changed", {
          bubbles: true,
          cancelable: true,
          detail: {}
        })
      );
    }
    /**
     * disablePrevPage
     */
    disablePrevPage(index) {
      if (index === 0 || index === -1) {
        return true;
      }
      return false;
    }
    /**
     * disableNextPage
     */
    disableNextPage(index) {
      if (index >= this.manifest.items.length - 1) {
        return true;
      }
      return false;
    }
    /**
     * Go back a page (if we can)
     */
    prevPage(e) {
      this.changePage("previous");
    }
    /**
     * Advance a page (if we can)
     */
    nextPage(e) {
      this.changePage("next");
    }
    /**
     * Go forward a page
     */
    changePage(direction) {
      if (
        direction == "next" &&
        this.activeManifestIndex < this.manifest.items.length - 1
      ) {
        window.history.pushState(
          {},
          null,
          this.manifest.items[this.activeManifestIndex + 1].location
        );
        window.dispatchEvent(new PopStateEvent("popstate"));
        this.dispatchEvent(
          new CustomEvent("haxcms-active-item-changed", {
            bubbles: true,
            cancelable: true,
            detail: this.manifest.items[this.activeManifestIndex + 1]
          })
        );
      } else if (direction == "previous" && this.activeManifestIndex > 0) {
        window.history.pushState(
          {},
          null,
          this.manifest.items[this.activeManifestIndex - 1].location
        );
        window.dispatchEvent(new PopStateEvent("popstate"));
        this.dispatchEvent(
          new CustomEvent("haxcms-active-item-changed", {
            bubbles: true,
            cancelable: true,
            detail: this.manifest.items[this.activeManifestIndex - 1]
          })
        );
      }
    }
  };
};

/**
 * `HAXCMSThemeWiring` streamline hooking themes up to HAXCMS
 * Directly invoking this class is not advised unless
 * the mixin class `HAXCMSTheme` integration needs modified beyond the norm
 */
class HAXCMSThemeWiring {
  constructor(element, load = true) {
    if (load) {
      document.body.addEventListener(
        "haxcms-edit-mode-changed",
        this._globalEditChanged.bind(element)
      );
      document.body.addEventListener(
        "json-outline-schema-changed",
        this._manifestUpdate.bind(element)
      );
      document.body.addEventListener(
        "haxcms-active-item-changed",
        this._activeItemUpdate.bind(element)
      );
      document.body.addEventListener(
        "haxcms-trigger-update",
        this._triggerUpdate.bind(element)
      );
      this.__disposer = autorun(() => {
        this._manifestUpdate({ detail: toJS(store.routerManifest) });
      });
    }
  }
  /**
   * connect the theme and see if we have an authoring experience to inject correctly
   */
  connect(element, injector) {
    // this implies there's the possibility of an authoring experience
    if (typeof window.cmsSiteEditor !== typeof undefined) {
      window.cmsSiteEditor.requestAvailability(element, injector);
    }
  }
  /**
   * detatch element events from whats passed in
   */
  disconnect(element) {
    document.body.removeEventListener(
      "haxcms-active-item-changed",
      this._activeItemUpdate.bind(element)
    );
    document.body.removeEventListener(
      "json-outline-schema-changed",
      this._manifestUpdate.bind(element)
    );
    document.body.removeEventListener(
      "haxcms-edit-mode-changed",
      this._globalEditChanged.bind(element)
    );
    document.body.removeEventListener(
      "haxcms-trigger-update",
      this._triggerUpdate.bind(element)
    );
    this.__disposer();
  }
  /**
   * Global edit state changed
   */
  _globalEditChanged(e) {
    this.editMode = e.detail;
  }
  /**
   * HAXcms: Active item has been updated
   */
  _activeItemUpdate(e) {
    let newValue = e.detail;
    if (newValue && typeof newValue.id !== typeof undefined) {
      const evt = new CustomEvent("json-outline-schema-active-item-changed", {
        bubbles: true,
        cancelable: true,
        detail: newValue
      });
      this.dispatchEvent(evt);
      const item = this.manifest.items
        .filter((d, i) => {
          if (newValue.id === d.id) {
            this.activeManifestIndex = i;
            return d;
          }
        })
        .pop();
      if (typeof newValue.title !== typeof undefined) {
        document.title = this.manifest.title + " - " + newValue.title;
      } else {
        document.title = this.manifest.title;
      }
    } else {
      this.activeManifestIndex = -1;
      document.title = this.manifest.title;
    }
  }
  /**
   * Generic event to ensure that the active item change is noticed
   */
  _triggerUpdate(e) {
    this.dispatchEvent(
      new CustomEvent("haxcms-active-item-changed", {
        bubbles: true,
        cancelable: true,
        detail: {}
      })
    );
  }
  _manifestUpdate(e) {
    let newValue = e.detail;
    if (typeof newValue.title !== typeof undefined) {
      document.title = newValue.title;
    }
    if (
      typeof newValue.metadata !== typeof undefined &&
      typeof newValue.metadata.cssVariable !== typeof undefined
    ) {
      // json outline schema changed, allow other things to react
      // fake way of forcing an update of these items
      let ary = newValue.metadata.cssVariable
        .replace("--simple-colors-default-theme-", "")
        .split("-");
      ary.pop();
      this.accentColor = ary.join("-");
      // set this directly instead of messing w/ accentColor
      document.body.style.setProperty(
        "--haxcms-color",
        newValue.metadata.hexCode
      );
    }
  }
}

export { HAXCMSThemeWiring };
