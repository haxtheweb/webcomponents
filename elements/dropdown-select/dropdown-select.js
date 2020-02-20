import { LitElement, html, css } from "lit-element/lit-element.js";
/**
 * `dropdown-select`
 * an easy to use, works as expected dropdown menu.
 *
 * @customElement dropdown-select
 * @demo demo/index.html
 */
class DropdownSelect extends LitElement {
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }
        paper-listbox ::slotted(paper-item) {
          display: block;
          width: calc(100% - 32px);
          padding: 0 16px;
          min-height: 32px;
          vertical-align: text-top;
          line-height: 32px;
        }
      `
    ];
  }
  render() {
    return html`
      <paper-dropdown-menu
        id="menu"
        .error-message="${this.errorMessage}"
        .horizontal-align="${this.horizontalAlign}"
        .label="${this.label}"
        .placeholder="${this.placeholder}"
        .vertical-align="${this.verticalAlign}"
        .vertical-offset="${this.verticalOffset}"
        ?allow-outside-scroll="${this.allowOutsideScroll}"
        ?always-float-label="${this.alwaysFloatLabel}"
        ?dynamic-align="${this.dynamicAlign}"
        ?no-animations="${this.noAnimations}"
        ?no-label-float="${this.noLabelFloat}"
        ?restore-focus-on-close="${this.restoreFocusOnClose}"
        @paper-dropdown-open="${this._onOpen}"
        @paper-dropdown-close="${this.onClose}"
        @selected-item-changed="${this._dropDownChanged}"
      >
        <paper-listbox
          id="listbox"
          slot="dropdown-content"
          class="dropdown-content"
          .selected="${this.selectedItemIndex}"
        >
          <slot id="content"></slot>
        </paper-listbox>
      </paper-dropdown-menu>
    `;
  }

  static get tag() {
    return "dropdown-select";
  }
  constructor() {
    super();
    this.allowOutsideScroll = false;
    this.alwaysFloatLabel = false;
    this.dynamicAlign = false;
    this.horizontalAlign = "right";
    this.label = "Select an option.";
    this.noAnimations = false;
    this.noLabelFloat = false;
    this.opened = false;
    this.restoreFocusOnClose = true;
    this.selectedItemIndex = null;
    this.selectedItemLabel = null;
    this.value = null;
    this.verticalAlign = "top";
    import("@polymer/paper-dropdown-menu/paper-dropdown-menu.js");
    import("@polymer/paper-item/paper-item.js");
    import("@polymer/paper-listbox/paper-listbox.js");
  }

  static get properties() {
    return {
      /**
       * @property {boolean} allowOutsideScroll
       *
       * Set to true in order to prevent scroll from being constrained
       * to the dropdown when it opens.
       */
      allowOutsideScroll: {
        attribute: "allow-outside-scroll",
        type: Boolean
      },

      /**
       * Set to true to always float the label.
       */
      alwaysFloatLabel: {
        attribute: "always-float-label",
        type: Boolean
      },

      /**
       * If true, the `horizontalAlign` and `verticalAlign` properties will
       * be considered preferences instead of strict requirements when
       * positioning the dropdown and may be changed if doing so reduces
       * the area of the dropdown falling outside of `fitInto`.
       */
      dynamicAlign: {
        attribute: "dynamic-align",
        type: Boolean
      },

      /**
       * The error message to display when invalid.
       */
      errorMessage: {
        attribute: "error-message",
        type: String
      },

      /**
       * The orientation against which to align the menu dropdown
       * horizontally relative to the dropdown trigger.
       */
      horizontalAlign: {
        attribute: "horizontal-align",
        type: String
      },

      /**
       * The label of the select menu
       */
      label: {
        type: String
      },

      /**
       * Set to true to disable animations when opening and closing the
       * dropdown.
       */
      noAnimations: {
        attribute: "no-animations",
        type: Boolean
      },

      /**
       * Set to true to disable the floating label.
       */
      noLabelFloat: {
        attribute: "no-label-float",
        type: Boolean
      },

      /**
       * True if the dropdown is open. Otherwise, false.
       */
      opened: {
        type: Boolean
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
        attribute: "restore-focus-on-close",
        type: Boolean
      },

      /**
       * The last selected item.
       */
      selectedItem: {
        attribute: "selected-item",
        type: Object
      },

      /**
       * The index of the selected item
       */
      selectedItemIndex: {
        attribute: "selected-item-index",
        type: Number
      },

      /**
       * The label of the selected item
       */
      selectedItemLabel: {
        attribute: "selected-item-label",
        type: String
      },

      /**
       * The default value
       */
      value: {
        type: String,
        reflect: true
      },

      /**
       * The orientation against which to align the menu dropdown
       * vertically relative to the dropdown trigger.
       */
      verticalAlign: {
        attribute: "vertical-align",
        type: String
      },

      /**
       * Overrides the vertical offset computed in
       * _computeMenuVerticalOffset.
       */
      verticalOffset: {
        attribute: "vertical-offset",
        type: Number
      }
    };
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "value") this._valueChanged(this.value, oldValue);
    });
    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: { value: this.value }
      })
    );
  }

  /**
   * Sets the opened property to true
   */
  _onOpen() {
    this.opened = true;
    this.dispatchEvent(
      new CustomEvent("open", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
  }

  /**
   * Sets the opened property to false
   */
  _onClose() {
    this.opened = false;
    this.dispatchEvent(
      new CustomEvent("close", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
  }
  /**
   * updates value when dropdown-menu's selected item changes
   * @param {event} e change event
   */
  _dropDownChanged(e) {
    this.value = e.detail.value ? e.detail.value.getAttribute("value") : null;
  }
  /**
   * Notice value has changed and ensure data model is accurate
   * @param {string} newValue
   * @param {string} oldValue
   * @fires dropdown-select-changed
   * @fires value-changed
   */
  _valueChanged(newValue, oldValue) {
    let items = Array.prototype.slice.call(this.querySelectorAll(`paper-item`));
    this.selectedItem = this.querySelector(`paper-item[value="${newValue}"]`);
    this.selectedItemLabel = this.selectedItem
      ? this.selectedItem.innerHTML
      : null;
    this.selectedItemIndex = this.selectedItem
      ? items.indexOf(this.selectedItem)
      : null;
    if (typeof oldValue !== typeof undefined) {
      this.dispatchEvent(
        new CustomEvent("value-changed", {
          bubbles: true,
          cancelable: true,
          composed: true,
          target: this,
          detail: {
            value: newValue,
            oldValue: oldValue
          }
        })
      );
      this.dispatchEvent(
        new CustomEvent("dropdown-select-changed", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this
        })
      );
    }
  }

  /**
   * @event awesome-change
   *
   * Fired when `element` changes its awesomeness level.
   */

  /**
   * @event value-changed
   *
   * fired when value has changed
   * @param {object} target dropdown-select instance
   * @param {object} detail `{ value: newValue, oldValue: oldValue }`
   */

  /**
   * @event dropdown-select-changed
   *
   * fired when value has changed (deprecated)
   * @param {object} detail dropdown-select instance
   */
}
window.customElements.define(DropdownSelect.tag, DropdownSelect);
export { DropdownSelect };
