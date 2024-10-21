/**
 * Copyright 2019 The Pennsylvania State University
 * @license Apache-2.0, see License.md for full text.
 */
import { LitElement, html, css } from "lit";
import { SchemaBehaviors } from "@haxtheweb/schema-behaviors/schema-behaviors.js";
import "@haxtheweb/code-editor/lib/monaco-element/monaco-element.js";
import { ReplaceWithPolyfill } from "@haxtheweb/utils/utils.js";
if (!Element.prototype.replaceWith) {
  Element.prototype.replaceWith = ReplaceWithPolyfill;
}
if (!CharacterData.prototype.replaceWith) {
  CharacterData.prototype.replaceWith = ReplaceWithPolyfill;
}
if (!DocumentType.prototype.replaceWith) {
  DocumentType.prototype.replaceWith = ReplaceWithPolyfill;
}
/**
 * `code-editor`
 * `Wrapper on top of a code editor`
 *
 * @demo demo/index.html
 * @demo demo/updating.html Update contents
 * @microcopy - the mental model for this element
 * - monaco is the VS code editor
 * @element code-editor
 */
class CodeEditor extends SchemaBehaviors(LitElement) {
  /**
   * LitElement constructable styles enhancement
   */
  static get styles() {
    return [
      css`
        :host {
          display: flex;
          flex-direction: column;
          font-family: unset;
          align-items: stretch;
          margin: var(--code-pen-margin, 16px 0);
          width: calc(100% - 2px);
          background-color: #1e1e1e;
          color: #c6c6c6;
          border: var(--code-editor-code-border);
          border-radius: var(--code-editor-code-border-radius);
          border: 1px solid var(--code-editor-label-color, #ddd);
        }
        :host([theme-colors="vs-dark"]) {
          background-color: #1e1e1e;
          color: #c6c6c6;
          border: 1px solid var(--code-editor-label-color, #000);
        }
        :host([theme-colors="vs"]) {
          background-color: #fffffe;
          color: #000;
          border: 1px solid var(--code-editor-label-color, #ddd);
        }
        :host([hidden]) {
          display: none !important;
        }
        .code-pen-container:not([hidden]) {
          width: calc(100% - 2 * var(--code-editor-margin, 12px));
          display: flex;
          height: 40px;
          justify-content: flex-end;
          align-items: center;
          margin: var(--code-editor-margin, 12px);
        }
        .code-pen-container span {
          display: inline-flex;
          line-height: 16px;
          font-size: 16px;
          padding: 12px 0;
        }
        code-pen-button {
          float: right;
          height: 40px;
          flex: 0 0 40px;
        }
        :host([theme-colors="vs"]) code-pen-button::part(button) {
          filter: invert(1);
        }
        label {
          color: var(--code-editor-label-color, #444);
          transition: all 0.5s;
          flex: 0 0 auto;
          margin: var(--code-editor-margin, 12px);
        }
        :host([theme-colors="vs"]) label {
          color: var(--code-editor-label-color, #444);
        }
        :host([theme-colors="vs-dark"]) label {
          color: var(--code-editor-label-color, #bbb);
        }
        :host([hidden]) {
          display: none !important;
        }

        :host([focused]) label {
          color: var(
            --code-editor-float-label-active-color,
            var(--code-editor-label-color, currentColor)
          );
        }

        #loading {
          padding: 0 74px;
          flex: 1 1 auto;
          overflow: hidden;
          white-space: pre-wrap;
          text-overflow: ellipsis;
          font-family: monospace;
        }
        #codeeditor {
          flex: 1 1 auto;
          height: 100%;
        }
        #codeeditor[data-hidden] {
          height: 0px;
        }

        :host([focused]) #codeeditor {
          border: var(--code-editor-focus-code-border);
        }
      `,
    ];
  }
  /**
   * HTMLElement
   */
  constructor() {
    super();
    this.codePenData = null;
    this.haxUIElement = true;
    this.showCodePen = false;
    this.readOnly = false;
    this.theme = "vs-dark";
    this.language = "javascript";
    this.fontSize = 16;
    this.wordWrap = false;
    this.tabSize = 2;
    this.autofocus = false;
    this.hideLineNumbers = false;
    this.focused = false;
    // helps in local testing and some edge cases of CDNs
    if (globalThis.WCGlobalBasePath) {
      this.libPath = globalThis.WCGlobalBasePath;
    } else {
      this.libPath =
        new URL("./code-editor.js", import.meta.url).href + "/../../../";
    }
    this.libPath += "monaco-editor/min/vs";
    setTimeout(() => {
      this.addEventListener(
        "monaco-element-ready",
        this.editorReady.bind(this),
      );
    }, 0);
  }
  /**
   * LitElement render
   */
  render() {
    return html`
      <label for="codeeditor" ?hidden="${!this.title}" part="label"
        >${this.title}</label
      >
      <monaco-element
        id="codeeditor"
        ?data-hidden="${!this.ready}"
        ?autofocus="${this.autofocus}"
        ?hide-line-numbers="${this.hideLineNumbers}"
        lib-path="${this.libPath}"
        language="${this.language}"
        tab-size="${this.tabSize}"
        theme="${this.getTheme(this.theme)}"
        @value-changed="${this._editorDataChanged}"
        font-size="${this.fontSize}"
        ?word-wrap="${this.wordWrap}"
        ?read-only="${this.readOnly}"
        @code-editor-focus="${this._handleFocus}"
        @code-editor-blur="${this._handleBlur}"
        @monaco-element-ready="${(e) => (this.ready = true)}"
        part="code"
      >
      </monaco-element>
      <pre
        id="loading"
        ?hidden="${this.ready}"
        style="font-size:${this.fontSize}px"
        part="preview"
      ><code>
  ${this.placeholder}</code></pre>
      <slot hidden></slot>
      ${this.showCodePen
        ? html`<div class="code-pen-container" part="code-pen">
            <span>Check it out on code pen: </span
            ><code-pen-button .data="${this.codePenData}"></code-pen-button>
          </div>`
        : ``}
    `;
  }

  getTheme(theme) {
    let watch = globalThis.matchMedia && theme == "auto",
      dark =
        watch && globalThis.matchMedia("(prefers-color-scheme: dark)").matches,
      light =
        watch && globalThis.matchMedia("(prefers-color-scheme: light)").matches,
      other = !theme || theme == "auto" ? "vs-dark" : theme,
      color = dark ? "vs-dark" : light ? "vs" : other;
    this.setAttribute("theme-colors", color);
    return color;
  }

  get placeholder() {
    let content = `${this.editorValue || this.innerHTML}`;
    return content.replace(/\s*<\/?template.*>\s*/gm, "");
  }

  static get tag() {
    return "code-editor";
  }

  static get properties() {
    return {
      ...super.properties,
      libPath: {
        type: String,
      },
      /**
       * Title
       */
      title: {
        type: String,
      },
      /**
       * Show codePen button to fork it to there to run
       */
      showCodePen: {
        type: Boolean,
        reflect: true,
        attribute: "show-code-pen",
      },
      /**
       * Readonly setting for the editor
       */
      readOnly: {
        type: Boolean,
        reflect: true,
        attribute: "read-only",
      },
      /**
       * Code pen data, computed based on the HTML editor
       */
      codePenData: {
        type: Object,
        attribute: "code-pen-data",
      },
      /**
       * contents of the editor
       */
      editorValue: {
        type: String,
        attribute: "editor-value",
      },
      /**
       * value of the editor after the fact
       */
      value: {
        type: String,
      },
      /**
       * Theme for the Ace editor.
       */
      theme: {
        type: String,
        reflect: true,
        attribute: "theme",
      },
      /**
       * Mode / language for editor
       */
      mode: {
        type: String,
      },
      /**
       * Language to present color coding for
       */
      language: {
        type: String,
      },
      /**
       * font size for the editor
       */
      fontSize: {
        type: Number,
        attribute: "font-size",
      },
      wordWrap: {
        type: Boolean,
        attribute: "word-wrap",
      },
      /**
       * automatically set focus on the editor
       */
      autofocus: {
        type: Boolean,
        reflect: true,
      },
      /**
       * hide the line numbers
       */
      hideLineNumbers: {
        type: Boolean,
        attribute: "hide-line-numbers",
      },
      /**
       * does the monaco-editor have focus
       */
      focused: {
        type: Boolean,
        reflect: true,
      },
      /**
       * number of characters for tabs
       */
      tabSize: {
        type: Number,
        attribute: "tab-size",
      },
      ready: {
        type: Boolean,
      },
    };
  }

  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "editorValue") {
        this._editorValueChanged(this[propName]);
      }
      if (propName == "mode") {
        this._modeChanged(this[propName], oldValue);
      }
      if (propName === "showCodePen") {
        // notify
        this.dispatchEvent(
          new CustomEvent("show-code-pen-changed", {
            detail: {
              value: this[propName],
            },
          }),
        );
        if (
          this[propName] &&
          !globalThis.customElements.get("code-pen-button")
        ) {
          import("@haxtheweb/code-editor/lib/code-pen-button.js");
        }
      }
      if (propName === "value") {
        // notify
        this.dispatchEvent(
          new CustomEvent("value-changed", {
            detail: {
              value: this[propName],
            },
          }),
        );
      }
      if (propName === "focused") {
        // notify
        this.dispatchEvent(
          new CustomEvent("focused-changed", {
            detail: {
              focused: this[propName],
            },
          }),
        );
      }
      if (["title", "value"].includes(propName)) {
        this.codePenData = this._computeCodePenData(this.title, this.value);
      }
    });
  }
  /**
   * Update the post data whenever the editor has been updated
   */
  _computeCodePenData(title, editorValue) {
    return {
      title: title,
      html: editorValue,
      head: `<script>globalThis.WCGlobalCDNPath="https://cdn.webcomponents.psu.edu/cdn/";</script><script src="https://cdn.webcomponents.psu.edu/cdn/build.js"></script>`,
    };
  }
  /**
   * sets focused attribute when monaco-elements's focus event fires
   * @param {event} e the monaco-elements's focus event
   */
  _handleFocus(e) {
    this.focused = true;
  }
  /**
   * unsets focused attribute when monaco-elements's blur event fires
   * @param {event} e the monaco-elements's blur event
   */
  _handleBlur(e) {
    this.focused = false;
  }
  /**
   * LEGACY: pass down mode to language if that api is used
   */
  _modeChanged(newValue) {
    this.language = this.mode;
  }

  /**
   * Notice code editor changes and reflect them into this element
   */
  _editorDataChanged(e) {
    // value coming up off of thiss
    this.value = e.detail;
  }

  /**
   * Calculate what's in slot currently and then inject it into the editor.
   */
  updateEditorValue() {
    var content = "";
    var children = this.children;
    if (this.childNodes[0] && this.childNodes[0].tagName !== "TEMPLATE") {
      children = this.childNodes;
      if (children.length > 0) {
        // loop through everything found in the slotted area and put it back in
        for (var j = 0, len2 = children.length; j < len2; j++) {
          if (children[j].tagName) {
            content += children[j].outerHTML;
          } else {
            content += children[j].textContent;
          }
        }
      }
    } else if (children[0]) {
      content = children[0].innerHTML;
    }
    if (content) {
      this.shadowRoot.querySelector("#codeeditor").value = content.trim();
    }
  }
  _editorValueChanged(newValue) {
    if (newValue) {
      this.innerHTML = "";
      this.innerHTML = `<template>${newValue}</template>`;
      this.updateEditorValue();
    }
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      preProcessNodeToContent: "haxpreProcessNodeToContent",
      activeElementChanged: "haxactiveElementChanged",
    };
  }
  /**
   * allow HAX to toggle edit state when activated
   */
  haxactiveElementChanged(el, val) {
    // overwrite the HAX dom w/ what our editor is supplying
    if (!val) {
      let replacement = this.getValueAsNode(el);
      if (el) {
        el.replaceWith(replacement);
      }
      el = replacement;
    }
    return el;
  }
  /**
   * Ensure fields don't pass through to HAX if in that context
   */
  haxpreProcessNodeToContent(node) {
    node.editorValue = null;
    node.codePenData = null;
    node.value = null;
    node.removeAttribute("value");
    node.removeAttribute("code-pen-data");
    return node;
  }
  /**
   * return HTML object of table data
   * @returns {object} HTML object for managed table
   */
  getValueAsNode(wrap = null) {
    if (wrap == null) {
      wrap = globalThis.document.createElement("p");
    }
    if (this.value) {
      wrap.innerHTML = this.value;
    }
    // implies we were actually modifying the thing in question
    // which we wanted to leverage. Example, code-sample won't have code-sample as
    // an immediate child. This implies the wrap is there for editing the ENTIRE item
    // where as if the wrapper was code-sample and the tagName of the 1st child
    // was template, then we'd know this should be the inner material
    if (
      wrap.firstElementChild &&
      wrap.children.length === 1 &&
      wrap.firstElementChild.tagName === wrap.tagName
    ) {
      return wrap.firstElementChild;
    }
    return wrap;
  }
  /**
   * attached life cycle
   */
  connectedCallback() {
    super.connectedCallback();
    // mutation observer that ensures state of hax applied correctly
    this._observer = new MutationObserver((mutations) => {
      this.updateEditorValue();
    });
  }
  disconnectedCallback() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    super.disconnectedCallback();
  }
  editorReady(e) {
    if (this.editorValue) {
      this.shadowRoot.querySelector("#codeeditor").value = this.editorValue;
    } else {
      this.updateEditorValue();
    }
    if (this._observer) {
      this._observer.observe(this, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
      });
    }
  }
}
customElements.define(CodeEditor.tag, CodeEditor);
export { CodeEditor };
