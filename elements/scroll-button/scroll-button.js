/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import "@lrnwebcomponents/simple-icon/simple-icon.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icons.js";
import "@lrnwebcomponents/simple-icon/lib/simple-icon-button.js";
/**
 * @deprecatedApply - required for @apply / invoking @apply css var convention
 */
import "@polymer/polymer/lib/elements/custom-style.js";
/**
 * `scroll-button`
 * `button to scroll to an area or back to top`
 * @demo demo/index.html
 * @element scroll-button
 */
class ScrollButton extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: block;
          --scroll-button-z-index: 99;
          z-index: var(--scroll-button-z-index);
        }

        :host([hidden]) {
          display: none;
        }

        simple-icon-button {
          background-color: var(
            --scroll-button-background-color,
            rgba(0, 0, 0, 0.6)
          );
          color: var(--scroll-button-color, white);
        }

        simple-icon-button:hover,
        simple-icon-button:active,
        simple-icon-button:focus {
          color: var(--scroll-button-background-color, rgba(0, 0, 0, 1));
          background-color: var(--scroll-button-color, white);
        }

        simple-tooltip {
          --simple-tooltip-background: var(
            --scroll-button-tooltip-background-color,
            #000000
          );
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: var(
            --scroll-button-tooltip-color,
            #ffffff
          );
          --simple-tooltip-delay-in: 0;
          --simple-tooltip-border-radius: 0;
        }
      `,
    ];
  }

  // render function
  render() {
    return html` <custom-style>
        <style>
          simple-icon-button {
            @apply --scroll-button-button;
          }
          simple-icon-button:hover,
          simple-icon-button:active,
          simple-icon-button:focus {
            @apply --scroll-button-button-active;
          }
          simple-tooltip {
            @apply --scroll-button-tooltip;
          }
        </style>
      </custom-style>
      <simple-icon-button
        @click="${this.scrollEvent}"
        id="btn"
        icon="${this.icon}"
        aria-label="${this.label}"
      ></simple-icon-button>
      <simple-tooltip for="btn" position="${this.position}" offset="14">
        ${this.label}
      </simple-tooltip>`;
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
            type: "todo:read-the-docs-for-usage",
          },
        ],
        meta: {
          author: "btopro",
          owner: "The Pennsylvania State University",
        },
      },
      settings: {
        configure: [
          {
            property: "target",
            description: "",
            inputMethod: "array",
            required: false,
            icon: "icons:android",
          },
          {
            property: "icon",
            description: "",
            inputMethod: "textfield",
            required: false,
            icon: "icons:android",
          },
          {
            property: "label",
            description: "",
            inputMethod: "textfield",
            required: false,
            icon: "icons:android",
          },
        ],
        advanced: [],
      },
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      target: {
        type: Object,
      },
      icon: {
        type: String,
      },
      label: {
        type: String,
      },
      position: {
        type: String,
      },
    };
  }
  constructor() {
    super();
    this.icon = "icons:expand-less";
    this.label = "Scroll to top";
    this.position = "top";
    import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
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
  scrollEvent(e) {
    if (this.target) {
      this.target.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    } else {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    }
  }
}
window.customElements.define(ScrollButton.tag, ScrollButton);
export { ScrollButton };
