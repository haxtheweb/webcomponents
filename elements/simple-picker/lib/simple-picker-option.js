/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/iron-icon/iron-icon.js";
import "@polymer/iron-icons/iron-icons.js";
import "@lrnwebcomponents/lrn-shared-styles/lrn-shared-styles.js";
export { SimplePickerOption };
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
      <style is="custom-style" include="lrn-shared-styles">
        :host {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        :host .label {
          padding: 2px 10px;
          line-height: 100%;
          @apply --simple-picker-option-label;
        }
      </style>
      <iron-icon
        aria-hidden="true"
        hidden$="[[_hideIcon(icon)]]"
        icon$="[[icon]]"
      ></iron-icon>
      <div id="title" class$="[[_getSrOnly(hideOptionLabels)]]">[[title]]</div>
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
        type: "Boolean",
        value: null,
        reflectToAttribute: true
      },

      /**
       * Optional. If option is an iron icon, the iconset:name of the icon
       */
      icon: {
        name: "icon",
        type: "String",
        value: null,
        reflectToAttribute: false
      },

      /**
       * Hide option labels? As color-picker or icon-picker, labels may be redundant.
       * This option would move the labels off-screen so that only screen-readers will have them.
       */
      hideOptionLabels: {
        name: "hideOptionLabels",
        type: "Boolean",
        value: false,
        reflectToAttribute: true
      },

      /**
       * The id of the option
       */
      id: {
        name: "order",
        type: "String",
        value: null,
        reflectToAttribute: true
      },

      /**
       * Is the option selected?
       */
      selected: {
        name: "selected",
        type: "Boolean",
        value: false,
        reflectToAttribute: true
      },

      /**
       * The style of the option. (Required for accessibility.)
       */
      data: {
        name: "data",
        type: "Object",
        value: null
      },

      /**
       * The text of the option. (Required for accessibility.)
       */
      title: {
        name: "title",
        type: "String",
        value: null,
        reflectToAttribute: true,
        observer: "_updateTitle"
      },

      /**
       * Renders html as title. (Good for titles with HTML in them.)
       */
      titleAsHtml: {
        name: "titleAsHtml",
        type: "Boolean",
        value: false,
        reflectToAttribute: true
      },

      /**
       * The value of the option.
       */
      value: {
        name: "label",
        type: "String",
        value: null,
        reflectToAttribute: true
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "simple-picker-option";
  }

  /**
   * If the option is not an iron-icon, hide the iron-icon.
   *
   * @param {string} the icon property
   * @returns {boolean} whether or not the iron iron should be hidden
   */
  _hideIcon(icon) {
    return this.icon === null;
  }

  /**
   * On keyboard focus, fires an event to the picker so that active descendant can be set.
   */
  _handleFocus() {
    this.dispatchEvent(new CustomEvent("option-focus", { detail: this }));
  }

  /**
   * On mouse hover, fires an event to the picker so that active descendant can be set.
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
   */
  _updateTitle() {
    let title = document.createElement("span");
    if (this.titleAsHtml !== false) {
      title.innerHTML = this.title;
      this.$.title.innerHTML = "";
      this.$.title.appendChild(title);
    }
  }

  /**
   * Set event listeners
   */
  ready() {
    super.ready();
    let root = this;
    this._updateTitle();
    this.addEventListener("focus", function(e) {
      root._handleFocus();
    });
    this.addEventListener("mouseover", function(e) {
      root._handleHover();
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
window.customElements.define(SimplePickerOption.tag, SimplePickerOption);
