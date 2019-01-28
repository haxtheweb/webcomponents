import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { SimpleColors } from "@lrnwebcomponents/simple-colors/simple-colors.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/a11y-behaviors/a11y-behaviors.js";
import "./lib/simple-concept-network-node.js";
/**
`simple-concept-network`
A small but effective little data visualizer for topics surrounding
a central concept, much like the ELMS:LN snowflake icon.

* @demo demo/index.html

@microcopy - the mental model for this element
 - ELMS:LN - The ELMS: Learning Network "snowflake" is a network diagram

*/
let SimpleConceptNetwork = Polymer({
  _template: html`
    <style include="simple-colors">
      :host {
        display: block;
      }
      :host([visualization="network"]) simple-concept-network-node {
        position: relative;
      }
      :host([visualization="network"])
        simple-concept-network-node:nth-child(1) {
        top: 150px;
        left: 176px;
      }
      :host([visualization="network"])
        simple-concept-network-node:nth-child(2) {
        top: 0px;
        left: 60px;
      }
      :host([visualization="network"])
        simple-concept-network-node:nth-child(3) {
        top: 75px;
        left: 60px;
      }
      :host([visualization="network"])
        simple-concept-network-node:nth-child(4) {
        top: 230px;
        left: -56px;
      }
      :host([visualization="network"])
        simple-concept-network-node:nth-child(5) {
        top: 300px;
        left: -282px;
      }
      :host([visualization="network"])
        simple-concept-network-node:nth-child(6) {
        top: 230px;
        left: -515px;
      }
      :host([visualization="network"])
        simple-concept-network-node:nth-child(7) {
        top: 75px;
        left: -630px;
      }
      :host([visualization="network"]) {
        display: block;
        min-height: 450px;
      }
    </style>
    <template is="dom-repeat" items="[[nodes]]" as="node">
      <simple-concept-network-node
        accent-color$="[[node.color]]"
        colored-text$="[[node.coloredText]]"
        dark$="[[node.dark]]"
        default-color$="[[accentColor]]"
        visualization$="[[visualization]]"
        src$="[[node.src]]"
        icon$="[[node.icon]]"
        image$="[[node.image]]"
        label$="[[node.label]]"
        disabled$="[[node.disabled]]"
      ></simple-concept-network-node>
    </template>
  `,

  is: "simple-concept-network",

  behaviors: [
    HAXBehaviors.PropertiesBehaviors,
    SimpleColors,
    A11yBehaviors.A11y
  ],

  observers: ["_valueChanged(nodes.*)"],

  properties: {
    /**
     * Type of visualization
     */
    visualization: {
      type: String,
      reflectToAttribute: true,
      value: "3d"
    },
    /**
     * List of nodes to template stamp out
     */
    nodes: {
      type: Array,
      value: [],
      notify: true
    }
  },

  /**
   * Notice an answer has changed and update the DOM.
   */
  _valueChanged: function(e) {
    for (var i in e.base) {
      for (var j in e.base[i]) {
        this.notifyPath("nodes." + i + "." + j);
      }
    }
  },

  /**
   * Attached.
   */
  attached: function() {
    // Establish hax properties if they exist
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Concept Network",
        description:
          "A simple way of visualizing data in a small network style configuration.",
        icon: "lrn:network",
        color: "blue",
        groups: ["Image", "Visualization"],
        handles: [
          {
            type: "image",
            source: "nodes.source",
            title: "nodes.label",
            link: "nodes.src",
            description: "nodes.description"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "visualization",
            title: "Visualization",
            description: "How to visualize the concept",
            inputMethod: "select",
            options: {
              "3d": "3d plain",
              network: "network",
              flat: "flat"
            }
          },
          {
            property: "nodes",
            title: "Node list",
            description: "List of the items to present in the visual",
            inputMethod: "array",
            properties: [
              {
                property: "icon",
                title: "Icon",
                description: "icon to display in the middle",
                inputMethod: "iconpicker",
                options: []
              },
              {
                property: "label",
                title: "Label",
                description: "Label",
                inputMethod: "textfield"
              },
              {
                property: "image",
                title: "Image",
                description: "Image for the background",
                inputMethod: "textfield",
                validationType: "url"
              },
              {
                property: "description",
                title: "Description",
                description:
                  "A longer description that can be used as part of a modal presentation",
                inputMethod: "textfield"
              },
              {
                property: "accent-color",
                title: "Node color",
                description: "Select the accent color for this node",
                inputMethod: "colorpicker",
                icon: "editor:format-color-fill"
              },
              {
                property: "dark",
                title: "Dark",
                description: "Use dark theme",
                inputMethod: "toggle",
                icon: "invert-colors"
              },
              {
                property: "coloredText",
                title: "Colored Text / Icon",
                description:
                  "Apply color to text / icon instead of background.",
                inputMethod: "toggle",
                icon: "editor:format-color-text"
              },
              {
                property: "src",
                title: "Link",
                description: "Label",
                inputMethod: "textfield",
                validationType: "url"
              }
            ]
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  }
});
export { SimpleConceptNetwork };
