/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorButtonBehaviors } from "./rich-text-editor-button.js";
import "@lrnwebcomponents/simple-picker/simple-picker.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";

const RichTextEditorPickerBehaviors = function(SuperClass) {
  return class extends RichTextEditorButtonBehaviors(SuperClass) {
    /**
     * Store the tag name to make it easier to obtain directly.
     */
    static get tag() {
      return "rich-text-editor-picker";
    }

    static get styles() {
      return [
        ...super.styles,
        css`
          :host {
            margin: 0 var(--rich-text-editor-button-margin);
          }
          simple-picker {
            --simple-picker-border-radius: 0px;
            --simple-picker-color: var(--rich-text-editor-button-color);
            --simple-picker-color-active: var(
              --rich-text-editor-button-hover-color
            );
            --simple-picker-color-disabled: var(
              --rich-text-editor-border-color
            );
            --simple-picker-background-color: var(--rich-text-editor-bg);
            --simple-picker-background-color-disabled: var(
              --rich-text-editor-border-color
            );
            --simple-picker-border-width: 0px;
            --simple-picker-option-size: 24px;
            --simple-picker-icon-size: 16px;
            --simple-picker-options-border-width: 1px;
          }
        `
      ];
    }

    render() {
      return html`
        <simple-picker
          id="button"
          ?allow-null="${this.allowNull}"
          class="rtebutton ${this.toggled ? "toggled" : ""}"
          ?disabled="${this.disabled}"
          controls="${super.controls}"
          @valueChanged="${this._pickerChange}"
          tabindex="0"
          ?title-as-html="${this.titleAsHtml}"
          .options="${this.options}"
          .value="${this.value}"
        >
          <span id="label" class="${super.labelStyle}"
            >${this.currentLabel}</span
          >
        </simple-picker>
        <simple-tooltip id="tooltip" for="button"
          >${this.currentLabel}</simple-tooltip
        >
      `;
    }

    static get properties() {
      return {
        ...super.properties,
        /**
         * Allow a null option to be selected?
         */
        allowNull: {
          type: Boolean
        },
        /**
         * The command used for document.execCommand.
         */
        command: {
          type: String
        },
        /**
         * Optional icon for null value
         */
        icon: {
          type: String
        },
        /**
         * The command used for document.execCommand.
         */
        options: {
          type: Array
        },

        /**
         * Renders html as title. (Good for titles with HTML in them.)
         */
        titleAsHtml: {
          type: Boolean
        },

        /**
         * The value
         */
        value: {
          type: Object
        }
      };
    }

    constructor() {
      super();
      this.allowNull = false;
      this.command = "insertHTML";
      this.label = "Insert link";
      this.options = [];
      this.titleAsHtml = false;
    }

    updated(changedProperties) {
      super.updated(changedProperties);
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "options") this._optionsChanged();
      });
    }

    /**
     * determines the value of the picker based on the selected range
     *
     * @param {object} the text selected range
     * @returns {boolean} whether the button is toggled
     *
     */
    get isToggled() {
      let selectors = this.options
          ? [...this.options]
              .map(option => option.value)
              .filter(option => !!option && option !== "")
              .join(",")
          : undefined,
        parent =
          !!this.range && this.range.commonAncestorContainer
            ? this.range.commonAncestorContainer.parentNode
            : undefined;
      this.value =
        this.command === "formatBlock" &&
        selectors &&
        parent &&
        !!parent.closest(selectors)
          ? parent.closest(selectors).tagName.toLowerCase()
          : undefined;
      return false;
    }

    _optionsChanged() {
      this.dispatchEvent(
        new CustomEvent("options-changed", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
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
      this.commandVal = this.shadowRoot.querySelector("#button") ? this.shadowRoot.querySelector("#button").value : false;
      e.preventDefault();
      
      console.log('_pickerChange',e,this.commandVal ,this.range);
      if (!!this.commandVal) {
        this.commandVal = this.shadowRoot.querySelector("#button").value;
        this.doTextOperation();
        if (this.block !== true) {
          this.shadowRoot.querySelector("#button").value = null;
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
    _getPickerOptions(options = [], allowNull = false, icon = undefined) {
      let items = [],
        cols =
          Math.sqrt(options.length) < 11
            ? Math.ceil(Math.sqrt(options.length))
            : 10;
      for (let i = 0; i < options.length; i++) {
        let row = Math.floor(i / cols),
          col = i - row * cols,
          data = this._getOptionData(options[i]);
        if (!items[row]) items[row] = [];
        items[row][col] = data;
      }
      return items;
    }
  };
};
/**
 * `rich-text-editor-picker`
 * a picker for rich text editor (custom buttons can extend this)
 *
 * @element rich-text-editor-picker
 * @demo ./demo/buttons.html
 */
class RichTextEditorPicker extends RichTextEditorPickerBehaviors(LitElement) {}
window.customElements.define(RichTextEditorPicker.tag, RichTextEditorPicker);
export { RichTextEditorPicker, RichTextEditorPickerBehaviors };
