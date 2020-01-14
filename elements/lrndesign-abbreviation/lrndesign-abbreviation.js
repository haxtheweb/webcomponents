/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { SchemaBehaviors } from "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
/**
 * `lrndesign-abbreviation`
 * @customElement lrndesign-abbreviation
 * `A wrapper to make a cleaner abbreviation deign element`
 *
 * @demo demo/index.html
 */
class LrndesignAbbreviation extends SchemaBehaviors(PolymerElement) {
  constructor() {
    super();
    import("@polymer/paper-tooltip/paper-tooltip.js");
  }
  static get template() {
    return html`
      <style>
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
          @apply --abbreviation-main;
        }
        abbr:focus,
        abbr:active,
        abbr:hover {
          text-decoration: none;
          background-color: var(--abbreviation-selection, #ffff33);
          @apply --abbreviation-hover;
        }
        abbr::-moz-selection,
        abbr::selection {
          text-decoration: none;
          background-color: var(--abbreviation-selection, #ffff33);
          @apply --abbreviation-selection;
        }
      </style>
      <abbr tabindex="0" title$="[[phrase]]" id="abbr">[[abbr]]</abbr>
      <paper-tooltip for="abbr" position="top" offset="2" animation-delay="300"
        >[[phrase]]</paper-tooltip
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
        type: String,
        reflectToAttribute: true,
        notify: true
      },
      /**
       * The thing the abbreviation represents.
       */
      phrase: {
        type: String,
        reflectToAttribute: true,
        notify: true
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
