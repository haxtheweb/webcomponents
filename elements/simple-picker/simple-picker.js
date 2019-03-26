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
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: inline-flex;
          align-items: center;
          position: relative;
          --simple-picker-color: black;
          font-size: var(
            --paper-input-container-label_-_font-size,
            var(--paper-font-subhead_-_font-size, inherit)
          );
          margin: 8px 0;
          height: 42px;
          @apply --simple-picker;
        }

        :host([disabled]) {
          cursor: not-allowed;
        }

        :host([hidden]) {
          display: none;
        }

        :host label {
          padding-right: 5px;
          color: var(
            --paper-input-container-label_-_color,
            var(
              --paper-input-container-color,
              var(--secondary-text-color, #000)
            )
          );
          @apply --simple-picker-label;
        }

        :host,
        :host #sample,
        :host .rows {
          margin: 0;
          padding: 0;
        }

        :host #listbox {
          display: flex;
          flex: 1 0 auto;
        }

        :host #sample {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2px;
          border-radius: 2px;
          background-color: var(--simple-picker-background-color, #ddd);
          border: 1px solid
            var(
              --simple-picker-sample-border-color,
              var(--simple-picker-border-color, var(--simple-picker-color))
            );
        }

        :host #icon {
          transform: var(--simple-picker-icon-tranform, rotate(-90deg));
          transition: transform 0.25s;
        }

        :host([expanded]) #icon {
          transform: var(--simple-picker-expanded-icon-tranform, rotate(0deg));
          transition: transform 0.25s;
        }

        :host #collapse {
          display: none;
          width: 100%;
          position: absolute;
          top: 35px;
          padding: 1px;
          @apply --simple-picker-collapse;
        }

        :host([expanded]:not([disabled])) #collapse {
          display: block;
        }

        :host .rows {
          display: block;
          position: absolute;
          z-index: 1000;
          outline: 1px solid
            var(--simple-picker-border-color, var(--simple-picker-color));
          background-color: var(--simple-picker-background-color, #ddd);
          box-shadow: 0px 0px 1px #888;
          @apply --simple-picker-rows;
        }

        :host .row {
          display: flex;
          align-items: stretch;
          justify-content: space-between;
          @apply --simple-picker-row;
        }

        :host simple-picker-option {
          z-index: 1;
          flex: 1 1 auto;
          max-height: unset;
          min-height: var(--simple-picker-option-size, 24px);
          min-width: var(--simple-picker-option-size, 24px);
          line-height: var(--simple-picker-option-size, 24px);
          color: var(--simple-picker-color);
          background-color: var(--simple-picker-option-background-color, white);
          outline: var(--simple-picker-option-outline, none);
          transition: max-height 2s;
          @apply --simple-picker-option;
        }

        :host(:not([value])) #sample simple-picker-option,
        :host([value="null"]) #sample simple-picker-option {
          @apply --simple-picker-sample-null;
          --simple-picker-option-label: {
            @apply --simple-picker-sample-null-label;
          }
        }

        :host #sample simple-picker-option {
          @apply --simple-picker-sample-option;
        }

        :host simple-picker-option[selected] {
          z-index: 50;
          color: var(--simple-picker-color);
          background-color: var(
            --simple-picker-selected-option-background-color,
            #e8e8e8
          );
          outline: var(--simple-picker-selected-option-outline, none);
        }

        :host simple-picker-option[active] {
          z-index: 100;
          cursor: pointer;
          color: var(--simple-picker-color);
          background-color: var(
            --simple-picker-active-option-background-color,
            #aaddff
          );
          outline: var(--simple-picker-active-option-outline, none);
        }

        :host #sample simple-picker-option {
          color: var(--simple-picker-sample-color, var(--simple-picker-color));
          background-color: var(
            --simple-picker-sample-background-color,
            transparent
          );
          border: none;
        }

        :host(:not([expanded])) #collapse simple-picker-option {
          max-height: 0;
          transition: max-height 1.5s;
        }

        :host #collapse simple-picker-option:not([value]),
        :host #collapse simple-picker-option[value="null"] {
          @apply --simple-picker-option-null;
        }

        @media screen and (max-width: 600px) {
          :host {
            position: static;
          }
          :host #collapse {
            top: 0;
            margin-top: 0;
            position: relative;
          }
          :host .rows {
            position: sticky;
          }
        }
      </style>
      <label for="listbox" hidden$="[[!hasLabel]]">[[label]]</label>
      <div
        id="listbox"
        aria-activedescendant$="[[__activeDesc]]"
        aria-labelledby$="[[ariaLabelledby]]"
        disabled$="[[disabled]]"
        role="listbox"
        tabindex="0"
      >
        <div id="sample">
          <simple-picker-option
            aria-hidden="true"
            hide-option-labels$="[[hideOptionLabels]]"
            icon$="[[__selectedOption.icon]]"
            style$="[[__selectedOption.style]]"
            title$="[[__selectedOption.alt]]"
            title-as-html$="[[titleAsHtml]]"
          >
          </simple-picker-option>
          <span id="icon"
            ><iron-icon aria-hidden="true" icon="arrow-drop-down"></iron-icon
          ></span>
        </div>
        <div id="collapse">
          <div class="rows">
            <template
              is="dom-repeat"
              items="[[options]]"
              as="row"
              index-as="rownum"
            >
              <div class="row">
                <template
                  is="dom-repeat"
                  items="[[row]]"
                  as="option"
                  index-as="colnum"
                >
                  <simple-picker-option
                    active$="[[_isActive(__activeDesc,rownum,colnum)]]"
                    aria-selected$="[[_isSelected(value,option.value)]]"
                    data$="[[data]]"
                    hide-option-labels$="[[hideOptionLabels]]"
                    icon$="[[option.icon]]"
                    id$="[[_getOptionId(rownum,colnum)]]"
                    role="option"
                    selected$="[[_isSelected(value,option.value)]]"
                    on-option-focus="_handleOptionFocus"
                    on-set-selected-option="_handleSetSelectedOption"
                    style$="[[option.style]]"
                    tabindex="-1"
                    title="[[option.alt]]"
                    title-as-html$="[[titleAsHtml]]"
                    value="[[option.value]]"
                  >
                  </simple-picker-option>
                </template>
              </div>
            </template>
          </div>
        </div>
      </div>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Optional. Sets the aria-labelledby attribute
       */
      ariaLabelledby: {
        name: "ariaLabelledby",
        type: "String",
        value: null
      },

      /**
       * Is the picker disabled?
       */
      disabled: {
        name: "disabled",
        type: "Boolean",
        value: false
      },

      /**
       * Is it expanded?
       */
      expanded: {
        name: "expanded",
        type: "Boolean",
        value: false,
        reflectToAttribute: true
      },

      /**
       * Renders html as title. (Good for titles with HTML in them.)
       */
      titleAsHtml: {
        name: "titleAsHtml",
        type: "Boolean",
        value: false
      },

      /**
       * Hide option labels? As color-picker or icon-picker, labels may be redundant.
       * This option would move the labels off-screen so that only screen-readers will have them.
       */
      hideOptionLabels: {
        name: "hideOptionLabels",
        type: "Boolean",
        value: false
      },

      /**
       * Whether r not a label shoudl be added
       */
      hasLabel: {
        name: "label",
        type: "Boolean",
        computed: "_hasLabel(label)"
      },

      /**
       * Optional. The label for the picker input
       */
      label: {
        name: "label",
        type: "String",
        value: null
      },

      /**
   * An array of options for the picker, eg.: `
[
  {
    "icon": "editor:format-paint",      //Optional. Used if the picker is used as an icon picker.
    "alt": "Blue",                      //Required for accessibility. Alt text description of the choice.
    "style": "background-color: blue;", //Optional. Used to set an option's style.
    ...                                 //Optional. Any other properties that should be captured as part of the selected option's value
  },...
]`
   */
      options: {
        name: "options",
        type: "Array",
        value: [[]],
        notify: true,
        observer: "_setSelectedOption"
      },

      /**
   * position the swatches relative to the picker, where:
   * `left` aligns the swatches to the picker's left edge
   * `right` aligns the swatches to the picker's right edge
   * `center` aligns the swatches to the picker's center
  "position": {
    "name": "position",
    "type": "Boolean",
    "value": "left",
    "reflectToAttribute": false,
    "observer": false
  },
   */

      /**
       * An string that stores the current value for the picker
       */
      value: {
        name: "value",
        type: "Object",
        value: null,
        notify: true,
        observer: "_setSelectedOption",
        reflectToAttribute: true
      },

      /**
       * The aria-activedescendant attribute (active option's ID)
       */
      __activeDesc: {
        name: "__activeDesc",
        type: "String",
        value: "option-0-0"
      },

      /**
       * The selected option based on the value of the picker
       */
      __selectedOption: {
        name: "_setSelectedOption",
        type: "Object"
      }
    };
  }

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
  _handleListboxEvent(e, type) {
    this.dispatchEvent(new CustomEvent(type, { detail: this }));
    if (type === "click") this._toggleListbox(!this.expanded);
  }

  /**
   * handles listbox keyboard events
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
   */
  _handleOptionFocus(e) {
    this._setActiveOption(e.detail.id);
  }

  /**
   * Determines if a label should be added
   *
   * @param {string} the label
   * @returns {boolean} if there is a label
   */
  _hasLabel(label) {
    return label !== undefined && label !== null && label.trim() !== "";
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
  _setSelectedOption() {
    let sel = null;
    if (this.options !== undefined && this.options !== null) {
      this.__activeDesc = "option-0-0";
      for (var i = 0; i < this.options.length; i++) {
        for (var j = 0; j < this.options[i].length; j++) {
          if (this.options[i][j].value === this.value) {
            this.__activeDesc = "option-" + i + "-" + j;
            sel = this.options[i][j];
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
   * @param {boolean} expand the listbox?
   */
  _toggleListbox(expanded) {
    let active = this.shadowRoot.querySelector("#" + this.__activeDesc);
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
    }
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
