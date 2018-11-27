import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom";
import "@polymer/paper-button/paper-button.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "@lrnwebcomponents/simple-modal/simple-modal.js";
import "./lib/lrn-vocab-dialog.js";
/**
`lrn-vocab`
Vocabulary term with visual treatment and semantic meaning.

@demo demo/index.html
*/
Polymer({
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

  properties: {
    /**
     * Term to highlight / display
     */
    term: {
      type: String,
      reflectToAttribute: true
    }
  },
  /**
   * Request the singleton dialog open
   */
  openDialog: function(e) {
    let children = FlattenedNodesObserver.getFlattenedNodes(this).filter(
      n => n.nodeType === Node.ELEMENT_NODE
    );
    let c = document.createElement("div");
    for (var child in children) {
      c.appendChild(children[child].cloneNode(true));
    }
    const evt = new CustomEvent("simple-modal-show", {
      bubbles: true,
      cancelable: true,
      detail: {
        title: this.term,
        elements: {
          content: c
        },
        invokedBy: this.$.button
      }
    });
    this.dispatchEvent(evt);
  },
  /**
   * Attached life cycle
   */
  attached: function() {
    window.simpleModal.requestAvailability();
    // Establish hax properties if they exist
    let props = {
      canScale: false,
      canPosition: false,
      canEditSource: false,
      gizmo: {
        title: "Vocab",
        description: "Vocabulary term",
        icon: "image:details",
        color: "red",
        groups: ["Vocab"],
        handles: [
          {
            type: "inline",
            text: "term"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            property: "term",
            title: "Term",
            description: "The word or words to make clickable for more detail.",
            inputMethod: "textfield",
            icon: "editor:title",
            required: true
          }
        ],
        configure: [
          {
            property: "term",
            title: "Term",
            description: "The word or words to make clickable for more detail.",
            inputMethod: "textfield",
            icon: "editor:title",
            required: true
          },
          {
            slot: "",
            title: "Contents",
            description: "Contents to display in the pop up.",
            inputMethod: "code-editor",
            required: true
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  }
});
