import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { resolveUrl } from "@polymer/polymer/lib/utils/resolve-url.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/es-global-bridge/es-global-bridge.js";
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
    console.log("?");
    if (newValue !== oldValue) {
      while (dom(this).firstChild !== null) {
        dom(this).removeChild(dom(this).firstChild);
      }
      let frag = document.createTextNode(newValue);
      console.log(frag);
      dom(this).appendChild(frag);
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
    const name = "mathjax";
    const location = resolveUrl("../../../mathjax/latest.js");
    window.addEventListener(
      `es-bridge-${name}-loaded`,
      this._mathjaxLoaded.bind(this)
    );
    window.ESGlobalBridge.requestAvailability();

    window.ESGlobalBridge.instance.load(name, location);
  },
  /**
   * Notice changes to the slot and reflect these to the math value
   * so that we can render it to the page.
   */
  _mathjaxLoaded: function() {
    this._observer = dom(this).observeNodes(info => {
      this.math = info.addedNodes.map(node => node.textContent).toString();
      window.MathJax.Hub.Config({
        skipStartupTypeset: true,
        jax: ["input/TeX", "output/HTML-CSS"],
        messageStyle: "none",
        tex2jax: {
          preview: "none"
        }
      });
      window.MathJax.Hub.Queue(["Typeset", window.MathJax.Hub, "lrn-math"]);
    });
  }
});
