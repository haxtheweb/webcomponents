import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-dropdown-menu/paper-dropdown-menu.js";
import "@polymer/paper-item/paper-item.js";
import "@polymer/paper-listbox/paper-listbox.js";
/**
`dropdown-select`
An easy to use, works as expected dropdown menu. Add slotted items like follows:

<dropdown-select
  allow-outside-scroll
  always-float-label
  dynamic-align
  error-message="Required."
  horizontal-align="left"
  label="Select an item." 
  no-animations
  no-label-float
  placeholder="none" 
  restore-focus-on-close 
  vertical-align="bottom" 
  vertical-offset="10">
  <paper-item value="100">100 things</paper-item>
  <paper-item value="1000">Another value</paper-item>
  <paper-item value="10">Value is 10, but you will see this text</paper-item>
</dropdown-select>

@demo demo/index.html

*/
let DropdownSelect = Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
      paper-listbox ::slotted(paper-item) {
        display: block;
        width: 100%;
        min-height: 32px;
        vertical-align: text-top;
        line-height: 32px;
        @apply --dropdown-select-items;
      }
      paper-listbox paper-listbox {
        @apply --dropdown-listbox;
      }
    </style>
    <paper-dropdown-menu id="menu" allow-outside-scroll\$="[[allowOutsideScroll]]" always-float-label\$="[[alwaysFloatLabel]]" dynamic-align\$="[[dynamicAlign]]" error-message\$="[[errorMessage]]" horizontal-align\$="[[horizontalAlign]]" label\$="[[label]]" no-animations\$="[[noAnimations]]" no-label-float\$="[[noLabelFloat]]" on-selected-item-changed="_getSelectedValue" placeholder\$="[[placeholder]]" restore-focus-on-close\$="[[restoreFocusOnClose]]" vertical-align\$="[[verticalAlign]]" vertical-offset\$="[[verticalOffset]]">
      <paper-listbox id="listbox" slot="dropdown-content" class="dropdown-content">
        <slot id="content"></slot>
      </paper-listbox>
    </paper-dropdown-menu>
`,

  is: "dropdown-select",

  listeners: {
    "paper-dropdown-open": "_onOpen",
    "paper-dropdown-close": "_onClose"
  },

  properties: {
    /**
     * Set to true in order to prevent scroll from being constrained
     * to the dropdown when it opens.
     */
    allowOutsideScroll: {
      type: Boolean,
      value: false
    },

    /**
     * Set to true to always float the label.
     */
    alwaysFloatLabel: {
      type: Boolean,
      value: false
    },

    /**
     * If true, the `horizontalAlign` and `verticalAlign` properties will
     * be considered preferences instead of strict requirements when
     * positioning the dropdown and may be changed if doing so reduces
     * the area of the dropdown falling outside of `fitInto`.
     */
    dynamicAlign: {
      type: Boolean
    },

    /**
     * The error message to display when invalid.
     */
    errorMessage: {
      type: String
    },

    /**
     * The orientation against which to align the menu dropdown
     * horizontally relative to the dropdown trigger.
     */
    horizontalAlign: {
      type: String,
      value: "right"
    },

    /**
     * The label of the select menu
     */
    label: {
      type: String,
      value: "Select an option."
    },

    /**
     * Set to true to disable animations when opening and closing the
     * dropdown.
     */
    noAnimations: {
      type: Boolean,
      value: false
    },

    /**
     * Set to true to disable the floating label.
     */
    noLabelFloat: {
      type: Boolean,
      value: false
    },

    /**
     * True if the dropdown is open. Otherwise, false.
     */
    opened: {
      type: Boolean,
      value: false
    },

    /**
     * The placeholder for the dropdown.
     */
    placeholder: {
      type: String
    },

    /**
     * Whether focus should be restored to the dropdown when the menu closes.
     */
    restoreFocusOnClose: {
      type: Boolean,
      value: true
    },

    /**
     * The last selected item.
     */
    selectedItem: {
      type: Object
    },

    /**
     * The index of the selected item
     */
    selectedItemIndex: {
      type: Number,
      value: null
    },

    /**
     * The label of the selected item
     */
    selectedItemLabel: {
      type: String,
      value: null
    },

    /**
     * The default value
     */
    value: {
      type: String,
      value: null
    },

    /**
     * The orientation against which to align the menu dropdown
     * vertically relative to the dropdown trigger.
     */
    verticalAlign: {
      type: String,
      value: "top"
    },

    /**
     * Overrides the vertical offset computed in
     * _computeMenuVerticalOffset.
     */
    verticalOffset: {
      type: Number
    }
  },

  /**
   * Get the value of the selected item.
   */
  _getSelectedValue: function(e) {
    if (e.detail.value !== null) {
      this.value = e.detail.value.getAttribute("value");
      this._setSelectedValues();
      this.fire("change", { value: this.value }); //support for old version
      this.fire("dropdown-select-changed", this);
    }
  },

  /**
   * Sets the opened property to true
   */
  _onOpen: function(e) {
    this.opened = true;
  },

  /**
   * Sets the opened property to false
   */
  _onClose: function(e) {
    this.opened = false;
  },

  /**
   * Get the value of the selected item.
   */
  _setSelectedValues: function() {
    this.selectedItem = this.$.menu.selectedItem;
    this.selectedItemLabel = this.$.menu.selectedItemLabel;
    this.selectedItemIndex = this.$.listbox.selected;
  },

  /**
   * Set the index of the selected item.
   */
  attached: function() {
    let children = this.$.listbox.querySelectorAll("paper-item");
    if (children !== undefined && children !== null) {
      for (let i = 0; i < children.length; i++) {
        if (this.value === children[i].getAttribute("value")) {
          this.$.listbox.selected = i;
          this._setSelectedValues();
        }
      }
    }
  }
});
export { DropdownSelect };
