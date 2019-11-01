/**
 * @license MIT, see License.md for full text.
 */
import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";
import { FlattenedNodesObserver } from "@polymer/polymer/lib/utils/flattened-nodes-observer.js";
import { oneDark } from "./lib/themes/one-dark.js";
import { hljs } from "./lib/highlightjs/highlight.js";
import { javascript } from "./lib/highlightjs/languages/javascript.js";
import { xml } from "./lib/highlightjs/languages/xml.js";
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("xml", xml);
window["hljs"] = hljs;
/**
 * `code-sample`
 * `<code-sample>` uses [highlight.js](https://highlightjs.org/) for syntax highlighting.
 * @polymer
 * @customElement
 * @extends {PolymerElement}
 * @demo demo/index.html
 */
class CodeSample extends PolymerElement {
  /* REQUIRED FOR TOOLING DO NOT TOUCH */

  /**
   * Store the tag name to make it easier to obtain directly.
   * @notice function name must be here for tooling to operate correctly
   */
  static get tag() {
    return "code-sample";
  }
  /**
   * life cycle, element is afixed to the DOM
   */
  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      if (this.querySelector("template")) {
        this._observer = new FlattenedNodesObserver(
          this.shadowRoot.querySelector("#content"),
          () => this._updateContent()
        );
      } else if (this.childNodes.length) {
        console.error(
          "<code-sample>:",
          "content must be provided inside a <template> tag"
        );
      }
    });
  }
  /**
   * life cycle, element is removed from the DOM
   */
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._observer) {
      this._observer.disconnect();
      this._observer = null;
    }
  }
  _themeChanged(theme) {
    if (theme && this._themeCanBeChanged()) {
      const previousTheme = this.shadowRoot
        .querySelector("#theme")
        .querySelector("style");
      this.shadowRoot
        .querySelector("#theme")
        .replaceChild(document.importNode(theme.content, true), previousTheme);
    }
  }
  _themeCanBeChanged() {
    if (window.ShadyCSS) {
      console.error(
        "<code-sample>:",
        "Theme changing is not supported in Shady DOM."
      );
      return;
    }

    if (this.theme.tagName !== "TEMPLATE") {
      console.error("<code-sample>:", "theme must be a template");
      return;
    }

    return true;
  }
  _updateContent() {
    if (this._code) this._code.parentNode.removeChild(this._code);
    if (this._demo) this.shadowRoot.querySelector("#demo").innerHTML = "";

    const template = this._getCodeTemplate();

    if (this.render) {
      this._demo = this.shadowRoot
        .querySelector("#demo")
        .appendChild(document.importNode(template.content, true));
    }

    this._highlight(template.innerHTML);
  }
  _getCodeTemplate() {
    const nodes = FlattenedNodesObserver.getFlattenedNodes(
      this.shadowRoot.querySelector("#content")
    );
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
