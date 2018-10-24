import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import "@polymer/paper-button/paper-button.js";
import "hax-body-behaviors/hax-body-behaviors.js";
import "schema-behaviors/schema-behaviors.js";
import "./lrn-vocab-dialog.js";
/**
`lrn-vocab`
Vocabulary term with visual treatment and semantic meaning.

@demo demo/index.html
*/
Polymer({
  _template: html`
    <style>
      :host {
        display: inline-flex;
        --lrn-vocab-border: 1px dashed gray;
      }
      paper-button {
        text-transform: none;
        padding: 0;
        margin: 0;
        border-bottom: var(--lrn-vocab-border);
        position: relative;
        top: 3px;
      }
    </style>

    <div>
      <paper-button id="button" noink="">[[term]]</paper-button>
    </div>
    <lrn-vocab-dialog id="dialog" opened="{{opened}}">
      <slot></slot>
    </lrn-vocab-dialog>
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
    },
    /**
     * Tracking the state of the dialog
     */
    opened: {
      type: Boolean,
      value: false
    }
  },

  /**
   * Ready life cycle
   */
  ready: function() {
    this.$.button.addEventListener("click", e => {
      this.opened = !this.opened;
    });
    // track this specific element to later match
    this.__modal = this.$.dialog;
  },

  /**
   * Attached life cycle
   */
  attached: function() {
    document.body.addEventListener(
      "lrn-vocab-dialog-closed",
      this._accessibleFocus.bind(this)
    );
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
  },

  /**
   * Set ourselves as having focus after the modal closes.
   */
  _accessibleFocus: function(e) {
    // this is OUR modal, we found her, oh modal, We've missed
    // you so much. thank you for coming home. We're so, so, so
    // sorry that we appended you to the body. We'll never do it
    // again (until the next time you open).
    if (e.detail === this.__modal) {
      // focus on our dialog triggering button
      this.$.button.focus();
    }
  }
});
