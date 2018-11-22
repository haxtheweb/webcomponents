/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "@lrnwebcomponents/lrn-shared-styles/lrn-shared-styles.js";
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
<style>:host {
  display: inline-block;
  position: relative;
  @apply --simple-picker;
}
:host, 
:host #sample, 
:host .rows {
  margin: 0;
  padding: 0;
}

:host[disabled] {
  cursor: not-allowed;
}

:host([hidden]) {
  display: none;
}
:host #sample {
  display: inline-flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px;
  border-radius: 2px;
  background-color: var(--simple-picker-background-color,#ddd);
  border: 1px solid var(--simple-picker-border-color,black);
}

:host #sample simple-color-picker-swatch {
  border-radius: 4px;
  border: 1px solid var(--simple-picker-border-color,black);
}

:host(:not([expanded])) #icon {
  transform: rotate(-90deg);
  transition: transform 0.25s;
}

:host([expanded]:not[disabled]) #collapse {
  position: absolute;
  top: calc(var(--simple-picker-swatch-size, 20px)+12px);
  background-color: var(--simple-picker-background-color,#ddd);
  transition: max-height 0.75s, overflow 0.75s, height 0.75s;
  transition-delay: 0.25s;
}

:host([expanded]) #collapse,
:host([expanded]) .rows {
  max-height: unset;
  overflow: visible;
}
:host([expanded]) .rows {
  outline: 1px solid var(--simple-picker-border-color,black);
}

:host #collapse,
:host([disabled]) #collapse,
:host .rows,
:host([disabled]) .rows {
  max-height: 0;
  overflow: hidden;
}

:host .rows {
  position: absolute;
  z-index: 1000;
}

:host .row {
  display: flex;
  justify-content: space-between;
  align-items: stretch;
}

:host simple-picker-option {
  min-width: var(--simple-picker-swatch-size, 20px);
  height: var(--simple-picker-swatch-size, 20px);
  padding: 0;
  margin: 0;
  border-radius: 0;
  border: 1px solid rgba(0,0,0,0);
  box-sizing: content-box;
  @apply --simple-picker-option;
}
:host simple-picker-option[active] {
  cursor: pointer;
  border: 1px solid var(--simple-picker-active-border-color, blue);
  @apply --simple-picker-option-active;
}
:host simple-picker-option[selected] {
  border: 1px solid var(--simple-picker-selected-border-color, black);
  @apply --simple-picker-option-selected;
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
<div id="listbox"
  aria-activedescendant$="[[__activeDesc]]" 
  aria-labelledby$="[[ariaLabelledby]]" 
  disabled$="[[disabled]]"
  label$="[[label]]" 
  role="listbox" 
  tabindex="0">
  <div id="sample">
    <simple-picker-option 
      style="[[_getBgcolor(__selectedOption.color)]]" 
      text$="[[__selectedOption.text]]">
    </simple-picker-option>
    <span id="icon"><iron-icon icon="arrow-drop-down"></iron-icon></span>
  </div>
  <div id="collapse">
    <div class="rows">
      <template is="dom-repeat" items="[[options]]" as="row" index-as="rownum">
        <div class="row">
          <template is="dom-repeat" items=[[row]] as="option" index-as="colnum">
            <simple-picker-option 
              active$="[[_isMatch(__activeDesc,rownum,colnum)]]"
              aria-selected$="[[option.selected]]" 
              id="[[_getOptionId(rownum,colnum)]]"
              role="option"
              selected$="[[_isMatch(__selected,rownum,colnum)]]"
              on-option-focus="_handleOptionFocus"
              on-set-selected-option="_handleSetSelectedOption"
              style="[[_getBgcolor(option.color)]]" 
              tabindex="-1"
              text$="[[option.text]]"
              value$="[[option.value]]">
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
    return {
      /**
       * Optional. Sets the aria-labelledby attribute
       */
      ariaLabelledby: {
        name: "ariaLabelledby",
        type: "String",
        value: null,
        reflectToAttribute: false,
        observer: false
      },

      /**
       * Is the picker disabled?
       */
      disabled: {
        name: "disabled",
        type: "Boolean",
        value: false,
        reflectToAttribute: false,
        observer: false
      },

      /**
       * Optional. The label for the picker input
       */
      label: {
        name: "label",
        type: "String",
        value: null,
        reflectToAttribute: false,
        observer: false
      },

      /**
       * An string that stores the current value for the picker
       */
      swatches: {
        name: "swatches",
        type: "Array",
        value: [],
        reflectToAttribute: false,
        observer: false
      },

      /**
       * An string that stores the current value for the picker
       */
      value: {
        name: "value",
        type: "String",
        value: "_getValue(__selectedDesc)",
        reflectToAttribute: false,
        "read-only": true,
        observer: false
      },

      /**
       * The aria-activedescendant attribute (active option's ID)
       */
      __activeDesc: {
        name: "__activeDesc",
        type: "String",
        value: "option-0-0",
        reflectToAttribute: false,
        observer: false
      },

      /**
       * The ID of the selected option
       */
      __selectedDesc: {
        name: "__selectedDesc",
        type: "String",
        value: "option-0-0",
        reflectToAttribute: false,
        observer: false
      },

      /**
       * The ID of the selected option
       */
      __selectedOption: {
        name: "__selectedOption",
        type: "Object",
        computed: "_getOption(__selectedDesc)",
        reflectToAttribute: false,
        observer: false
      },

      /**
       * Is it expanded?
       */
      expanded: {
        name: "expanded",
        type: "Boolean",
        value: false,
        reflectToAttribute: true,
        observer: false
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
   * returns the value of the selected option
   *
   * @param {options} the options array
   * @returns {object} the selected option value
   */
  _getValue(options) {
    let option = null;
    for (let i = 0; i < this.options.length; i++) {
      let row = this.options[i];
      for (let j = 0; j < row.length; j++) {
        if (row[j].selected === true) option = row[j];
      }
    }
    this.$.texture.style.display = option !== null ? "none" : "block";
    return option !== null ? option.value : null;
  }

  _getBgcolor(color) {
    return "background-color:" + color + ";";
  }

  _getOptionId(rownum, colnum) {
    return "option-" + rownum + "-" + colnum;
  }

  _getValue(__selectedDesc) {
    return this._getOption(__selectedDesc).value;
  }

  _getOption(optionId) {
    let coords = this.__selectedDesc.split("-");
    return this.options[coords[1]][coords[2]];
  }

  _isMatch(match, rownum, colnum) {
    return match === this._getOptionId(rownum, colnum);
  }

  _handleListboxClick(e) {
    this._toggleListbox(!this.expanded);
  }

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

  _handleOptionFocus(e) {
    this._setActiveOption(e.detail.id);
  }

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

  _setActiveOption(optionId) {
    this.__activeDesc = optionId;
  }

  _setSelectedOption(optionId) {
    this.__selectedDesc = optionId;
  }

  _toggleListbox(expanded) {
    this.expanded = expanded;
    if (expanded) {
      let active = this.shadowRoot.querySelector("#" + this.__activeDesc);
      if (active !== null) active.focus();
    } else {
      this._setSelectedOption(this.__activeDesc);
    }
  }

  /**
   * Set event listeners
   */
  ready() {
    super.ready();
    let root = this;
    for (let i = 0; i < this.options.length; i++) {
      for (let j = 0; j < this.options[i].length; j++) {
        let option = this.options[i][j];
        if (option.selected) {
          this.__activeDesc = this._getOptionId(i, j);
          this.__selectedDesc = this._getOptionId(i, j);
        }
      }
    }
    console.log(this.__activeDesc);
    this.$.listbox.addEventListener("click", function(e) {
      root._handleListboxClick(e);
    });
    this.$.listbox.addEventListener("keydown", function(e) {
      root._handleListboxKeydown(e);
    });
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
