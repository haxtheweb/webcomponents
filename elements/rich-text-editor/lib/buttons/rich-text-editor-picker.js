/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextEditorButtonBehaviors } from "./rich-text-editor-button.js";
import "@lrnwebcomponents/simple-picker/simple-picker.js";
import "../singletons/rich-text-editor-selection.js";
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
        },
        /**
         * highlight surrounding selected range
         */
        __selection: {
          name: "__selection",
          type: Object
        },
        /**
         * contents node inside selected range
         */
        __selectionContents: {
          name: "__selectionContents",
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
      this.__selection = window.RichTextEditorSelection.requestAvailability();
    }

    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
      this._setOptions();
    }

    updated(changedProperties) {
      super.updated(changedProperties);
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "options" && this.options !== oldValue) this._optionsChanged(oldValue,this.options);
        if (propName === "range" && this.range !== oldValue) this._rangeChanged(oldValue,this.range);

      });
    }

    /**
     * Handles button tap
     * @param {event} e the button tap event
     */
    _pickerFocus(e) {
      e.preventDefault();
      this.range = this.__selection.range;
      console.log('_pickerFocus',this.range);
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

    _rangeChanged() {
      super._rangeChanged();
      console.log('_rangeChanged',this.range,this.__selection.range);
      let temp = this.__selection.getAncestor(this.tag, this.range),
        tag = !!temp && !!temp.tagName ? temp.tagName.toLowerCase() : false,
        tags = this.tag.split(',');
      console.log('_rangeChanged 2',this.range,this.__selection.range,tag,tags);
      this.__selectionContents = temp;
      if(this.shadowRoot && tags.includes(tag)){
        this.shadowRoot.querySelector('#button').value = tag;
      }
      console.log('_rangeChanged 3',this.range,this.__selection.range,tag,tags);
    }

    _optionsChanged(oldVal,newVal) {
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
      this.tag = this.blocks.map(block=>block.tag).join(',');
      //this.options = this._getPickerOptions(data, this.allowNull, this.icon);
      this.options = [
        [{ alt: this.label, value: null }],
        ...this.blocks.map(block => [{ alt: block.label, value: block.tag }])
      ];
    }

    /**
     * Picker change
     */
    _pickerChange(e) {
      this.commandVal = e.detail.value;
      let tag = !!this.__selectionContents && !!this.__selectionContents.tagName ? this.__selectionContents.tagName.toLowerCase() : false;
      console.log('_pickerChange',tag,this.__selectionContents,this.range,this.__selection.range);
      if(tag && tag  !==  this.commandVal){
        if(this.__selectionContents) this.__selection.selectNode(this.__selectionContents);
        console.log('_pickerChange 2',tag,this.__selectionContents,this.range,this.__selection.range);
        document.execCommand(this.command,false,this.commandVal);
        console.log('_pickerChange 3',tag,this.range,this.__selection.range);
        this.__selection.deselectRange();
        console.log('_pickerChange 3',tag,this.range,this.__selection.range);
      }
    }

    /**
     * Picker change
     * /
    _pickerChange(e) {
      /*this.doTextOperation();
      if (this.block !== true) {
        this.shadowRoot.querySelector("#button").value = null;
      }*
    }
    /**
     * Converts option data to picker option data;
     * can be overridden in extended elements
     *
     * @param {object} data about option
     * @returns {object} picker dato for option
     */
    _getOptionData(option) {
      return {
        alt: !!option.alt ? undefined : option.alt,
        icon: !!option.icon ? undefined : option.icon,
        style: !!option.style ? undefined : option.style,
        value: !!option.value ? undefined : option.value
      };
    }

    /**
     * gets a list of icons and load them in a format
     * that simple-picker can take;
     * if no icons are provided, loads a list from iron-meta
     *
     * @param {array} a list of custom icons for picker
     * @param {array} default list of icons for picker
     * @param {boolean} allow a null value for picker
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
