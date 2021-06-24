/**
 * @license MIT, see License.md for full text.
 */
import { LitElement, html, css, render } from "lit";
import { oneDark } from "./lib/themes/one-dark.js";
import { hljs } from "./lib/highlightjs/highlight.js";
import { javascript } from "./lib/highlightjs/languages/javascript.js";
import { yaml } from "./lib/highlightjs/languages/yaml.js";
import { jsonLang } from "./lib/highlightjs/languages/json.js";
import { cssLang } from "./lib/highlightjs/languages/css.js";
import { phpLang } from "./lib/highlightjs/languages/php.js";
import { xml } from "./lib/highlightjs/languages/xml.js";
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", jsonLang);
hljs.registerLanguage("css", cssLang);
hljs.registerLanguage("php", phpLang);
hljs.registerLanguage("yaml", yaml);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("html", xml);
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
      `,
    ];
  }

  // render function
  render() {
    return html` <div id="theme"></div>
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
      </div>`;
  }

  // haxProperty definition
  static get haxProperties() {
    return {
      type: "element",
      canScale: true,
      canPosition: true,
      canEditSource: true,
      gizmo: {
        title: "Code sample",
        description: "A sample of code highlighted in the page",
        icon: "icons:code",
        color: "blue",
        groups: ["Code", "Development"],
        meta: {
          author: "elmsln",
        },
      },
      settings: {
        configure: [
          {
            property: "type",
            title: "Code highlighting",
            description: "Syntax highlighting to apply to the code area",
            inputMethod: "select",
            options: {
              javascript: "JavaScript",
              css: "CSS",
              html: "HTML",
              xml: "XML",
              json: "JSON data",
              php: "PHP",
              yaml: "YAML",
            },
          },
          {
            slot: "",
            slotWrapper: "template",
            slotAttributes: {
              "preserve-content": "preserve-content",
            },
            title: "Source",
            description: "The URL for this video.",
            inputMethod: "code-editor",
          },
          {
            property: "copyClipboardButton",
            title: "Copy to clipboard button",
            description: "button in top right that says copy to clipboard",
            inputMethod: "boolean",
          },
        ],
        advanced: [],
      },
      saveOptions: {
        unsetAttributes: ["theme"],
      },
      demoSchema: [
        {
          tag: "code-sample",
          content:
            '<template preserve-content="preserve-content">const great = "example";</template>',
          properties: {
            "copy-clipboard-button": "copy-clipboard-button",
          },
        },
      ],
    };
  }
  // properties available to the custom element for data binding
  static get properties() {
    return {
      ...super.properties,

      // Set to true to show a copy to clipboard button.
      copyClipboardButton: {
        type: Boolean,
        attribute: "copy-clipboard-button",
      },
      // Tagged template literal with custom styles.
      // Only supported in Shadow DOM.
      theme: {
        type: Object,
      },
      // Code type (optional). (eg.: html, js, css)
      // Options are the same as the available classes for `<code>` tag using highlight.js
      type: {
        type: String,
        reflect: true,
      },
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
    this.type = "html";
    this.copyClipboardButton = false;
  }
  /**
   * Implements haxHooks to tie into life-cycle if hax exists.
   */
  haxHooks() {
    return {
      gizmoRegistration: "haxgizmoRegistration",
    };
  }
  /**
   * @see haxHooks: gizmoRegistration
   */
  haxgizmoRegistration(store) {
    let list = [
      "javascript",
      "js",
      "json",
      "css",
      "php",
      "yaml",
      "xml",
      "html",
    ];
    for (var i in list) {
      store.keyboardShortcuts["```" + list[i]] = {
        tag: "code-sample",
        properties: {
          type: list[i] === "js" ? "javascript" : list[i],
        },
        content: `<template preserve-content="preserve-content">${this.getExample(
          list[i]
        )}</template>`,
      };
    }
    // force the default to now be code-sample instead of code
    store.keyboardShortcuts["```"] = store.keyboardShortcuts["```html"];
  }
  /**
   * returns a very simple example of the type of data requested
   */
  getExample(type) {
    switch (type) {
      case "css":
        return `
  .the-cheet[is="tothelimit"] {
    padding: 8px;
    margin: 4px;
  }
`;
        break;
      case "html":
        return `
  <blockquote>
  Dear Strongbad,
  In 5th grade I have to watch a <em>lame hygiene movie</em>. I was thinking
  you could make a <strong id="bad">better movie about hygiene</strong> than the cruddy school version.
  Your friend,
  John
  </blockquote>
`;
        break;
      case "javascript":
      case "js":
        return `const everyBody = "to the limit";
  let theCheat = true;
  if (theCheat) {
    return \`is \${everyBody}\`;
  }`;
        break;
      case "xml":
        return `<IAmLike>
  <ComeOn>fhqwhgads</ComeOn>
</IAmLike>`;
        break;
      case "yaml":
        return `- CaracterList:
  - Homestar Runner
  - Strongbad
  - The Cheat`;
        break;
      case "php":
        return `  $MrTheCheat = "wins the big race";
if ($MrTheCheat) {
  return "HaVe A tRoPhY";
}`;
        break;
      case "json":
        return `{
  "mainMenu": [
    "Characters",
    "Games",
    "Toons",
    "Email",
    "Store"
  ]
}`;
        break;
    }
  }
  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    // can't allow this to be null for a number of reasons related
    // to the tag's internals. This ensures it's not null on initial paint
    if (this.innerHTML == "") {
      this.innerHTML =
        '<template preserve-content="preserve-content">const great="example";</template>';
    }
    this._updateContent();
    setTimeout(() => {
      this._themeChanged(this.theme);
    }, 0);
  }
  /**
   * HTMLElement
   */
  connectedCallback() {
    super.connectedCallback();
    if (this.querySelector("template")) {
      this._observer = new MutationObserver((mutations) => {
        if (this.shadowRoot) {
          this._updateContent();
        }
      });
      this._observer.observe(this, {
        attributes: true,
        childList: true,
        subtree: true,
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
      if (propName == "theme" && this.shadowRoot) {
        this._themeChanged(this[propName]);
      }
    });
  }
  _themeChanged(theme) {
    if (theme) {
      while (this.shadowRoot.querySelector("#theme").childNodes > 0) {
        this.shadowRoot
          .querySelector("#theme")
          .removeChild(this.shadowRoot.querySelector("#theme").firstChild);
      }
      render(theme, this.shadowRoot.querySelector("#theme"));
    }
  }
  _updateContent() {
    if (this._code && this._code.parentNode) {
      this._code.parentNode.removeChild(this._code);
    }

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
      (node) => node.nodeType === Node.ELEMENT_NODE
    )[0];
  }
  _highlight(str) {
    this._code = document.createElement("code");
    if (this.type) this._code.classList.add(this.type);
    this._code.innerHTML = this._entitize(this._cleanIndentation(str));
    if (this.shadowRoot && this.shadowRoot.querySelector("#code")) {
      this.shadowRoot.querySelector("#code").appendChild(this._code);
      hljs.highlightBlock(this._code);
    }
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
