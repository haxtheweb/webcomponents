/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "./lib/simple-picker-option.js";
export { SimplePicker };
/**
 * `simple-picker`
 * `a simple picker for options, icons, etc.`
 *
 * @microcopy - language worth noting:
 *  -
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
   * @param {string} the selected option's id
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
   * @param {number} the row number
   * @param {number} the column number
   * @returns {string} a unique id
   */
  _getOptionId(rownum, colnum) {
    return "option-" + rownum + "-" + colnum;
  }

  /**
   * aligns collapse to picker
   *
   * @param {string} the position: left, right, center
   * @return {string} css for aligning the collapse
  _getPosition(position,width = 0) {
    console.log(width);
    if(position === "right"){
      return "left: "+(0 - width);
    } else if(position === "center"){
      return "left: "+(0 - width/2);
    } 
    return null;
  }
   */

  /**
   * sets a new active descendant and sets focus on it
   *
   * @param {number} the row number to be tested
   * @param {number} the column number to be tested
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
   */
  _handleListboxClick(e) {
    this._toggleListbox(!this.expanded);
  }

  /**
   * handles listbox keyboard events
   */
  _handleListboxKeydown(e) {
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
   */
  _handleOptionFocus(e) {
    this._setActiveOption(e.detail.id);
  }

  /**
   * sets the selected option to a given option's id
   *
   * @param {string} the option id
   */
  _initSelectedOption(value) {
    this.__selectedOption = null;
    for (var i = 0; i < this.options.length; i++) {
      for (var j = 0; j < this.options[i].length; j++) {
        if (this.options[i][j].value === value) {
          this.__selectedOption = this.options[i][j];
          this.__activeDesc = this.options[i][j].value;
        }
      }
    }
  }

  /**
   * determines if an option is at a given row and column
   *
   * @param {string} an option's id
   * @param {number} the row number to be tested
   * @param {number} the column number to be tested
   * @returns {boolean} whether or not the option is at the given row and column
   */
  _isActive(active, rownum, colnum) {
    return active === this._getOptionId(rownum, colnum);
  }

  /**
   * determines if an option is at a given row and column
   *
   * @param {string} an option's id
   * @param {number} the row number to be tested
   * @param {number} the column number to be tested
   * @returns {boolean} whether or not the option is at the given row and column
   */
  _isSelected(value1, value2) {
    return value1 === value2;
  }

  /**
   * sets the  active descendant to a given option's id
   *
   * @param {string} the option id
   */
  _setActiveOption(id) {
    this.__activeDesc = id;
    this.dispatchEvent(new CustomEvent("option-focus", { detail: this }));
  }

  /**
   * sets the selected option to a given option's id
   *
   * @param {string} the option id
   */
  _setSelectedOption(option) {
    this.__selectedOption = this._getOption(this.options, option.id);
    this.value = option.value;
    this.dispatchEvent(new CustomEvent("change", { detail: this }));
  }

  /**
   * toggles the listbox
   *
   * @param {boolean} expand the listbox?
   */
  _toggleListbox(expanded) {
    let active = this.shadowRoot.querySelector("#" + this.__activeDesc);
    this.expanded = expanded;
    if (expanded) {
      if (active !== null) active.focus();
      this.dispatchEvent(new CustomEvent("expand", { detail: this }));
    } else {
      if (active !== null) this._setSelectedOption(active);
      this.dispatchEvent(new CustomEvent("collapse", { detail: this }));
    }
  }

  /**
   * Set event listeners
   */
  ready() {
    super.ready();
    let root = this;
    this._initSelectedOption(this.value);
    this.$.listbox.addEventListener("click", function(e) {
      root._handleListboxClick(e);
    });
    this.$.listbox.addEventListener("keydown", function(e) {
      root._handleListboxKeydown(e);
    });
  }

  /**
   * sets the options for the picker
   *
   * @param {array} the nested array of options
   */
  setOptions(options) {
    this.set("options", [[]]);
    this.set("options", options);
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(SimplePicker.tag, SimplePicker);
