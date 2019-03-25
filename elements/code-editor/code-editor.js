/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, Polymer } from "@polymer/polymer/polymer-legacy.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import { dom } from "@polymer/polymer/lib/legacy/polymer.dom.js";
import { afterNextRender } from "@polymer/polymer/lib/utils/render-status.js";
import * as async from "@polymer/polymer/lib/utils/async.js";
import "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@lrnwebcomponents/schema-behaviors/schema-behaviors.js";
import "./lib/monaco-element/monaco-element.js";
import "./lib/code-pen-button.js";
/**
 * `code-editor`
 * `Wrapper on top of a code editor`
 *
 * @demo demo/index.html
 * @microcopy - the mental model for this element
 * - monaco is the VS code editor
 */
let CodeEditor = Polymer({
  _template: html`
    <custom-style>
      <style>
        :host {
          display: block;
          padding: 16px;
        }
        .code-pen-container {
          width: 100%;
          display: flex;
          background-color: var(--code-pen-button-color, #222222);
          color: white;
          height: 40px;
          justify-content: flex-end;
          align-items: center;
        }
        .code-pen-container span {
          display: inline-flex;
          line-height: 16px;
          font-size: 16px;
          padding: 12px;
        }
        [hidden] {
          display: none !important;
        }
        code-pen-button {
          float: right;
          height: 40px;
        }
        h3 {
          color: var(--code-pen-title-color, #222222);
        }
        #codeeditor {
          height: 100%;
          display: flex;
        }
      </style>
    </custom-style>
    <h3 hidden$="[[!title]]">[[title]]</h3>
    <monaco-element
      id="codeeditor"
      lib-path="[[__libPath]]"
      value="[[editorValue]]"
      language="[[language]]"
      theme="[[theme]]"
      on-value-changed="_editorDataChanged"
      font-size$="[[fontSize]]"
      read-only$="[[readOnly]]"
    >
    </monaco-element>
    <div class="code-pen-container" hidden$="[[!showCodePen]]">
      <span>Check it out on code pen: </span
      ><code-pen-button data="[[codePenData]]"></code-pen-button>
    </div>
  `,

  is: "code-editor",

  behaviors: [HAXBehaviors.PropertiesBehaviors, SchemaBehaviors.Schema],

  properties: {
    /**
     * Title
     */
    title: {
      type: String
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
      value: false,
      reflectToAttribute: true
    },
    /**
     * Code pen data, computed based on the HTML editor
     */
    codePenData: {
      type: Object,
      computed: "_computeCodePenData(title, value)"
    },
    /**
     * contents of the editor
     */
    editorValue: {
      type: String
    },
    /**
     * value of the editor after the fact
     */
    value: {
      type: String,
      notify: true
    },
    /**
     * Theme for the Ace editor.
     */
    theme: {
      type: String,
      value: "vs-dark"
    },
    /**
     * Mode / language for editor
     */
    mode: {
      type: String,
      observer: "_modeChanged"
    },
    /**
     * Language to present color coding for
     */
    language: {
      type: String,
      value: "javascript"
    },
    /**
     * font size for the editor
     */
    fontSize: {
      type: Number,
      value: 16
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
   * LEGACY: pass down mode to language if that api is used
   */
  _modeChanged: function(newValue) {
    this.language = this.mode;
  },

  /**
   * Notice code editor changes and reflect them into this element
   */
  _editorDataChanged: function(e) {
    // value coming up off of thiss
    this.value = e.detail;
  },

  /**
   * Calculate what's in slot currently and then inject it into the editor.
   */
  updateEditorValue: function() {
    var content = "";
    // 1st look for a template tag
    var children = this.queryEffectiveChildren("template");
    if (!children) {
      console.warn(
        "code-editor works best with a template tag provided in light dom"
      );
      children = dom(this).getEffectiveChildNodes();
      if (children.length > 0) {
        // loop through everything found in the slotted area and put it back in
        for (var j = 0, len2 = children.length; j < len2; j++) {
          if (typeof children[j].tagName !== typeof undefined) {
            content += children[j].outerHTML;
          } else {
            content += children[j].textContent;
          }
        }
      }
    } else {
      content = children.innerHTML;
    }
    this.$.codeeditor.value = content.trim();
  },
  /**
   * Ensure fields don't pass through to HAX if in that context
   */
  preProcessHaxNodeToContent: function(clone) {
    clone.editorValue = null;
    clone.codePenData = null;
    clone.value = null;
    clone.removeAttribute("value");
    clone.removeAttribute("code-pen-data");
    return clone;
  },
  /**
   * created callback
   */
  created: function() {
    // set this ahead of it being painted into the dom
    this.__libPath =
      decodeURIComponent(import.meta.url) + "/../../../monaco-editor/min/vs";
  },
  /**
   * attached life cycle
   */
  attached: function() {
    afterNextRender(this, function() {
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
    });
  }
});
export { CodeEditor };
