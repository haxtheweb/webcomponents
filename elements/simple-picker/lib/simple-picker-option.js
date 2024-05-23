/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import "@haxtheweb/simple-icon/lib/simple-icon-lite.js";
import "@haxtheweb/simple-icon/lib/simple-icons.js";
/**
 * `simple-picker-option`
 * a simple picker for options, icons, etc.
 * 
### Styling

`<a11y-gif-player>` provides the following custom properties
for styling:

Custom property | Description | Default
----------------|-------------|----------
`--simple-picker-color` | color of simple picker text | unset
`--simple-picker-option-padding` | padding within each simple picker option | 2px 10px
`--simple-picker-option-label-padding` | adding within each simple picker option's label | --simple-picker-option-padding
`--simple-picker-option-size` | size of each simple picker option | 24px
 *
 * @see ../simple-picker.js
 * @element simple-picker-option
 */
class SimplePickerOption extends LitElement {
  //styles
  static get styles() {
    return css`
      :host {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: var(--simple-picker-color);
      }
      :host([hidden]) {
        display: none;
      }
      div {
        margin: unset;
        padding: unset;
      }
      #label {
        padding: var(
          --simple-picker-option-label-padding,
          var(--simple-picker-option-padding, 2px 10px)
        );
        line-height: 100%;
        width: max-content;
      }

      :host([hide-option-labels]) #label {
        position: absolute;
        left: -999999px;
        width: 0;
        height: 0;
        overflow: hidden;
      }

      simple-icon-lite {
        --simple-icon-width: var(--simple-picker-option-size, 24px);
        --simple-icon-height: var(--simple-picker-option-size, 24px);
        width: var(--simple-picker-option-size, 24px);
        min-height: var(--simple-picker-option-size, 24px);
        min-width: var(--simple-picker-option-size, 24px);
        line-height: var(--simple-picker-option-size, 24px);
      }
    `;
  }

  // render function
  render() {
    return html`
      <simple-icon-lite
        ?hidden="${!this.icon}"
        .icon="${this.icon}"
        aria-hidden="true"
      ></simple-icon-lite>
      <div id="label">
        <slot ?hidden="${!this.titleAsHtml}"></slot>
        ${this.titleAsHtml ? `` : this.label}
      </div>
    `;
  }

  constructor() {
    super();
    this.active = null;
    this.data = null;
    this.hidden = false;
    this.hideOptionLabels = false;
    this.icon = null;
    this.id = null;
    this.label = null;
    this.selected = false;
    this.titleAsHtml = false;
    this.value = null;
    setTimeout(() => {
      this.addEventListener("focus", this._handleFocus.bind(this));
      this.addEventListener("mouseover", this._handleHover.bind(this));
    }, 0);
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Is the option active?
       */
      active: {
        type: Boolean,
        reflect: true,
      },

      /**
       * The style of the option. (Required for accessibility.)
       */
      data: {
        type: Object,
      },

      /**
       * If the option is hidden
       */
      hidden: {
        type: Boolean,
        reflect: true,
      },

      /**
       * Hide option labels? As color-picker or icon-picker, labels may be redundant.
       * This option would move the labels off-screen so that only screen-readers will have them.
       */
      hideOptionLabels: {
        type: Boolean,
        reflect: true,
        attribute: "hide-option-labels",
      },

      /**
       * Optional. If option is an iron icon, the iconset:name of the icon
       */
      icon: {
        type: String,
      },

      /**
       * The id of the option
       */
      id: {
        type: String,
        reflect: true,
      },

      /**
       * The text of the option. (Required for accessibility.)
       */
      label: {
        type: String,
        reflect: true,
      },

      /**
       * Is the option selected?
       */
      selected: {
        type: Boolean,
        reflect: true,
      },

      /**
       * styles object to allow for piercing of shadow DOM
       */
      styles: {
        type: Object,
      },

      /**
       * Renders html as title. (Good for titles with HTML in them.)
       */
      titleAsHtml: {
        type: Boolean,
        reflect: true,
        attribute: "title-as-html",
      },

      /**
       * The value of the option.
       */
      value: {
        type: String,
        reflect: true,
      },
    };
  }

  updated(changedProperties) {
    super.updated(changedProperties);
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "label") {
        this.innerHTML = this.label;
      }
    });
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "simple-picker-option";
  }

  /**
   * On keyboard focus, fires an event to the picker so that active descendant can be set.
   * @returns {void}
   */
  _handleFocus() {
    this.dispatchEvent(new CustomEvent("option-focus", { detail: this }));
  }

  /**
   * On mouse hover, fires an event to the picker so that active descendant can be set.
   * @returns {void}
   */
  _handleHover() {
    this.dispatchEvent(new CustomEvent("option-focus", { detail: this }));
  }
}
customElements.define(SimplePickerOption.tag, SimplePickerOption);
export { SimplePickerOption };
