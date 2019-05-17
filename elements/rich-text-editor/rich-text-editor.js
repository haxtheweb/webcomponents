/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { HAXWiring } from "@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js";
import "@polymer/iron-a11y-keys/iron-a11y-keys.js";
import "./lib/rich-text-editor-styles.js";
import "./lib/singletons/rich-text-editor-clipboard.js";
import "./lib/toolbars/rich-text-editor-toolbar.js";
import "./lib/toolbars/rich-text-editor-toolbar-mini.js";
import "./lib/toolbars/rich-text-editor-toolbar-full.js";
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
 * @demo demo/mini.html mini floating toolbar
 * @demo demo/full.html toolbar with breadcrumb
 * @demo demo/config.html custom configuration
 */
class RichTextEditor extends PolymerElement {
  // render function
  static get template() {
    return html`
      <style>
        :host([hidden]) {
          display: none;
        }
        :host {
          display: block;
          min-height: 20px;
          cursor: pointer;
          @apply --rich-text-editor-content;
        }
        :host([contenteditable="true"]) {
          border: var(--rich-text-editor-border);
          overflow: auto;
          @apply --rich-text-editor-content-edit;
        }
        :host(.heightmax[contenteditable="true"]) {
          max-height: calc(100vh - 200px);
          overflow-y: scroll;
        }
        :host([contenteditable="true"]):empty:before {
          content: attr(placeholder);
          display: block;
          @apply --rich-text-editor-content-placeholder;
        }
        span {
          background-color: blue;
        }
        .rich-text-editor-selection {
          background-color: var(--rich-text-editor-selection-bg);
          @apply --rich-text-editor-content-selection;
        }
      </style>
      <style include="rich-text-editor-styles"></style>
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
       * The id for the toolbar
       */
      toolbar: {
        name: "toolbar",
        type: "String",
        value: ""
      },
      /**
       * The editor's unique id
       */
      id: {
        name: "id",
        type: "String",
        value: ""
      },
      /**
       * The type of editor toolbar, i.e.
       * `full` for full toolbar with breadcrumb,
       * `mini` for mini floating toolbar, or
       * the default toolbar if neither.
       */
      type: {
        name: "type",
        type: "String",
        value: ""
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
    let style = document.createElement("style");
    style.setAttribute("is", "custom-style");
    style.setAttribute("include", "rich-text-editor-styles");
    if (!this.id) this.id = this._generateUUID();
    document.head.append(style);
  }
  /**
   * ready
   */
  ready() {
    super.ready();
    this.getEditor();
  }
  /**
   * connects the mini-toolbar to a mini editor
   */
  getEditor() {
    window.RichTextEditorClipboard.requestAvailability();
    let root = this,
      toolbar = "rich-text-editor-toolbar",
      id = this.toolbar ? "#" + this.toolbar : "",
      type =
        this.type === "full" || this.type === "mini" ? "-" + this.type : "",
      both = document.querySelector(toolbar + type + id),
      idOnly = document.querySelector(
        toolbar +
          id +
          "," +
          toolbar +
          "-full" +
          id +
          "," +
          toolbar +
          "-mini" +
          id
      ),
      typeOnly = document.querySelector(toolbar + type),
      //try to match both id and type, if no match try id only, and then type only
      editor = both || idOnly || typeOnly;
    //if still no match, create a region of type
    if (!this.toolbar) this.toolbar = this._generateUUID();
    if (!editor || !editor.addEditableRegion) {
      editor = document.createElement(toolbar + type);
      editor.id = this.toolbar;
      root.parentNode.appendChild(editor);
    }
    editor.addEditableRegion(root);
  }

  /**
   * Normalizes selection data.
   *
   * @returns {object} the selection
   */
  _getRange() {
    let sel = window.getSelection();
    if (sel.getRangeAt && sel.rangeCount) {
      return sel.getRangeAt(0);
    } else if (sel) {
      return sel;
    } else false;
  }

  /**
   * Generate a UUID
   */
  _generateUUID() {
    let hex = Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    return "rte-" + "ss-s-s-s-sss".replace(/s/g, hex);
  }

  /**
   * life cycle, element is removed from the DOM
   */
  //disconnectedCallback() {}
}

export { RichTextEditor };

window.customElements.define(RichTextEditor.tag, RichTextEditor);
