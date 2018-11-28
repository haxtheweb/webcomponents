import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import "./node_modules/@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "./node_modules/@lrnwebcomponents/a11y-behaviors/a11y-behaviors.js";
import "./lib/simple-concept-network-node.js";
let SimpleConceptNetwork = Polymer({
  _template: html`
    <style include="materializecss-styles">
      :host {
        display: block;
      }
      :host([visualization="network"]) simple-concept-network-node {
        position: relative;
      }
      :host([visualization="network"]) simple-concept-network-node:nth-child(1) {
        top: 150px;
        left: 176px;
      }
      :host([visualization="network"]) simple-concept-network-node:nth-child(2) {
        top: 0px;
        left: 60px;
      }
      :host([visualization="network"]) simple-concept-network-node:nth-child(3) {
        top: 75px;
        left: 60px;
      }
      :host([visualization="network"]) simple-concept-network-node:nth-child(4) {
        top: 230px;
        left: -56px;
      }
      :host([visualization="network"]) simple-concept-network-node:nth-child(5) {
        top: 300px;
        left: -282px;
      }
      :host([visualization="network"]) simple-concept-network-node:nth-child(6) {
        top: 230px;
        left: -515px;
      }
      :host([visualization="network"]) simple-concept-network-node:nth-child(7) {
        top: 75px;
        left: -630px;
      }
      :host([visualization="network"]) {
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
    color: { type: String },
    visualization: { type: String, reflectToAttribute: !0, value: "3d" },
    nodes: { type: Array, value: [], notify: !0 }
  },
  _valueChanged: function(e) {
    for (var i in e.base) {
      for (var j in e.base[i]) {
        this.notifyPath("nodes." + i + "." + j);
      }
    }
  },
  attached: function() {
    let props = {
      canScale: !0,
      canPosition: !0,
      canEditSource: !1,
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
        meta: { author: "LRNWebComponents" }
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
            options: { "3d": "3d plain", network: "network", flat: "flat" }
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
export { SimpleConceptNetwork };
