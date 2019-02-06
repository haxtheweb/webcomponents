/**
 * Copyright 2019 Penn State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-button/paper-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/iron-icons/iron-icons.js";
/**
 * `rich-text-editor-button`
 * `a standalone rich text editor`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html
 */
class RichTextEditorButton extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: flex;
          flex: 0 0 auto;
          align-items: stretch;
          margin: 3px;
        }
        :host([hidden]) {
          display: none;
        }
        :host #button {
          text-transform: unset;
          color: var(--rich-text-editor-button-color, #444);
          border-color: var(--rich-text-editor-button-border, transparent);
          padding: 0;
          transition: all 0.5s;
          min-width: 24px;
          height: 24px;
          @apply --rich-text-editor-button;
        }
        :host([disabled]) #button {
          cursor: not-allowed;
          color: var(--rich-text-editor-button-disabled-color, #666);
          background-color: var(--rich-text-editor-button-disabled-bg, transparent);
          @apply --rich-text-editor-button-disabled;
        }
        :host([toggled]) #button {
          color: var(--rich-text-editor-button-toggled-color, #222);
          background-color: var(--rich-text-editor-button-toggled-bg, #e0e0e0);
          @apply --rich-text-editor-button-toggled;
        }
        :host #button:focus,
        :host #button:hover {
          color: var(--rich-text-editor-button-hover-color, #000);
          background-color: var(--rich-text-editor-button-hover-bg, #f0f0f0);
        }
        :host #icon:not([icon]) {
          display:none;
        }
        :host #label.offscreen {
          position: absolute;
          left: -999999px;
          top: 0;
          height: 0;
          width: 0;
          overflow: hidden;
        }
      </style>
      <iron-a11y-keys
        id="a11y"
        target="[[__a11y]]"
        keys="enter"
        on-keys-pressed="_buttonTap">
      </iron-a11y-keys>
      <paper-button id="button"
        disabled$="[[disabled]]" 
        controls="[[controls]]"
        on-tap="_buttonTap"
        tabindex="0"
        toggled$="[[toggled]]">
        <iron-icon id="icon" 
          aria-hidden
          icon$="[[icon]]">
        </iron-icon>
        <span id="label" class$="[[labelStyle]]">[[label]]</span>
      </paper-button>
      <paper-tooltip id="tooltip" 
        for="button">
        [[label]]
      </paper-button>
    `;
  }

  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * Is the button disabled? Default is false.
       */
      disabled: {
        name: "disabled",
        type: "Boolean",
        value: false
      },

      /**
       * Event that this button fires.
       */
      command: {
        name: "command",
        type: "String",
        value: null
      },

      /**
       * Event that this button fires.
       */
      event: {
        name: "event",
        type: "String",
        value: null
      },

      /**
       * Optional iron icon name for the button.
       */
      icon: {
        name: "icon",
        type: "String",
        value: null
      },

      /**
       * Label for the icon.
       */
      label: {
        name: "label",
        type: "String",
        value: null
      },

      /**
       * Hide the label offscreen?
       */
      labelStyle: {
        name: "labelStyle",
        type: "String",
        computed: "_labelStyle(icon,showTextLabel)",
        readOnly: true
      },

      /**
       * Show text label even if an icon is named?
       */
      showTextLabel: {
        name: "showTextLabel",
        type: "Boolean",
        value: false
      },

      /**
       * Is the button toggled on? Default is false.
       */
      toggled: {
        name: "toggled",
        type: "Boolean",
        value: false
      },

      /**
       * Can this button toggle?
       */
      toggles: {
        name: "toggles",
        type: "Boolean",
        value: false
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rich-text-editor-button";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.__a11y = this.$.button;
  }

  /**
   * Determines if an iron icon has been named for the button.
   *
   * @param {string} the name of the icon
   * @returns {boolean} if an icon is named
   */
  _buttonTap(e) {
    this.dispatchEvent(
      new CustomEvent("rich-text-button-tap", { detail: this })
    );
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

  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}
window.customElements.define(RichTextEditorButton.tag, RichTextEditorButton);
export { RichTextEditorButton };
