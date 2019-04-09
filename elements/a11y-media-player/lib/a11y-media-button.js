/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { A11yMediaBehaviors } from "./a11y-media-behaviors.js";
import "@polymer/iron-icons/iron-icons.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "@polymer/iron-icons/av-icons.js";
import "@polymer/paper-tooltip/paper-tooltip.js";

export { A11yMediaButton };
/**
 * `a11y-media-button`
 * `A button used in a11y-media-controls and a11y-media-transcript-controls.`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @extends A11yMediaBehaviors
 * @customElement
 * @polymer
 */
class A11yMediaButton extends A11yMediaBehaviors {
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * is button action to send as an event
       */
      action: {
        type: String,
        value: null
      },
      /*
       * id of element button controls
       */
      controls: {
        type: String,
        value: "video"
      },
      /*
       * iron-icon type
       */
      icon: {
        type: String,
        value: null
      },
      /*
       * button label
       */
      label: {
        type: String,
        value: null
      },
      /*
       * Is it toggled on?
       */
      toggle: {
        type: Boolean,
        value: false,
        reflectToAttribute: true
      },
      /*
       * Is it disabled?
       */
      disabled: {
        type: Boolean,
        value: null
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "a11y-media-button";
  }

  //get player-specifc properties
  static get behaviors() {
    return [A11yMediaBehaviors];
  }

  //render function
  static get template() {
    return html`
      <style>
        :host {
          margin: 0;
          padding: 0;
        }
        :host #button {
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
          cursor: pointer;
          color: var(--a11y-media-button-hover-color);
          background-color: var(--a11y-media-button-hover-bg-color);
        }
        :host .sr-only {
          position: absolute;
          left: -99999;
          top: 0;
          height: 0;
          width: 0;
          overflow: hidden;
        }
        :host paper-tooltip {
          z-index: 100;
        }
        iron-icon {
          display: inline-block;
        }
      </style>
      <button
        id="button"
        aria-label$="[[label]]"
        aria-pressed$="[[toggle]]"
        controls="[[controls]]"
        disabled$="[[disabled]]"
        on-tap="_buttonTap"
        role="button"
        tabindex="0"
        toggle$="[[toggle]]"
      >
        <iron-icon icon="[[icon]]"></iron-icon>
      </button>
      <paper-tooltip for="button">[[label]]</paper-tooltip>
      <iron-a11y-keys
        id="a11y"
        keys="enter space"
        target$="[[__target]]"
        on-keys-pressed="_buttonTap"
      ></iron-a11y-keys>
    `;
  }

  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }

  /**
   * sets target for a11y keys
   */
  ready() {
    super.ready();
    this.__target = this.$.button;
  }

  /**
   * lets player know this button was clicked
   */
  _buttonTap() {
    this.dispatchEvent(new CustomEvent("tap", { detail: this }));
  }
}
window.customElements.define(A11yMediaButton.tag, A11yMediaButton);
