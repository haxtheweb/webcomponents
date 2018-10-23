import "@polymer/polymer/polymer.js";
import "materializecss-styles/materializecss-styles.js";
import "hax-body-behaviors/hax-body-behaviors.js";
import "a11y-behaviors/a11y-behaviors.js";
import "./simple-concept-network-node.js";
/**
`simple-concept-network`
A small but effective little data visualizer for topics surrounding
a central concept, much like the ELMS:LN snowflake icon.

@demo demo/index.html

@microcopy - the mental model for this element
 - ELMS:LN - The ELMS: Learning Network "snowflake" is a network diagram

*/
Polymer({
  _template: `
    <style include="materializecss-styles">
      :host {
        display: block;
      }
      :host[visualization="network"] simple-concept-network-node {
        position: relative;
      }
      :host[visualization="network"] simple-concept-network-node:nth-child(1) {
        top: 150px;
        left: 176px;
      }
      :host[visualization="network"] simple-concept-network-node:nth-child(2) {
        top: 0px;
        left: 60px;
      }
      :host[visualization="network"] simple-concept-network-node:nth-child(3) {
        top: 75px;
        left: 60px;
      }
      :host[visualization="network"] simple-concept-network-node:nth-child(4) {
        top: 230px;
        left: -56px;
      }
      :host[visualization="network"] simple-concept-network-node:nth-child(5) {
        top: 300px;
        left: -282px;
      }
      :host[visualization="network"] simple-concept-network-node:nth-child(6) {
        top: 230px;
        left: -515px;
      }
      :host[visualization="network"] simple-concept-network-node:nth-child(7) {
        top: 75px;
        left: -630px;
      }
      :host[visualization="network"] {
        display: block;
        min-height: 450px;
      }
    </style>
    <template is="dom-repeat" items="[[nodes]]" as="node">
      <simple-concept-network-node visualization="[[visualization]]" src="[[node.src]]" icon="[[node.icon]]" icon-color="[[node.iconColor]]" image="[[node.image]]" label="[[node.label]]" color="[[node.color]]" disabled="[[node.disabled]]"></simple-concept-network-node>
    </template>
`,

  is: "simple-concept-network",

  behaviors: [
    HAXBehaviors.PropertiesBehaviors,
    MaterializeCSSBehaviors.ColorBehaviors,
    A11yBehaviors.A11y
  ],

  observers: ["_valueChanged(nodes.*)"],

  properties: {
    /**
     * Primary color to use as the background
     */
    color: {
      type: String
    },
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
        quick: [
          {
            property: "color",
            title: "Color",
            description: "Primary / background color",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill"
          }
        ],
        configure: [
          {
            property: "color",
            title: "Color",
            description: "Default background color",
            inputMethod: "colorpicker",
            icon: "editor:format-color-fill"
          },
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
                property: "iconColor",
                title: "Icon Color",
                description: "Color for this icon",
                inputMethod: "colorpicker"
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
                property: "color",
                title: "Color",
                description: "Color for this node",
                inputMethod: "colorpicker"
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
