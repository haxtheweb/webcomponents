/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, css, LitElement } from "lit-element/lit-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
/**
 * `lrndesign-abbreviation`
 * `A wrapper to make a cleaner abbreviation deign element`
 *
 * @demo demo/index.html
 * @customElement lrndesign-abbreviation
 */
class LrndesignAbbreviation extends SchemaBehaviors(LitElement) {
  constructor() {
    super();
    setTimeout(() => {
      import("@lrnwebcomponents/simple-tooltip/simple-tooltip.js");
    }, 0);
  }
  static get styles() {
    return [
      css`
        :host {
          display: inline-block;
        }
        abbr {
          transition: 0.6s all ease;
          padding: 2px 4px;
          font-style: italic;
          background-color: var(--abbreviation-bg, #f9f9f9);
          text-underline-position: under;
          text-decoration: underline double;
          cursor: help;
          outline: var(--abbreviation-selection, #ffff33);
        }
        abbr:focus,
        abbr:active,
        abbr:hover {
          text-decoration: none;
          background-color: var(--abbreviation-selection, #ffff33);
        }
        abbr::-moz-selection,
        abbr::selection {
          text-decoration: none;
          background-color: var(--abbreviation-selection, #ffff33);
        }
        simple-tooltip {
          --simple-tooltip-background: #000000;
          --simple-tooltip-opacity: 1;
          --simple-tooltip-text-color: #ffffff;
          --simple-tooltip-delay-in: 0;
        }
      `
    ];
  }
  /**
   * Render callback
   */
  render() {
    return html`
      <abbr tabindex="0" title="${this.phrase}" id="abbr">${this.abbr}</abbr>
      <simple-tooltip for="abbr" position="top" offset="2" animation-delay="300"
        >${this.phrase}</simple-tooltip
      >
    `;
  }

  static get tag() {
    return "lrndesign-abbreviation";
  }
  static get properties() {
    return {
      ...super.properties,

      /**
       * Abbreviation text.
       */
      abbr: {
        type: String
      },
      /**
       * The thing the abbreviation represents.
       */
      phrase: {
        type: String
      }
    };
  }
  /**
   * Attached to the DOM, now fire.
   */
  static get haxProperties() {
    return {
      canScale: false,
      canPosition: false,
      canEditSource: false,
      gizmo: {
        title: "Abbreviation",
        description: "Simple abbreviation with tooltip of full word",
        icon: "editor:title",
        color: "grey",
        groups: ["Instructional", "Term"],
        handles: [
          {
            type: "inline",
            text: "text"
          }
        ],
        meta: {
          author: "ELMS:LN"
        }
      },
      settings: {
        quick: [
          {
            property: "abbr",
            title: "Abbreviation",
            description: "Abbreviation word",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "phrase",
            title: "Phrase",
            description: "The phrase / original words",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        configure: [
          {
            property: "abbr",
            title: "Abbreviation",
            description: "Abbreviation word",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "phrase",
            title: "Phrase",
            description: "The phrase / original words",
            inputMethod: "textfield",
            icon: "editor:title"
          }
        ],
        advanced: []
      }
    };
  }
}
window.customElements.define(LrndesignAbbreviation.tag, LrndesignAbbreviation);
export { LrndesignAbbreviation };
