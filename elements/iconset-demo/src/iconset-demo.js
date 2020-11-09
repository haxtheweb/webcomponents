/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/polymer/lib/elements/dom-repeat.js";
import { IronMeta } from "@polymer/iron-meta/iron-meta.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@polymer/marked-element/marked-element.js";

/**
 * `iconset-demo`
 * @element iconset-demo
 * `iterates through an iconset array to generate a demo of all of the icons`
 *
 * @microcopy - language worth noting:
 *  -
 *

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
    let temp = [],
      root = this;

    // need to access iconset imperatively now
    if (
      typeof iconSets !== typeof undefined &&
      iconSets.list &&
      iconSets.list.length
    ) {
      var index = 0;
      iconSets.list.forEach(function (item) {
        let name = item.name;
        if (!root._hideIconset(name)) {
          temp.push({
            name: name,
            icons: [],
          });
          item.getIconNames().forEach((icon) => {
            temp[index].icons.push(icon);
          });
          index++;
        }
      });
    }
    this.set("__iconList", []);
    this.set("__iconList", temp);
  }
  /**
   *  determines if a given iconset should be hidden
   *
   * @param {string} name the name of the iconset
   * @returns {boolean} whether or n ot to hide the iconset
   */
  _hideIconset(name) {
    let isets = this.includeSets !== null ? this.includeSets.split(/ /) : [],
      included = isets.length === 0 || isets.includes(name),
      esets = this.excludeSets !== null ? this.excludeSets.split(/ /) : [],
      excluded = esets.length.length > 0 && esets.includes(name);
    return !included || excluded;
  }
}
window.customElements.define(IconsetDemo.tag, IconsetDemo);
export { IconsetDemo };
