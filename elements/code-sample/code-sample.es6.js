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
  
  // render function
  static get template() {
    return html`
<style>
:host {
    display: block;
}

:host([hidden]),
[hidden] {
    display: none;
}

pre {
    margin: 0;
    @apply --code-sample-pre;
}

pre, code {
    font-family: var(--code-sample-font-family, Operator Mono, Inconsolata, Roboto Mono, monaco, consolas, monospace);
    font-size: var(--code-sample-font-size, 0.875rem);
}

.hljs {
    padding: 0 1.25rem;
    line-height: var(--code-sample-line-height, 1.3);
    @apply --code-sample-hljs;
}

.demo:not(:empty) {
    padding: var(--code-sample-demo-padding, 0 0 1.25rem);
    @apply --code-sample-demo-not-empty;
}

.demo {
    @apply --code-sample-demo;
}

#code-container {
    position: relative;
    @apply --code-sample-code-container;
}

#code-container:hover {
    @apply --code-sample-code-container-hover;
}

#code-container:hover > button {
    @apply --code-sample-code-container-hover-button;
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
    @apply --code-sample-copy-clipboard-button;
}
        </style>
<div id="theme">${this.constructor.theme || oneDark}</div>
<div id="demo" class="demo"></div>
<slot id="content"></slot>

<div id="code-container">
  <button type="button" hidden="[[!copyClipboardButton]]" id="copyButton" title="Copy to clipboard" on-click="_copyToClipboard">Copy</button>
  <pre id="code"></pre>
</div>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
  "canScale": true,
  "canPosition": true,
  "canEditSource": false,
  "gizmo": {
    "title": "Code sample",
    "description": "A sample of code highlighted in the page",
    "icon": "icons:code",
    "color": "blue",
    "groups": ["Code", "Development"],
    "meta": {
      "author": "kuscamara"
    }
  },
  "settings": {
    "quick": [],
    "configure": [
      {
        "slot": "",
        "slotWrapper": "template",
        "slotAttributes": {
          "preserve-content": "preserve-content"
        },
        "title": "Source",
        "description": "The URL for this video.",
        "inputMethod": "code-editor"
      },
      {
        "attribute": "copy-clipboard-button",
        "title": "Copy to clipboard button",
        "description": "button in top right that says copy to clipboard",
        "inputMethod": "boolean"
      }
    ],
    "advanced": []
  }
}
;
  }
  // properties available to the custom element for data binding
    static get properties() {
    let props = {
  // Set to true to show a copy to clipboard button.
  "copyClipboardButton": {
    "type": Boolean,
    "value": false
  },
  // Tagged template literal with custom styles.
  // Only supported in Shadow DOM.
  "theme": {
    "type": String,
    "observer": "_themeChanged"
  },
  // Set to true to render the code inside the template.
  "render": {
    "type": Boolean,
    "value": false
  },
  // Code type (optional). (eg.: html, js, css)
  // Options are the same as the available classes for `<code>` tag using highlight.js
  "type": {
    "type": String
  }
}
;
    if (super.properties) {
      props = Object.assign(props, super.properties);
    }
    return props;
  }

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
