/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "@polymer/iron-icons/iron-icons.js";
import "./extensible-toolbar-button-styles.js";
/**
 * `extensible-toolbar-button`
 * `a button for rich text editor (custom buttons can extend this)`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 */
class ExtensibleToolbarButton extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style include="extensible-toolbar-button-styles">
        :host .toolbar-button {
          min-width: var(--extensible-toolbar-button-min-width);
          height: var(--extensible-toolbar-button-height);
          margin: var(--extensible-toolbar-button-margin);
          padding: var(--extensible-toolbar-button-padding);
        }
      </style>
      <iron-a11y-keys
        id="a11y"
        target="[[__a11y]]"
        keys="enter"
        on-keys-pressed="_handleButton"
      >
      </iron-a11y-keys>
      <paper-button
        id="button"
        class="toolbar-button"
        disabled$="[[disabled]]"
        controls$="[[controls]]"
        on-click="_handleButton"
        tabindex="0"
        toggled$="[[toggled]]"
      >
        <iron-icon id="icon" aria-hidden icon$="[[__icon]]"></iron-icon>
        <span id="label" class$="[[labelStyle]]">[[__label]]</span>
      </paper-button>
      <paper-tooltip id="tooltip" aria-hidden for="button"
        >[[__label]]</paper-tooltip
      >
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * The minimum breakpoint where the button appears, expressed as `xs`, `sm`, `md`, `lg`, or `xl`
       */
      collapsedUntil: {
        name: "collapsedUntil",
        type: String,
        value: "xs"
      },
      /**
       * The `id` of the element that the toolbar controls.
       */
      controls: {
        name: "controls",
        type: String
      },

      /**
       * Is the button disabled? Default is false.
       */
      disabled: {
        name: "disabled",
        type: Boolean,
        value: false
      },

      /**
       * Optional iron icon name for the button.
       */
      icon: {
        name: "icon",
        type: String,
        value: null
      },

      /**
       * Label for the icon.
       */
      label: {
        name: "label",
        type: String,
        value: null
      },

      /**
       * Hide the label offscreen?
       */
      labelStyle: {
        name: "labelStyle",
        type: String,
        computed: "_labelStyle(icon,showTextLabel)",
        readOnly: true
      },

      /**
       * Optional space-sperated list of keyboard shortcuts for the editor
       * to fire this button, see iron-a11y-keys for more info.
       */
      shortcutKeys: {
        name: "shortcutKeys",
        type: String,
        value: null
      },

      /**
       * Show text label even if an icon is named?
       */
      showTextLabel: {
        name: "showTextLabel",
        type: Boolean,
        value: false
      },

      /**
       * Is this button toggled?
       */
      toggled: {
        name: "toggled",
        type: Boolean,
        value: false,
        notify: true
      },

      /**
       * Optional iron icon name for the button if it is toggled.
       */
      toggledIcon: {
        name: "toggledIcon",
        type: String,
        value: null
      },

      /**
       * Label for the icon, if button is toggled.
       */
      toggledLabel: {
        name: "toggledLabel",
        type: String,
        value: null
      },

      /**
       * The label for the button based on its toggled state
       */
      __label: {
        name: "__label",
        type: String,
        computed: "_getLabel(toggled,label,toggledLabel)",
        notify: true
      },

      /**
       * The label for the button based on its toggled state
       */
      __icon: {
        name: "__icon",
        type: String,
        computed: "_getIcon(toggled,icon,toggledIcon)",
        notify: true
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "extensible-toolbar-button";
  }

  /**
   * life cycle, element is ready
   */
  ready() {
    super.ready();
    let root = this;
    root.addEventListener("keypress", function(e) {
      e.preventDefault();
    });
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.__a11y = this.$.button;
  }

  /**
   * life cycle, element is detatched
   */
  disconnectedCallback() {
    super.disconnectedCallback();
  }

  /**
   * excutes the button's command
   */
  buttonAction() {
    this.dispatchEvent(
      new CustomEvent("button-action", {
        bubbles: true,
        cancelable: true,
        composed: true,
        detail: this
      })
    );
  }

  /**
   * Handles button tap
   */
  _handleButton(e) {
    e.preventDefault();
    console.log("_handleButton", e);
    this.buttonAction();
  }

  /**
   * gets the label based on whether the button is toggled
   *
   * @param {boolean} toggled if the button is toggled
   * @param {string} label the default label
   * @param {string} toggledLabel the label when toggled
   * @returns {string} the label based on whether or not the button is toggled
   *
   */
  _getLabel(toggled, label, toggledLabel) {
    return toggled && toggledLabel !== null ? toggledLabel : label;
  }

  /**
   * gets the icon based on whether the button is toggled
   *
   * @param {boolean} toggled if the button is toggled
   * @param {string} icon the default icon
   * @param {string} toggledIcon the label when toggled
   * @returns {string} the icon based on whether or not the button is toggled
   *
   */
  _getIcon(toggled, icon, toggledIcon) {
    return toggled && toggledIcon !== null ? toggledIcon : icon;
  }

  /**
   * Handles keys the same way a button is handled
   * @param {event} e the  event
   */
  _keysPressed(e) {
    e.preventDefault();
    this._handleButton(e);
  }

  /**
   * Determines if an iron icon has been named for the button.
   *
   * @param {string} the name of the icon
   * @returns {boolean} if an icon is named
   */
  _labelStyle(icon, showTextLabel) {
    return icon !== undefined &&
      icon !== null &&
      icon !== "" &&
      showTextLabel === false
      ? "offscreen"
      : null;
  }
}
window.customElements.define(
  ExtensibleToolbarButton.tag,
  ExtensibleToolbarButton
);
export { ExtensibleToolbarButton };
