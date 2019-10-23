/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
/**
 * `simple-picker`
 * `a simple picker for options, icons, etc.`
 *
### Styling

`<simple-picker>` provides the following custom properties and mixins
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--simple-picker-font-family` | Main font-family. | inherit
`--simple-picker-font-size` | Main font-size. | inherit
`--simple-picker-color` | Main text color. | black
`--simple-picker-color-active` | Color of the sample text when button is focused within or hovered. | --simple-picker-color
`--simple-picker-color-disabled` | Disabled text color. | #888
`--simple-picker-background-color` | Background color for the button. | #f0f0f0
`--simple-picker-background-color-disabled` | Background color for the button when picker is disabled. | #e8e8e8
`--simple-picker-border-radius` | Main border-radius. | 2px
`--simple-picker-border-width` | The default border width. | 1px
`--simple-picker-border-style` | The default border style. | solid
`--simple-picker-border-color` | The default border color. | --simple-picker-color-disabled
`--simple-picker-focus-border-width` | The border width when focused within or hovered. | --simple-picker-border-width
`--simple-picker-focus-border-style` | The border style when focused within or hovered. | --simple-picker-border-style
`--simple-picker-focus-border-color` | The border color when focused within or hovered. | --simple-picker-border-color
`--simple-picker-label-color` | Label text color. | --simple-picker-color
`--simple-picker-float-label-color` | Floating label text color. | --simple-picker-color-disabled
`--simple-picker-float-label-active-color` | Floating label text color when picker is focused or hovered. | --simple-picker-color-disabled
`--simple-picker-icon-transform` | Rotation of the arrow icon by default. | rotate(0deg)
`--simple-picker-expanded-icon-transform` | Rotation of the arrow icon when picker is expanded. | rotate(0deg)
`--simple-picker-sample-color` | Sample option text color. | --simple-picker-color
`--simple-picker-sample-padding` | Sample option padding. | 2px
`--simple-picker-sample-background-color` | Sample option background-color. | transparent
`--simple-picker-option-size` | Height of the option. | 24px
`--simple-picker-option-selected-background-color` | Outline for the currently sselected option. | --simple-picker-options-background-color
`--simple-picker-option-active-background-color` | Outline for the currently active option. | #aaddff
`--simple-picker-options-border-width` | The border width of the listbox. | --simple-picker-border-width
`--simple-picker-options-border-style` | The border style of the listbox. | --simple-picker-border-style
`--simple-picker-options-border-color` | The border color of the listbox. | --simple-picker-border-color
`--simple-picker-options-background-color` | Background color for the listbox. | #fff
`--simple-picker-height` | Calculation based on option size, padding, and border. DO NOT EDIT. | --simple-picker-option-size - --simple-picker-sample-padding * 2 - --simple-picker-border-width * 2
*
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class SimplePicker extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-picker";
  }

  /**
   * returns the value of the selected option.
   *
   * @param {string} options the options
   * @param {string} optionId the selected option's id
   * @returns {object} the selected option
   */
  _getOption(options, optionId) {
    if (options !== undefined && optionId !== undefined && optionId !== null) {
      let coords = optionId.split("-");
      return options[coords[1]][coords[2]];
    }
    return null;
  }

  /**
   * returns a unique id for the option based on its row and column.
   *
   * @param {number} rownum the row number
   * @param {number} colnum the column number
   * @returns {string} a unique id
   */
  _getOptionId(rownum, colnum) {
    return "option-" + rownum + "-" + colnum;
  }

  /**
   * sets a new active descendant and sets focus on it
   *
   * @param {number} rownum the row number to be tested
   * @param {number} colnum the column number to be tested
   * @returns {void}
   */
  _goToOption(rownum, colnum) {
    let targetId = this._getOptionId(rownum, colnum),
      target = this.shadowRoot.querySelector("#" + targetId),
      active = this.shadowRoot.querySelector("#" + this.__activeDesc);
    if (target !== null) {
      target.tabindex = 0; //allow the item to be focusable.
      target.focus();
      active.tabindex = -1; //prevent tabbing between options.
    }
  }

  /**
   * handles listbox click event
   *
   * @param {event} e the event
   * @param {string} type the type of event
   * @returns {void}
   */
  _handleListboxEvent(e, type) {
    this.dispatchEvent(new CustomEvent(type, { detail: this }));
    if (type === "click") this._toggleListbox(!this.expanded);
  }

  /**
   * handles listbox keyboard events
   *
   * @param {event} e the event
   * @returns {void}
   */
  _handleListboxKeydown(e) {
    this.dispatchEvent(new CustomEvent("keydown", { detail: this }));
    let coords = this.__activeDesc.split("-"),
      rownum = parseInt(coords[1]),
      colnum = parseInt(coords[2]);
    if (e.keyCode === 32) {
      //spacebar
      e.preventDefault();
      this._toggleListbox(!this.expanded);
    } else if (this.expanded && [9, 35, 36, 38, 40].includes(e.keyCode)) {
      e.preventDefault();
      if (e.keyCode === 35) {
        //end
        let lastrow = this.options.length - 1,
          lastcol = this.options[lastrow].length - 1;
        this._goToOption(lastrow, lastcol); //move to last option
      } else if (e.keyCode === 36) {
        //home
        this._goToOption(0, 0); //move to first option
      } else if (e.keyCode === 38) {
        //previous (up arrow)
        if (colnum > 0) {
          this._goToOption(rownum, colnum - 1); //move up to previous column
        } else if (rownum > 0) {
          this._goToOption(rownum - 1, this.options[rownum - 1].length - 1); //move up to end of previous row
        }
      } else if (e.keyCode === 40) {
        //next (down arrow)
        if (colnum < this.options[rownum].length - 1) {
          //move down to next column
          this._goToOption(rownum, colnum + 1);
        } else if (rownum < this.options.length - 1) {
          //move down to beginning of next row
          this._goToOption(rownum + 1, [0]);
        }
      }
    }
  }

  /**
   * handles option focus event and sets the active descendant
   *
   * @param {event} e the event
   * @returns {void}
   */
  _handleOptionFocus(e) {
    this._setActiveOption(e.detail.id);
  }

  /**
   * Determines if a label should be added
   *
   * @param {string} label
   * @returns {boolean} if there is a label
   */
  _setLabel() {
    let label = this.shadowRoot.querySelector("#listLabel");
    this.hasLabel =
      this.label !== undefined &&
      this.label !== null &&
      this.label.trim() !== "";
    label.innerHTML =
      this.label !== undefined &&
      this.label !== null &&
      this.label.trim() !== ""
        ? this.label.trim()
        : "";
  }
  /**
   * determines if an option is hidden a d can't be selected
   *
   * @param {string} val option value
   * @param {boolean} allowNull whether or not null option can be selected
   * @returns {boolean} whether or not the option should be hidden
   */
  _hideNullOption(val, allowNull) {
    return !allowNull && (val === undefined || val === null);
  }

  /**
   * gets sets active option based on a row and column
   *
   * @param {string} active active option's id
   * @param {number} rownum the row number to be tested
   * @param {number} colnum the column number to be tested
   * @returns {boolean} whether or not the option is at the given row and column
   */
  _isActive(active, rownum, colnum) {
    return active === this._getOptionId(rownum, colnum);
  }

  /**
   * determines if an option is at a given row and column
   *
   * @param {string} value1 current value
   * @param {string} value2 an option's value
   * @returns {boolean} whether or not the option is selected
   */
  _isSelected(value1, value2) {
    return value1 === value2;
  }

  /**
   * sets the  active descendant to a given option's id
   *
   * @param {string} id the option id
   * @returns {void}
   */
  _setActiveOption(id) {
    this.__activeDesc = id;
    this.dispatchEvent(new CustomEvent("option-focus", { detail: this }));
  }

  /**
   * handles change in value
   *
   * @param {object} newValue the new value for the picker
   * @param {object} oldValue the old value for the picker
   * @returns {void}
   */
  _valueChanged(newValue, oldValue) {
    this._setSelectedOption(newValue, oldValue);
  }

  /**
   * handles change in options
   *
   * @param {object} newValue the new options for the picker
   * @param {object} oldValue the old options for the picker
   * @returns {void}
   */
  _optionsChanged(newValue, oldValue) {
    this._setSelectedOption(newValue, oldValue);
  }

  /**
   * sets the selected option to a given option's id
   * @returns {void}
   */
  _setSelectedOption(newVal, oldVal) {
    let sel =
      !this.allowNull && this.options.length > 0
        ? this.options[0][0].value
        : null;
    if (this.options !== undefined && this.options !== null) {
      this.set(
        "__options",
        typeof this.options === "string"
          ? JSON.parse(this.options)
          : this.options.slice()
      );
      //if nulls are allowed, set the active descendant to the first not null option
      this.__activeDesc = this.allowNull ? "option-0-0" : null;
      for (var i = 0; i < this.__options.length; i++) {
        for (var j = 0; j < this.__options[i].length; j++) {
          //if unset, set the active descendant to the first not null option
          if (this.value !== null && this.__activeDesc === null)
            this.__activeDesc = "option-" + i + "-" + j;
          if (`${this.__options[i][j].value}` === `${this.value}`) {
            //set the active descendant to the option that matches the value
            this.__activeDesc = "option-" + i + "-" + j;
            sel = this.__options[i][j];
          }
        }
      }
    }
    if (sel === null) this.value = null;
    this.__selectedOption = sel;
    this.dispatchEvent(
      new CustomEvent("change", { bubbles: true, detail: this })
    );
  }

  /**
   * toggles the listbox
   *
   * @param {boolean} expanded is the listbox expanded?
   * @returns {void}
   */
  _toggleListbox(expanded) {
    if (this.disabled) return;
    let active = this.shadowRoot.querySelector("#" + this.__activeDesc);
    console.log("_toggleListbox", expanded);
    this.expanded = expanded;
    if (expanded) {
      if (active !== null) active.focus();
      this.dispatchEvent(new CustomEvent("expand", { detail: this }));
    } else {
      if (active !== null) this.value = active.getAttribute("value");
      this.dispatchEvent(new CustomEvent("collapse", { detail: this }));
    }
  }

  /**
   * Set event listeners
   * @returns {void}
   */
  ready() {
    super.ready();
    let root = this;
    if (this.$.listbox !== undefined) {
      this.$.listbox.addEventListener("click", function(e) {
        root._handleListboxEvent(e, "click");
      });
      this.$.listbox.addEventListener("mousedown", function(e) {
        root._handleListboxEvent(e, "mousedown");
      });
      this.$.listbox.addEventListener("keydown", function(e) {
        root._handleListboxKeydown(e);
      });
      this.addEventListener("blur", function(e) {
        this.expanded = false;
      });
    }
  }
  constructor() {
    super();
    import("@polymer/iron-icon/iron-icon.js");
    import("@polymer/iron-icons/iron-icons.js");
    import("./lib/simple-picker-option.js");
  }
  /**
   * sets the options for the picker
   *
   * @param {array} options the nested array of options
   * @returns {void}
   */
  setOptions(options) {
    this.set("options", [[]]);
    this.set("options", options);
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(SimplePicker.tag, SimplePicker);
export { SimplePicker };
