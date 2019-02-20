/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import "@lrnwebcomponents/simple-colors/simple-colors.js";
// ensure HAXCMSBehaviors exists
window.HAXCMSBehaviors = window.HAXCMSBehaviors || {};
/**
 * `HAXCMSBehaviors.Theme` streamline hooking themes up to HAXCMS
 *
 * @polymerBehavior HAXCMSBehaviors.Schema
 **/
export class HAXCMSWiring {
  constructor() {
    this.element = null;
    /**
     * editting state for the page
     */
    this.editMode = {
      type: Boolean,
      reflectToAttribute: true,
      value: false,
      notify: true
    };
    /**
     * Active item which is in JSON Outline Schema
     */
    this.activeItem = {
      type: Object,
      notify: true,
      observer: "_activeItemChanged"
    };
    /**
     * a manifest json file decoded, in JSON Outline Schema format
     */
    this.manifest = {
      type: Object,
      notify: true,
      observer: "_manifestChanged"
    };
  }

  _globalEditChanged(e) {
    if (this.element) {
      this.element.editMode = e.detail;
    }
  }

  _activeItemChanged(newValue, oldValue) {
    if (newValue && typeof newValue.id !== typeof undefined) {
      this.element.fire("json-outline-schema-active-item-changed", newValue);
      if (typeof newValue.title !== typeof undefined) {
        document.title = this.element.manifest.title + " - " + newValue.title;
      } else {
        document.title =
          this.element.manifest.title +
          " - " +
          this.element.manifest.description;
      }
    } else {
      document.title =
        this.element.manifest.title + " - " + this.element.manifest.description;
    }
  }
  _activeItemUpdate(e) {
    this.element.set("activeItem", e.detail);
    this.element.notifyPath("activeItem.*");
  }
  setupHAXTheme(element, load, injector) {
    this.element = element;
    this.load = load;
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
      // this implies there's the possibility of an authoring experience
      if (typeof window.cmsSiteEditor !== typeof undefined) {
        window.cmsSiteEditor.requestAvailability(element, injector);
      }
    } else {
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
    }
  }
  _triggerUpdate(e) {
    this.element.fire("json-outline-schema-active-item-changed", {});
  }
  _manifestUpdate(e) {
    this.element.set("manifest", e.detail);
    this.element.notifyPath("manifest.*");
  }
  _manifestChanged(newValue, oldValue) {
    if (typeof newValue.title !== typeof undefined) {
      document.title =
        this.element.manifest.title + " - " + this.element.manifest.description;
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
      this.element.accentColor = ary.join("-");
      // set this directly instead of messing w/ accentColor
      document.body.style.setProperty(
        "--haxcms-color",
        newValue.metadata.hexCode
      );
    }
  }
}
const HAXCMS = new HAXCMSWiring();
window.HAXCMSBehaviors = window.HAXCMSBehaviors || {};
window.HAXCMSBehaviors.Theme = {
  properties: {
    editMode: HAXCMS.editMode,
    activeItem: HAXCMS.activeItem,
    manifest: HAXCMS.manifest
  },
  /**
   * Toggle edit mode
   */
  _globalEditChanged: function(e) {
    HAXCMS._globalEditChanged(e);
  },
  /**
   * Notice that active item has changed.
   */
  _activeItemChanged: function(newValue, oldValue) {
    HAXCMS._activeItemChanged(newValue, oldValue);
  },
  /**
   * See if we need to update to match state if something external
   * to the theme makes a change in the active item globally
   */
  _activeItemUpdate: function(e) {
    HAXCMS._activeItemUpdate(e);
  },
  /**
   * Setup HAX theme common design needs at a data layer
   */
  setupHAXTheme: function(load = true, injector = this.$.contentcontainer) {
    HAXCMS.setupHAXTheme(this, load, injector);
  },
  /**
   * refreshed data call
   */
  _triggerUpdate: function(e) {
    HAXCMS._triggerUpdate();
  },
  /**
   * react to manifest being changed
   */
  _manifestUpdate: function(e) {
    HAXCMS._manifestUpdate(e);
  },
  /**
   * Manifest has changed
   */
  _manifestChanged: function(newValue, oldValue) {
    if (HAXCMS.load) {
      HAXCMS._manifestChanged(newValue, oldValue);
    }
  }
};
