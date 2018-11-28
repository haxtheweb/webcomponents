import {
  html,
  Polymer
} from "./node_modules/@polymer/polymer/polymer-legacy.js";
import { FlattenedNodesObserver } from "./node_modules/@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import { dom } from "./node_modules/@polymer/polymer/lib/legacy/polymer.dom.js";
import "./node_modules/@polymer/paper-button/paper-button.js";
import "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "./node_modules/@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "./node_modules/@lrnwebcomponents/simple-modal/simple-modal.js";
import "./lib/lrn-vocab-dialog.js";
let LrnVocab = Polymer({
  _template: html`
  <custom-style>
    <style is="custom-style">
      :host {
        display: inline-flex;
        --lrn-vocab-border: 1px dashed #ccc;
      }
      paper-button {
        text-transform: none;
        padding: 0;
        margin: 0;
        position: relative;
        top:0px;
        border-radius:0;
        border-bottom: var(--lrn-vocab-border);
        background:#f5f5f5;
        @apply --lrn-vocab-button
      }
      paper-button:hover {
        background:#bbdefb;
        border-bottom: 1px dashed #2196f3;
        @apply --lrn-vocab-button-hover
      }
    </style>
  </custom-style>
  <paper-button id="button" noink on-tap="openDialog">[[term]]</paper-button>
`,
  is: "lrn-vocab",
  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],
  properties: { term: { type: String, reflectToAttribute: !0 } },
  openDialog: function(e) {
    let children = FlattenedNodesObserver.getFlattenedNodes(this).filter(
        n => n.nodeType === Node.ELEMENT_NODE
      ),
      c = document.createElement("div");
    for (var child in children) {
      c.appendChild(children[child].cloneNode(!0));
    }
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: !0,
      cancelable: !0,
      detail: {
        title: this.term,
        elements: { content: c },
        invokedBy: this.$.button
      }
    });
    this.dispatchEvent(evt);
  },
  attached: function() {
    window.simpleModal.requestAvailability();
    let props = {
      canScale: !1,
      canPosition: !1,
      canEditSource: !1,
      gizmo: {
        title: "Vocab",
        description: "Vocabulary term",
        icon: "image:details",
        color: "red",
        groups: ["Vocab"],
        handles: [{ type: "inline", text: "term" }],
        meta: { author: "LRNWebComponents" }
      },
      settings: {
        quick: [
          {
            property: "term",
            title: "Term",
            description: "The word or words to make clickable for more detail.",
            inputMethod: "textfield",
            icon: "editor:title",
            required: !0
          }
        ],
        configure: [
          {
            property: "term",
            title: "Term",
            description: "The word or words to make clickable for more detail.",
            inputMethod: "textfield",
            icon: "editor:title",
            required: !0
          },
          {
            slot: "",
            title: "Contents",
            description: "Contents to display in the pop up.",
            inputMethod: "code-editor",
            required: !0
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  }
});
export { LrnVocab };
