/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
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

          :host(.heightmax[editing]) {
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
          :host(:empty) #wysiwyg::after {
            display: block;
            content: attr(aria-placeholder);
          }

          :host(:hover),
          :host(:focus-within) {
            opacity: 1;
            outline: var(--rich-text-editor-border-width, 1px) solid
              var(--rich-text-editor-focus-color, blue);
          }
          :host([disabled]),
          :host([view-source]) {
            outline: none !important;
          }

          #source:hover,
          #source:focus-within {
            outline: var(--rich-text-editor-border-width, 1px) solid
              var(--rich-text-editor-focus-color, blue);
          }
          :host([editing][view-source]) #container {
            display: flex;
            align-items: stretch;
            justify-content: space-between;
            width: 100%;
          }
          :host([editing][view-source]) #source,
          :host([editing][view-source]) #wysiwyg {
            resize: horizontal;
            overflow: auto;
            flex: 1 1 auto;
            width: 50%;
          }
          :host([editing][view-source]) #source {
            min-width: 300px;
          }
          :host([editing][view-source]) #wysiwyg {
            cursor: not-allowed;
            margin-right: 10px;
            width: calc(50% - 10px);
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
        <div id="wysiwyg" aria-placeholder="${this.placeholder}">
          <slot></slot>
        </div>
        <code-editor
          id="source"
          font-size="13"
          ?hidden="${!(this.viewSource && this.editing)}"
          language="html"
          @value-changed="${this._handleSourceChange}"
          word-wrap
        >
        </code-editor>
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
          type: Boolean,
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
          reflect: true,
          attribute: "placeholder",
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
      this.contenteditable = false;
      import("@lrnwebcomponents/code-editor/code-editor.js");
      this.setAttribute("tabindex", 1);
      this.addEventListener("click", this._handleClick);
    }

    firstUpdated() {
      if (super.firstUpdated) super.firstUpdated();
      /*if (this.isEmpty() && !!this.rawhtml) {
        this.setHTML(this.rawhtml);
      } else {
        if (this.isEmpty()) this.innerHTML = "";
        this._editableChange();
      }*/
    }

    updated(changedProperties) {
      super.updated(changedProperties);
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "rawhtml" && !!this.rawhtml)
          this.setHTML(this.rawhtml);
        if (propName === "viewSource") this._handleViewSourceChange();
        if (["viewSource", "editing"].includes(propName)) {
          if (this.editing && !this.viewSource) {
            this.setAttribute("contenteditable", true);
          } else {
            this.removeAttribute("contentEditable");
          }
        }
      });
      if (!this.innerHTML) this.innerHTML = "";
    }
    /**
     * focuses on the contenteditable region
     * @memberof RichTextEditor
     */
    focus() {
      if (!this.disabled) this.__focused = true;
      this.dispatchEvent(
        new CustomEvent("focus", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: this.querySelector("*"),
        })
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
     * Handles clicking to edit.
     *
     * @param {event} e paste event
     * @returns {void}
     */
    _handleClick(e) {
      e.preventDefault();
      if (!this.contenteditable && !this.__toolbar) {
        console.log(this.__toolbar, this.contenteditable);
        //get toolbar by id
        let toolbar,
          filter = !this.toolbarId
            ? []
            : (window.RichTextEditorToolbars || []).filter(
                (toolbar) => toolbar.id === this.toolbarId
              );
        //get toolbar by type
        if (filter.length === 0) {
          filter = !this.type
            ? []
            : (window.RichTextEditorToolbars || []).filter(
                (toolbar) => toolbar.type === this.type
              );
        }
        //get any toolbar
        if (filter.length === 0) filter = window.RichTextEditorToolbars;
        if (filter[0]) {
          toolbar = filter[0];
        } else if (filter.length === 0) {
          //make toolbar
          toolbar = document.createElement(
            this.type || "rich-text-editor-toolbar"
          );
        }
        this.__toolbar = toolbar;
        if (!this.disabled) this.__toolbar.setTarget(this);
      }
    }
    /**
     * updates editor content to code-editor value
     *
     * @param {event} e code-editor's value change event
     * @memberof RichTextEditor
     */
    _handleSourceChange(e) {
      if (!this.__needsUpdate) {
        let html = `${this.innerHTML}`,
          code = !!e.detail.value ? `${e.detail.value}` : html,
          cleanCode = this.outdentHTML(code).replace(/\s+/gm, ""),
          cleanHTML = this.outdentHTML(html).replace(/\s+/gm, "");
        this.__needsUpdate = cleanCode.localeCompare(cleanHTML);
        let update = () => {
          this.__needsUpdate = false;
          this.innerHTML = e.detail.value;
        };
        if (this.__needsUpdate) setTimeout(update.bind(this), 300);
      }
    }
    /**
     * hangles show/hide view source
     *
     * @param {event} e
     */
    _handleViewSourceChange(e) {
      let code = this.shadowRoot
        ? this.shadowRoot.querySelector("#source")
        : undefined;
      if (code && this.viewSource) {
        code.editorValue = this.outdentHTML(this.innerHTML);
        code.addEventListener(
          "value-changed",
          this._handleSourceChange.bind(this)
        );
      } else if (code) {
        code.removeEventListener(
          "value-changed",
          this._handleSourceChange.bind(this)
        );
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
window.customElements.define(RichTextEditor.tag, RichTextEditor);
export { RichTextEditor, RichTextEditorBehaviors };
