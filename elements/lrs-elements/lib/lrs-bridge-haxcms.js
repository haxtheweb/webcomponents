/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LrsBridge } from "./lrs-bridge.js";

/**
 * `lrs-bridge-haxcms`
 * `LRS bridge for HAXcms sites.`
 *
 * HAXcms records each page visit itself: the progress store
 * (haxcms-learner-progress) sends an experienced statement for the page as a
 * lesson, with the site as its grouping, through the same user-engagement
 * pipeline every element uses. The base bridge forwards those along with
 * everything else, so this bridge no longer posts its own page view (it was
 * a non-xAPI "viewed" verb and duplicated the progress store's statement).
 * @demo demo/index.html
 */
class LrsBridgeHaxcms extends LrsBridge {
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "lrs-bridge-haxcms";
  }
}
globalThis.customElements.define(LrsBridgeHaxcms.tag, LrsBridgeHaxcms);
export { LrsBridgeHaxcms };
