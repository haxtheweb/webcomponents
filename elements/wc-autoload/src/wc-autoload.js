/**
 * Copyright 2020 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */

/**
 * `wc-autoload`
 * `automatically load new tags in the dom`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @demo demo/index.html
 * @element wc-autoload
 */
class WcAutoload extends HTMLElement {
  /**
   * This is a convention, not the standard
   */
  static get tag() {
    return "wc-autoload";
  }
}
window.customElements.define(WcAutoload.tag, WcAutoload);
export { WcAutoload };
