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
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: inline-flex;
          align-items: center;
          color: var(--simple-picker-color, black);
          font-family: var(--simple-picker-font-family, inherit);
          font-size: var(--simple-picker-font-size, inherit);
          --simple-picker-height: calc(
            var(--simple-picker-option-size, 24px) +
              var(--simple-picker-sample-padding, 2px) * 2 +
              var(--simple-picker-border-width, 1px) * 2
          );
          min-height: var(--simple-picker-height);
          max-height: var(--simple-picker-height);
          @apply --simple-picker;
        }
        :host div {
          margin: unset;
          padding: unset;
        }

        :host([block-label]) {
          display: block;
          margin: 0 0 15px;
          max-height: unset;
        }

        :host([disabled]) {
          --simple-picker-color: var(--simple-picker-color-disabled, #888);
          --simple-picker-background-color: var(
            --simple-picker-background-color-disabled,
            #e8e8e8
          );
          cursor: not-allowed;
        }

        :host([hidden]) {
          display: none;
        }

        :host label:not([hidden]) {
          display: flex;
          align-items: center;
          padding-right: 5px;
          font-family: var(--simple-picker-font-family, inherit);
          color: var(
            --simple-picker-label-color,
            var(--simple-picker-color, black)
          );
          @apply --simple-picker-label;
        }

        :host([block-label]) label:not([hidden]) {
          display: block;
          padding-right: 0px;
          color: var(
            --simple-picker-float-label-color,
            var(--simple-picker-color-disabled, #888)
          );
          transition: all 0.5s;
          max-height: unset;
        }

        :host([block-label]:focus-within) label,
        :host([block-label]:hover) label {
          color: var(
            --simple-picker-float-label-active-color,
            var(--simple-picker-color, black)
          );
          transition: all 0.5s;
        }

        :host #sample,
        :host .rows {
          margin: 0;
          padding: 0;
        }

        :host #listbox {
          cursor: pointer;
          position: relative;
          flex: 1 0 auto;
          min-height: var(--simple-picker-height);
          max-height: var(--simple-picker-height);
        }

        :host #sample {
          display: flex;
          flex: 1 0 auto;
          justify-content: space-between;
          align-items: center;
          padding: var(--simple-picker-sample-padding, 2px);
          border-radius: var(--simple-picker-border-radius, 2px);
          color: var(--simple-picker-sample-color, black);
          background-color: var(--simple-picker-background-color, #f0f0f0);
          border-width: var(--simple-picker-border-width, 1px);
          border-style: var(--simple-picker-border-style, solid);
          border-color: var(
            --simple-picker-border-color,
            var(--simple-picker-color-disabled, #888)
          );
          @apply --simple-picker-sample;
        }
        :host([hide-sample]) #sample {
          width: var(--simple-picker-option-size);
          overflow: visible;
        }
        :host(:focus-within) #sample {
          border-width: var(
            --simple-picker-focus-border-width,
            var(--simple-picker-border-width, 1px)
          );
          border-style: var(
            --simple-picker-focus-border-style,
            var(--simple-picker-border-style, solid)
          );
          border-color: var(
            --simple-picker-focus-border-color,
            var(
              --simple-picker-border-color,
              var(--simple-picker-color-disabled, #888)
            )
          );
          transition: all 0.5s;
          @apply --simple-picker-sample-focus;
        }

        :host #icon {
          transform: var(--simple-picker-icon-transform, rotate(0deg));
          transition: transform 0.25s;
        }

        :host([expanded]) #icon {
          transform: var(--simple-picker-expanded-icon-transform, rotate(0deg));
          transition: transform 0.25s;
        }

        :host #collapse {
          display: none;
          width: 100%;
          position: absolute;
          padding: var(
            --simple-picker-options-border-width,
            var(--simple-picker-border-width, 1px)
          );
          z-index: 2;
          @apply --simple-picker-collapse;
        }

        :host([expanded]:not([disabled])) #collapse {
          display: block;
        }

        :host .rows {
          display: block;
          position: absolute;
          z-index: 1000;
          left: calc(
            var(
              --simple-picker-options-border-width,
              var(--simple-picker-border-width, 1px)
            )
          );
          top: calc(
            0px -
              var(
                --simple-picker-options-border-width,
                var(--simple-picker-border-width, 1px)
              )
          );
          border-width: var(
            --simple-picker-options-border-width,
            var(--simple-picker-border-width, 1px)
          );
          border-style: var(
            --simple-picker-options-border-style,
            var(--simple-picker-border-style, solid)
          );
          border-color: var(
            --simple-picker-options-border-color,
            var(
              --simple-picker-border-color,
              var(--simple-picker-color-disabled, #888)
            )
          );
          background-color: var(--simple-picker-options-background-color, #fff);
          @apply --simple-picker-rows;
        }
        :host([align-right]) #collapse .rows {
          left: unset;
          right: calc(
            var(
                --simple-picker-options-border-width,
                var(--simple-picker-border-width, 1px)
              ) * 2
          );
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
          justify-content: flex-start;
          max-height: unset;
          min-height: var(--simple-picker-option-size, 24px);
          min-width: var(--simple-picker-option-size, 24px);
          line-height: var(--simple-picker-option-size, 24px);
          color: var(--simple-picker-color, black);
          background-color: var(--simple-picker-options-background-color, #fff);
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

        :host simple-picker-option[selected] {
          z-index: 50;
          color: var(--simple-picker-color, black);
          background-color: var(
            --simple-picker-option-selected-background-color,
            var(--simple-picker-options-background-color, #fff)
          );
        }

        :host simple-picker-option[active] {
          z-index: 100;
          cursor: pointer;
          color: var(--simple-picker-color, black);
          background-color: var(
            --simple-picker-option-active-background-color,
            #aaddff
          );
        }

        :host #sample simple-picker-option {
          color: var(--simple-picker-color, black);
          background-color: var(
            --simple-picker-sample-background-color,
            transparent
          );
          --simple-picker-option-padding: var(
              --simple-picker-sample-padding,
              2px
            )
            0;
          --simple-picker-option-label: {
            @apply --simple-picker-sample-label;
          }
          @apply --simple-picker-sample-option;
          border: none;
        }

        :host([hide-sample]) #sample simple-picker-option {
          position: absolute;
          left: -9999px;
          overflow: hidden;
          width: 0;
          height: 0;
        }

        :host(:focus-within) #sample simple-picker-option,
        :host(:hover) #sample simple-picker-option {
          --simple-picker-color: var(
            --simple-picker-color-active,
            var(--simple-picker-color, black)
          );
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
            position: absolute;
          }
        }
      </style>
      <label id="listLabel" for="listbox" hidden$="[[!hasLabel]]"
        >[[label]]</label
      >
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
            label$="[[__selectedOption.alt]]"
            style$="[[__selectedOption.style]]"
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
              items="[[__options]]"
              as="row"
              index-as="rownum"
              restamp
            >
              <div class="row">
                <template
                  is="dom-repeat"
                  items="[[row]]"
                  as="option"
                  index-as="colnum"
                  restamp
                >
                  <simple-picker-option
                    active$="[[_isActive(__activeDesc,rownum,colnum)]]"
                    aria-selected$="[[_isSelected(value,option.value)]]"
                    data$="[[data]]"
                    hide-option-labels$="[[hideOptionLabels]]"
                    hidden$="[[_hideNullOption(option.value,allowNull)]]"
                    icon$="[[option.icon]]"
                    id$="[[_getOptionId(rownum,colnum)]]"
                    label$="[[option.alt]]"
                    role="option"
                    selected$="[[_isSelected(value,option.value)]]"
                    on-option-focus="_handleOptionFocus"
                    on-set-selected-option="_handleSetSelectedOption"
                    style$="[[option.style]]"
                    tabindex="-1"
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
    let props = {
      /**
       * llow a null value?
       * Default behavior/false will select the first option and set value accordingly.
       */
      allowNull: {
        name: "allowNull",
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * Align the right edges of listbox and the button?
       * Default behavior/false aligns to the left edges.
       */
      alignRight: {
        name: "alignRight",
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * Optional. Sets the aria-labelledby attribute
       */
      ariaLabelledby: {
        name: "ariaLabelledby",
        type: String,
        value: null
      },

      /**
       * Position label above select dropdown?
       */
      blockLabel: {
        name: "blockLabel",
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * Is the picker disabled?
       */
      disabled: {
        name: "disabled",
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * Is it expanded?
       */
      expanded: {
        name: "expanded",
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * Hide option labels? As color-picker or icon-picker, labels may be redundant.
       * This option would move the labels off-screen so that only screen-readers will have them.
       */
      hideOptionLabels: {
        name: "hideOptionLabels",
        type: Boolean,
        value: false
      },

      /**
       * Hide the selected item sample?
       * Default behavior/false shows a sample without expanding menu.
       */
      hideSample: {
        name: "hideSample",
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * Optional. The label for the picker input
       */
      label: {
        name: "label",
        type: String,
        value: null,
        observer: "_setLabel"
      },

      /**
   * An array of options for the picker, eg.: `
[
  [
    {
      "icon": "editor:format-paint",      //Optional. Used if the picker is used as an icon picker.
      "alt": "Blue",                      //Required for accessibility. Alt text description of the choice.
      "style": "background-color: blue;", //Optional. Used to set an option's style.
      ...                                 //Optional. Any other properties that should be captured as part of the selected option's value
    },...
  ]
]`
   */
      options: {
        name: "options",
        type: Array,
        value: [
          [
            {
              icon: null,
              style: null,
              alt: null,
              value: null
            }
          ]
        ],
        observer: "_optionsChanged"
      },

      /**
   * position the swatches relative to the picker, where:
   * `left` aligns the swatches to the picker's left edge
   * `right` aligns the swatches to the picker's right edge
   * `center` aligns the swatches to the picker's center
  "position": {
    "name": "position",
    "type": Boolean,
    "value": "left",
    "reflectToAttribute": false,
    "observer": false
  },
   */

      /**
       * Renders html as title. (Good for titles with HTML in them.)
       */
      titleAsHtml: {
        name: "titleAsHtml",
        type: Boolean,
        value: false
      },

      /**
       * An string that stores the current value for the picker
       */
      value: {
        name: "value",
        type: Object,
        value: null,
        notify: true,
        observer: "_valueChanged",
        reflectToAttribute: true
      },

      /**
       * The aria-activedescendant attribute (active option's ID)
       */
      __activeDesc: {
        name: "__activeDesc",
        type: String,
        value: "option-0-0"
      },

      /**
       * Whether or not a label should be added
       */
      __hasLabel: {
        name: "__hasLabel",
        type: Boolean,
        value: true
      },

      /**
       * The selected option based on the value of the picker
       */
      __selectedOption: {
        name: "__selectedOption",
        type: Object
      }
    };
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
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
