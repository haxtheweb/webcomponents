/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx/lib/mobx.module.js";
import { varExists, varGet } from "@lrnwebcomponents/hax-body/lib/haxutils.js";
import { microTask } from "@polymer/polymer/lib/utils/async.js";
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
      this.__disposer = [];
      this.HAXCMSThemeWiring = new HAXCMSThemeWiring(this);
    }
    /**
     * This is a render function example. All new HAXcms capable themes need
     * to define a contentcontainer and a slot id wrapper. this allows HAXcms
     * to correctly target the area that will display the HAXeditor when in
     * edit-mode and correctly hide the editor when in normal content presentation.
     * static get template() {
     *  return html`
     *  <style include="simple-colors-shared-styles">
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
      let props = {
        /**
         * Class for the color
         */
        hexColor: {
          type: String
        },
        /**
         * Color class work to apply
         */
        color: {
          type: String,
          reflectToAttribute: true,
          observer: "_colorChanged"
        },
        /**
         * editting state for the page
         */
        editMode: {
          type: Boolean,
          reflectToAttribute: true,
          notify: true,
          value: false,
          observer: "_editModeChanged"
        },
        /**
         * DOM node that wraps the slot
         */
        contentContainer: {
          type: Object,
          notify: true,
          value: null,
          observer: "_contentContainerChanged"
        },
        /**
         * location as object
         */
        _location: {
          type: Object,
          observer: "_locationChanged"
        }
      };
      if (super.properties) {
        props = Object.assign(props, super.properties);
      }
      return props;
    }
    _colorChanged(newValue) {
      if (newValue) {
        this.hexColor = this._getHexColor(newValue);
      }
    }
    /**
     * Convert color name to HEX
     */
    _getHexColor(color) {
      // legacy support for materializeCSS names
      let name = color.replace("-text", "");
      let tmp = new SimpleColors();
      if (tmp.colors[name]) {
        return tmp.colors[name][6];
      }
      return "#000000";
    }
    /**
     * notice edit changed, make sure we fake a resize because of that container flyout
     */
    _editModeChanged(newValue, oldValue) {
      if (typeof oldValue !== typeof undefined) {
        // ensure global is kept in sync
        store.editMode = newValue;
        microTask.run(() => {
          // trick browser into thinking we just reized
          window.dispatchEvent(new Event("resize"));
          // forcibly update styles via css variables
          updateStyles();
        });
      }
    }
    /**
     * private: Notice content container has changed
     */
    _contentContainerChanged(newValue, oldValue) {
      // test that this hasn't been connected previously
      setTimeout(() => {
        if (newValue && oldValue == null) {
          this.HAXCMSThemeWiring.connect(this, newValue);
        }
        // previously connected, needs to change to new connection
        // this is an edge case at best...
        else if (newValue && oldValue) {
          this.HAXCMSThemeWiring.disconnect(this);
          this.HAXCMSThemeWiring.connect(this, newValue);
        }
        // no longer connected
        else if (oldValue && newValue == null) {
          this.HAXCMSThemeWiring.disconnect(this);
        }
      }, 500);
    }
    _locationChanged(newValue, oldValue) {
      if (!newValue || typeof newValue.route === "undefined") return;
      const location = newValue;
      const name = location.route.name;
      if (name === "home" || name === "404") {
        // if we are on the homepage then load the first item in the manifest
        // and set it active
        const firstItem = store.routerManifest.items.find(
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
      afterNextRender(this, function() {
        // edge case, we just swapped theme faster then content loaded... lol
        setTimeout(() => {
          if (dom(this).getEffectiveChildNodes().length === 0) {
            let frag = document
              .createRange()
              .createContextualFragment(store.activeItemContent);
            dom(this).appendChild(frag);
          }
        }, 50);
        updateStyles();
        // keep editMode in sync globally
        autorun(reaction => {
          this.editMode = toJS(store.editMode);
          this.__disposer.push(reaction);
        });
        // store disposer so we can clean up later
        autorun(reaction => {
          const __routerManifest = toJS(store.routerManifest);
          if (__routerManifest && varExists(__routerManifest, "title")) {
            document.title = __routerManifest.title;
          }
          if (
            __routerManifest &&
            varExists(__routerManifest, "metadata.theme.variables.cssVariable")
          ) {
            // json outline schema changed, allow other things to react
            // fake way of forcing an update of these items
            let ary = __routerManifest.metadata.theme.variables.cssVariable
              .replace("--simple-colors-default-theme-", "")
              .split("-");
            ary.pop();
            // simple colors "accent color" property
            this.accentColor = ary.join("-");
            // set this directly instead of messing w/ accentColor
            document.body.style.setProperty(
              "--haxcms-color",
              varGet(
                __routerManifest,
                "metadata.theme.variables.hexCode",
                "#FFFFFF"
              )
            );
          }
          this.__disposer.push(reaction);
        });
        autorun(reaction => {
          this._location = store.location;
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
          composed: true,
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
      window.addEventListener(
        "haxcms-edit-mode-changed",
        this._globalEditChanged.bind(element)
      );
      window.addEventListener(
        "haxcms-active-item-changed",
        this._activeItemUpdate.bind(element)
      );
      window.addEventListener(
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
    store.cmsSiteEditorAvailability(element, injector);
  }
  /**
   * detatch element events from whats passed in
   */
  disconnect(element) {
    window.removeEventListener(
      "haxcms-active-item-changed",
      this._activeItemUpdate.bind(element)
    );
    window.removeEventListener(
      "haxcms-edit-mode-changed",
      this._globalEditChanged.bind(element)
    );
    window.removeEventListener(
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
        composed: true,
        cancelable: true,
        detail: newValue
      });
      this.dispatchEvent(evt);
      // update title as a simple nicity
      if (typeof newValue.title !== typeof undefined) {
        document.title = store.routerManifest.title + " - " + newValue.title;
      } else {
        document.title = store.routerManifest.title;
      }
    } else {
      document.title = store.routerManifest.title;
    }
  }
  /**
   * Generic event to ensure that the active item change is noticed
   */
  _triggerUpdate(e) {
    this.dispatchEvent(
      new CustomEvent("haxcms-active-item-changed", {
        bubbles: true,
        composed: true,
        cancelable: true,
        detail: {}
      })
    );
  }
}

export { HAXCMSThemeWiring };
