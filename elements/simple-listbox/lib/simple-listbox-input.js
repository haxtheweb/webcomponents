import { LitElement, html, css } from "lit";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import { SimpleListbox, SimpleListboxProperties } from "@lrnwebcomponents/simple-listbox/simple-listbox.js";

const SimpleListboxInputProperties = {
  ...SimpleListboxProperties,
  /**
   * whether listbox is positioned above the input
   */
  position: {
    type: String,
    attribute: "position",
  },
  /**
   * whether listbox is aligned on the right edge
   */
  positionAlign: {
    type: Boolean,
    attribute: "position-align",
  },
  /**
   * Hint for form autofill feature: "none", "inline", "both", "list"
   */
  autocomplete: {
    type: String,
    attribute: "autocomplete",
  },
  /**
   * whether listbox is expanded
   */
  expanded: {
    type: Boolean,
    reflect: true,
  },
  /**
   * hover state pegged to attribute
   */
  hovered: {
    type: Boolean,
    reflect: true,
  },
  /**
   * whether input has focus
   */
  inputFocus: {
    type: Boolean,
  },
  /**
   * whether input is hovered
   */
  inputHover: {
    type: Boolean,
  },
  /**
   * whether listbox is full-width
   */
  justify: {
    type: Boolean,
    reflect: true,
  },
  /**
   * whether input has focus
   */
  listboxFocus: {
    type: Boolean,
  },
  /**
   * whether input is hovered
   */
  listboxHover: {
    type: Boolean,
  },
  /**
   * options {value: "Text"}  for select, radio options, and checkboxes,
   * which are sorted by key,
   * eg. {a: "Option A", b: "Option B", c: "Option C"}
   */
  options: {
    type: Object,
  },
  /**
   * Content to be appear in the form control when the form control is empty
   */
  placeholder: {
    attribute: "placeholder",
    type: String,
    reflect: true
  },
  /**
   * if options are grouped, displays them as tabs
   */
  tabs: {
    attribute: "tabs",
    type: Boolean,
    reflect: true,
  },
  /**
   * Value is not editable
   */
  readonly: {
    type: Boolean,
    reflect: true,
  },
  /**
   * Whether field is required
   */
  required: {
    type: Boolean,
    reflect: true,
  }
};

const SimpleListboxInputStyles = [
  css`
    :host {
      display: inline-block;
      overflow: hidden;
    }
    :host([expanded]) {
      overflow: auto;
    }
    :host([expanded]),
    :host(:hover) {
      z-index: 2;
    }
    :host([expanded]:focus-within) {
      z-index: 3;
    }
    #field {
      display: flex;
      align-items: center;
    }
    input {
      flex: 1 1 auto;
      padding-right: calc(2px + var(--simple-icon-height, 24px));
      min-height: calc(var(--simple-icon-height, 24px) - 4px);
      line-height: calc(var(--simple-icon-height, 24px) - 4px);
    }
    simple-icon-button-lite {
      margin-left: calc(-2px - var(--simple-icon-height, 24px));
      margin-right: 2px;
    }
    simple-listbox {
      display:none;
      max-width: 300px;
      background-color: white;
    }
    :host([expanded]) simple-listbox {
      display:inline-block;
    }
  `
];

const SimpleListboxInputBehaviors = function (SuperClass) {
  return class extends SuperClass {
    static get styles() {
      return [
        ...(super.styles ? super.styles : []),
        ...SimpleListboxInputStyles,
      ];
    }
  
    static get properties() {
      return {
        ...(super.properties ? super.properties : {}),
        ...SimpleListboxInputProperties,
      };
    }
    constructor() {
      super();
      this.filter = "";
      this.filteredOptions = [];
      this.autocomplete = "both";
    }

    render(){
      return html`
        <div 
          id="field"
          part="field-outer">
          ${this.fieldTemplate}
        </div>
        ${this.listboxTemplate}
      `;
    }

    /**
     * template for field element
     *
     * @readonly
     */
    get fieldTemplate(){
      return html`
          ${this.inputTemplate}
          ${this.expandButtonTemplate}`;
    }

    /**
     * template for simple-lsitbox element
     *
     * @readonly
     */
    get listboxTemplate(){
      return html`<simple-listbox 
        id="listbox"
        for="field" 
        auto
        demo-mode="${this.demoMode}"
        filter="${this.filter}"
        fit-to-visible-bounds 
        ?hidden="${this.listboxHidden}"
        part="listbox-outer"
        position="${this.position || "bottom"}" 
        position-align="${this.positionAlign | "start"}"
        ?justify="${this.justify}"
        .items-list="${this.itemsList}"
        @value-changed="${this.suggestOption}"
        @mouseover="${this._onListboxMouseover}"
        @mouseover="${this._onListboxMouseout}">
      </simple-listbox>`;
    }
  
    /**
     * template for input element
     *
     * @readonly
     */
    get inputTemplate() {
      return html`
        <input
          .aria-activedescendant="${this.activeDescendant}"
          .aria-autocomplete="${this.autocomplete}"
          .aria-descrbedby="${this.describedBy}"
          .aria-expanded="${this.expanded}"
          aria-haspopup="true"
          .aria-invalid="${this.error ? "true" : "false"}"
          .aria-owns="listbox"
          ?autofocus="${this.autofocus}"
          @blur="${this._onInputBlur}"
          @change="${this._handleFieldChange}"
          class="input ${this.inputFocus ? "focus" : ""}"
          @click="${this._onInputClick}"
          ?disabled="${this.disabled}"
          @focus="${this._onInputFocus}"
          @keydown="${this._onInputKeydown}"
          @keyup="${this._onInputKeyup}"
          .placeholder="${this.placeholder || ""}"
          part="option-input"
          ?readonly="${this.readonly}"
          ?required="${this.required}"
          tabindex="0"
          type="text"
          value="${this.inputText}"
        />
        <input type="hidden" value="${this.value}">
      `;
    }
    /**
     * gets text for input box
     *
     * @readonly
     */
    get inputText(){
      let option = (this.sortedOptions || []).filter(o=>o.value === this.value), 
        val = option && option[0] ? (option[0].text || option[0].value) : undefined;
      return typeof val !== typeof undefined ? val : '';

    }
    /**
     * template for button to expand listbox
     *
     * @readonly
     */
    get expandButtonTemplate() {
      return html`
        <simple-icon-button-lite
          icon="arrow-drop-down"
          ?hidden="${this.buttonHidden}"
          label="open"
          @click="${this._onButtonClick}"
          part="option-icon"
          tabindex="-1"
          controls="listbox"
        >
        </simple-icon-button-lite>
      `;
    }
  
    /**
     * whether expand button is currently hidden
     *
     * @readonly
     * @memberof SimpleFieldsCombo
     */
    get buttonHidden() {
      return this.hidden || !this.listbox || !this.listbox.hasOptions || !this.isList;
    }
  
    /**
     * whether listbox is currently hidden
     *
     * @readonly
     * @memberof SimpleFieldsCombo
     */
    get listboxHidden() {
      return !this.expanded || this.buttonHidden;
    }
    /**
     * an object containing proerty info that can be used for debugging
     *
     * @readonly
     */
    get stateInfo() {
      return {
        filter: this.filter,
        value: this.value,
        inputValue: !this.input ? false : this.input.value,
      };
    }
    /**
     * whether autocomplete includes a list
     *
     * @readonly
     */
    get isList(){
      return this.autocomplete !== "none" && this.autocomplete !== "inline";
    }
    /**
     * whether autocomplete includes inlune suggestions
     *
     * @readonly
     */
    get isInline(){
      return this.autocomplete !== "none" && this.autocomplete !== "list";
    }
    /**
     * listbox element from shadowRoot
     *
     * @readonly
     */
    get listbox() {
      if (!this._listbox)
        this._listbox =
          this.shadowRoot && this.shadowRoot.querySelector(`simple-listbox`)
            ? this.shadowRoot.querySelector(`simple-listbox`)
            : undefined;
      return this._listbox;
    }

    /**
     * input element from shadowRoot
     *
     * @readonly
     */
    get input() {
      if (!this._input)
        this._input = this.field
          ? this.field
          : this.shadowRoot && this.shadowRoot.querySelector(`input`)
          ? this.shadowRoot.querySelector(`input`)
          : undefined;
      return this._input;
    }
  
    firstUpdated(changedProperties) {
      if (super.firstUpdated) super.firstUpdated(changedProperties);
      this.filter = !!this.value ? this.value : "";
    }
  
    updated(changedProperties) {
      if (super.updated) super.updated(changedProperties);
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "expanded" && this.listbox) this.listbox.updatePosition();
        if (propName === "value" && this.value !== oldValue)
          this.fieldValueChanged();
      });
    }
    /**
     * handles change to input field
     */
    fieldValueChanged() {
      if (this.input && this.input.value !== this.inputText)
        this.input.value = this.inputText;
      this._fireValueChanged();
    }

    /**
     * fires when value changes
     * @event value-changed
     */
    _fireValueChanged() {
      this.dispatchEvent(
        new CustomEvent("value-changed", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        })
      );
    }
    /**
    /**
     * sets the combobox value
     *
     * @param {*} value
     * @memberof SimpleFieldsCombo
     */
    setValue(value) {
      this.filter = value;
      this.input.setSelectionRange(this.filter.length, this.filter.length);
      if (this.isList || this.isInline) {
        this.value = this.firstOption.value || '';
      }
    }

    /**
     * sets the selected option, inlcuding active descendent and input selection
     *
     * @param {object} option
     * @param {string} flag
     * @memberof SimpleFieldsCombo
     */
    suggestOption(option, flag = false) {
      if(!option || !option.value) return;
      if (this.isInline && this.isList) {
        this.value = option.value;
        this.input.value = option.value;
        if (flag) {
          //set selection at the end of value
          setTimeout(() => {
            this.input.setSelectionRange(
              option.value.length,
              option.value.length
            );
          }, 0);
        } else {
          //select suggested characters
          setTimeout(() => {
            this.input.setSelectionRange(
              this.filter.length,
              option.value.length
            );
          }, 0);
        }
      }
    }
    

    /**
     * switches focus to input
     *
     * @memberof SimpleFieldsCombo
     */
    setVisualFocusTextbox() {
      this.listboxFocus = false;
      this.inputFocus = true;
      if(this.listbox) this.listbox.setActiveDescendant(false);
    }
    /**
     * switches focus to listbox
     *
     * @memberof SimpleFieldsCombo
     */
    setVisualFocusListbox() {
      this.inputFocus = false;
      this.listboxFocus = true;
      if(this.listbox) this.listbox.setActiveDescendant(this.option);
    }
    /**
     * switches focus from text box and listbox
     *
     * @memberof SimpleFieldsCombo
     */
    removeVisualFocusAll() {
      this.inputFocus = false;
      this.listboxFocus = true; 
      this.option = false;
      if(this.listbox) this.listbox.resetActiveDescendant();
    }
    /**
     * handles the dropdown button click
     *
     * @param {event} event
     * @memberof SimpleFieldsCombo
     */
    _onButtonClick(event) {
      if (this.expanded) {
        this.close(true);
      } else {
        this.open();
      }
      this.setVisualFocusTextbox();
    }
    /**
     * handles input click
     *
     * @param {event} event
     * @memberof SimpleFieldsCombo
     */
    _onInputClick(event) {
      if (this.expanded) {
        this.close(true);
      } else {
        this.open();
      }
    }
    /**
     * handles input blur
     *
     * @param {event} event
     * @memberof SimpleFieldsCombo
     */
    _onInputBlur(event) {
      this.listboxFocus = false;
      this.removeVisualFocusAll();
      setTimeout(this.close(false), 300);
    }
    /**
     * handles input focus
     *
     * @param {event} event
     * @memberof SimpleFieldsCombo
     */
    _onInputFocus(event) {
      this.setVisualFocusTextbox();
      this.option = false;
    }
    /**
     * handles input keydown
     *
     * @param {event} event
     * @memberof SimpleFieldsCombo
     */
    _onInputKeydown(event) {
      if(!this.listbox) return;
      var flag = false,
        altKey = event.altKey;
      switch (event.keyCode) {
        case this.keyCode.RETURN:
          this.setValue(this.listbox.value);
          if ((this.listboxFocus || this.isInline) && this.listbox.option) {
            this.setValue(this.listbox.value);
          }
          this.close(true);
          flag = true;
          break;
  
        case this.keyCode.DOWN:
          if (this.hasOptions) {
            if (this.listboxFocus || (this.isInline && this.listbox.option)) {
              this.suggestOption(this.listbox.nextOption, !this.isInline);
            } else {
              this.open();
              if (!altKey) {
                this.suggestOption(this.listbox.firstOption, !this.isInline);
              }
            }
            this.setVisualFocusListbox();
          }
          flag = true;
          break;
  
        case this.keyCode.UP:
          if (this.hasOptions) {
            if (this.listboxFocus || (this.isInline && this.listbox.option)) {
              this.suggestOption(this.listbox.previousOption, !this.isInline);
            } else {
              this.open();
              if (!altKey) {
                this.suggestOption(this.listbox.lastOption, !this.isInline);
              }
            }
            this.setVisualFocusListbox();
          }
          flag = true;
          break;
  
        case this.keyCode.ESC:
          this.close(true);
          this.setVisualFocusTextbox();
          this.setValue("");
          this.option = false;
          flag = true;
          break;
  
        case this.keyCode.TAB:
          this.close(true);
          if (this.listboxFocus) {
            if (this.listbox.option) {
              this.setValue(this.listbox.value);
            }
          }
          break;
  
        default:
          break;
      }
  
      if (flag) {
        event.stopPropagation();
        event.preventDefault();
      }
    }
    /**
     * handles input keyup
     *
     * @param {event} event
     * @memberof SimpleFieldsCombo
     */
    _onInputKeyup(event) {
      this.dispatchEvent(
        new CustomEvent("combo-input-keyup", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: event,
        })
      );
      if(!this.listbox) return;
  
      var flag = false,
        option = false,
        char = event.key || "";
  
      function isPrintableCharacter(str) {
        return str.length === 1 && str.match(/\S/);
      }
  
      if (isPrintableCharacter(char)) {
        this.filter += char;
      }
  
      // this is for the case when a selection in the textbox has been deleted
      if (this.input && (this.input.value || "").length < this.filter.length) {
        this.filter = this.input.value || "";
        this.option = false;
      }
  
      if (event.keyCode === this.keyCode.ESC) {
        return;
      }
  
      switch (event.keyCode) {
        case this.keyCode.BACKSPACE:
          this.setValue(this.input.value);
          this.setVisualFocusTextbox();
          this.listbox.option = false;
          flag = true;
          break;
  
        case this.keyCode.LEFT:
        case this.keyCode.RIGHT:
        case this.keyCode.HOME:
        case this.keyCode.END:
          if (this.isInline) {
            this.filter = this.input.value;
          } else {
            this.listbox.option = false;
          }
  
          this.setVisualFocusTextbox();
          flag = true;
          break;
  
        default:
          if (isPrintableCharacter(char)) {
            this.setVisualFocusTextbox();
            flag = true;
          }
  
          break;
      }
  
      if (event.keyCode !== this.keyCode.RETURN) {
        if (this.isList || this.isInline) {
          if (
            this.listbox.option &&
            !this.listbox.option.group && 
            this.listbox.option.id 
            && this.listbox.filteredOptions.filter(o=>!!o.id).map((o) => o.id === this.listbox.option.id).length > 0
          ) {
            option = this.listbox.option;
          } else {
            option = this.firstOption;
          }

          if (option) {
            if (!this.expanded && (this.input.value || "").length) this.open();
  
            if (
              option.textComparison.filter(t=>t.indexOf(
                (this.filter.value || "").toLowerCase()
              ) === 0).length > 0
            ) {
              this.listbox.option = option;
              if (this.isInline || this.listboxFocus) {
                if (this.isInline && isPrintableCharacter(char)) {
                  this.suggestOption(option);
                }
              }
            } else {
              this.listbox.option = false;
            }
          } else {
            this.close();
            this.listbox.option = false;
            if(this.listbox) this.listbox.setActiveDescendant(false);
          }
        } else {
          if (this.input && (this.input.value || "").length) {
            this.open();
          }
        }
      }
  
      if (flag) {
        event.stopPropagation();
        event.preventDefault();
      }
    }
    /**
     * handles listbox mouseover
     * @param {event} event 
     */
    _onListboxMouseover(event) {
      this.listboxHover = true;
    }
    /**
     * handles listbox mouseout
     * @param {event} event 
     */
    _onListboxMouseout(event) {
      this.listboxHover = false;
      //wait for next action and then check if listbox should be closed
      setTimeout(this.close(false), 300);
    }
    /**
     * opens listbox if it is not open
     */
    open() {
      if (!this.expanded) this.expanded = true;
    }
    /**
     * closes listbox based is closing is intentional or automatically when no longer focused/hovered
     * @param {boolean} force whether clsoing is intentional
     */
    close(force) {
      //return;
      if (typeof force !== "boolean") {
        force = false;
      }
  
      if (force || (!this.inputFocus && !this.inputHover && !this.listboxHover )) {
        this.expanded = false;
        if(this.listbox) this.listbox.setActiveDescendant(false);
      }
    }
    /**
     * keycodes by key
     *
     * @readonly
     */
    get keyCode() {
      return {
        BACKSPACE: 8,
        TAB: 9,
        RETURN: 13,
        ESC: 27,
        SPACE: 32,
        PAGEUP: 33,
        PAGEDOWN: 34,
        END: 35,
        HOME: 36,
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
      };
    }
    /**
     * gets unicode character for an HTML entity
     * @param {string} html HTML entity
     * @returns {string}
     */
    _getUnicode(html){
        if(!html.match(/^\&\#[a-zA-Z0-9]+\;$/)) return;
        let temp = document.createElement('textarea');
        temp.innerHTML = html;
      return temp.value;
    }
  };
}
/**
 *`simple-listbox-input`
 * input tags and validate an array of input
 * can return as a string or object based on
 * requirements of the implementing element
 *
 * @customElement
 * @class SimpleListboxInput
 * @extends {SimpleListboxInputBehaviors(LitElement)}
 * @demo ./demo/index.html Overview
 * @demo ./demo/groups.html Groups of Items
 * @demo ./demo/icons.html Icons
 * @demo ./demo/emoji.html Emojis
 * @demo ./demo/symbols.html Symbols
 */
class SimpleListboxInput extends SimpleListboxInputBehaviors(LitElement) {
  static get tag() {
    return "simple-listbox-input";
  }
}
window.customElements.define(SimpleListboxInput.tag, SimpleListboxInput);
export { SimpleListboxInput, SimpleListboxInputBehaviors };
