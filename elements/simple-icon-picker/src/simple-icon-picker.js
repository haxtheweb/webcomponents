/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import { SimplePicker } from "@lrnwebcomponents/simple-picker/simple-picker.js";
import { IronMeta } from "@polymer/iron-meta/iron-meta.js";

/**
 * `simple-icon-picker`
 * `Uses simple-picker to create an icon picker`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SimpleIconPicker extends SimplePicker {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-icon-picker";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  ready() {
    super.ready();
    afterNextRender(this, function() {
      const iconSets = new IronMeta({ type: "iconset" });
      if (
        this.icons.length === 0 &&
        typeof iconSets !== typeof undefined &&
        iconSets.list &&
        iconSets.list.length
      ) {
        var iconList = [];
        iconSets.list.forEach(function(item) {
          item.getIconNames().forEach(icon => {
            iconList.push(icon);
          });
        });
        this.__iconList = iconList;
      }
    });
  }

  /**
   * gets a list of icons and load them in a format
   * that the simple-picker can take;
   * if no icons are provided, loads a list from iron-meta
   *
   * @param {array} a list of custom icons for the picker
   * @param {array} default list of icons for the picker
   * @param {boolean} allow a null value for the picker
   *
   */
  _getOptions(icons = [], __iconList = [], allowNull = false) {
    if (icons.length === 0) icons = __iconList;
    let options = allowNull === false ? [] : [[{ alt: "null", value: null }]],
      h = allowNull === false ? 0 : 1,
      cols =
        Math.sqrt(icons.length + h) < 16
          ? Math.ceil(Math.sqrt(icons.length + h))
          : 15;
    for (let i = 0; i < icons.length; i++) {
      let j = h + i,
        row = Math.floor(j / cols),
        col = j - row * cols;
      if (options[row] === undefined || options[row] === null)
        options[row] = [];
      options[row][col] = {
        alt: icons[i],
        icon: icons[i],
        value: icons[i]
      };
    }
    return options;
  }

  /**
   * handles when the picker's value changes
   */
  _handleChange(e) {
    this.value = e.detail.value;
    this.dispatchEvent(
      new CustomEvent("change", { bubbles: true, detail: this })
    );
  }

  /**
   * handles when the picker collapses
   */
  _handleCollapse(e) {
    this.dispatchEvent(new CustomEvent("collapse", { detail: this }));
  }

  /**
   * handles when the picker expands
   */
  _handleExpand(e) {
    this.dispatchEvent(new CustomEvent("expand", { detail: this }));
  }

  /**
   * handles when the picker's focus changes
   */
  _handleOptionFocus(e) {
    this.dispatchEvent(new CustomEvent("option-focus", { detail: this }));
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(SimpleIconPicker.tag, SimpleIconPicker);
export { SimpleIconPicker };
