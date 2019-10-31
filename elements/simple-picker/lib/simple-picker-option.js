/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@lrnwebcomponents/lrn-shared-styles/lrn-shared-styles.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
/**
 * `simple-picker-option`
 * `a simple picker for options, icons, etc.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @see ../simple-picker.js
 * @see ../simple-color-picker-row.js
 */
class SimplePickerOption extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style include="lrn-shared-styles">
        :host {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: var(--simple-picker-color);
        }
        :host div {
          margin: unset;
          padding: unset;
        }
        :host([hidden]) {
          display: none;
        }
        :host .label {
          padding: var(--simple-picker-option-padding, 2px 10px);
          line-height: 100%;
          width: max-content;
          @apply --simple-picker-option-label;
        }

        :host iron-icon {
          width: var(--simple-picker-option-size, 24px);
          min-height: var(--simple-picker-option-size, 24px);
          min-width: var(--simple-picker-option-size, 24px);
          line-height: var(--simple-picker-option-size, 24px);
          @apply --simple-picker-icon;
        }
      </style>
      <iron-icon
        aria-hidden="true"
        hidden$="[[_hideIcon(icon)]]"
        icon$="[[icon]]"
      ></iron-icon>
      <div id="label" class$="[[_getSrOnly(hideOptionLabels)]]">[[label]]</div>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Is the option active?
       */
      active: {
        name: "active",
        type: Boolean,
        value: null,
        reflectToAttribute: true
      },

      /**
       * The style of the option. (Required for accessibility.)
       */
      data: {
        name: "data",
        type: Object,
        value: null
      },

      /**
       * If the option is hidden
       */
      hidden: {
        name: "hidden",
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
        value: false,
        reflectToAttribute: true
      },

      /**
       * Optional. If option is an iron icon, the iconset:name of the icon
       */
      icon: {
        name: "icon",
        type: String,
        value: null,
        reflectToAttribute: false
      },

      /**
       * The id of the option
       */
      id: {
        name: "order",
        type: String,
        value: null,
        reflectToAttribute: true
      },

      /**
       * The text of the option. (Required for accessibility.)
       */
      label: {
        name: "label",
        type: String,
        value: null,
        reflectToAttribute: true,
        observer: "_updateLabel"
      },

      /**
       * Is the option selected?
       */
      selected: {
        name: "selected",
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * Renders html as title. (Good for titles with HTML in them.)
       */
      titleAsHtml: {
        name: "titleAsHtml",
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },

      /**
       * The value of the option.
       */
      value: {
        name: "label",
        type: String,
        value: null,
        reflectToAttribute: true
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   */
  static get tag() {
    return "simple-picker-option";
  }

  /**
   * If the option is not an iron-icon, hide the iron-icon.
   *
   * @param {string} icon the icon property
   * @returns {boolean} whether or not the iron iron should be hidden
   */
  _hideIcon(icon) {
    return this.icon === null;
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

  /**
   * determines if a label should visible on screen
   *
   * @param {boolean} hideOptionLabels property
   * @returns {string} the sr-only (screenreader-only) class
   */
  _getSrOnly(hideOptionLabels) {
    return hideOptionLabels === false ? "label" : "label sr-only";
  }

  /**
   * updates the title
   * @returns {void}
   */
  _updateLabel() {
    let label = document.createElement("span");
    if (this.titleAsHtml !== false) {
      label.innerHTML = this.label;
      this.shadowRoot.querySelector("#label").innerHTML = "";
      this.shadowRoot.querySelector("#label").appendChild(label);
    }
  }

  /**
   * Set event listeners
   * @returns {void}
   */
  ready() {
    super.ready();
    let root = this;
    this._updateLabel();
    this.addEventListener("focus", function(e) {
      root._handleFocus();
    });
    this.addEventListener("mouseover", function(e) {
      root._handleHover();
    });
  }
  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(SimplePickerOption.tag, SimplePickerOption);
export { SimplePickerOption };
