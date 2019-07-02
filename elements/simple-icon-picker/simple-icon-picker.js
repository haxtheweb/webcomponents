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
  
  // render function
  static get template() {
    return html`
<style>:host(simple-icon-picker) #collapse {
  width: 300px;
  height: 300px;
  max-height: 300px;
  overflow: auto;
}
:host(simple-icon-picker) .row {
  justify-content: flex-start;
}
:host(simple-icon-picker) simple-picker-option {
  flex: 0 0 auto;
}
</style>
${super.template}`;
  }

  // properties available to the custom element for data binding
    static get properties() {
    let props = {
  /**
   * Allow a null option to be selected?
   */
  "allowNull": {
    "name": "allowNull",
    "type": Boolean,
    "value": false,
    "observer": "_getOptions"
  },

  /**
    * An array of icons by name: ```
[
  "editor:format-paint",
  "content-copy",
  "av:volume-off"
  
]```
  */
  "icons": {
    "name": "icons",
    "type": Array,
    "value": [],
    "observer": "_getOptions"
  },

  /**
   * The value of the option.
   */
  "value": {
    "name": "value",
    "type": String,
    "value": null,
    "reflectToAttribute": true,
    "notify": true
  },

  /**
   * the maximum number of options per row
   */
  "optionsPerRow": {
    "optionSize": "optionsPerRow",
    "type": Number,
    "value": 10,
    "observer": "_getOptions"
  },

  /**
    * An array of icons by name: ```
[
  "editor:format-paint",
  "content-copy",
  "av:volume-off"
  
]```
  */
  "__iconList": {
    "name": "__iconList",
    "type": Array,
    "read-only": true,
    "observer": "_getOptions"
  }
}
;
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-icon-picker";
  }
  constructor() {
    super();
    this.hideOptionLabels = true;
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
  _getOptions() {
    let icons =
        typeof this.icons === "string" ? JSON.parse(this.icons) : this.icons,
      collapse = this.shadowRoot.querySelector("#collapse"),
      cols = this.optionsPerRow;
    if (icons.length === 0 && this.__iconList && this.__iconList.length > 0)
      icons = this.__iconList;
    let options =
        this.allowNull === false ? [] : [[{ alt: "null", value: null }]],
      h = this.allowNull === false ? 0 : 1;
    cols =
      Math.sqrt(icons.length + h) <= this.optionsPerRow
        ? Math.ceil(Math.sqrt(icons.length + h))
        : this.optionsPerRow;
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
    this.set("options", options);
    let option = this.shadowRoot.querySelector("simple-picker-option");
    if (collapse && option)
      collapse.style.width = cols * option.offsetWidth + 15 + "px";
  }
}
window.customElements.define(SimpleIconPicker.tag, SimpleIconPicker);
export { SimpleIconPicker };
