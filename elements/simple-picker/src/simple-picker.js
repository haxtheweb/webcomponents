/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
/**
 * `simple-picker`
 * a simple picker for options, icons, etc.
 *
### Styling

`<simple-picker>` provides the following custom properties and mixins
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--simple-picker-display` | default display for simple-picker | inline-flex
`--simple-picker-font-family` | Main font-family. | inherit
`--simple-picker-font-size` | Main font-size. | inherit
`--simple-picker-color` | Main text color. | black
`--simple-picker-color-active` | Color of sample text when button is focused within or hovered. | --simple-picker-color
`--simple-picker-color-disabled` | Disabled text color. | #888
`--simple-picker-background-color` | Background color for button. | #f0f0f0
`--simple-picker-background-color-disabled` | Background color for button when picker is disabled. | #e8e8e8
`--simple-picker-border-radius` | Main border-radius. | 2px
`--simple-picker-border-width` | Default border width. | 1px
`--simple-picker-border-style` | Default border style. | solid
`--simple-picker-border-color` | Default border color. | --simple-picker-color-disabled
`--simple-picker-focus-border-width` | Border width when focused within or hovered. | --simple-picker-border-width
`--simple-picker-focus-border-style` | Border style when focused within or hovered. | --simple-picker-border-style
`--simple-picker-focus-border-color` | Border color when focused within or hovered. | --simple-picker-border-color
`--simple-picker-listbox-border-width` | Border width of listbox. | --simple-picker-border-width
`--simple-picker-listbox-border-style` | Border style of listbox. | --simple-picker-border-style
`--simple-picker-listbox-border-color` | Border color of listbox. | --simple-picker-border-color
`--simple-picker-label-color` | Label text color. | --simple-picker-color
`--simple-picker-float-label-color` | Floating label text color. | --simple-picker-color-disabled
`--simple-picker-float-label-active-color` | Floating label text color when picker is focused or hovered. | --simple-picker-color-disabled
`--simple-picker-icon-transform` | Rotation of arrow icon by default. | rotate(0deg)
`--simple-picker-expanded-icon-transform` | Rotation of arrow icon when picker is expanded. | rotate(0deg)
`--simple-picker-sample-color` | Sample option text color. | --simple-picker-color
`--simple-picker-sample-padding` | Sample option padding. | 2px
`--simple-picker-sample-background-color` | Sample option background-color. | transparent
`--simple-picker-option-size` | Height of option. | 24px
`--simple-picker-option-selected-background-color` | Outline for currently sselected option. | --simple-picker-options-background-color
`--simple-picker-option-active-background-color` | Outline for currently active option. | #aaddff
`--simple-picker-option-padding` | padding within each simple picker option | 2px 10px
`--simple-picker-option-label-padding` | adding within each simple picker option's label | --simple-picker-option-padding
`--simple-picker-options-max-height` | Maximum amount of space listbox can use before scrolling. Use `unset` for now vertical scroll. | 250px
`--simple-picker-options-border-width` | Border width of listbox. | --simple-picker-border-width
`--simple-picker-options-border-style` | Border style of listbox. | --simple-picker-border-style
`--simple-picker-options-border-color` | Border color of listbox. | --simple-picker-border-color
`--simple-picker-options-background-color` | Background color for listbox. | #fff
`--simple-picker-height` | Calculation based on option size, padding, and border. DO NOT EDIT. | --simple-picker-option-size - --simple-picker-sample-padding * 2 - --simple-picker-border-width * 2
 *
 * @demo ./demo/index.html
 * @element simple-picker
 */
class SimplePicker extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-picker";
  }

  // life cycle
  constructor() {
    super();
    import("./lib/simple-picker-option.js");
    this.tag = SimplePicker.tag;
    this.allowNull = false;
    this.alignRight = false;
    this.ariaLabelledby = null;
    this.blockLabel = false;
    this.disabled = false;
    this.expanded = false;
    this.hideOptionLabels = false;
    this.hideSample = false;
    this.label = null;
    this.__options = [[]];
    this.options = [
      [
        {
          icon: null,
          style: null,
          alt: null,
          value: null,
        },
      ],
    ];
    this.titleAsHtml = false;
    this.value = null;
    this.__activeDesc = "option-0-0";
    this.__hasLabel = true;
    this.__selectedOption = {};
    this.addEventListener("blur", function (e) {
      this.expanded = false;
    });
    // map our imported properties json to real props on the element
    // @notice static getter of properties is built via tooling
    // to edit modify src/test-lit-properties.json
    let obj = SimplePicker.properties;
    for (let p in obj) {
      if (obj.hasOwnProperty(p)) {
        if (this.hasAttribute(p)) {
          this[p] = this.getAttribute(p);
        } else {
          if (p.reflect) this.setAttribute(p, obj[p].value);
          this[p] = obj[p].value;
        }
      }
    }
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "value") this._valueChanged();
      if (propName === "options") this._optionsChanged();
    });
    /**
     * Fires when properties change
     * @event changed
     */
    this.dispatchEvent(
      new CustomEvent("changed", {
        detail: this,
      })
    );
  }

  /**
   * returns value of selected option.
   *
   * @param {array} options array of options
   * @param {string} optionId selected option's id
   * @returns {object} selected option
   */
  _getOption(options, optionId) {
    if (options !== undefined && optionId !== undefined && optionId !== null) {
      let coords = optionId.split("-");
      return options[coords[1]][coords[2]];
    }
    return null;
  }

  /**
   * sets a new active descendant and sets focus on it
   *
   * @param {number} rownum row number to be tested
   * @param {number} colnum column number to be tested
   * @returns {void}
   */
  _goToOption(rownum, colnum) {
    let targetId = html` option-${rownum}-${colnum} `,
      target = this.shadowRoot.querySelector("#" + targetId),
      active = this.shadowRoot.querySelector("#" + this.__activeDesc);
    if (target !== null) {
      target.tabindex = 0; //allow item to be focusable.
      target.focus();
      active.tabindex = -1; //prevent tabbing between options.
    }
  }

  /**
   * handles listbox click event
   * @param {event} e event
   * @returns {void}
   */
  _handleListboxClick(e) {
    /**
     * handles listbox click event
     * @event click
     */
    this.dispatchEvent(new CustomEvent("click", { detail: this }));
    this._toggleListbox();
  }

  /**
   * handles listbox mousedown event
   * @param {event} e event
   * @returns {void}
   */
  _handleListboxMousedown(e) {
    /**
     * fires with listbox mousedown event
     * @event mousedown
     */
    this.dispatchEvent(new CustomEvent("mousedown", { detail: this }));
  }

  /**
   * handles listbox keyboard events
   * @param {event} e event
   * @returns {void}
   */
  _handleListboxKeydown(e) {
    /**
     * fires with listbox keyboard events
     * @event keydown
     */
    this.dispatchEvent(new CustomEvent("keydown", { detail: this }));
    let coords = this.__activeDesc.split("-"),
      rownum = parseInt(coords[1]),
      colnum = parseInt(coords[2]);
    if (e.keyCode === 32) {
      //spacebar
      e.preventDefault();
      this._toggleListbox();
    } else if (this.expanded && [9, 35, 36, 38, 40].includes(e.keyCode)) {
      e.preventDefault();
      if (e.keyCode === 35) {
        //end
        let lastrow = (this.options || []).length - 1,
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
        } else if (rownum < (this.options || []).length - 1) {
          //move down to beginning of next row
          this._goToOption(rownum + 1, [0]);
        }
      }
    }
  }

  /**
   * handles option focus event and sets active descendant
   * @param {event} e event
   * @returns {void}
   */
  _handleOptionFocus(e) {
    this._setActiveOption(e.detail.id);
  }

  /**
   * sets  active descendant to a given option's id
   * @param {string} id option id
   * @returns {void}
   */
  _setActiveOption(id) {
    this.__activeDesc = id;
    /**
     * fires when active descendant changes
     * @event option-focus
     */
    this.dispatchEvent(new CustomEvent("option-focus", { detail: this }));
  }

  /**
   * handles change in value
   *
   * @param {object} newValue new value for picker
   * @param {object} oldValue old value for picker
   * @returns {void}
   */
  _valueChanged() {
    this._setSelectedOption();
    /**
     * fires when value changes
     * @event value-changed
     */
    this.dispatchEvent(
      new CustomEvent("value-changed", {
        detail: this,
      })
    );
  }

  /**
   * handles change in options
   * @param {object} newValue new options for picker
   * @param {object} oldValue old options for picker
   * @returns {void}
   */
  _optionsChanged() {
    this._setSelectedOption();
  }

  /**
   * sets selected option to a given option's id
   * @returns {void}
   */
  _setSelectedOption() {
    let sel =
      !this.allowNull &&
      (this.options || []).length > 0 &&
      this.options[0].length > 0
        ? this.options[0][0].value
        : null;
    if (this.options) {
      this.__options =
        typeof this.options === "string"
          ? JSON.parse(this.options)
          : this.options.slice();
      //if nulls are allowed, set active descendant to first not null option
      this.__activeDesc = this.allowNull ? "option-0-0" : null;
      for (var i = 0; i < this.__options.length; i++) {
        for (var j = 0; j < this.__options[i].length; j++) {
          //if unset, set active descendant to first not null option
          if (this.value !== null && this.__activeDesc === null)
            this.__activeDesc = `option-${i}-${j}`;
          if (`${this.__options[i][j].value}` === `${this.value}`) {
            //set active descendant to option that matches value
            this.__activeDesc = `option-${i}-${j}`;
            sel = this.__options[i][j];
          }
        }
      }
    }
    if (sel === null) this.value = null;
    this.__selectedOption = sel;

    /**
     * fires when options or value changes
     * @event change
     */
    this.dispatchEvent(
      new CustomEvent("change", { bubbles: true, detail: this })
    );
  }

  /**
   * toggles listbox
   *
   * @param {boolean} open whether to open
   * @returns {void}
   */
  _toggleListbox(open = !this.expanded) {
    if (this.disabled) return;
    let active = this.shadowRoot.querySelector("#" + this.__activeDesc);
    this.expanded = open;
    if (open) {
      if (active !== null) active.focus();
      /**
       * fires when listbox is expanded
       * @event expand
       */
      this.dispatchEvent(new CustomEvent("expand", { detail: this }));
    } else {
      if (active !== null) this.value = active.getAttribute("value");
      /**
       * fires when listbox is collapsed
       * @event collapse
       */
      this.dispatchEvent(new CustomEvent("collapse", { detail: this }));
    }
  }
  /**
   * sets options for picker
   *
   * @param {array} options nested array of options
   * @returns {void}
   */
  setOptions(options) {
    this.set("options", [[]]);
    this.set("options", options);
  }
  /**
   * life cycle, element is removed from DOM
   */
  disconnectedCallback() {
    this.removeEventListener("blur", function (e) {
      this.expanded = false;
    });
    super.disconnectedCallback();
  }
}
window.customElements.define(SimplePicker.tag, SimplePicker);
export { SimplePicker };
