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
 * @customElement code-sample
 */
class CodeSample extends LitElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

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
