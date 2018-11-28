/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import "@lrnwebcomponents/materializecss-styles/materializecss-styles.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "./lib/juicy-ace-editor.js";
import "./lib/code-pen-button.js";
/**
`code-editor`
A LRN element

@demo demo/index.html

@microcopy - the mental model for this element
 -
 -

*/
let CodeEditor = Polymer({
  _template: html`
    <style>
      :host {
        display: block;
        padding: 16px;
        --code-pen-button-color: #222222;
        --code-pen-title-color: #222222;
      }
      .code-pen-container {
        width: 100%;
        display: block;
        background-color: var(--code-pen-button-color);
        height: 40px;
      }
      code-pen-button {
        float: right;
        height: 40px;
      }
      h3 {
        color: var(--code-pen-title-color);
      }
    </style>
    <h3>[[title]]</h3>
    <juicy-ace-editor id="codeeditor" theme\$="[[theme]]" mode\$="[[mode]]" font-size\$="[[fontSize]]" readonly\$="[[readOnly]]"></juicy-ace-editor>
    <div class="code-pen-container" hidden\$="[[!showCodePen]]">
      <code-pen-button data="[[codePenData]]"></code-pen-button>
    </div>
`,

  is: "code-editor",

  behaviors: [
    HAXBehaviors.PropertiesBehaviors,
    MaterializeCSSBehaviors.ColorBehaviors,
    SchemaBehaviors.Schema
  ],

  listeners: {
    change: "_editorDataChanged",
    "editor-ready": "_editorReady"
  },

  properties: {
    /**
     * Title
     */
    title: {
      type: String,
      value: "Code sample"
    },
    /**
     * Show codePen button to fork it to there to run
     */
    showCodePen: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    /**
     * Readonly setting for the editor
     */
    readOnly: {
      type: Boolean,
      value: true,
      reflectToAttribute: true
    },
    /**
     * Code pen data, computed based on the HTML editor
     */
    codePenData: {
      type: Object,
      computed: "_computeCodePenData(title, editorValue)"
    },
    /**
     * contents of the editor
     */
    editorValue: {
      type: String,
      value: "",
      notify: true
    },
    /**
     * Theme for the Ace editor.
     */
    theme: {
      type: String,
      value: "ace/theme/monokai"
    },
    /**
     * Mode for the Ace editor.
     */
    mode: {
      type: String,
      value: "ace/mode/html"
    },
    /**
     * font size for the Ace editor.
     */
    fontSize: {
      type: String,
      value: "16px"
    },
    /**
     * Min lines of the editor to show
     */
    minLines: {
      type: Number,
      value: 10
    },
    /**
     * Max lines of the editor to show
     */
    maxLines: {
      type: Number,
      value: 25
    }
  },

  /**
   * Update the post data whenever the editor has been updated
   */
  _computeCodePenData: function(title, editorValue) {
    return {
      title: title,
      html: editorValue
    };
  },

  /**
   * Event for when the editor is ready so we can modify it.
   */
  _editorReady: function(e) {
    this.__editorReady = true;
    setTimeout(() => {
      this.$.codeeditor.editor.setOptions({
        maxLines: this.maxLines,
        minLines: this.minLines
      });
      this.updateEditorValue();
    }, 200);
  },

  /**
   * Notice code editor changes and reflect them into this element
   */
  _editorDataChanged: function(e) {
    this.editorValue = this.$.codeeditor.value;
  },

  /**
   * Calculate what's in slot currently and then inject it into the editor.
   */
  updateEditorValue: function() {
    let children = this.queryEffectiveChildren("template");
    if (!children) {
      console.warn(
        "code-editor requires a template to be provided in light-dom"
      );
    } else {
      this.$.codeeditor.value = children.innerHTML;
    }
  },

  /**
   * Ready state to tee everything up.
   */
  ready: function() {
    // mutation observer that ensures state of hax applied correctly
    this._observer = new FlattenedNodesObserver(this, info => {
      // if we've got new nodes, we have to react to that
      if (info.addedNodes.length > 0) {
        info.addedNodes.map(node => {
          this.updateEditorValue();
        });
      }
      // if we dropped nodes via the UI (delete event basically)
      if (info.removedNodes.length > 0) {
        // handle removing items... not sure we need to do anything here
        info.removedNodes.map(node => {
          this.updateEditorValue();
        });
      }
    });
  },

  /**
   * Attached to the DOM, now fire.
   */
  attached: function() {
    // Establish hax property binding
    let props = {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Code editor",
        description: "Edit code in the browser with minor HTML validation",
        icon: "icons:code",
        color: "blue",
        groups: ["Code", "Development"],
        handles: [
          {
            type: "code",
            code: "contents"
          }
        ],
        meta: {
          author: "LRNWebComponents"
        }
      },
      settings: {
        quick: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "showCodePen",
            title: "Code pen button",
            description: "Play with this on code pen",
            inputMethod: "boolean",
            icon: "icons:code"
          }
        ],
        configure: [
          {
            property: "title",
            title: "Title",
            description: "The title of the element",
            inputMethod: "textfield",
            icon: "editor:title"
          },
          {
            property: "showCodePen",
            title: "Code pen button",
            description: "Play with this on code pen",
            inputMethod: "boolean",
            icon: "icons:code"
          },
          // this is trippy but actually will work.
          {
            slot: "",
            title: "Code",
            description: "The code to present to the user",
            inputMethod: "code-editor",
            icon: "editor:title"
          }
        ],
        advanced: []
      }
    };
    this.setHaxProperties(props);
  }
});
export { CodeEditor };
