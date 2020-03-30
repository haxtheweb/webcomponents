/**
 * @license MIT, see License.md for full text.
 */
import { LitElement, html, css } from "lit-element/lit-element.js";
import { oneDark } from "./lib/themes/one-dark.js";
import { hljs } from "./lib/highlightjs/highlight.js";
import { javascript } from "./lib/highlightjs/languages/javascript.js";
import { yaml } from "./lib/highlightjs/languages/yaml.js";
import { jsonLang } from "./lib/highlightjs/languages/json.js";
import { xml } from "./lib/highlightjs/languages/xml.js";
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", jsonLang);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("xml", xml);
window["hljs"] = hljs;
/**
 * `code-sample`
 * `<code-sample>` uses [highlight.js](https://highlightjs.org/) for syntax highlighting.
 * @demo demo/index.html
 * @element code-sample
 */
class CodeSample extends LitElement {
  //styles function
  static get styles() {
    return [
      css`
        :host {
          display: block;
        }

        :host([hidden]),
        [hidden] {
          display: none;
        }

        pre {
          margin: 0;
        }

        pre,
        code {
          font-family: var(
            --code-sample-font-family,
            Operator Mono,
            Inconsolata,
            Roboto Mono,
            monaco,
            consolas,
            monospace
          );
          font-size: var(--code-sample-font-size, 0.875rem);
        }

        .hljs {
          padding: 0 1.25rem;
          line-height: var(--code-sample-line-height, 1.3);
        }

        .demo:not(:empty) {
          padding: var(--code-sample-demo-padding, 0 0 1.25rem);
        }

        #code-container {
          position: relative;
        }

        button {
          background: var(--code-sample-copy-button-bg-color, #e0e0e0);
          border: none;
          cursor: pointer;
          display: block;
          position: absolute;
          right: 0;
          top: 0;
          text-transform: uppercase;
        }
      `
    ];
  }
  // render function
  render() {
    return html`
      <div id="theme"></div>
      <div id="demo" class="demo"></div>
      <slot></slot>
      <div id="code-container">
        <button
          type="button"
          ?hidden="${!this.copyClipboardButton}"
          id="copyButton"
          title="Copy to clipboard"
          @click="${this._copyToClipboard}"
        >
          Copy
        </button>
        <pre id="code"></pre>
      </div>
    `;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      canScale: true,
      canPosition: true,
      canEditSource: false,
      gizmo: {
        title: "Code sample",
        description: "A sample of code highlighted in the page",
        icon: "icons:code",
        color: "blue",
        groups: ["Code", "Development"],
        meta: {
          author: "kuscamara"
        }
      },
      settings: {
        quick: [],
        configure: [
          {
            slot: "",
            slotWrapper: "template",
            slotAttributes: {
              "preserve-content": "preserve-content"
            },
            title: "Source",
            description: "The URL for this video.",
            inputMethod: "code-editor"
          },
          {
            property: "copyClipboardButton",
            title: "Copy to clipboard button",
            description: "button in top right that says copy to clipboard",
            inputMethod: "boolean"
          }
        ],
        advanced: []
      },
      saveOptions: {
        unsetAttributes: ["theme"]
      }
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      // Set to true to show a copy to clipboard button.
      copyClipboardButton: {
        type: Boolean,
        attribute: "copy-clipboard-button"
      },
      // Tagged template literal with custom styles.
      // Only supported in Shadow DOM.
      theme: {
        type: String
      },
      // Code type (optional). (eg.: html, js, css)
      // Options are the same as the available classes for `<code>` tag using highlight.js
      type: {
        type: String
      }
    };
  }

  /**
   * Convention
   */
  static get tag() {
    return "code-sample";
  }
  constructor() {
    super();
    this._observer = null;
    this.theme = oneDark;
    this.copyClipboardButton = false;
  }
  firstUpdated() {
    this._updateContent();
  }
  /**
   * HTMLElement
   */
  connectedCallback() {
    super.connectedCallback();
    if (this.querySelector("template")) {
      this._observer = new MutationObserver(mutations => {
        if (this.shadowRoot) {
          this._updateContent();
        }
      });
      this._observer.observe(this, {
        attributes: true,
        childList: true,
        subtree: true
      });
    } else if (this.childNodes.length) {
      console.error(
        "<code-sample>:",
        "content must be provided inside a <template> tag"
      );
    }
  }
  /**
   * HTMLElement
   */
  disconnectedCallback() {
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
    super.disconnectedCallback();
  }
  /**
   * LitElement properties changed
   */
  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName == "theme") {
        this._themeChanged(this[propName]);
      }
    });
  }
  _themeChanged(theme) {
    if (theme && this._themeCanBeChanged(theme)) {
      while (this.shadowRoot.querySelector("#theme").childNodes > 0) {
        this.shadowRoot
          .querySelector("#theme")
          .removeChild(this.shadowRoot.querySelector("#theme").firstChild);
      }
      this.shadowRoot
        .querySelector("#theme")
        .appendChild(document.importNode(theme.content, true));
    }
  }
  _themeCanBeChanged(theme) {
    if (theme.tagName !== "TEMPLATE") {
      console.error("<code-sample>:", "theme must be a template");
      return;
    }
    return true;
  }
  _updateContent() {
    if (this._code) this._code.parentNode.removeChild(this._code);

    let template = this._getCodeTemplate();
    if (!template) {
      template = document.createElement("template");
      template.setAttribute("preserve-content", "preserve-content");
      this.appendChild(template);
    }
    this._highlight(template.innerHTML);
  }
  _getCodeTemplate() {
    const nodes = this.children;
    return [].filter.call(
      nodes,
      node => node.nodeType === Node.ELEMENT_NODE
    )[0];
  }
  _highlight(str) {
    this._code = document.createElement("code");
    if (this.type) this._code.classList.add(this.type);
    this._code.innerHTML = this._entitize(this._cleanIndentation(str));
    this.shadowRoot.querySelector("#code").appendChild(this._code);
    hljs.highlightBlock(this._code);
  }
  _cleanIndentation(str) {
    const pattern = str.match(/\s*\n[\t\s]*/);
    return str.replace(new RegExp(pattern, "g"), "\n");
  }
  _entitize(str) {
    return String(str)
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/=""/g, "")
      .replace(/=&gt;/g, "=>")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
  _copyToClipboard(event) {
    const copyButton = event.target;
    const textarea = this._textAreaWithClonedContent();
    textarea.select();

    try {
      document.execCommand("copy", false);
      copyButton.textContent = "Done";
    } catch (err) {
      console.error(err);
      copyButton.textContent = "Error";
    }

    textarea.remove();

    setTimeout(() => {
      copyButton.textContent = "Copy";
    }, 1000);
  }
  _textAreaWithClonedContent() {
    const textarea = document.createElement("textarea");
    document.body.appendChild(textarea);
    textarea.value = this._cleanIndentation(this._getCodeTemplate().innerHTML);

    return textarea;
  }
}
window.customElements.define(CodeSample.tag, CodeSample);
export { CodeSample };
