/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { RichTextEditorButton } from "./rich-text-editor-button.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
import { pathFromUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
import "@lrnwebcomponents/simple-picker/simple-picker.js";
/**
 * `rich-text-editor-picker`
 * `a picker for rich text editor (custom buttons can extend this)`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class RichTextEditorPicker extends RichTextEditorButton {
  // render function
  static get template() {
    return html`
      <style include="rich-text-editor-styles"></style>
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
        <span id="label" class$="[[labelStyle]]"></span>
      </simple-picker>
      <paper-tooltip id="tooltip" for="button"></paper-tooltip>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Allow a null option to be selected?
       */
      allowNull: {
        name: "allowNull",
        type: "Boolean",
        value: false
      },
      /**
       * The command used for document.execCommand.
       */
      command: {
        name: "command",
        type: "String",
        value: "insertHTML",
        readOnly: true
      },
      /**
       * Optional icon for null value
       */
      icon: {
        name: "icon",
        type: "String",
        value: null
      },
      /**
       * The command used for document.execCommand.
       */
      options: {
        name: "options",
        type: "Array",
        value: [],
        notify: true
      },

      /**
       * Renders html as title. (Good for titles with HTML in them.)
       */
      titleAsHtml: {
        name: "titleAsHtml",
        type: "Boolean",
        value: false
      },

      /**
       * The value
       */
      value: {
        name: "value",
        type: "Object",
        value: null
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rich-text-editor-picker";
  }

  /**
   * determins if the button is toggled
   *
   * @param {object} the text selection
   * @returns {boolean} whether the button is toggled
   *
   */
  _isToggled(selection) {
    let toggled = false;
    if (selection !== null) {
      if (this.command === "formatBlock") {
        let ancestor = selection.commonAncestorContainer,
          parent = ancestor.parentNode,
          temp = [];
        this.options.forEach(function(row) {
          row.forEach(function(option) {
            temp.push(option.value);
          });
        });
        this.$.button.value =
          parent.closest(temp.join(",")) !== null
            ? parent.closest(temp.join(",")).tagName.toLowerCase()
            : null;
      }
    }
    return false;
  }

  /**
   * Handles default options loaded from an external js file
   */
  _setOptions() {
    this.set(
      "options",
      this._getPickerOptions(data, this.allowNull, this.icon)
    );
  }

  /**
   * Picker change
   */
  _pickerChange(e) {
    let val = this.$.button.value;
    e.preventDefault();
    if (
      val !== null &&
      this.selection !== undefined &&
      this.selection !== null
    ) {
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
      if (this.block !== true) {
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
   */
  _getOptionData(option) {
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
   */
  _getPickerOptions(options = [], allowNull = false, icon = null) {
    let items =
        allowNull === false && icon === null
          ? [{ alt: "null", icon: icon, value: null }]
          : [],
      cols =
        Math.sqrt(options.length) < 11
          ? Math.ceil(Math.sqrt(options.length))
          : 10;
    for (let i = 0; i < options.length; i++) {
      let row = Math.floor(i / cols),
        col = i - row * cols,
        data = this._getOptionData(options[i]);
      if (items[row] === undefined || items[row] === null) items[row] = [];
      if (row === 0 && allowNull === false && icon !== null) {
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
