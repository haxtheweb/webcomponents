/**
 * Copyright 2018 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import * as shadow from "shadow-selection-polyfill/shadow.js";
import { RichTextStyles } from "./lib/buttons/rich-text-editor-button.js";
import "./lib/toolbars/rich-text-editor-toolbar.js";
import "./lib/toolbars/rich-text-editor-toolbar-mini.js";
import "./lib/toolbars/rich-text-editor-toolbar-full.js";
import "./lib/singletons/rich-text-editor-selection.js";
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
        editing: {
          name: "editing",
          type: Boolean,
          reflect: true,
          attribute: "editing",
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
      this.disabled = false;
      this.__focused = false;
      this.__hovered = false;
      this.editing = false;
      this.__selection = window.RichTextEditorSelection.requestAvailability();
      let root = this;
      import("@lrnwebcomponents/code-editor/code-editor.js");
      this.setAttribute("tabindex", 1);
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
      }, 500);
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
        if (propName === "disabled") {
          this.disableEditing();
          this.setAttribute("tabindex", this.disabled ? -1 : 0);
        }
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
    /**
     * removes contenteditable and cleans HTML
     *
     * @event editing-disabled
     * @memberof RichTextEditor
     */
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
    /**
     * adds contenteditable and cleans HTML
     *
     * @event editing-endabled
     * @memberof RichTextEditor
     *
     */
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
     * gets cleaned HTML from the editor
     *
     * @returns {string}
     * @memberof RichTextEditor
     */
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
     * sets editor HTML
     *
     * @param {string} [rawhtml=""]
     * @memberof RichTextEditor
     */
    setHTML(rawhtml = "") {
      let html = this.sanitizeHTML(rawhtml).trim();
      this.innerHTML = html;
      this.setCancelHTML(html);
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
     * @returns {string}
     * @memberof RichTextEditor
     */
    trimHTML(node) {
      let str = node ? node.innerHTML : undefined;
      return this.trimString(str);
    }
    /**
     * cleans and trims a string of HTML so that it has no extra spaces
     *
     * @param {string} str
     * @returns {string}
     */
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
     * watches for range changes
     *
     * @memberof RichTextEditor
     */
    _editableChange() {
      let keyPress = (e) => {
        if (this.isEmpty() && e.key) {
          this.innerHTML = e.key
            .replace(">", "&gt;")
            .replace("<", "&lt;")
            .replace("&", "&amp;");
          let range = this._getRange();
          this.range.selectNodeContents(this);
          this.range.collapse();
        }
      };
      if (this.editing) {
        this.addEventListener("keypress", keyPress);
        this.setCancelHTML();
      } else {
        this.removeEventListener("keypress", keyPress);
      }
    }
    /**
     * gets range from shadowDOM
     *
     * @returns {range}
     */
    _getRange() {
      let shadowRoot = (el) => {
        let parent = el.parentNode;
        return parent ? shadowRoot(parent) : el;
      };
      try {
        this.range = shadowRoot(this)
          ? shadow.getRange(shadowRoot(this))
          : undefined;
      } catch (e) {
        this.range = undefined;
      }
      if (this.updateRange) this.updateRange();
      return this.range;
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
    /**
     * cleans up indents and extra spaces in HTML string for source code editor
     *
     * @param {string} [str=""]
     * @returns {string}
     */
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
    /**
     * handles range changes (can be overridden)
     *
     * @param {event} e
     */
    _rangeChange(e) {}
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
