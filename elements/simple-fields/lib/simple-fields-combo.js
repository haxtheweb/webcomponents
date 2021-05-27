import { LitElement, html, css } from "lit-element/lit-element.js";
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
      ...super.styles,
      css`
        :host([expanded]) {
          overflow: visible;
        }
        :host(:focus-within),
        :host(:hover),
        ul:hover,
        li:hover {
          z-index: 999999999;
        }
        .input-option {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex: 1 0 100%;
        }
        #combo {
          flex: 1 1 auto;
        }
        ul[role="listbox"] {
          margin: 0;
          padding: 0;
          right: 0;
          top: 100%;
          position: absolute;
          list-style: none;
          background-color: var(--simple-fields-background-color, white);
          color: var(--simple-fields-color, currentColor);
          border: 2px #333 solid;
          max-height: 12em;
          overflow: auto;
        }

        ul[role="listbox"] li[role="option"] {
          margin: 0;
          padding: 0;
          padding-left: 0.125em;
          border-top: 1px solid transparent;
          border-bottom: 1px solid transparent;
        }

        [role="listbox"].focus {
          border-color: var(--simple-fields-accent-color, #3f51b5);
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
       * whether listbox is expanded
       */
      expanded: {
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
    if (this.input.value !== this.value) this.input.value = this.value;
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
          <span class="input-option" part="option-inner">
            <input
              .aria-activedescendant="${this.activeDescendant}"
              .aria-autocomplete="${this.autocomplete}"
              .aria-descrbedby="${this.describedBy}"
              .aria-expanded="${this.expanded}"
              .aria-haspopup="true"
              .aria-invalid="${this.error ? "true" : "false"}"
              .aria-owns="${this.id}-list"
              ?autofocus="${this.autofocus}"
              @blur="${this._onInputBlur}"
              class="field box-input ${this.inputFocus ? "focus" : ""}"
              @click="${this._onInputClick}"
              ?disabled="${this.disabled}"
              @focus="${this._onInputFocus}"
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
              value="${this.value}"
            />
            <simple-icon-button-lite
              label="open"
              icon="arrow-drop-down"
              @click="${this._onButtonClick}"
              part="option-icon"
              tabindex="-1"
            >
            </simple-icon-button-lite>
          </span>
          <ul
            .aria-labelledBy="${this.fieldId}-label"
            class="${this.listFocus ? "focus" : ""}"
            data-items="${this.itemsList.join()}"
            data-options="${this.filteredOptions
              .map((option) => option.text)
              .join()}"
            ?hidden="${this.hidden ||
            !this.expanded ||
            this.filteredOptions.length < 1}"
            id="${this.id}-list"
            @mouseout="${this._onListboxMouseout}"
            @mouseover="${this._onListboxMouseover}"
            role="listbox"
          >
            ${(this.filteredOptions || []).map(
              (option) => html`
                <li
                  aria-selected="${this._isSelected(option)}"
                  id="${this.id}.${option.textComparison}"
                  role="option"
                  @click="${(e) => this._onOptionClick(e, option)}"
                  @mouseout="${(e) => this._onOptionMouseout(e, option)}"
                  @mouseover="${(e) => this._onOptionMouseover(e, option)}"
                >
                  ${option.text}
                </li>
              `
            )}
          </ul>
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
      this.activeDescendant = `${this.id}.${option.textComparison}`;
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
    console.log("setValue", value, this.stateInfo);
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
    console.log("setOption", option, flag, this.stateInfo);

    if (option) {
      this.option = option;
      this.setCurrentOptionStyle(this.option);
      this.setActiveDescendant(this.option);

      if (this.isBoth) {
        this.value = this.option.text;
        this.input.value = this.option.text;
        if (flag) {
          setTimeout(() => {
            this.input.setSelectionRange(
              this.option.text.length,
              this.option.text.length
            );
            console.log("place cursor at end", flag, this.stateInfo);
          }, 0);
        } else {
          setTimeout(() => {
            this.input.setSelectionRange(
              this.filter.length,
              this.option.text.length
            );
            console.log(
              "place cursor after filter",
              flag,
              window.getSelection(),
              this.filter.length,
              this.option.text.length,
              this.stateInfo
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
    //console.log('setVisualFocusTextbox',this.stateInfo);
    this.listFocus = false;
    this.inputFocus = true;
    this.setActiveDescendant(false);
    console.log("unsets desc", this.stateInfo);
  }
  /**
   * switches focus to listbox
   *
   * @memberof SimpleFieldsCombo
   */
  setVisualFocusListbox() {
    //console.log('setVisualFocusListbox',this.stateInfo);
    this.inputFocus = false;
    this.listFocus = true;
    this.setActiveDescendant(this.option);
    console.log("sets desc", this.stateInfo);
  }
  /**
   * switches focus from text box and listbox
   *
   * @memberof SimpleFieldsCombo
   */
  removeVisualFocusAll() {
    //console.log('removeVisualFocusAll',this.stateInfo);
    this.inputFocus = false;
    this.listFocus = true; //??
    this.option = false;
    this.setActiveDescendant(false);
    console.log("unsets option and active desc", this.stateInfo);
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
    //if(!!this.hoveredOption) return;
    this.listFocus = false;
    this.setCurrentOptionStyle(null);
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
    //console.log('_onInputFocus',event,this.stateInfo);
    this.setVisualFocusTextbox();
    this.option = false;
    this.setCurrentOptionStyle(null);
    console.log("unsets option", this.stateInfo);
  }
  /**
   * handles input keydown
   *
   * @param {event} event
   * @memberof SimpleFieldsCombo
   */
  _onInputKeydown(event) {
    //console.log('_onInputKeydown',event,this.stateInfo);
    var tgt = event.currentTarget,
      flag = false,
      char = event.key,
      shiftKey = event.shiftKey,
      ctrlKey = event.ctrlKey,
      altKey = event.altKey;

    switch (event.keyCode) {
      case this.keyCode.RETURN:
        if ((this.listFocus || this.isBoth) && this.option) {
          this.setValue(this.option.text);
        }
        this.close(true);
        flag = true;
        break;

      case this.keyCode.DOWN:
        console.log("DOWN", this.stateInfo);
        if (this.hasOptions) {
          if (this.listFocus || (this.isBoth && this.option)) {
            this.setOption(this.nextItem, true);
            //console.log('DOWN is nextItem',this.stateInfo);
          } else {
            this.open();
            if (!altKey) {
              this.setOption(this.firstItem, true);
              //console.log('DOWN is firstitem',this.stateInfo);
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
        //console.log('ESC',this.stateInfo);
        this.close(true);
        this.setVisualFocusTextbox();
        this.setValue("");
        this.option = false;
        flag = true;
        //console.log('ESC unset option',this.stateInfo);
        break;

      case this.keyCode.TAB:
        this.close(true);
        if (this.listFocus) {
          if (this.option) {
            this.setValue(this.option.text);
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
    //console.log('_onInputKeyup',event,this.stateInfo);
    var tgt = event.currentTarget,
      flag = false,
      option = false,
      char = event.key || "";

    function isPrintableCharacter(str) {
      return str.length === 1 && str.match(/\S/);
    }

    if (isPrintableCharacter(char)) {
      this.filter += char;
    }

    // this is for the case when a selection in the textbox has been deleted
    if (this.input.value.length < this.filter.length) {
      this.filter = this.input.value;
      //console.log('input cleared / filter reset',this.stateInfo);
      this.option = false;
    }

    if (event.keyCode === this.keyCode.ESC) {
      return;
    }

    switch (event.keyCode) {
      case this.keyCode.BACKSPACE:
        //console.log('BACKSPACE',this.stateInfo);
        this.setValue(this.input.value);
        this.setVisualFocusTextbox();
        this.setCurrentOptionStyle(false);
        this.option = false;
        flag = true;
        //console.log('unsets option',this.stateInfo);
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
      //console.log('not RETURN',this.stateInfo);

      if (this.isList || this.isBoth) {
        option = this.filterOptions(this.filter, this.option);
        //console.log('RETURN filtered',option,this.stateInfo);
        if (option) {
          if (!this.expanded && this.input.value.length) this.open();

          if (
            option.textComparison.indexOf(this.input.value.toLowerCase()) === 0
          ) {
            this.option = option;
            if (this.isBoth || this.listFocus) {
              this.setCurrentOptionStyle(option);
              if (this.isBoth && isPrintableCharacter(char)) {
                this.setOption(option);
              }
            }
            //console.log('option matches value',this.stateInfo);
          } else {
            this.option = false;
            this.setCurrentOptionStyle(false);
            //console.log('option does not match',this.stateInfo,this.input.value.toLowerCase(),option.textComparison);
          }
        } else {
          this.close();
          this.option = false;
          this.setActiveDescendant(false);
          //console.log('close no option',this.stateInfo);
        }
      } else {
        if (this.input.value.length) {
          this.open();
          //console.log('open with value',this.stateInfo);
        }
      }
    }

    if (flag) {
      event.stopPropagation();
      event.preventDefault();
    }
  }
  /**
   * updates options list
   *
   * @param {event} event
   * @memberof SimpleFieldsCombo
   */
  filterOptions(filter, currentOption) {
    console.log(
      "filterOptions",
      filter,
      currentOption,
      this.stateInfo,
      this.sortedOptions
    );
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
      option.textComparison = option.text.toLowerCase();
      console.log("filter Option", option, filter.length);
      if (filter.length === 0 || option.textComparison.indexOf(filter) === 0) {
        this.filteredOptions.push(option);
        textContent = option.text.trim();
        this.firstChars.push(textContent.substring(0, 1).toLowerCase());
      }
    }

    // Use populated.filteredOptions array to initialize firstOption and lastOption.
    numItems = this.filteredOptions.length;
    if (numItems > 0) {
      this.firstOption = this.filteredOptions[0];
      this.lastOption = this.filteredOptions[numItems - 1];
      let filteredText = this.filteredOptions.map((o) => o.textComparison);
      console.log(!currentOption || currentOption.textComparison, filteredText);
      if (
        currentOption &&
        currentOption.textComparison &&
        filteredText.includes(currentOption.textComparison)
      ) {
        option = currentOption;
        console.log("currentOption", option);
      } else {
        option = this.firstOption;
        console.log("first", option);
      }
    } else {
      this.firstOption = false;
      option = false;
      console.log("false", option);
      this.lastOption = false;
    }
    console.log("filtered Options", option, this.stateInfo);
    return option;
  }
  setCurrentOptionStyle(option) {
    this._selectedOption = option;
    if (option) this.listbox.scrollTop = option.offsetTop;
  }
  _isSelected(option) {
    //console.log('------ _isSelected',option,this._selectedOption);
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
    if (!this.exapanded) this.expanded = true;
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
    console.log("_onOptionClick", e, option);
    if (option) {
      this.setOption(option);
      this.setValue(option.text);
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
      this._input =
        this.field ||
        (this.shadowRoot && this.shadowRoot.querySelector(`#${this.id}`))
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
window.customElements.define(SimpleFieldsCombo.tag, SimpleFieldsCombo);
export { SimpleFieldsCombo };
