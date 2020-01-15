/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { ifDefined } from "lit-html/directives/if-defined.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-icons/av-icons.js";

export { A11yMediaButton };
/**
 * `a11y-media-button`
 * a button used in a11y-media-controls and a11y-media-transcript-controls.
 *
 * @customElement
 */
class A11yMediaButton extends LitElement {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,
      /**
       * is button action to send as an event
       */
      action: {
        attribute: "action",
        reflect: true,
        type: String
      },
      /*
       * id of element button controls
       */
      controls: {
        attribute: "controls",
        reflect: true,
        type: String
      },
      /*
       * iron-icon type
       */
      icon: {
        attribute: "icon",
        type: String
      },
      /*
       * button label
       */
      label: {
        attribute: "label",
        type: String
      },
      /*
       * Is it toggled on?
       */
      toggle: {
        attribute: "toggle",
        type: Boolean,
        reflect: true
      },
      /*
       * Is it disabled?
       */
      disabled: {
        attribute: "disabled",
        type: Boolean
      },
      /*
       * Is it disabled?
       */
      tooltipPosition: {
        attribute: "tooltip-position",
        type: String
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.

   */
  static get tag() {
    return "a11y-media-button";
  }

  //inherit styles from a11y-media-player or a11y-media-transcript
  constructor() {
    super();
    this.action = null;
    this.controls = "video";
    this.disabled = false;
    this.icon = null;
    this.toggle = false;
    this.tooltipPosition = "bottom";
    import("@polymer/paper-tooltip/paper-tooltip.js");
  }

  static get styles() {
    return [
      this.buttonStyles,
      css`
        :host {
          margin: 0;
          padding: 0;
        }
        #button {
          margin: 0;
          padding: 8px;
          line-height: 1;
          border: none;
          transition: color 0.25s;
          color: var(--a11y-media-button-color);
          background-color: var(--a11y-media-button-bg-color);
        }
        :host([toggle]) #button {
          color: var(--a11y-media-button-toggle-color);
          background-color: var(--a11y-media-button-toggle-bg-color);
        }
        :host([toggle]:active) #button,
        :host([toggle]:focus) #button,
        :host([toggle]:hover) #button,
        :host(:active) #button,
        :host(:focus) #button,
        :host(:hover) #button {
          color: var(--a11y-media-button-hover-color);
          background-color: var(--a11y-media-button-hover-bg-color);
        }
        :host([disabled]) #button {
          color: var(--a11y-media-button-disabled-color);
          cursor: none;
        }
        .sr-only {
          position: absolute;
          left: -99999;
          top: 0;
          height: 0;
          width: 0;
          overflow: hidden;
        }
        paper-tooltip {
          z-index: 100;
        }
        paper-tooltip:not(:defined) {
          display: none;
        }
        iron-icon {
          display: inline-block;
        }
      `
    ];
  }
  static get buttonStyles() {
    return [
      css`
        #button {
          margin: 0;
          border: none;
        }
        .sr-only {
          position: absolute;
          left: -99999;
          top: 0;
          height: 0;
          width: 0;
          overflow: hidden;
        }
        paper-tooltip {
          z-index: 100;
        }
        paper-tooltip:not(:defined) {
          display: none;
        }
      `
    ];
  }

  render() {
    return html`
      <button
        id="button"
        aria-label="${ifDefined(this.label)}"
        aria-pressed="${this.toggle ? "true" : "false"}"
        controls="${this.controls}"
        tabindex="0"
        @click="${this._buttonClick}"
        ?disabled="${this.disabled}"
        ?toggle="${this.toggle}"
      >
        <iron-icon icon="${this.icon}"></iron-icon>
      </button>
      <paper-tooltip for="button" position="${this.tooltipPosition}"
        >${this.label}</paper-tooltip
      >
    `;
  }

  /**
   * lets player know this button was clicked
   */
  _buttonClick(e) {
    console.log("button-click", e);
    /**
     * Fires when button is clicked
     * @event click-details
     */
    this.dispatchEvent(new CustomEvent("button-click", { detail: this }));
  }
}
window.customElements.define(A11yMediaButton.tag, A11yMediaButton);
