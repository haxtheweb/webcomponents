import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
/**
`lrn-math`
A LRN element

@demo demo/index.html
*/
Polymer({
  _template: html`
    <style>
       :host {
        display: inline;
      }
    </style>
    [[prefix]] [[math]] [[suffix]]
    <span hidden=""><slot id="content"></slot></span>
`,

  is: "lrn-math",

  behaviors: [HAXBehaviors.PropertiesBehaviors],

  properties: {
    /**
     * Styling for targeting the math pre and post
     */
    prefix: {
      type: String,
      value: "$$"
    },
    suffix: {
      type: String,
      value: "$$"
    },
    /**
     * display the math inline
     */
    inline: {
      type: Boolean,
      value: true,
      reflectToAttribute: true
    },
    /**
     * The math to get rendered.
     */
    math: {
      type: String
    },
    /**
     * backdown to inject text
     */
    mathText: {
      type: String,
      observer: "_mathChanged"
    }
  },

  observers: ["_inlineChanged(inline)"],

  /**
   * Modify pre and suffix if inline is set
   */
  _inlineChanged: function(inline) {
    if (inline) {
      this.prefix = "\\(";
      this.suffix = "\\)";
    }
  },

  /**
   * Notice math changed, update slot.
   */
  _mathChanged: function(newValue, oldValue) {
    if (newValue !== oldValue) {
      while (Polymer.dom(this).firstChild !== null) {
        Polymer.dom(this).removeChild(Polymer.dom(this).firstChild);
      }
      let frag = document.createTextNode(newValue);
      Polymer.dom(this).appendChild(frag);
    }
  },

  /**
   * Attached life cycle
   */
  attached: function() {
    // Establish hax properties if they exist
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: true,
      gizmo: {
        title: "Math",
        description: "Present math in a nice looking way.",
        icon: "places:all-inclusive",
        color: "grey",
        groups: ["Content"],
        handles: [
          {
            type: "math",
            math: "mathText"
          },
          {
            type: "inline",
            text: "mathText"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            property: "inline",
            title: "Inline",
            description: "Display this math inline",
            inputMethod: "boolean",
            icon: "remove"
          }
        ],
        configure: [
          {
            property: "mathText",
            title: "Math",
            description: "Math",
            inputMethod: "textfield",
            icon: "editor:format-quote"
          },
          {
            property: "inline",
            title: "Inline",
            description: "Display this math inline",
            inputMethod: "boolean",
            icon: "remove"
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  },

  /**
   * Notice changes to the slot and reflect these to the math value
   * so that we can render it to the page.
   */
  ready: function() {
    if (typeof window.__mathJaxLoaded === typeof undefined) {
      let mathjaxCDN = document.createElement("script");
      mathjaxCDN.src =
        "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_HTML";
      document.body.appendChild(mathjaxCDN);
      window.__mathJaxLoaded = true;
    }
    this._observer = Polymer.dom(this.$.content).observeNodes(info => {
      this.math = info.addedNodes.map(node => node.textContent).toString();
      setTimeout(function() {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
      }, 100);
    });
  }
});
