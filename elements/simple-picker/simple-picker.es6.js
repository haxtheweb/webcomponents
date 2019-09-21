/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
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
<style>:host {
  display: inline-flex;
  align-items: center;
  color: var(--simple-picker-color, black);
  font-family: var(--simple-picker-font-family, inherit);
  font-size: var(--simple-picker-font-size, inherit);
  max-height: calc(var(--simple-picker-option-size, 24px) + 18px);
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
  cursor: not-allowed;
}

:host([hidden]) {
  display: none;
}

:host label:not([hidden]) {
  padding-right: 5px;
  font-family: var(--simple-picker-font-family, inherit);
  color: var(--simple-picker-label-color, var(--simple-picker-color, black));
  max-height: calc(var(--simple-picker-option-size, 24px) + 4px);
  @apply --simple-picker-label;
}

:host([block-label]) label:not([hidden]) {
  display: block;
  padding-right: 0px;
  color: var(--simple-picker-float-label-color, #888);
  transition: all 0.5s;
  max-height: unset;
}

:host([block-label]:focus) label,
:host([block-label]:hover) label {
  color: var(--simple-picker-float-label-active-color, var(--simple-picker-color, black));
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
  max-height: calc(var(--simple-picker-option-size, 24px) + 4px);
}

:host #sample {
  display: flex;
  flex: 1 0 auto;
  justify-content: space-between;
  align-items: center;
  padding: 2px;
  border-radius: 2px;
  background-color: var(--simple-picker-background-color,#f0f0f0);
  border: 1px solid var(--simple-picker-border-color, var(--simple-picker-color, black));
  @apply --simple-picker-sample;
}
:host(:focus) #sample,
:host #listbox:focus #sample,
:host #sample:focus {
  border: 2px solid var(--simple-picker-focus-border-color, var(--simple-picker-color, black));
  @apply --simple-picker-sample-focus;
}

:host #listbox:focus {
  outline: none;
}

:host #icon {
  transform: var(--simple-picker-icon-tranform, rotate(0deg));
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
  top: calc(var(--simple-picker-option-size, 24px) + 4px);
  padding: 0 1px;
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
  outline: 1px solid var(--simple-picker-border-color, var(--simple-picker-color, black));;
  background-color: var(--simple-picker-background-color,#f0f0f0);
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
  justify-content: flex-start;
  max-height: unset;
  min-height: var(--simple-picker-option-size, 24px);
  min-width: var(--simple-picker-option-size, 24px);
  line-height: var(--simple-picker-option-size, 24px);
  color: var(--simple-picker-color);
  background-color: var(--simple-picker-option-background-color, #ffffff);
  outline: var(--simple-picker-option-outline, none);
  transition: max-height 2s;
  @apply --simple-picker-option;
}

:host(:not([value])) #sample simple-picker-option,
:host([value="null"]) #sample simple-picker-option {
  @apply --simple-picker-sample-null;
  --simple-picker-option-label: {
    @apply --simple-picker-sample-null-label;
  };
}

:host simple-picker-option[selected] {
  z-index: 50;
  color: var(--simple-picker-color);
  background-color: var(--simple-picker-selected-option-background-color, #e8e8e8);
  outline: var(--simple-picker-selected-option-outline, none);
}

:host simple-picker-option[active] {
  z-index: 100;
  cursor: pointer;
  color: var(--simple-picker-color);
  background-color: var(--simple-picker-active-option-background-color, #aaddff);
  outline: var(--simple-picker-active-option-outline, none);
}

:host #sample simple-picker-option {
  color: var(--simple-picker-sample-color,  var(--simple-picker-color));
  background-color: var(--simple-picker-sample-background-color, transparent);
  --simple-picker-option-padding: 2px 0;
  --simple-picker-option-label: {
    @apply --simple-picker-sample-label;
  }
  @apply --simple-picker-sample-option;
  border: none;
}

:host(:not([expanded])) #collapse simple-picker-option {
  max-height: 0;
  transition: max-height 1.5s;
}

:host #collapse simple-picker-option:not([value]),
:host #collapse simple-picker-option[value=null] {
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
<label id="listLabel" for="listbox" hidden$="[[!hasLabel]]">[[label]]</label>
<div id="listbox"
  aria-activedescendant$="[[__activeDesc]]" 
  aria-labelledby$="[[ariaLabelledby]]" 
  disabled$="[[disabled]]"
  role="listbox" 
  tabindex="0">
  <div id="sample">
    <simple-picker-option 
      aria-hidden="true" 
      hide-option-labels$="[[hideOptionLabels]]"
      icon$="[[__selectedOption.icon]]"
      label$="[[__selectedOption.alt]]"
      style$="[[__selectedOption.style]]" 
      title-as-html$="[[titleAsHtml]]">
    </simple-picker-option>
    <span id="icon"><iron-icon aria-hidden="true" icon="arrow-drop-down"></iron-icon></span>
  </div>
  <div id="collapse">
    <div class="rows">
      <template is="dom-repeat" items="[[__options]]" as="row" index-as="rownum" restamp>
        <div class="row">
          <template is="dom-repeat" items=[[row]] as="option" index-as="colnum" restamp>
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
              value="[[option.value]]">
            </simple-picker-option>
          </template>
        </div>
      </template>
    </div>
  </div>
</div>`;
  }

  // properties available to the custom element for data binding
    static get properties() {
    let props = {
  "allowNull": {
    "name": "allowNull",
    "type": Boolean,
    "value": false,
    "reflectToAttribute": true
  },
  /**
   * Optional. Sets the aria-labelledby attribute
   */
  "ariaLabelledby": {
    "name": "ariaLabelledby",
    "type": String,
    "value": null
  },

  /**
   * Position label above select dropdown?
   */
  "blockLabel": {
    "name": "blockLabel",
    "type": Boolean,
    "value": false,
    "reflectToAttribute": true
  },

  /**
   * Is the picker disabled?
   */
  "disabled": {
    "name": "disabled",
    "type": Boolean,
    "value": false
  },

  /**
   * Is it expanded?
   */
  "expanded": {
    "name": "expanded",
    "type": Boolean,
    "value": false,
    "reflectToAttribute": true
  },

  /**
   * Hide option labels? As color-picker or icon-picker, labels may be redundant.
   * This option would move the labels off-screen so that only screen-readers will have them.
   */
  "hideOptionLabels": {
    "name": "hideOptionLabels",
    "type": Boolean,
    "value": false
  },

  /**
   * Optional. The label for the picker input
   */
  "label": {
    "name": "label",
    "type": String,
    "value": null,
    "observer": "_setLabel"
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
  "options": {
    "name": "options",
    "type": Array,
    "value": [
      [
        {
          "icon": null,
          "style": null,
          "alt": null,
          "value": null
        }
      ]
    ],
    "observer": "_optionsChanged"
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
  "titleAsHtml": {
    "name": "titleAsHtml",
    "type": Boolean,
    "value": false
  },

  /**
   * An string that stores the current value for the picker
   */
  "value": {
    "name": "value",
    "type": Object,
    "value": null,
    "observer": "_valueChanged",
    "reflectToAttribute": true
  },

  /**
   * The aria-activedescendant attribute (active option's ID)
   */
  "__activeDesc": {
    "name": "__activeDesc",
    "type": String,
    "value": "option-0-0"
  },

  /**
   * Whether or not a label should be added
   */
  "__hasLabel": {
    "name": "__hasLabel",
    "type": Boolean,
    "value": true
  },

  /**
   * The selected option based on the value of the picker
   */
  "__selectedOption": {
    "name": "__selectedOption",
    "type": Object
  }
}
;
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
  _valueChanged(newValue, oldValue) {
    this._setSelectedOption(newValue, oldValue);
  }
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
    let active = this.shadowRoot.querySelector("#" + this.__activeDesc);
    console.log("_toggleListbox", active);
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
