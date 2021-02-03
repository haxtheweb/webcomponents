/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { RichTextStyles } from "./lib/buttons/rich-text-editor-button.js";
import * as shadow from "shadow-selection-polyfill/shadow.js";
import "./lib/singletons/rich-text-editor-selection.js";
import "./lib/toolbars/rich-text-editor-toolbar.js";
import "./lib/toolbars/rich-text-editor-toolbar-mini.js";
import "./lib/toolbars/rich-text-editor-toolbar-full.js";
const RichTextEditorBehaviors = function (SuperClass) {
  return class extends SuperClass {
    //styles function
    static get styles() {
      return [
        ...RichTextStyles,
        css`
          :host([hidden]) {
            display: none;
          }

          :host {
            display: block;
            --simple-toolbar-border-color: #ddd;
            --simple-toolbar-border-width: 1px;
            --simple-toolbar-button-opacity: 1;
            --simple-toolbar-button-color: #444;
            --simple-toolbar-bg: #ffffff;
            --simple-toolbar-button-bg: #ffffff;
            --simple-toolbar-button-border-color: transparent;
            --simple-toolbar-button-toggled-opacity: 1;
            --simple-toolbar-button-toggled-color: #222;
            --simple-toolbar-button-toggled-bg: #ddd;
            --simple-toolbar-button-toggled-border-color: transparent;
            --simple-toolbar-button-hover-opacity: 1;
            --simple-toolbar-button-hover-color: #000;
            --simple-toolbar-button-hover-bg: #f0f0f0;
            --simple-toolbar-button-hover-border-color: unset;
            --simple-toolbar-button-disabled-opacity: 1;
            --simple-toolbar-button-disabled-color: #666;
            --simple-toolbar-button-disabled-bg: transparent;
            --simple-toolbar-button-disabled-border-color: transparent;
          }

          :host(:focus) {
            outline: none;
          }

          :host(.heightmax[editing]) {
            max-height: calc(100vh - 200px);
            overflow-y: scroll;
          }

          #container {
            display: flex;
            align-items: stretch;
            justify-content: space-between;
            width: 100%;
          }
          #placeholder {
            display: none;
            width: 100%;
          }
          #source,
          #wysiwyg {
            margin: 0;
            padding: 0;
            min-height: 40px;
            cursor: pointer;
            outline: none;
            flex: 1 1 100%;
            width: 100%;
          }
          :host(:empty) #placeholder {
            outline: var(--rich-text-editor-border-width, 1px) dashed
              var(--simple-toolbar-border-color);
            margin: 10px;
            width: calc(100% - 10px);
          }

          :host(:empty) #source:focus #placeholder,
          :host(:empty) #source:hover #placeholder {
            display: block;
            margin: 0;
            padding: 0;
          }

          #source:hover,
          #source:focus-within,
          :host(:not([editing][view-source])) #wysiwyg:hover,
          :host(:not([editing][view-source])) #wysiwyg:focus,
          :host(:not([editing][view-source])) #wysiwyg:focus-within {
            outline: var(--rich-text-editor-border-width, 2px) solid
              var(--rich-text-editor-focus-color, blue);
          }

          :host([editing][view-source]) #source,
          :host([editing][view-source]) #wysiwyg {
            resize: horizontal;
            overflow: auto;
            min-width: 5%;
            max-width: 95%;
            flex: 1 1 auto;
            width: 50%;
          }
          :host([editing][view-source]) #wysiwyg {
            cursor: not-allowed;
            margin-right: 10px;
            width: calc(50% - 10px);
          }

          *::selection .rich-text-editor-selection {
            background-color: var(
              --rich-text-editor-selection-bg,
              rgb(146, 197, 255)
            );
          }

          ::slotted(*:first-child) {
            margin-top: 0;
          }

          ::slotted(*:last-child) {
            margin-bottom: 0;
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
        <div id="wysiwyg">
          <div id="placeholder" aria-placeholder="${this.placeholder}">
            ${this.placeholder}
          </div>
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
    // properties available to the custom element for data binding
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
        editing: {
          name: "editing",
          type: Boolean,
          reflect: true,
          attribute: "editing",
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
        toolbar: {
          name: "toolbar",
          type: String,
          reflect: true,
          attribute: "toolbar",
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
         * whether to update range
         */
        updateRange: {
          type: Boolean,
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
         * contains cancelled edits
         */
        __canceledEdits: {
          type: Object,
        },

        /**
         * connected toolbar
         */
        __connectedToolbar: {
          type: Object,
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

        /**
         * selection management
         */
        __selection: {
          type: Object,
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
      this.toolbar = "";
      this.type = "rich-text-editor-toolbar";
      this.id = "";
      this.range = undefined;
      this.__focused = false;
      this.__hovered = false;
      this.editing = false;
      this.__selection = window.RichTextEditorSelection.requestAvailability();
      let root = this;
      import("@lrnwebcomponents/code-editor/code-editor.js");
      document.addEventListener(shadow.eventName, this._getRange.bind(root));
    }

    /**
     * mutation observer
     *
     * @readonly
     * @memberof RichTextEditor
     */
    get observer() {
      return new MutationObserver(this._getRange);
    }

    connectedCallback() {
      super.connectedCallback();
      setTimeout(() => {
        this.register();
      }, 1);
    }

    /**
     * life cycle, element is disconnected
     * @returns {void}
     */
    disconnectedCallback() {
      super.disconnectedCallback();
      this.register(true);
    }

    firstUpdated() {
      if (super.firstUpdated) super.firstUpdated();
      if (this.isEmpty() && !!this.rawhtml) {
        this.setHTML(this.rawhtml);
      } else {
        if (this.isEmpty()) this.innerHTML = "";
        this._editableChange();
      }
    }

    updated(changedProperties) {
      super.updated(changedProperties);
      changedProperties.forEach((oldValue, propName) => {
        if (propName === "editing") this._editableChange();
        if (propName === "range") this._rangeChange();
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

    disableEditing() {
      this.editing = false;
      this.dispatchEvent(
        new CustomEvent("editing-disabled", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: (this.innerHTML || "")
            .replace(/<!--[^(-->)]*-->/g, "")
            .trim(),
        })
      );
    }
    enableEditing() {
      this.editing = true;
      this.dispatchEvent(
        new CustomEvent("editing-enabled", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: (this.innerHTML || "")
            .replace(/<!--[^(-->)]*-->/g, "")
            .trim(),
        })
      );
    }
    focus() {
      this.__focused = true;
      this.dispatchEvent(
        new CustomEvent("focus", {
          bubbles: true,
          composed: true,
          cancelable: true,
          detail: this.querySelector("*"),
        })
      );
    }
    getHTML() {
      return this.isEmpty()
        ? ""
        : (this.innerHTML || "").replace(/<!--[^(-->)]*-->/g, "").trim();
    }
    /**
     * determines if editor is empty
     *
     * @returns {string}
     * @memberof RichTextEditor
     */
    isEmpty() {
      return !this.innerHTML || this.trimHTML(this) == "";
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
     * set observer on or off
     *
     * @param {boolean} [on=true]
     * @memberof RichTextEditor
     */
    observeChanges(on = true) {
      if (on) {
        this.observer.observe(this, {
          attributes: false,
          childList: true,
          subtree: true,
          characterData: false,
        });
      } else {
        if (this.observer) this.observer.disconnect;
      }
    }

    /**
     *
     *
     * @memberof RichTextEditor
     */
    paste(pasteContent, sanitized = true) {
      this._handlePaste(pasteContent);
    }
    /**
     * handles registration to selection singleton's toolbars list
     * @param {boolean} remove whether to remove
     * @event register
     */
    register(remove = false) {
      window.dispatchEvent(
        new CustomEvent("register", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: {
            remove: remove,
            editor: this,
          },
        })
      );
    }
    /**
     * revert content to before editing=true
     *
     * @memberof RichTextEditor
     */
    revert() {
      this.innerHTML = this.__canceledEdits;
    }
    /**
     * gets closet document oor shadowRoot
     *
     * @returns node
     * @memberof RichTextEditor
     */
    rootNode() {
      return !this.__selection ? document : this.__selection.getRoot(this);
    }

    /**
     * sanitizesHTML
     * override this function to make your own filters
     *
     * @param {string} html html to be pasted
     * @returns {string} filtered html as string
     */
    sanitizeHTML(html) {
      if (!html) return;
      let regex = "<body(.*\n)*>(.*\n)*</body>";
      if (html.match(regex) && html.match(regex).length > 0)
        html = html.match(regex)[0].replace(/<\?body(.*\n)*\>/i);
      return html;
    }
    /**
     *
     *
     * @param {string} [rawhtml=""]
     * @memberof RichTextEditor
     */
    setHTML(rawhtml = "") {
      this.innerHTML = rawhtml.trim();
      this.setCancelHTML(rawhtml.trim());
      if (this.isEmpty()) this.innerHTML = "";
      this._editableChange();
    }
    /**
     * holds on to edits so cancel willwork
     *
     * @param {string} [html=this.innerHTML]
     * @memberof RichTextEditor
     */
    setCancelHTML(html = this.innerHTML) {
      this.__canceledEdits = html || "";
    }
    /**
     * gets trimmed version of innerHTML
     *
     * @param {obj} node
     * @returns string
     * @memberof RichTextEditor
     */
    trimHTML(node) {
      let str = node ? node.innerHTML : undefined;
      return this.trimString(str);
    }
    trimString(str) {
      return (str || "")
        .replace(/<!--[^(-->)]*-->/g, "")
        .replace(/[\s\t\r\n]/gim, "");
    }
    updateRange() {
      this.dispatchEvent(
        new CustomEvent("getrange", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        })
      );
    }
    /**
     * updates editor placeholder and watches for range changes
     *
     * @memberof RichTextEditor
     */
    _editableChange() {
      if (this.editing) {
        this.setCancelHTML();
        if (this.isEmpty()) this.innerHTML = "";
      }
    }

    _getRange() {
      let shadowRoot = (el) => {
        let parent = el.parentNode;
        return parent ? shadowRoot(parent) : el;
      };
      this.range = shadowRoot(this)
        ? shadow.getRange(shadowRoot(this))
        : undefined;
      if (this.updateRange) this.updateRange();
    }

    /**
     * Handles paste.
     *
     * @param {event} e paste event
     * @returns {void}
     */
    _handlePaste(e) {
      let pasteContent = "";
      // intercept paste event
      if (e && (e.clipboardData || e.originalEvent.clipboardData)) {
        pasteContent = (e.originalEvent || e).clipboardData.getData(
          "text/html"
        );
      } else if (window.clipboardData) {
        pasteContent = window.clipboardData.getData("Text");
      }
      this.dispatchEvent(
        new CustomEvent("pastefromclipboard", {
          bubbles: true,
          cancelable: true,
          composed: true,
          detail: this,
        })
      );
      e.preventDefault();
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
          cleanCode = this._outdentHTML(code).replace(/\s+/gm, ""),
          cleanHTML = this._outdentHTML(html).replace(/\s+/gm, "");
        this.__needsUpdate = cleanCode.localeCompare(cleanHTML);
        let update = () => {
          this.__needsUpdate = false;
          this.innerHTML = e.detail.value;
        };
        if (this.__needsUpdate) setTimeout(update.bind(this), 300);
      }
    }
    _outdentHTML(str = "") {
      str = this.sanitizeHTML(str)
        .replace(/[\s]*$/, "")
        .replace(/^[\n\r]*/, "")
        .replace(/[\n\r]+/gm, "\n");
      let match = str.match(/^\s+/),
        find = match ? match[0] : false,
        regex = !find ? false : new RegExp(`\\n${find}`, "gm");
      str = str.replace(/^\s+/, "");
      str = regex ? str.replace(regex, "\n ") : str;
      return str;
    }
    _handleViewSourceChange() {
      let code = this.shadowRoot
        ? this.shadowRoot.querySelector("#source")
        : undefined;
      if (code && this.viewSource) {
        code.editorValue = this._outdentHTML(this.innerHTML);
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
    _rangeChange(e) {}
  };
};
/**
 * `rich-text-editor`
 * @element rich-text-editor
 * a standalone rich text editor
 *
 * @demo ./demo/index.html demo
 * @demo ./demo/mini.html mini floating toolbar
 * @demo ./demo/full.html toolbar with breadcrumb
 * @demo ./demo/config.html custom configuration
 * @demo ./demo/rawhtml.html raw HTML
 */
class RichTextEditor extends RichTextEditorBehaviors(LitElement) {}
window.customElements.define(RichTextEditor.tag, RichTextEditor);
export { RichTextEditor, RichTextEditorBehaviors };
