import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import { dom } from "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
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
    prefix: { type: String, value: "$$" },
    suffix: { type: String, value: "$$" },
    inline: { type: Boolean, value: !0, reflectToAttribute: !0 },
    math: { type: String },
    mathText: { type: String, observer: "_mathChanged" }
  },
  observers: ["_inlineChanged(inline)"],
  _inlineChanged: function(inline) {
    if (inline) {
      this.prefix = "\\(";
      this.suffix = "\\)";
    }
  },
  _mathChanged: function(newValue, oldValue) {
    if (newValue !== oldValue) {
      while (null !== dom(this).firstChild) {
        dom(this).removeChild(dom(this).firstChild);
      }
      let frag = document.createTextNode(newValue);
      dom(this).appendChild(frag);
    }
  },
  attached: function() {
    this.setHaxProperties({
      canScale: !0,
      canPosition: !0,
      canEditSource: !0,
      gizmo: {
        title: "Math",
        description: "Present math in a nice looking way.",
        icon: "places:all-inclusive",
        color: "grey",
        groups: ["Content"],
        handles: [
          { type: "math", math: "mathText" },
          { type: "inline", text: "mathText" }
        ],
        meta: { author: "LRNWebComponents" }
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
    });
  },
  ready: function() {
    if (typeof window.__mathJaxLoaded === typeof void 0) {
      let mathjaxCDN = document.createElement("script");
      mathjaxCDN.src =
        "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-AMS_HTML";
      document.body.appendChild(mathjaxCDN);
      window.__mathJaxLoaded = !0;
    }
    this._observer = dom(this.$.content).observeNodes(info => {
      this.math = info.addedNodes.map(node => node.textContent).toString();
      setTimeout(function() {
        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
      }, 100);
    });
  }
});
