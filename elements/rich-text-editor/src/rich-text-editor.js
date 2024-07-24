/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { RichTextStyles } from "./lib/buttons/rich-text-editor-button.js";
import "./lib/toolbars/rich-text-editor-toolbar.js";
import "./lib/toolbars/rich-text-editor-toolbar-mini.js";
import "./lib/toolbars/rich-text-editor-toolbar-full.js";
/**

 * RichTextEditorBehaviors
 * @extends RichTextStyles
 *
 * @customElement
 * @class
 * @lit-html
 * @lit-element
 */
const RichTextEditorBehaviors = function (SuperClass) {
  return class extends SuperClass {
    //styles function
    static get styles() {
      return [
        ...RichTextStyles,
        css`
          :host {
            display: block;
          }
          :host([hidden]) {
            display: none;
          }
          :host([disabled]) {
            cursor: not-allowed;
          }
          :host(:empty) {
            opacity: 0.7;
          }
          :host(:focus) {
            outline: none;
          }

          :host(.heightmax[contenteditable="true"]) {
            max-height: calc(100vh - 200px);
            overflow-y: scroll;
          }

          #container,
          #wysiwyg {
            display: block;
            width: 100%;
          }
          #source,
          #wysiwyg {
            margin: 0;
            padding: 0;
            min-height: var(--rich-text-editor-min-height, 20px);
            cursor: pointer;
            outline: none;
            flex: 1 1 100%;
            width: 100%;
          }
          :host(:empty) {
            min-height: 20px;
          }
          :host(:empty)::after {
            display: block;
            content: attr(aria-placeholder);
          }

          :host(:hover),
          :host(:focus-within) {
            opacity: 1;
            outline: var(--rich-text-editor-border-width, 1px) dotted
              var(--rich-text-editor-focus-color, currentColor);
          }
          :host([disabled]),
          :host([view-source]) {
            outline: none !important;
          }

          #source:hover,
          #source:focus-within {
            outline: var(--rich-text-editor-border-width, 1px) dotted
              var(--rich-text-editor-focus-color, currentColor);
          }
          :host([contenteditable="true"][view-source]) #container {
            display: flex;
            align-items: stretch;
            justify-content: space-between;
            width: 100%;
          }
          :host([contenteditable="true"][view-source]) #source,
          :host([contenteditable="true"][view-source]) #wysiwyg {
            resize: horizontal;
            overflow: auto;
            flex: 1 1 auto;
            width: 50%;
          }
          :host([contenteditable="true"][view-source]) #source {
            min-width: 300px;
          }
          :host([contenteditable="true"][view-source]) #wysiwyg {
            cursor: not-allowed;
            margin-right: 10px;
            width: calc(50% - 10px);
          }
          ::slotted(*:first-child) {
            margin-top: 0px;
          }
          ::slotted(*:last-child) {
            margin-bottom: 0px;
          }
        `,
      ];
    }

    // render function
    render() {
      return html` <div
        id="container"
        @focus="${(e) => (this.__focused = true)}"
        @blur="${(e) => (this.__focused = false)}"
        @mouseover="${(e) => (this.__hovered = true)}"
        @mouseout="${(e) => (this.__hovered = false)}"
      >
        <slot></slot>
      </div>`;
    }
    static get properties() {
      return {
        ...super.properties,

        /**
         * editor's unique id
         */
        id: {
          name: "id",
          type: String,
          reflect: true,
          attribute: "id",
        },
        /**
         * Maps to editing attribute
         */
        contenteditable: {
          name: "contenteditable",
          type: String,
          reflect: true,
          attribute: "contenteditable",
        },
        /**
         * don't reveal toolbar on mouseover
         */
        disabled: {
          name: "disabled",
          type: Boolean,
          attribute: "disabled",
          reflect: true,
        },
        /**
         * don't reveal toolbar on mouseover
         */
        disableHover: {
          name: "disableHover",
          type: Boolean,
          attribute: "disable-hover",
        },
        /**
         * Placeholder text for empty editable regions
         */
        placeholder: {
          name: "placeholder",
          type: String,
          reflect: false,
          attribute: "aria-placeholder",
        },

        /**
         * id for toolbar
         */
        toolbarId: {
          name: "toolbarId",
          type: String,
          reflect: true,
          attribute: "toolbar-id",
        },

        /**
         * current range
         */
        range: {
          name: "range",
          type: Object,
          attribute: "range",
        },
        /**
         * raw html
         */
        rawhtml: {
          type: String,
          attribute: "rawhtml",
        },

        /**
         * type of editor toolbar, i.e.
         * full - full for full toolbar with breadcrumb,
         * mini - mini for mini floating toolbar, or
         * default toolbar if neither.
         */
        type: {
          name: "type",
          type: String,
          reflect: true,
          attribute: "type",
        },

        /**
         * whether editor is view source code mode
         */
        viewSource: {
          type: Boolean,
          attribute: "view-source",
          reflect: true,
        },

        /**
         * code-editor for view source
         */
        __codeEditorValue: {
          type: String,
        },

        /**
         * has focus
         */
        __needsUpdate: {
          type: Boolean,
        },

        /**
         * has focus
         */
        __focused: {
          type: Boolean,
        },

        /**
         * is hovered
         */
        __hovered: {
          type: Boolean,
        },
      };
    }

    /**
     * Store the tag name to make it easier to obtain directly.
     * @notice function name must be here for tooling to operate correctly
     */
    static get tag() {
      return "rich-text-editor";
    }
    constructor() {
      super();
      this.placeholder = "Click to edit";
      this.toolbarId = "";
      this.type = "rich-text-editor-toolbar";
      this.id = "";
      this.range = undefined;
      this.disabled = false;
      this.__focused = false;
      this.__hovered = false;
      this.editing = false;
      this.setAttribute("tabindex", 0);
      this.addEventListener("click", this._handleClick);
    }
    get editable() {
      return !!this.contenteditable && this.contenteditable !== "false";
    }

    get isEmpty() {
      return (
        !this.innerHTML ||
        this.innerHTML
          .replace(/<!--[^(-->)]*-->/g, "")
          .replace(/[\s\t\r\n]/gim, "") == ""
      );
    }

    firstUpdated() {
      if (super.firstUpdated) super.firstUpdated();
      if (this.isEmpty && !!this.rawhtml) {
        this.innerHTML = this.rawhtml.trim();
      } else if (this.isEmpty) {
        this.innerHTML = "";
      }
    }

    updated(changedProperties) {
      super.updated(changedProperties);
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "rawhtml" && !!this.rawhtml) {
          this.innerHTML = this.rawhtml.trim();
        }
        if (propName === "contenteditable") this._contenteditableChange();
      });
      if (!this.innerHTML) this.innerHTML = "";
    }
    /**
     * focuses on the contenteditable region
     * @memberof RichTextEditor
     */
    focus() {
      if (!this.disabled) {
        this.contenteditable = "true";
        this.__focused = true;
      }
      this.dispatchEvent(
        new CustomEvent("focus", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: this.querySelector("*"),
        }),
      );
    }

    /**
     * allows editor to fit within a stick toolbar
     *
     * @param {boolean} sticky
     * @memberof RichTextEditor
     */
    makeSticky(sticky = true) {
      if (!sticky) {
        this.classList.add("heightmax");
      } else {
        this.classList.remove("heightmax");
      }
    }
    /**
     * fires when contenteditable changed
     * @event contenteditable-changed
     *
     */
    _contenteditableChange() {
      this.dispatchEvent(
        new CustomEvent("contenteditable-change", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: this,
        }),
      );
    }

    /**
     * Handles clicking to edit.
     *
     * @param {event} e click event
     * @returns {void}
     */
    _handleClick(e) {
      e.preventDefault();
      if (!this.disabled && !this.editable && !this.__toolbar) {
        //get toolbar by id
        let toolbar,
          filter = !this.toolbarId
            ? []
            : (globalThis.RichTextEditorToolbars || []).filter(
                (toolbar) => toolbar.id === this.toolbarId,
              );
        //get toolbar by type
        if (filter.length === 0) {
          filter = !this.type
            ? []
            : (globalThis.RichTextEditorToolbars || []).filter(
                (toolbar) => toolbar.type === this.type,
              );
        }
        //get any toolbar
        if (filter.length === 0) filter = globalThis.RichTextEditorToolbars;
        if (filter[0]) {
          toolbar = filter[0];
        } else if (filter.length === 0) {
          //make toolbar
          toolbar = globalThis.document.createElement(
            this.type || "rich-text-editor-toolbar",
          );
        }
        this.__toolbar = toolbar;
        if (!this.disabled && this.__toolbar && this.__toolbar.setTarget)
          this.__toolbar.setTarget(this);
      }
    }
  };
};
/**
 * `rich-text-editor`
 * a standalone rich text editor
 * (can customize by extending RichTextEditorBehaviors)
### Styling

`<rich-text-editor>`  uses RichTextStyles variables, 
as well as an additional style:

Custom property | Description | Default
----------------|-------------|----------
--rich-text-editor-min-height | minimum height of editor | 20px
 *
 * @extends RichTextEditorBehaviors
 * @extends LitElement
 * @customElement
 * @element rich-text-editor
 * @lit-html
 * @lit-element
 * @demo ./demo/index.html demo
 * @demo ./demo/mini.html mini floating toolbar
 * @demo ./demo/full.html toolbar with breadcrumb
 * @demo ./demo/config.html custom configuration
 * @demo ./demo/rawhtml.html raw HTML
 */
class RichTextEditor extends RichTextEditorBehaviors(LitElement) {}
customElements.define(RichTextEditor.tag, RichTextEditor);
export { RichTextEditor, RichTextEditorBehaviors };
