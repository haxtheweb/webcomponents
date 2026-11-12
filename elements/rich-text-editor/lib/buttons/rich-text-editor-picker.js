/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { RichTextEditorButtonBehaviors } from "./rich-text-editor-button.js";
import "@haxtheweb/simple-picker/simple-picker.js";

/**
 * RichTextEditorPickerBehaviors
 *
 * @customElement
 * @class
 * @lit-html
 * @lit-element
 * @extends RichTextEditorButtonBehaviors
 */
const RichTextEditorPickerBehaviors = function (SuperClass) {
  return class extends RichTextEditorButtonBehaviors(SuperClass) {
    /**
     * Store tag name to make it easier to obtain directly.
     */
    static get tag() {
      return "rich-text-editor-picker";
    }

    static get styles() {
      return [
        super.styles,
        css`
          :host {
            align-items: center;
            --simple-picker-background-color: var(--simple-toolbar-button-bg);
            --simple-picker-color-active: var(
              --simple-toolbar-button-hover-color
            );
            --simple-picker-background-color-active: var(
              --simple-toolbar-button-hover-bg
            );
            --simple-picker-color-disabled: var(
              --simple-toolbar-button-disabled-color
            );
            --simple-picker-background-color-disabled: var(
              --simple-toolbar-button-disabled-bg
            );
            --simple-picker-border-radius: 0px;
            --simple-picker-border-width: 0px;
            --simple-picker-option-size: calc(
              24px - 2 * var(--simple-picker-sample-padding, 2px)
            );
            --simple-picker-icon-size: 16px;
            --simple-picker-options-border-width: 1px;
            --simple-picker-options-border: var(
                --simple-picker-options-border-width,
                1px
              )
              solid
              var(
                --simple-toolbar-border-color,
                var(--rich-text-editor-border-color, #ddd)
              );
          }
          #button {
            margin-top: 0;
            margin-bottom: 0;
          }
          /* the listbox is the picker's keyboard control; its ring matches
             the rest of the HAX UI (sky blue, 3:1 or more on light and dark) */
          #button::part(input):focus-visible {
            outline: var(--ddd-border-size-sm, 2px) solid
              var(--ddd-theme-default-skyBlue, #009cde);
            outline-offset: -2px;
          }
          #button.hide-label::part(label) {
            position: absolute;
            left: -999999px;
            top: 0;
            width: 0px;
            height: 0px;
            overflow: hidden;
          }
        `,
      ];
    }

    render() {
      return html`
        <simple-picker
          id="button"
          ?allow-null="${this.allowNull}"
          class="rtebutton ${this.labelVisibleClass}-label ${
            this.toggled ? "toggled" : ""
          }"
          ?disabled="${this.disabled}"
          ?hide-null-option="${this.hideNullOption}"
          .controls="${super.controls}"
          .options="${this.options}"
          @mouseover="${this._pickerFocus}"
          @keydown="${this._pickerFocus}"
          .label="${this.currentLabel}"
          @value-changed="${this._pickerChange}"
          ?title-as-html="${this.titleAsHtml}"
          .value="${this.value}"
        >
        </simple-picker>
        ${super.tooltipTemplate}
      `;
    }

    static get properties() {
      return {
        ...super.properties,
        /**
         * Allow a null option to be selected?
         */
        allowNull: {
          type: Boolean,
        },
        /**
         * Hide the null option
         */
        disabled: {
          type: Boolean,
          reflect: true,
          attribute: "disabled",
        },
        /**
         * command used for globalThis.document.execCommand.
         */
        command: {
          type: String,
        },
        /**
         * Hide the null option
         */
        hideNullOption: {
          type: Boolean,
        },
        /**
         * Optional icon for null value
         */
        icon: {
          type: String,
          reflect: true,
        },

        /**
         * Renders html as title. (Good for titles with HTML in them.)
         */
        titleAsHtml: {
          type: Boolean,
        },

        /**
         * value of elected options
         */
        value: {
          type: Object,
        },
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

    willUpdate(changedProperties) {
      if (super.willUpdate) super.willUpdate(changedProperties);
      // Build the picker options on the first update (in willUpdate, before
      // render) so the reactive `options` set inside _setOptions() batches
      // into the current cycle. Calling _setOptions() from firstUpdated set a
      // reactive prop post-render and scheduled a redundant second update
      // (Lit change-in-update warning). Subclasses override _setOptions()
      // (heading-picker, alignment-picker) and their overrides run here too.
      if (!this.hasUpdated) {
        this._setOptions();
      }
    }
    firstUpdated(changedProperties) {
      super.firstUpdated(changedProperties);
    }

    /**
     * overrides RichTextEditorButtonBehaviors
     * toggle button behaviors
     *
     * @param {object} text selected range
     * @returns {boolean} whether button is toggled
     *
     */
    get isToggled() {
      return false;
    }

    get labelVisibleClass() {
      return this.icon ? "hide" : "show";
    }

    get picker() {
      return this.shadowRoot && this.shadowRoot.querySelector("#button")
        ? this.shadowRoot.querySelector("#button")
        : undefined;
    }

    get expanded() {
      return this.picker && this.picker.expanded;
    }

    /**
     * handles picker focus
     * @param {event} e the button tap event
     */
    _pickerFocus(e) {
      // Tab and Shift+Tab are never taken: the browser moves focus out of
      // the picker as it does for every other toolbar button
      if (e && e.type === "keydown" && (e.key === "Tab" || e.keyCode === 9)) {
        return;
      }
      // with the list open, the arrow keys, Home and End move between its
      // options, so a surrounding toolbar must not also use them to move to
      // another toolbar item
      if (
        e &&
        e.type === "keydown" &&
        this.expanded &&
        [35, 36, 38, 40].includes(e.keyCode)
      ) {
        e.stopPropagation();
      }
      e.preventDefault();
    }

    /**
     * the picker's keyboard control is the simple-picker's listbox, which
     * is what receives arrow keys and Space; focusing the simple-picker host
     * instead would leave the picker unable to open from the keyboard
     */
    get focusableElement() {
      let picker = this.picker;
      if (picker && picker.shadowRoot) {
        let listbox = picker.shadowRoot.querySelector("#listbox");
        if (listbox) return listbox;
      }
      return picker;
    }

    updated(changedProperties) {
      if (super.updated) super.updated(changedProperties);
      this._syncPickerTabindex();
    }

    /**
     * One Tab stop per picker: the simple-picker's listbox (the host is not
     * focusable). Inside a simple-toolbar only the current item is a stop
     * (roving tabindex, arrow keys move between items), the same as every
     * other toolbar button. The listbox's own tabindex is set rather than one
     * on the host, because changing a host's tabindex while its listbox holds
     * focus makes the browser drop that focus.
     */
    async _syncPickerTabindex() {
      let picker = this.picker;
      if (!picker) return;
      if (!picker.shadowRoot || !picker.shadowRoot.querySelector("#listbox")) {
        if (picker.updateComplete) await picker.updateComplete;
        if (!picker.shadowRoot) return;
      }
      let listbox = picker.shadowRoot.querySelector("#listbox");
      if (listbox && listbox.tabIndex !== this.innerTabindex) {
        listbox.tabIndex = this.innerTabindex;
      }
    }

    /**
     * handles range changes by getting
     */
    _rangeChanged() {
      this._setRangeValue();
      super._rangeChanged();
    }

    /**
     * sets picker's value based ion current selected range
     */
    _setRangeValue() {
      let val = this._getSelection();
      if (this.shadowRoot) {
        if (this.tagsArray.includes(val)) {
          this.shadowRoot.querySelector("#button").value = val;
        } else if (!this.range || this.range.collapsed) {
          this.shadowRoot.querySelector("#button").value = undefined;
        }
      }
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
      /* only update when there is an actual change */
      if (this.range && val !== this.commandVal) {
        this.sendCommand();
      }
    }
  };
};
/**
 * `rich-text-editor-picker`
 * a picker for rich text editor (custom buttons can RichTextEditorPickerBehaviors)
 *
 * @extends RichTextEditorPickerBehaviors
 * @extends LitElement
 * @customElement
 * @lit-html
 * @lit-element
 * @element rich-text-editor-picker
 * @demo ./demo/buttons.html
 */
class RichTextEditorPicker extends RichTextEditorPickerBehaviors(LitElement) {}
globalThis.customElements.define(
  RichTextEditorPicker.tag,
  RichTextEditorPicker,
);
export { RichTextEditorPicker, RichTextEditorPickerBehaviors };
