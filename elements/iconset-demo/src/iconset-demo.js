/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/marked-element/marked-element.js";

export { IconsetDemo };
/**
 * `iconset-demo`
 * `iterates through an iconset array to generate a demo of all of the icons`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class IconsetDemo extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "iconset-demo";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
  _getIcons(iconsets) {
    let set = iconsets !== null ? JSON.parse(iconsets) : [],
      items = [];
    for (let i = 0; i < set.length; i++) {
      items.push({
        name:
          set[i].name !== undefined && set[i].name !== null
            ? set[i].name + " "
            : "Icons",
        prefix:
          set[i].name !== undefined && set[i].name !== null
            ? set[i].name + ":"
            : "",
        icons:
          set[i].icons !== undefined && set[i].icons !== null
            ? set[i].icons
            : []
      });
    }
    return items;
  }
}
window.customElements.define(IconsetDemo.tag, IconsetDemo);
