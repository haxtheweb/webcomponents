/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "./lib/rich-text-editor-toolbar.js";
/**
 * `rich-text-editor`
 * `a standalone rich text editor`
 *
 * @microcopy - language worth noting:
 *  -
 *
 * @customElement
 * @polymer
 * @demo demo/index.html demo
 * @demo demo/config.html custom configuration
 */
class RichTextEditor extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style>
        :host {
          display: block;
          min-height: 20px;
          cursor: pointer;
          @apply --rich-text-editor-content;
        }
        :host([contenteditable="true"]) {
          border: var(--rich-text-editor-border);
          border-top: none;
          overflow: hidden;
          @apply --rich-text-editor-content-edit;
        }
        :host([contenteditable="true"]):empty:before {
          content: attr(placeholder);
          display: block;
          @apply --rich-text-editor-content-placeholder;
        }
        :host .rich-text-editor-selection {
          background-color: var(--rich-text-editor-selection-bg);
          @apply --rich-text-editor-content-selection;
        }
      </style>
      <slot></slot>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Rich text-editor",
        description: "a standalone rich text editor",
        icon: "icons:android",
        color: "green",
        groups: ["Text"],
        handles: [
          {
            type: "todo:read-the-docs-for-usage"
          }
        ],
        meta: {
          author: "nikkimk",
          owner: "Penn State University"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            property: "title",
            description: "",
            inputMethod: "textfield",
            required: false,
            icon: "icons:android"
          }
        ],
        advanced: []
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      /**
       * The editableElement element for the editor.
       */
      editorId: {
        name: "editableElement",
        type: "Object",
        value: null
      }
    };
  }

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "rich-text-editor";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
  }
  /**
   * ready
   */
  ready() {
    super.ready();
    //find an editor by id
    let id = document.querySelector(
        "rich-text-editor-toolbar#" + this.editorId
      ),
      editor =
        id !== null ? id : document.querySelector("rich-text-editor-toolbar");
    if (editor === null) {
      editor = document.createElement("rich-text-editor-toolbar");
      this.parentNode.appendChild(editor);
    }
    editor.addEditableRegion(this);
  }

  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}

export { RichTextEditor };

window.customElements.define(RichTextEditor.tag, RichTextEditor);
