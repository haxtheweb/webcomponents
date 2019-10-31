/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { RichTextEditorButton } from "./rich-text-editor-button.js";
import "@lrnwebcomponents/simple-picker/simple-picker.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
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
  constructor() {
    super();
    this.label = "Insert link";
  }
  // render function
  static get template() {
    return html`
      <style include="rich-text-editor-button-styles">
        :host {
          margin: 0 var(--rich-text-editor-button-margin);
        }
        :host simple-picker {
          --simple-picker-border-radius: 0px;
          --simple-picker-color: var(--rich-text-editor-button-color);
          --simple-picker-color-active: var(
            --rich-text-editor-button-hover-color
          );
          --simple-picker-color-disabled: var(--rich-text-editor-border-color);
          --simple-picker-background-color: var(--rich-text-editor-bg);
          --simple-picker-background-color-disabled: var(
            --rich-text-editor-border-color
          );
          --simple-picker-border-width: 0px;
          --simple-picker-option-size: 18px;
          --simple-picker-options-border-width: 1px;
        }
      </style>
      <simple-picker
        id="button"
        allow-null$="[[allowNull]]"
        class="rtebutton"
        disabled$="[[super.disabled]]"
        controls$="[[super.controls]]"
        on-change="_pickerChange"
        tabindex="0"
        title-as-html$="[[titleAsHtml]]"
        options="[[options]]"
        value="{{value}}"
      >
        <span id="label" class$="[[super.labelStyle]]">[[__label]]</span>
      </simple-picker>
      <paper-tooltip id="tooltip" for="button">[[__label]]</paper-tooltip>
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
        type: Boolean,
        value: false
      },
      /**
       * The command used for document.execCommand.
       */
      command: {
        name: "command",
        type: String,
        value: "insertHTML"
      },
      /**
       * Optional icon for null value
       */
      icon: {
        name: "icon",
        type: String,
        value: null
      },
      /**
       * The command used for document.execCommand.
       */
      options: {
        name: "options",
        type: Array,
        value: [],
        notify: true
      },

      /**
       * Renders html as title. (Good for titles with HTML in them.)
       */
      titleAsHtml: {
        name: "titleAsHtml",
        type: Boolean,
        value: false
      },

      /**
       * The value
       */
      value: {
        name: "value",
        type: Object,
        value: null
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "rich-text-editor-picker";
  }

  /**
   * determines the value of the picker based on the selected range
   *
   * @param {object} the text selected range
   * @returns {boolean} whether the button is toggled
   *
   */
  _isToggled(range) {
    //get all the possible block selectors from the options
    let selectors = this.options
        ? []
            .concat(...this.options)
            //flatten th eoptions array
            .map(option => option.value)
            //get all the values
            .filter(
              //remove the empty values
              option => option !== null && option !== ""
              //stringify the list
            )
            .join(",")
        : null,
      //get the selected range parent
      parent =
        range !== null && range.commonAncestorContainer
          ? range.commonAncestorContainer.parentNode
          : null;
    this.$.button.value =
      this.command === "formatBlock" &&
      selectors &&
      parent &&
      parent.closest(selectors) !== null
        ? parent.closest(selectors).tagName.toLowerCase()
        : null;
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
    console.log("_pickerChange", this.$.button.value);
    e.preventDefault();
    if (val !== null && this.range !== undefined && this.range !== null) {
      this.commandVal = this.$.button.value;
      console.log("commandVal", this.commandVal);
      this.doTextOperation();
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
    let items = [],
      cols =
        Math.sqrt(options.length) < 11
          ? Math.ceil(Math.sqrt(options.length))
          : 10;
    for (let i = 0; i < options.length; i++) {
      let row = Math.floor(i / cols),
        col = i - row * cols,
        data = this._getOptionData(options[i]);
      if (items[row] === undefined || items[row] === null) items[row] = [];
      items[row][col] = data;
    }
    return items;
  }
}
window.customElements.define(RichTextEditorPicker.tag, RichTextEditorPicker);
export { RichTextEditorPicker };
