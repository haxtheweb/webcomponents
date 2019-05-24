/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */ import {
  html,
  PolymerElement
} from "../../node_modules/@polymer/polymer/polymer-element.js";
import { RichTextEditorButton } from "./rich-text-editor-button.js";
import "../../node_modules/@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import { pathFromUrl } from "../../node_modules/@polymer/polymer/lib/utils/resolve-url.js";
import "../../node_modules/@lrnwebcomponents/simple-picker/simple-picker.js";
/**
 * `rich-text-editor-picker`
 * `a picker for rich text editor (custom buttons can extend this)`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */ class RichTextEditorPicker extends RichTextEditorButton {
  constructor() {
    super();
    this.label = "Insert link";
    this.icon = "";
  } // render function
  static get template() {
    return html`
      <style include="rich-text-editor-button-styles">
        :host {
          margin: var(--rich-text-editor-button-margin);
          --simple-picker-option: {
            line-height: var(--simple-picker-option-size);
            height: var(--simple-picker-option-size);
            max-height: var(--simple-picker-option-size);
          }
        }
      </style>
      <simple-picker
        id="button"
        class="rtebutton"
        disabled$="[[disabled]]"
        controls="[[controls]]"
        on-change="_pickerChange"
        tabindex="0"
        title-as-html$="[[titleAsHtml]]"
        options="[[options]]"
        value="{{value}}"
      >
        <span id="label" class$="[[labelStyle]]">[[__label]]</span>
      </simple-picker>
      <paper-tooltip id="tooltip" for="button">[[__label]]</paper-tooltip>
    `;
  } // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Allow a null option to be selected?
       */ allowNull: { name: "allowNull", type: Boolean, value: !1 },
      /**
       * The command used for document.execCommand.
       */ command: {
        name: "command",
        type: String,
        value: "insertHTML",
        readOnly: !0
      },
      /**
       * Optional icon for null value
       */ icon: { name: "icon", type: String, value: null },
      /**
       * The command used for document.execCommand.
       */ options: { name: "options", type: Array, value: [], notify: !0 },
      /**
       * Renders html as title. (Good for titles with HTML in them.)
       */ titleAsHtml: { name: "titleAsHtml", type: Boolean, value: !1 },
      /**
       * The value
       */ value: { name: "value", type: Object, value: null }
    };
  }
  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */ static get tag() {
    return "rich-text-editor-picker";
  }
  /**
   * determins if the button is toggled
   *
   * @param {object} the text selection
   * @returns {boolean} whether the button is toggled
   *
   */ _isToggled(selection) {
    let toggled = !1;
    if (null !== selection && !selection.isCollapsed) {
      if ("formatBlock" === this.command) {
        let ancestor = selection.commonAncestorContainer,
          parent = ancestor.parentNode,
          temp = [];
        this.options.forEach(function(row) {
          row.forEach(function(option) {
            temp.push(option.value);
          });
        });
        this.$.button.value =
          null !== parent.closest(temp.join(","))
            ? parent.closest(temp.join(",")).tagName.toLowerCase()
            : null;
      }
    }
    return !1;
  }
  /**
   * Handles default options loaded from an external js file
   */ _setOptions() {
    this.set(
      "options",
      this._getPickerOptions(data, this.allowNull, this.icon)
    );
  }
  /**
   * Picker change
   */ _pickerChange(e) {
    let val = this.$.button.value;
    e.preventDefault();
    if (null !== val && this.selection !== void 0 && null !== this.selection) {
      this.commandVal = this.$.button.value;
      if ((this.command = "formatBlock")) {
        this.doTextOperation();
      } else if ((this.command = "insertNode")) {
        let node = !this.block
          ? document.createTextNode(val)
          : document.createElement(val);
        this.selection.extractContents();
        this.selection.insertNode(node);
      }
      if (!0 !== this.block) {
        this.$.button.value = null;
        this.dispatchEvent(new CustomEvent("deselect", { detail: this }));
      }
    }
  }
  /**
   * Converts option data to picker option data;
   * can be overridden in extended elements
   *
   * @param {object} data about the option
   * @returns {object} picker dato for the option
   */ _getOptionData(option) {
    return {
      alt: option.alt,
      icon: option.icon,
      style: option.style,
      value: option.value
    };
  }
  /**
   * gets a list of icons and load them in a format
   * that the simple-picker can take;
   * if no icons are provided, loads a list from iron-meta
   *
   * @param {array} a list of custom icons for the picker
   * @param {array} default list of icons for the picker
   * @param {boolean} allow a null value for the picker
   */ _getPickerOptions(options = [], allowNull = !1, icon = null) {
    let items =
        !1 === allowNull && null === icon
          ? [{ alt: "null", icon: icon, value: null }]
          : [],
      cols =
        11 > Math.sqrt(options.length)
          ? Math.ceil(Math.sqrt(options.length))
          : 10;
    for (let i = 0; i < options.length; i++) {
      let row = Math.floor(i / cols),
        col = i - row * cols,
        data = this._getOptionData(options[i]);
      if (items[row] === void 0 || null === items[row]) items[row] = [];
      if (0 === row && !1 === allowNull && null !== icon) {
        items[0][0] = { alt: "null", icon: icon, value: null };
        col++;
      }
      items[row][col] = data;
    }
    return items;
  }
}
window.customElements.define(RichTextEditorPicker.tag, RichTextEditorPicker);
export { RichTextEditorPicker };
