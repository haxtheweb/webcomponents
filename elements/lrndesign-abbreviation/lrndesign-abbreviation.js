/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
/**
 * `lrndesign-abbreviation`
 * `A wrapper to make a cleaner abbreviation deign element`
 *
 * @demo demo/index.html
 */
let LrndesignAbbreviation = Polymer({
  _template: html`
    <style>
      :host {
        display: inline-block;
      }
      abbr {
        transition: .6s all ease;
        padding: 2px 4px;
        font-style: italic;
        background-color: var(--abbreviation-bg, #F9F9F9);
        text-underline-position: under;
        text-decoration:underline double;
        cursor: help;
        outline: var(--abbreviation-selection, #FFFF33);
        @apply --abbreviation-main;
      }
      abbr:focus,
      abbr:active,
      abbr:hover {
        text-decoration: none;
        background-color: var(--abbreviation-selection, #FFFF33);
        @apply --abbreviation-hover;
      }
      abbr::-moz-selection,
      abbr::selection {
        text-decoration: none;
        background-color: var(--abbreviation-selection, #FFFF33);
        @apply --abbreviation-selection;
      }
    </style>
    <abbr tabindex="0" title$="[[phrase]]" id="abbr">[[abbr]]</abbr>
    <paper-tooltip for="abbr" position="top" offset="2" animation-delay="300">[[phrase]]</paper-tooltip>
`,

  is: "lrndesign-abbreviation",
  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],
  properties: {
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
  },
  /**
   * Attached to the DOM, now fire.
   */
  attached: function() {
    // Establish hax property binding
    let props = {
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
          author: "LRNWebComponents"
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
    this.setHaxProperties(props);
  }
});
export { LrndesignAbbreviation };
