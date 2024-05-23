/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { store } from "@haxtheweb/haxcms-elements/lib/core/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
import {
  varExists,
  varGet,
  localStorageGet,
  localStorageSet,
} from "@haxtheweb/utils/utils.js";
import "@haxtheweb/simple-colors-shared-styles/simple-colors-shared-styles.js";
import "@haxtheweb/anchor-behaviors/anchor-behaviors.js";

/**
 * `HAXCMSTheme` mixin class to automatically apply HAXcms theme state
 * Typically an element will be extended from this and while not all,
 * many will want to customize the `contentContainer` property in order
 * to ensure the editable layer is correctly applied visually.
 *
 * This will then need a rendering helper library to make work
 */
const HAXCMSTheme = function (SuperClass) {
  return class extends SuperClass {
    // leverage the wiring class element; this helps us clean things up smoothly later
    // while still keeping it abstract enough for direct usage in PolymerLegacy elements
    // as well as those wanting a custom integration methodology
    constructor() {
      super();
      this.windowControllers = new AbortController();
      // a bucket for settings that can be for reusable
      // functionality across themes yet they might want
      // to opt in / out
      this.HAXCMSThemeSettings = {
        // should we scroll to the top when a new page
        // is selected
        autoScroll: false,
        scrollTarget: globalThis,
      };
      this.__disposer = this.__disposer ? this.__disposer : [];
      this.HAXCMSThemeWiring = new HAXCMSThemeWiring(this);
    }
    /**
     * This is a render function example. All new HAXcms capable themes need
     * to define a contentcontainer and a slot id wrapper. this allows HAXcms
     * to correctly target the area that will display the HAXeditor when in
     * edit-mode and correctly hide the editor when in normal content presentation.
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
      let colors = globalThis.SimpleColorsSharedStyles.colors;
      if (colors[name]) {
        return colors[name][6];
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
        this.__styleReapply();
      }
    }
    /**
     * private: Notice content container has changed
     */
    _contentContainerChanged(newValue, oldValue) {
      // test that this hasn't been connected previously
      if (
        newValue &&
        (typeof oldValue === typeof undefined || oldValue == null)
      ) {
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
    }
    _locationChanged(newValue, oldValue) {
      if (!newValue || typeof newValue.route === "undefined") return;
      const location = newValue;
      const name = location.route.name;
      if (name == "home") {
        // if we are on the homepage then load the first item in the manifest
        // and set it active
        const firstItem = store.routerManifest.items.find(
          (i) => typeof i.id !== "undefined",
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
      // edge case, we just swapped theme faster then content loaded... lol
      setTimeout(() => {
        if (this.childNodes.length === 0) {
          let frag = document
            .createRange()
            .createContextualFragment(store.activeItemContent);
          this.appendChild(frag);
        }
        this.__styleReapply();
      }, 50);
      // keep activeItemContent in sync globally
      autorun((reaction) => {
        this.activeItemContent = toJS(store.activeItemContent);
        this.__disposer.push(reaction);
      });
      // keep editMode in sync globally
      autorun((reaction) => {
        this.editMode = toJS(store.editMode);
        this.__disposer.push(reaction);
      });
      // logged in so we can visualize things differently as needed
      autorun((reaction) => {
        this.isLoggedIn = toJS(store.isLoggedIn);
        this.__disposer.push(reaction);
      });
      // store disposer so we can clean up later
      autorun((reaction) => {
        const __manifest = toJS(store.manifest);
        if (__manifest && varExists(__manifest, "title")) {
          globalThis.document.title = __manifest.title;
        }
        if (
          __manifest &&
          varExists(__manifest, "metadata.theme.variables.cssVariable")
        ) {
          // json outline schema changed, allow other things to react
          // fake way of forcing an update of these items
          let ary = __manifest.metadata.theme.variables.cssVariable
            .replace("--simple-colors-default-theme-", "")
            .split("-");
          ary.pop();
          // simple colors "accent color" property
          this.accentColor = ary.join("-");
          var color = varGet(
            __manifest,
            "metadata.theme.variables.cssVariable",
            null,
          );
          // fallback if color wasn't set via css var
          if (color == null) {
            color = varGet(
              __manifest,
              "metadata.theme.variables.hexCode",
              "#ff0074",
            );
          } else {
            color = `var(${color})`;
          }
          // set this directly instead of messing w/ accentColor
          globalThis.document.body.style.setProperty("--haxcms-color", color);
        }
        this.__disposer.push(reaction);
      });
      autorun((reaction) => {
        this._location = toJS(store.location);
        this.__disposer.push(reaction);
      });
    }
    __styleReapply() {
      // trick browser into thinking we just reized
      globalThis.dispatchEvent(new Event("resize"));
    }
    /**
     * Disconnect the wiring for the theme and clean up state
     */
    disconnectedCallback() {
      // remove our content container var which will disconnect the wiring
      delete this.contentContainer;
      // clean up state
      for (var i in this.__disposer) {
        this.__disposer[i].dispose();
      }
      super.disconnectedCallback();
    }
    /**
     * Correctly reset state and dispatch event to notify of active item change
     */
    resetActive() {
      globalThis.history.pushState(null, null, store.location.baseUrl);
      globalThis.dispatchEvent(new PopStateEvent("popstate"));
      this.dispatchEvent(
        new CustomEvent("haxcms-active-item-changed", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: {},
        }),
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
    globalThis.SimpleColorsSharedStyles.requestAvailability();
    if (load) {
      // @todo may want to set this to sessionStorage instead...
      if (localStorageGet("HAXCMSSystemData", null) == null) {
        localStorageSet("HAXCMSSystemData", {});
      }
    }
    this.__disposer = this.__disposer ? this.__disposer : [];
    autorun((reaction) => {
      // we have a backend and we have a jwt, but didnt at onee point...
      if (
        store.jwt &&
        store.themeElement &&
        store.cmsSiteEditorBackend.tag &&
        store.themeElement.contentContainer &&
        store.isLoggedIn
      ) {
        // this forces the connect callback to run which would have happened on intial spin up
        // it also ensures some slow loading environments will still get the editor
        this.connect(store.themeElement, store.themeElement.contentContainer);
      }
      this.__disposer.push(reaction);
    });
  }
  /**
   * connect the theme and see if we have an authoring experience to inject correctly
   */
  connect(element, injector) {
    if (this.windowControllers) {
      this.windowControllers.abort();
    }
    this.windowControllers = new AbortController();
    globalThis.addEventListener(
      "haxcms-active-item-changed",
      this._activeItemUpdate.bind(element),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener(
      "haxcms-edit-mode-changed",
      this._globalEditChanged.bind(element),
      { signal: this.windowControllers.signal },
    );

    globalThis.addEventListener(
      "haxcms-trigger-update",
      this._triggerUpdate.bind(element),
      { signal: this.windowControllers.signal },
    );

    // inject the tools to allow for an authoring experience
    // ensuring they are loaded into the correct theme
    if (this.cmsSiteEditorInstance) {
      globalThis.document.body.appendChild(this.cmsSiteEditorInstance);
    }
    // if we don't have a backend, don't assume we have an editing experience
    // or we'll keep injecting one regardless and then we're a lightdom read
    // away from our autoloader hydrating it. also ensure we have a backend
    // and a JWT from said backend before we proceed in injecting the editor
    // this doesn't validate the jwt but the calls will do that for us
    // this is ONLY the act of displaying the editor bar in the first place
    if (store.jwt && store.cmsSiteEditorBackend.tag && store.isLoggedIn) {
      this.cmsSiteEditorInstance = store.cmsSiteEditorAvailability();
      store.cmsSiteEditor.instance.appElement = element;
      store.cmsSiteEditor.instance.appendTarget = injector;
      store.cmsSiteEditor.instance.appendTarget.appendChild(
        store.cmsSiteEditor.instance,
      );
    }
  }
  /**
   * detatch element events from whats passed in
   */
  disconnect(element) {
    this.windowControllers.abort();
    // need to unplug this so that the new theme can pick it up.
    if (this.cmsSiteEditorInstance) {
      globalThis.document.body.appendChild(this.cmsSiteEditorInstance);
    }
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
        detail: newValue,
      });
      this.dispatchEvent(evt);
      // update title as a simple nicity
      if (typeof newValue.title !== typeof undefined) {
        globalThis.document.title =
          store.routerManifest.title + " - " + newValue.title;
      } else {
        globalThis.document.title = store.routerManifest.title;
      }
    } else {
      globalThis.document.title = store.routerManifest.title;
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
        detail: {},
      }),
    );
  }
}
export { HAXCMSTheme, HAXCMSThemeWiring };
