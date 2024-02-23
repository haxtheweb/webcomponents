import { LitElement, html, css } from "lit";
import { SimpleFieldsFieldBehaviors } from "./simple-fields-field.js";

/**
 *`simple-fields-combo`
 * input tags and validate an array of input
 * can return as a string or object based on
 * requirements of the implementing element
 *
 * @customElement
 * @group simple-fields
 * @class SimpleFieldsCombo
 * @extends {SimpleFieldsFieldBehaviors(LitElement)}
 * @demo ./demo/index.html Demo
 */
class SimpleFieldsCombo extends SimpleFieldsFieldBehaviors(LitElement) {
  static get tag() {
    return "simple-fields-combo";
  }
  static get styles() {
    return [
      super.styles,
      css`
        :host([expanded]) {
          overflow: visible;
        }
        :host(:focus-within),
        :host(:hover),
        ul:hover,
        li:hover {
          z-index: 2;
        }
        .input-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 1 1 100%;
        }
        .box-input {
          flex: 1 1 auto;
        }
        ul[role="listbox"] {
          opacity: 0;
          position: absolute;
          list-style: none;
          max-height: var(--simple-fields-combo-max-height, 12em);
          max-width: 100%;
          left: 0;
        }
        :host([align-right]) ul[role="listbox"] {
          right: 0;
          left: unset;
        }
        :host([justify]) ul[role="listbox"] {
          right: 0;
          left: 0;
        }
        :host([expanded]:hover) ul[role="listbox"],
        :host([expanded]:focus-within) ul[role="listbox"] {
          opacity: 1;
        }

        ul[role="listbox"] li[role="option"] {
          margin: 0;
          padding: 0;
          padding-left: 0.125em;
          border-top: 1px solid transparent;
          border-bottom: 1px solid transparent;
          background-color: var(--simple-fields-background-color, white);
        }

        [role="listbox"] [role="option"] {
          display: block;
          margin: 0.25em;
          padding: 0;
          font-size: 100%;
        }

        [role="listbox"] [role="option"][aria-selected="true"] {
          background-color: var(--simple-fields-active-color, #eeeeee);
        }

        [role="listbox"].focus [role="option"][aria-selected="true"] {
          background-color: var(--simple-fields-accent-color-light, #d9eaff);
          border-color: var(--simple-fields-accent-color, #3f51b5);
        }

        [role="listbox"] li[role="option"]:hover {
          background-color: var(--simple-fields-accent-color-light, #d9eaff);
        }
        ::slotted([slot="prefix"]:not(:empty)) {
          margin-right: 0.25em;
        }
        ::slotted([slot="suffix"]:not(:empty)) {
          margin: 0 0.25em;
        }
      `,
    ];
  }

  static get properties() {
    return {
      ...super.properties,
      /**
       * id of active option
       */
      activeDescendant: {
        type: String,
      },
      /**
       * whether listbox is aligned on the right edge
       */
      alignRight: {
        type: Boolean,
        reflect: true,
        attribute: "align-right",
      },
      /**
       * whether listbox is expanded
       */
      expanded: {
        type: Boolean,
        reflect: true,
      },
      /**
       * whether listbox is full-width
       */
      justify: {
        type: Boolean,
        reflect: true,
      },
      /**
       * input text to filter listbox options
       */
      filter: {
        type: String,
      },
      /**
       * aray of filtered listbox options
       */
      filteredOptions: {
        type: Array,
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
       * whether list has focus
       */
      listFocus: {
        type: Boolean,
      },
      /**
       * whether list is hovered
       */
      listHover: {
        type: Boolean,
      },
      hoveredOption: {
        type: Object,
      },
    };
  }
  constructor() {
    super();
    this.expanded = false;
    this.filter = "";
    this.filteredOptions = [];
    this.inputFocus = false;
    this.inputHover = false;
    this.isNone = true;
    this.isList = false;
    this.isBoth = false;
    this.listFocus = false;
    this.listHover = false;
    this.option = false;
    this.autocomplete = "none";
  }
  get stateInfo() {
    return {
      activeDescendant: this.activeDescendant,
      filteredOptions: this.filteredOptions,
      filter: this.filter,
      option: this.option,
      _selectedOption: this._selectedOption,
      value: this.value,
      firstOption: this.firstOption,
      lastOption: this.lastOption,
      input: !this.input ? false : this.input.value,
    };
  }
  get fieldElementTag() {
    return "input";
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) super.firstUpdated(changedProperties);
    this.filter = !!this.value ? this.value : "";
    this.filterOptions(this.filter, this.option);
  }

  updated(changedProperties) {
    if (super.updated) super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "autocomplete") this.autocompleteChanged();
      if (propName === "value" && this.value !== oldValue)
        this.fieldValueChanged();
      if (propName === "itemsList" || propName === "options")
        this.filterOptions(this.filter, this.option);
    });
  }

  fieldValueChanged() {
    if (this.input && this.input.value !== this.value)
      this.input.value = this.value;
    this._fireValueChanged();
  }

  autocompleteChanged() {
    if (typeof this.autocomplete === "string") {
      let autocomplete = this.autocomplete.toLowerCase();
      this.isNone = autocomplete === "none";
      this.isList = autocomplete === "list";
      this.isBoth = autocomplete === "both";
    } else {
      this.isNone = true;
    }
  }

  get inputTemplate() {
    return html`
      <input
        .aria-activedescendant="${this.activeDescendant}"
        .aria-autocomplete="${this.autocomplete}"
        .aria-descrbedby="${this.describedBy}"
        .aria-expanded="${this.expanded}"
        aria-haspopup="true"
        .aria-invalid="${this.error ? "true" : "false"}"
        .aria-owns="${this.id}-list"
        ?autofocus="${this.autofocus}"
        @blur="${this._onInputBlur}"
        @change="${this._handleFieldChange}"
        class="field box-input ${this.inputFocus ? "focus" : ""}"
        @click="${this._onInputClick}"
        ?disabled="${this.disabled}"
        @focus="${this._onInputFocus}"
        @paste="${this._onInputPaste}"
        id="${this.id}"
        @keydown="${this._onInputKeydown}"
        @keyup="${this._onInputKeyup}"
        name="${this.id}"
        .placeholder="${this.placeholder || ""}"
        part="option-input"
        ?readonly="${this.readonly}"
        ?required="${this.required}"
        tabindex="0"
        type="text"
        value="${this.value || ""}"
      />
    `;
  }

  get expandButtonTemplate() {
    return html`
      <simple-icon-button-lite
        icon="arrow-drop-down"
        ?hidden="${this.sortedOptions.length < 1}"
        label="open"
        @click="${this._onButtonClick}"
        part="option-icon"
        tabindex="-1"
      >
      </simple-icon-button-lite>
    `;
  }

  get listboxTemplate() {
    return html`
      <ul
        .aria-labelledBy="${this.fieldId}-label"
        class="${this.listFocus ? "focus" : ""}"
        data-items="${this.itemsList.join()}"
        data-options="${this.filteredOptions
          .map((option) => option.value)
          .join()}"
        ?hidden="${this.isListboxHidden}"
        id="${this.id}-list"
        @mouseout="${this._onListboxMouseout}"
        @mouseover="${this._onListboxMouseover}"
        role="listbox"
        part="listbox"
      >
        ${this.listboxInnerTemplate}
      </ul>
    `;
  }

  get listboxInnerTemplate() {
    return (this.filteredOptions || []).map((option) =>
      this.getListItem(option),
    );
  }

  /**
   * determines if listbox is hidden
   *
   * @readonly
   * @memberof SimpleFieldsCombo
   */
  get isListboxHidden() {
    return this.hidden || !this.expanded || this.filteredOptions.length < 1;
  }

  getListItem(option) {
    return html`
      <li
        aria-selected="${this._isSelected(option)}"
        id="option${option.id}"
        role="option"
        part="listbox-li"
        @click="${(e) => this._onOptionClick(e, option)}"
        @mouseout="${(e) => this._onOptionMouseout(e, option)}"
        @mouseover="${(e) => this._onOptionMouseover(e, option)}"
      >
        ${this.getListItemInner(option)}
      </li>
    `;
  }

  getListItemInner(option) {
    return option.value;
  }

  /**
   * template label and field
   *
   * @readonly
   * @returns {object}
   * @memberof SimpleFieldsField
              @input="${this._handleFieldChange}"
   */
  get fieldMainTemplate() {
    return html`
      <div class="field-main" part="field-main" ?hidden="${this.hidden}">
        ${this.labelTemplate}
        <div id="field-main-inner" part="field-main-inner">
          ${this.prefixTemplate}
          <span class="input-option" part="option-inner">
            ${this.inputTemplate} ${this.suffixTemplate}
            ${this.expandButtonTemplate}
          </span>
          ${this.listboxTemplate}
        </div>
      </div>
    `;
  }

  get hasOptions() {
    return this.filteredOptions.length > 0;
  }
  /**
   * sets aria-activeDescendant
   *
   * @param {object} option
   * @memberof SimpleFieldsCombo
   */
  setActiveDescendant(option) {
    if (option && this.listFocus) {
      this.activeDescendant = `option${option.id}`;
    } else {
      this.activeDescendant = "";
    }
  }
  /**
   * sets the combobox value
   *
   * @param {*} value
   * @memberof SimpleFieldsCombo
   */
  setValue(value) {
    this.filter = value;
    this.input.setSelectionRange(this.filter.length, this.filter.length);
    if (this.isList || this.isBoth) {
      this.filterOptions(this.filter, this.option);
    }
  }
  /**
   * sets the selected option
   *
   * @param {object} option
   * @param {string} flag
   * @memberof SimpleFieldsCombo
   */
  setOption(option, flag = false) {
    if (option) {
      this.option = option;
      this.setCurrentOptionStyle(this.option);
      this.setActiveDescendant(this.option);

      if (this.isBoth) {
        this.value = this.option.value;
        this.input.value = this.option.value;
        if (flag) {
          setTimeout(() => {
            this.input.setSelectionRange(
              option.value.length,
              option.value.length,
            );
          }, 0);
        } else {
          setTimeout(() => {
            this.input.setSelectionRange(
              this.filter.length,
              option.value.length,
            );
          }, 0);
        }
      }
    }
  }
  /**
   * switches focus to input
   *
   * @memberof SimpleFieldsCombo
   */
  setVisualFocusTextbox() {
    this.listFocus = false;
    this.inputFocus = true;
    this.setActiveDescendant(false);
  }
  /**
   * switches focus to listbox
   *
   * @memberof SimpleFieldsCombo
   */
  setVisualFocusListbox() {
    this.inputFocus = false;
    this.listFocus = true;
    this.setActiveDescendant(this.option);
  }
  /**
   * switches focus from text box and listbox
   *
   * @memberof SimpleFieldsCombo
   */
  removeVisualFocusAll() {
    this.inputFocus = false;
    this.listFocus = true; //??
    this.option = false;
    this.setActiveDescendant(false);
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
    this.input.focus();
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
    if (!!this.hoveredOption) return;
    this.listFocus = false;
    this.setCurrentOptionStyle(null);
    this.removeVisualFocusAll();
    setTimeout(this.close(false), 300);
  }

  _onInputPaste(e) {
    clearTimeout(this.__debounce);
    this.__debounce = setTimeout(() => {
      this.value = this.input.value;
    }, 0);
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
    this.setCurrentOptionStyle(null);
  }
  /**
   * handles input keydown
   *
   * @param {event} event
   * @memberof SimpleFieldsCombo
   */
  _onInputKeydown(event) {
    clearTimeout(this.__debounce);
    this.__debounce = setTimeout(() => {
      this.value = this.input.value;
    }, 300);
    var flag = false,
      altKey = event.altKey;

    switch (event.keyCode) {
      case this.keyCode.RETURN:
        if ((this.listFocus || this.isBoth) && this.option) {
          this.setValue(this.option.value);
        }
        this.close(true);
        flag = true;
        break;

      case this.keyCode.DOWN:
        if (this.hasOptions) {
          if (this.listFocus || (this.isBoth && this.option)) {
            this.setOption(this.nextItem, true);
          } else {
            this.open();
            if (!altKey) {
              this.setOption(this.firstItem, true);
            }
          }
          this.setVisualFocusListbox();
        }
        flag = true;
        break;

      case this.keyCode.UP:
        if (this.hasOptions) {
          if (this.listFocus || (this.isBoth && this.option)) {
            this.setOption(this.previousItem, true);
          } else {
            this.open();
            if (!altKey) {
              this.setOption(this.lastItem, true);
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
        if (this.listFocus) {
          if (this.option) {
            this.setValue(this.option.value);
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
      }),
    );

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
        this.setCurrentOptionStyle(false);
        this.option = false;
        flag = true;
        break;

      case this.keyCode.LEFT:
      case this.keyCode.RIGHT:
      case this.keyCode.HOME:
      case this.keyCode.END:
        if (this.isBoth) {
          this.filter = this.input.value;
        } else {
          this.option = false;
          this.setCurrentOptionStyle(false);
        }

        this.setVisualFocusTextbox();
        flag = true;
        break;

      default:
        if (isPrintableCharacter(char)) {
          this.setVisualFocusTextbox();
          this.setCurrentOptionStyle(false);
          flag = true;
        }

        break;
    }

    if (event.keyCode !== this.keyCode.RETURN) {
      if (this.isList || this.isBoth) {
        option = this.filterOptions(this.filter, this.option);
        if (option) {
          if (!this.expanded && (this.input.value || "").length) this.open();

          if (
            option.textComparison.indexOf(
              (this.input.value || "").toLowerCase(),
            ) === 0
          ) {
            this.option = option;
            if (this.isBoth || this.listFocus) {
              this.setCurrentOptionStyle(option);
              if (this.isBoth && isPrintableCharacter(char)) {
                this.setOption(option);
              }
            }
          } else {
            this.option = false;
            this.setCurrentOptionStyle(false);
          }
        } else {
          this.close();
          this.option = false;
          this.setActiveDescendant(false);
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
   * gets a sorted list of option
   *
   * @readonly
   * @memberof SimpleFieldsField
   */
  get sortedOptions() {
    let sorted = (this.itemsList || []).map((item, i) =>
      typeof item === "object" ? item : { id: i, value: item },
    );
    Object.keys(this.options || {})
      .sort((a, b) => (a > b ? 1 : -1))
      .forEach((key) =>
        sorted.push({ id: sorted.length, value: this.options[key] }),
      );
    return sorted;
  }
  /**
   * updates options list
   *
   * @param {event} event
   * @memberof SimpleFieldsCombo
   */
  filterOptions(filter, currentOption) {
    if (typeof filter !== "string") {
      filter = "";
    }

    var firstMatch = false,
      i,
      option,
      textContent,
      numItems;

    filter = filter.toLowerCase();

    this.filteredOptions = [];
    this.firstChars = [];

    for (i = 0; i < this.sortedOptions.length; i++) {
      option = this.sortedOptions[i];
      option.id = i;
      option.textComparison = option.value.toLowerCase();
      if (filter.length === 0 || option.textComparison.indexOf(filter) === 0) {
        this.filteredOptions.push(option);
        textContent = option.value.trim();
        this.firstChars.push(textContent.substring(0, 1).toLowerCase());
      }
    }

    // Use populated.filteredOptions array to initialize firstOption and lastOption.
    numItems = this.filteredOptions.length;
    if (numItems > 0) {
      this.firstOption = this.filteredOptions[0];
      this.lastOption = this.filteredOptions[numItems - 1];
      let filteredText = this.filteredOptions.map((o) => o.textComparison);
      if (
        currentOption &&
        currentOption.textComparison &&
        filteredText.includes(currentOption.textComparison)
      ) {
        option = currentOption;
      } else {
        option = this.firstOption;
      }
    } else {
      this.firstOption = false;
      option = false;
      this.lastOption = false;
    }
    return option;
  }

  setCurrentOptionStyle(option) {
    this._selectedOption = option;
    if (
      !!this.listbox &&
      !!option &&
      !!this.shadowRoot &&
      !!this.shadowRoot.querySelector(`#option${option.id}`)
    )
      this.listbox.scrollTop = this.shadowRoot.querySelector(
        `#option${option.id}`,
      ).offsetTop;
  }
  _isSelected(option) {
    return option &&
      this._selectedOption &&
      option.textComparison === this._selectedOption.textComparison
      ? "true"
      : "false";
  }
  _onListboxMouseover(event) {
    this.listHover = true;
  }
  _onListboxMouseout(event) {
    this.listHover = false;
    this.hoveredOption = undefined;
    setTimeout(this.close(false), 300);
  }
  open() {
    if (!this.expanded) this.expanded = true;
  }
  close(force) {
    //return;
    if (typeof force !== "boolean") {
      force = false;
    }

    if (force || (!this.inputFocus && !this.hasHover && !this.hasHover)) {
      this.setCurrentOptionStyle(false);
      this.expanded = false;
      this.setActiveDescendant(false);
    }
  }
  _onOptionClick(e, option) {
    if (option) {
      this.setOption(option);
      this.setValue(option.value);
    }
    this.close(true);
  }
  _onOptionMouseover(e, option) {
    this.hoveredOption = option;
    this.listHover = true;
    this.open();
  }
  _onOptionMouseout(e, option) {
    this.listHover = false;
    this.hoveredOption = undefined;
    setTimeout(this.close(false), 300);
  }

  get previousItem() {
    var index,
      optionText = !this.option ? undefined : this.option.textComparison,
      firstText = !this.firstOption
        ? undefined
        : this.firstOption.textComparison,
      filteredtext = this.filteredOptions.map((o) => o.textComparison);
    if (optionText !== firstText) {
      index = filteredtext.indexOf(optionText);
      return this.filteredOptions[index - 1];
    }
    return this.lastOption;
  }
  get nextItem() {
    var index,
      optionText = !this.option ? undefined : this.option.textComparison,
      lastText = !this.lastOption ? undefined : this.lastOption.textComparison,
      filteredtext = this.filteredOptions.map((o) => o.textComparison);
    if (optionText !== lastText) {
      index = filteredtext.indexOf(optionText);
      return this.filteredOptions[index + 1];
    }
    return this.firstOption;
  }
  get listbox() {
    if (!this._listbox)
      this._listbox =
        this.shadowRoot && this.shadowRoot.querySelector(`#${this.id}-list`)
          ? this.shadowRoot.querySelector(`#${this.id}-list`)
          : undefined;
    return this._listbox;
  }
  get input() {
    if (!this._input)
      this._input = this.field
        ? this.field
        : this.shadowRoot && this.shadowRoot.querySelector(`#${this.id}`)
          ? this.shadowRoot.querySelector(`#${this.id}`)
          : undefined;
    return this._input;
  }
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
}
customElements.define(SimpleFieldsCombo.tag, SimpleFieldsCombo);
export { SimpleFieldsCombo };
