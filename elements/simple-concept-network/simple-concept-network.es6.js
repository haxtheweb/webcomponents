import { html } from "@polymer/polymer/polymer-element.js";
import { SimpleColorsPolymer } from "@lrnwebcomponents/simple-colors/lib/simple-colors-polymer.js";
import { A11yBehaviors } from "@lrnwebcomponents/a11y-behaviors/a11y-behaviors.js";
/**
`simple-concept-network`
A small but effective little data visualizer for topics surrounding
a central concept, much like the ELMS:LN snowflake icon.
* @demo demo/index.html
@microcopy - the mental model for this element
 - ELMS:LN - The ELMS: Learning Network "snowflake" is a network diagram
*/
class SimpleConceptNetwork extends A11yBehaviors(SimpleColorsPolymer) {
  constructor() {
    super();
    import("@lrnwebcomponents/simple-concept-network/lib/simple-concept-network-node.js");
  }
  static get template() {
    return html`
      <style include="simple-colors-shared-styles-polymer">
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
          colored-text$="[[coloredText]]"
          dark$="[[dark]]"
          visualization$="[[visualization]]"
          src$="[[node.src]]"
          icon$="[[node.icon]]"
          image$="[[node.image]]"
          label$="[[node.label]]"
          disabled$="[[node.disabled]]"
        ></simple-concept-network-node>
      </template>
    `;
  }
  static get tag() {
    return "simple-concept-network";
  }
  static get observers() {
    return ["_valueChanged(nodes.*)"];
  }
  static get properties() {
    return {
      ...super.properties,

      /**
       * Type of visualization
       */
      visualization: {
        type: String,
        reflectToAttribute: true,
        value: "3d"
      },
      /**
       * disabled status
       */
      disabled: {
        type: Boolean
      },
      /**
       * Apply color to text / icon instead of background.
       */
      coloredText: {
        type: Boolean,
        reflectToAttribute: true,
        value: false
      },
      /**
       * List of nodes to template stamp out
       */
      nodes: {
        type: Array,
        value: [],
        notify: true
      }
    };
  }
  static get haxProperties() {
    return {
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
            property: "dark",
            title: "Dark",
            description: "Use dark theme",
            inputMethod: "boolean",
            icon: "invert-colors"
          },
          {
            property: "coloredText",
            title: "Colored Text / Icon",
            description: "Apply color to text / icon instead of background.",
            inputMethod: "boolean",
            icon: "editor:format-color-text"
          },
          {
            property: "nodes",
            title: "Node list",
            description: "List of the items to present in the visual",
            inputMethod: "array",
            itemLabel: "label",
            properties: [
              {
                property: "color",
                title: "Node color",
                description: "Select the accent color for this node",
                inputMethod: "colorpicker",
                icon: "editor:format-color-fill"
              },
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
  }
  /**
   * Notice an answer has changed and update the DOM.
   */
  _valueChanged(e) {
    for (var i in e.base) {
      for (var j in e.base[i]) {
        this.notifyPath("nodes." + i + "." + j);
      }
    }
  }
}
window.customElements.define(SimpleConceptNetwork.tag, SimpleConceptNetwork);
export { SimpleConceptNetwork };
