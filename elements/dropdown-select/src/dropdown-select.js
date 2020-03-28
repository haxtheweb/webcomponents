import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-picker/simple-picker.js";
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
          --simple-picker-border-width: 0;
          --simple-picker-options-border-width: 1px;
          --simple-picker-options-border-color: var(
            --simple-fields-accent-color
          );
          --simple-picker-background-color: rgba(255, 255, 255, 0);
        }
        :host([hidden]) {
          display: none;
        }
      `
    ];
  }
  render() {
    return html`
      <simple-fields-container
        id="menu"
        .error-message="${this.errorMessage}"
        .label="${this.label}"
      >
        <simple-picker
          id="picker"
          slot="field"
          value="${this.value}"
          @expand="${this._onOpen}"
          @collapse="${this.onClose}"
          @changed="${this._dropDownChanged}"
        >
        </simple-picker>
      </simple-fields-container>
      <slot id="content" hidden></slot>
    `;
  }

  static get tag() {
    return "dropdown-select";
  }
  constructor() {
    super();
    this.label = "Select an option.";
    this.options = [[]];
    this.opened = false;
    this.setOptions();
    this.observer.observe(this, {
      attributes: false,
      childList: true,
      subtree: false
    });

    import("@lrnwebcomponents/simple-fields/lib/simple-fields-container.js");
  }

  disconnectedCallback() {
    this.observer.disconnect();
    super.disconnectedCallback();
  }

  static get properties() {
    return {
      /**
       * The error message to display when invalid.
       */
      errorMessage: {
        attribute: "error-message",
        type: String
      },

      /**
       * The label of the select menu
       */
      label: {
        type: String
      },
      /**
       * True if the dropdown is open. Otherwise, false.
       */
      opened: {
        type: Boolean
      },
      /**
       * Optional options array
       */
      options: {
        type: Array
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
      }
    };
  }
  /**
   * mutation observer for dropdown
   * @readonly
   * @returns {object}
   */
  get observer() {
    let callback = () => this.setOptions();
    return new MutationObserver(callback);
  }
  setOptions() {
    let options = [];
    this.querySelectorAll("paper-item").forEach((option, index) => {
      options.push([
        {
          alt: option.innerHTML,
          style: option.getAttribute("style") || undefined,
          icon: option.querySelector("[icon]")
            ? option.querySelector("[icon]").getAttribute("icon")
            : undefined,
          value:
            option.getAttribute("value") || option.getAttribute("id") || index
        }
      ]);
    });
    if (options === []) options = [[]];
    this.options = options;
  }

  updated(changedProperties) {
    let picker =
      this.shadowRoot && this.shadowRoot.querySelector("#picker")
        ? this.shadowRoot.querySelector("#picker")
        : undefined;
    changedProperties.forEach((oldValue, propName) => {
      console.log(propName, oldValue, this[propName]);
      if (propName === "value") this._valueChanged(this.value, oldValue);
      if (propName === "options" && this.options !== oldValue)
        picker.options = this.options;
    });
    this.dispatchEvent(
      new CustomEvent("change", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
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
    let picker =
      this.shadowRoot && this.shadowRoot.querySelector("#picker")
        ? this.shadowRoot.querySelector("#picker")
        : undefined;
    this.value = picker.value;
  }
  /**
   * Notice value has changed and ensure data model is accurate
   * @param {string} newValue
   * @param {string} oldValue
   * @fires dropdown-select-changed
   * @fires value-changed
   */
  _valueChanged(newValue, oldValue) {
    let label = null,
      index = null,
      ctr = -1;
    console.log("value-changed", {
      value: newValue,
      oldValue: oldValue
    });
    this.selectedItem = this.value;
    this.options.forEach(row =>
      row.forEach(item => {
        if (this.value === item.value) {
          label = item.alt || item.value;
          index = ctr++;
        }
      })
    );
    this.selectedItemLabel = label;
    this.selectedItemIndex = index;
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
