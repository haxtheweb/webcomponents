import { html, PolymerElement } from "@polymer/polymer/polymer-element.js";

/**
 * `monaco-element`
 * Webcomponent wrapper for the monaco editor.
 *
 * Sets value, language and theme.
 * Offers a value-changed event.
 *
 * Partly influenced by https://github.com/PolymerVis/monaco-editor
 *
 * @customElement
 * @polymer
 *
 * @author Lars Gröber <larsgroeber7@gmail.com>
 */
class MonacoElement extends PolymerElement {
  constructor() {
    super();
    this.iframe = null;
  }

  static get template() {
    return html`
      <style>
        :host {
          display: block;
        }
        iframe {
          border: none;
          width: 100%;
          height: 100%;
          padding: 0;
        }
      </style>
      <iframe id="iframe"></iframe>
    `;
  }

  static get properties() {
    return {
      value: {
        type: String,
        value: "",
        observer: "monacoValueChanged"
      },
      eventTypes: {
        type: Object,
        value: {
          ready: "ready",
          valueChanged: "valueChanged",
          languageChanged: "languageChanged",
          themeChanged: "themeChanged"
        }
      },
      language: {
        type: String,
        value: "javascript",
        observer: "monacoLanguageChanged"
      },
      theme: {
        type: String,
        value: "vs-dark",
        observer: "monacoThemeChanged"
      },
      libPath: {
        type: String,
        value: "node_modules/monaco-editor/min/vs"
      }
    };
  }

  get document() {
    if (this.iframe.contentWindow) {
      return this.iframe.contentWindow.document;
    }
  }

  connectedCallback() {
    super.connectedCallback();
    window.addEventListener("message", message => {
      this.handleMessage(message);
    });
    setTimeout(() => {
      if (!this.__init) {
        this.initIFrame();
      }
    }, 500);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    window.removeEventListener("message", message => {
      this.handleMessage(message);
    });
    this.__init = false;
  }

  initIFrame() {
    this.iframe = this.shadowRoot.querySelector("#iframe");
    if (this.document && !this.__init) {
      this.__init = true;
      const div = document.createElement("div");
      div.id = "container";
      this.document.body.appendChild(div);
      var iframeScript = `
var eventTypes = {
  ready: 'ready',
  valueChanged: 'valueChanged',
  languageChanged: 'languageChanged',
  themeChanged: 'themeChanged',
};

class MonacoEditor {
  constructor() {
    this.language = 'javascript';
    this.value = '';
    this.editor = null;
    this.setupEventListener('message', this.handleMessage.bind(this));
    this.setupEditor();
  }

  setupEditor() {
    require.config({ paths: { vs: '${this.libPath}' } });
    require(['vs/editor/editor.main'], () => {
      this.editor = monaco.editor.create(document.getElementById('container'), {
        value: this.value,
        language: this.language,
        scrollBeyondLastLine: false,
        minimap: {
          enabled: false
        }
      });

      const model = this.editor.getModel();
      model.onDidChangeContent(() => {
        const value = model.getValue();
        this.onValueChanged(value);
      });

      this.ready();
    });
  }

  ready() {
    setTimeout(() => {
      this.postMessage(eventTypes.ready, null);
      this.setupEventListener(
        eventTypes.valueChanged,
        this.onValueChanged.bind(this)
      );
    }, 100);
  }

  _handleMessage(data) {
    switch (data.event) {
      case eventTypes.valueChanged:
        this.onInputValueChanged(data.payload);
        break;
      case eventTypes.languageChanged:
        this.onLanguageChanged(data.payload);
        break;
      case eventTypes.themeChanged:
        this.onThemeChanged(data.payload);
        break;
      default:
        break;
    }
  }

  handleMessage(message) {
    try {
      const data = JSON.parse(message.data);
      this._handleMessage(data);
    } catch (error) {
      console.warn(error);
      return;
    }
  }

  postMessage(event, payload) {
    window.parent.postMessage(
      JSON.stringify({ event, payload }),
      window.parent.location.href
    );
  }

  setupEventListener(type, callback) {
    window.addEventListener(type, data => {
      callback(data);
    });
  }

  onInputValueChanged(newValue) {
    if (newValue !== this.value) {
      this.value = newValue;
      this.editor.getModel().setValue(newValue);
      this.postMessage(eventTypes.valueChanged, newValue);
    }
  } 

  onValueChanged(newValue) {
    if (newValue !== this.value) {
      this.value = newValue;
      this.postMessage(eventTypes.valueChanged, newValue);
    }
  }

  onLanguageChanged(newLang) {
    monaco.editor.setModelLanguage(this.editor.getModel(), newLang);
  }

  onThemeChanged(newValue) {
    monaco.editor.setTheme(newValue);
  }
}

new MonacoEditor();
`;
      this.insertScriptElement({
        src: `${this.libPath}/loader.js`,
        onload: () => {
          this.insertScriptElement({ text: iframeScript });
          this.insertStyle();
        }
      });
    }
  }

  handleMessage(message) {
    try {
      let data = message.data;
      if (typeof message.data === "string") {
        data = JSON.parse(message.data);
      }
      this._handleMessage(data);
    } catch (error) {
      console.warn("[monaco-element] Error while parsing message:", error);
      return;
    }
  }

  _handleMessage(data) {
    if (data.event === this.eventTypes.valueChanged) {
      this.dispatchEvent(
        new CustomEvent("value-changed", { detail: data.payload })
      );
    } else if (data.event === this.eventTypes.ready) {
      this.onIFrameReady();
    }
  }

  onIFrameReady() {
    this.monacoValueChanged(this.value);
    this.monacoLanguageChanged(this.language);
    this.monacoThemeChanged(this.theme);
  }

  monacoValueChanged(value) {
    this.postMessage(this.eventTypes.valueChanged, value);
  }

  monacoLanguageChanged(value) {
    this.postMessage(this.eventTypes.languageChanged, value);
  }

  monacoThemeChanged(value) {
    this.postMessage(this.eventTypes.themeChanged, value);
  }

  postMessage(event, payload) {
    if (!this.iframe) {
      return;
    }
    if (this.iframe.contentWindow != null) {
      this.iframe.contentWindow.postMessage(
        JSON.stringify({ event, payload }),
        window.location.href
      );
    }
  }

  insertScriptElement({ src, text, onload }) {
    var ele = this.document.createElement("script");
    if (src) ele.src = src;
    if (text) ele.text = text;
    if (onload) ele.onload = onload;
    this.document.head.appendChild(ele);
  }

  insertStyle() {
    var css = `
    body {
      height: 100vh;
      overflow: hidden;
      margin: 0;
    }    
    #container {
      width: 100%;
      height: 100%;
    }
    .debug-red {
      background : red;
    }
    .debug-green {
      background : green;
    }
    html,body {
      margin : 0px;
    }`;
    const head = this.document.head;
    const style = this.document.createElement("style");
    style.type = "text/css";
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(this.document.createTextNode(css));
    }
    head.appendChild(style);
  }
}

window.customElements.define("monaco-element", MonacoElement);
