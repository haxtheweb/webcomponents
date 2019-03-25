/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { updateStyles } from "@polymer/polymer/lib/mixins/element-mixin.js";
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
          notify: true
        },
        /**
         * active manifest index counter, adds 1 to the index; good for visuals
         */
        activeManifestIndexCounter: {
          type: Number,
          notify: true
        },
        /**
         * acitve item id
         */
        activeId: {
          type: String,
          notify: true,
          observer: "_activeIdChanged"
        },
        /**
         * location as object
         */
        _location: {
          type: Object,
          observer: "_locationChanged"
        }
      };
    }
    /**
     * Selected page has changed.
     */
    _activeIdChanged(newValue) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
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
    _locationChanged(newValue, oldValue) {
      if (!newValue || typeof newValue.route === "undefined") return;
      const location = newValue;
      const name = location.route.name;
      if (name === "home" || name === "404") {
        // if we are on the homepage then load the first item in the manifest
        // and set it active
        const firstItem = this.manifest.items.find(
          i => typeof i.id !== "undefined"
        );
        if (firstItem) {
          store.activeId = firstItem.id;
        }
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
      this.__disposer = [];
      afterNextRender(this, function() {
        // edge case, we just swapped theme faster then content loaded... lol
        if (dom(this).getEffectiveChildNodes().length === 0) {
          let frag = document
            .createRange()
            .createContextualFragment(store.activeItemContent);
          dom(this).appendChild(frag);
        }
        updateStyles();
        // store disposer so we can clean up later
        autorun(reaction => {
          this.manifest = toJS(store.routerManifest);
          if (typeof this.manifest.title !== typeof undefined) {
            document.title = this.manifest.title;
          }
          if (
            typeof this.manifest.metadata !== typeof undefined &&
            typeof this.manifest.metadata.cssVariable !== typeof undefined
          ) {
            // json outline schema changed, allow other things to react
            // fake way of forcing an update of these items
            let ary = this.manifest.metadata.cssVariable
              .replace("--simple-colors-default-theme-", "")
              .split("-");
            ary.pop();
            this.accentColor = ary.join("-");
            // set this directly instead of messing w/ accentColor
            document.body.style.setProperty(
              "--haxcms-color",
              this.manifest.metadata.hexCode
            );
          }
          this.__disposer.push(reaction);
        });
        autorun(reaction => {
          this._location = store.location;
          this.__disposer.push(reaction);
        });
        autorun(reaction => {
          this.activeItem = toJS(store.activeItem);
          this.__disposer.push(reaction);
        });
        autorun(reaction => {
          this.activeId = toJS(store.activeId);
          this.__disposer.push(reaction);
        });
        autorun(reaction => {
          this.activeItemFields = toJS(store.activeItemFields);
          this.__disposer.push(reaction);
        });
        autorun(reaction => {
          this.activeManifestIndex = toJS(store.activeManifestIndex);
          this.__disposer.push(reaction);
        });
        autorun(reaction => {
          this.activeTitle = toJS(store.activeTitle);
          this.__disposer.push(reaction);
        });
        autorun(reaction => {
          this.siteTitle = toJS(store.siteTitle);
          this.__disposer.push(reaction);
        });
        autorun(reaction => {
          this.homeLink = toJS(store.homeLink);
          this.__disposer.push(reaction);
        });
        autorun(reaction => {
          this.activeManifestIndexCounter = toJS(
            store.activeManifestIndexCounter
          );
          this.__disposer.push(reaction);
        });
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
      for (var i in this.__disposer) {
        this.__disposer[i].dispose();
      }
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
        "haxcms-active-item-changed",
        this._activeItemUpdate.bind(element)
      );
      document.body.addEventListener(
        "haxcms-trigger-update",
        this._triggerUpdate.bind(element)
      );
      // @todo may want to set this to sessionStorage instead...
      if (window.localStorage.getItem("HAXCMSSystemData") == null) {
        window.localStorage.setItem("HAXCMSSystemData", JSON.stringify({}));
      }
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
      "haxcms-edit-mode-changed",
      this._globalEditChanged.bind(element)
    );
    document.body.removeEventListener(
      "haxcms-trigger-update",
      this._triggerUpdate.bind(element)
    );
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
      // dispatch to the store
      store.activeId = newValue.id;
      // dispatch to everything else caring
      const evt = new CustomEvent("json-outline-schema-active-item-changed", {
        bubbles: true,
        cancelable: true,
        detail: newValue
      });
      this.dispatchEvent(evt);
      // update title as a simple nicity
      if (typeof newValue.title !== typeof undefined) {
        document.title = this.manifest.title + " - " + newValue.title;
      } else {
        document.title = this.manifest.title;
      }
    } else {
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
}

export { HAXCMSThemeWiring };
