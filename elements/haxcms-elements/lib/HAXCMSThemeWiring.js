/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { store } from "@lrnwebcomponents/haxcms-elements/lib/haxcms-site-store.js";
import { autorun, toJS } from "mobx";
/**
 * `HAXCMSThemeWiring` streamline hooking themes up to HAXCMS
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
      autorun(() => {
        this._manifestUpdate({ detail: toJS(store.routerManifest) });
      });
    }
  }
  connect(element, injector) {
    // this implies there's the possibility of an authoring experience
    if (typeof window.cmsSiteEditor !== typeof undefined) {
      window.cmsSiteEditor.requestAvailability(element, injector);
    }
  }
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
  }
  _globalEditChanged(e) {
    this.editMode = e.detail;
  }
  _activeItemUpdate(e) {
    let newValue = e.detail;
    if (newValue && typeof newValue.id !== typeof undefined) {
      const evt = new CustomEvent("json-outline-schema-active-item-changed", {
        bubbles: true,
        cancelable: true,
        detail: newValue
      });
      this.dispatchEvent(evt);
      if (typeof newValue.title !== typeof undefined) {
        document.title = newValue.title + " - " + newValue.title;
      } else {
        document.title = newValue.title + " - " + newValue.description;
      }
    } else {
      document.title = newValue.title + " - " + newValue.description;
    }
  }
  _triggerUpdate(e) {
    const evt = new CustomEvent("json-outline-schema-active-item-changed", {
      bubbles: true,
      cancelable: true,
      detail: {}
    });
    this.dispatchEvent(evt);
  }
  _manifestUpdate(e) {
    let newValue = e.detail;
    if (typeof newValue.title !== typeof undefined) {
      document.title = newValue.title + " - " + newValue.description;
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
