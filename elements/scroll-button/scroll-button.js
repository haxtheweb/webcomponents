/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import "@polymer/paper-icon-button/paper-icon-button.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
import "@polymer/iron-icons/iron-icons.js";
/**
 * `scroll-button`
 * @customElement scroll-button
 * `button to scroll to an area or back to top`
 *
 * @microcopy - language worth noting:
 *  -
 *

 * @polymer
 * @demo demo/index.html
 */
class ScrollButton extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          --scroll-button-z-index: 99;
          z-index: var(--scroll-button-z-index);
        }

        :host([hidden]) {
          display: none;
        }
        paper-icon-button {
          background-color: rgba(0, 0, 0, 0.6);
          color: white;
          @apply --scroll-button-button;
        }
        paper-icon-button:hover,
        paper-icon-button:active,
        paper-icon-button:focus {
          background-color: rgba(0, 0, 0, 1);
          @apply --scroll-button-button-active;
        }
        paper-tooltip {
          --paper-tooltip-background: #000000;
          --paper-tooltip-opacity: 1;
          --paper-tooltip-text-color: #ffffff;
          --paper-tooltip-delay-in: 0;
          --paper-tooltip: {
            border-radius: 0;
          }
          @apply --scroll-button-tooltip;
        }
      </style>
      <paper-icon-button
        id="btn"
        icon="[[icon]]"
        title="[[label]]"
      ></paper-icon-button>
      <paper-tooltip for="btn" position="[[position]]" offset="14">
        [[label]]
      </paper-tooltip>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Scroll button",
        description: "button to scroll to an area or back to top",
        icon: "icons:android",
        color: "green",
        groups: ["Button"],
        handles: [
          {
            type: "todo:read-the-docs-for-usage"
          }
        ],
        meta: {
          author: "btopro",
          owner: "The Pennsylvania State University"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "target",
            description: "",
            inputMethod: "array",
            required: false,
            icon: "icons:android"
          },
          {
            property: "icon",
            description: "",
            inputMethod: "textfield",
            required: false,
            icon: "icons:android"
          },
          {
            property: "label",
            description: "",
            inputMethod: "textfield",
            required: false,
            icon: "icons:android"
          }
        ],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      target: {
        name: "target",
        type: Object
      },
      icon: {
        name: "icon",
        type: String,
        value: "icons:expand-less"
      },
      label: {
        name: "label",
        type: String,
        value: "Scroll to top"
      },
      position: {
        name: "position",
        type: String,
        value: "top"
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "scroll-button";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    this.shadowRoot.querySelector("#btn").addEventListener("click", e => {
      if (this.target) {
        this.target.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest"
        });
      } else {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth"
        });
      }
    });
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    this.shadowRoot.querySelector("#btn").removeEventListener("click", e => {
      if (this.target) {
        this.target.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest"
        });
      } else {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: "smooth"
        });
      }
    });
    super.disconnectedCallback();
  }
}
window.customElements.define(ScrollButton.tag, ScrollButton);
export { ScrollButton };
