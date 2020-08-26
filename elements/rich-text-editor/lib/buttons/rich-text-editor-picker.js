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
     * Store tag name to make it easier to obtain directly.
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
          .options="${this.options}"
          @mouseover="${this._pickerFocus}"
          @keydown="${this._pickerFocus}"
          @value-changed="${this._pickerChange}"
          tabindex="0"
          ?title-as-html="${this.titleAsHtml}"
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
         * command used for document.execCommand.
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
         * Renders html as title. (Good for titles with HTML in them.)
         */
        titleAsHtml: {
          type: Boolean
        },

        /**
         * value of elected options
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
      this.titleAsHtml = false;
      this.value = null;
    }

    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
      this._setOptions();
    }

    /**
     * Handles button tap
     * @param {event} e the button tap event
     */
    _pickerFocus(e) {
      e.preventDefault();
      ////console.log('_pickerFocus');
      //this.range = this.__selection.range;
    }

    /**
     * determines value of picker based on selected range
     *
     * @param {object} text selected range
     * @returns {boolean} whether button is toggled
     *
     */
    get isToggled() {
      return false;
    }

    /**
     * handles range changes by getting
     */
    _rangeChanged() {
      let val = this._getSelection();
      //console.log('_rangeChanged',val);
      if (this.shadowRoot) {
        if (this.blockSelectors.split(",").includes(val)) {
          this.shadowRoot.querySelector("#button").value = val;
          //console.log('_rangeChanged block',this.blockSelectors,this.shadowRoot.querySelector("#button").value);
        } else if (!this.range || this.range.collapsed) {
          this.shadowRoot.querySelector("#button").value = null;
          //console.log('_rangeChanged inline',this.shadowRoot.querySelector("#button").value);
        }
      }
      super._rangeChanged();
    }

    /**
     * override to handle custom options
     */
    _setOptions() {
      return (this.options = this._setPickerOptions());
    }

    /**
     * gets a list of icons and load them in a format
     * that simple-picker can take;
     * if no icons are provided, loads a list from iron-meta
     *
     * @param {array} a list of custom icons for picker
     * @returns {array}
     */
    _setPickerOptions(options = this.options || []) {
      let items = [],
        cols =
          Math.sqrt(options.length) < 11
            ? Math.ceil(Math.sqrt(options.length))
            : 10;
      options.forEach((option, i) => {
        let row = Math.floor(i / cols),
          col = i - row * cols;
        if (!items[row]) items[row] = [];
        items[row][col] = option;
      });
      return items;
    }

    /**
     * Picker change
     */
    _pickerChange(e) {
      let val = this._getSelectionType() || "";
      this.commandVal = e.detail.value || "";
      console.log(
        `_pickerChange -${val || ""}-${this.commandVal || ""}-`,
        this.range
      );

      /* only update when there is an actual change */
      if (this.range && val !== this.commandVal) {
        this.setRange();
        console.log(
          `_pickerChange 2 -${val || ""}-${this.commandVal || ""}-`,
          this.range
        );
        this.execCommand();
      }
      console.log(
        `_pickerChange 2 -${val || ""}-${this.commandVal || ""}-`,
        this.range
      );
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
