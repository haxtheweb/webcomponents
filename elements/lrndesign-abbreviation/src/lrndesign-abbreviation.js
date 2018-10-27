import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@polymer/paper-tooltip/paper-tooltip.js";
/**
`lrndesign-abbreviation`
A wrapper to make a cleaner abbreviation deign element

@demo demo/index.html
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: block;
      }
    </style>
    <abbr title$="[[phrase]]" id="abbr">[[abbr]]</abbr>
    <paper-tooltip for="abbr">[[phrase]]</paper-tooltip>
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
