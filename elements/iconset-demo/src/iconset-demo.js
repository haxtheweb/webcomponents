/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { IronMeta } from "@polymer/iron-meta/iron-meta.js";
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
   * life cycle, element is ready
   */
  connectedCallback() {
    super.connectedCallback();
    const iconSets = new IronMeta({ type: "iconset" });
    let temp = [];

    // need to access iconset imperatively now
    if (
      typeof iconSets !== typeof undefined &&
      iconSets.list &&
      iconSets.list.length
    ) {
      var index = 0;
      iconSets.list.forEach(function(item) {
        let name = item.name;
        temp.push({
          name: name,
          icons: []
        });
        item.getIconNames().forEach(icon => {
          temp[index].icons.push(icon);
        });
        index++;
      });
    }
    this.__iconList = temp;
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(IconsetDemo.tag, IconsetDemo);
