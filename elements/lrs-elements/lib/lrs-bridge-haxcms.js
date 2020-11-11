/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { autorun, toJS } from "mobx";
import { store } from "@lrnwebcomponents/haxcms-elements/lib/core/haxcms-site-store.js";
import { LrsBridge } from "./lrs-bridge.js";

/**
 * `lrs-bridge-haxcms`
 * `Adds HAXcms event listeners for our LRS.`
 * @demo demo/index.html
 */
class LrsBridgeHaxcms extends LrsBridge {
  constructor() {
    super();
    autorun(() => {
      this._locationChanged(toJS(store.location));
    });
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "lrs-bridge-haxcms";
  }

  _locationChanged(location) {
    // trim slash from begining and end
    const trimSlash = (string) => string.replace(/(^\/|\/$)/, "");
    const url = `${trimSlash(location.baseUrl)}/${trimSlash(
      location.pathname
    )}`;
    this.recordStatement({
      verb: {
        id: "viewed",
      },
      object: {
        id: url,
      },
    });
  }
}
window.customElements.define(LrsBridgeHaxcms.tag, LrsBridgeHaxcms);
export { LrsBridgeHaxcms };
