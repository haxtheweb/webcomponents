import "./ace-builds/src-noconflict/ace.js";
import "./ace-builds/src-noconflict/ext-searchbox.js";
class LRNAceEditor extends HTMLElement {
  get value() {
    return (this.editor && this.editor.getValue()) || this.textContent;
  }
  set value(val) {
    if (this.editor) {
      this.editor.setValue(val, 1);
    } else {
      this.textContent = val;
    }
  }
  static get observedAttributes() {
    return [
      "theme",
      "mode",
      "fontsize",
      "softtabs",
      "tabsize",
      "readonly",
      "wrapmode"
    ];
  }
  constructor(self) {
    self = super(self);
    var shadowRoot;
    if (self.attachShadow && self.getRootNode) {
      shadowRoot = self.attachShadow({ mode: "open" });
    } else {
      shadowRoot = self.createShadowRoot();
    }
    shadowRoot.innerHTML = `
            <style>
                :host{
                    display: flex;
                    min-height: 1em;
                    flex-direction: column;
                }
                #juicy-ace-editor-container{
                    flex: 1;
                    height: 100%;
                }
            </style>
            <div id="juicy-ace-editor-container"></div>
        `;
    self.container = shadowRoot.querySelector("#juicy-ace-editor-container");
    return self;
  }
  connectedCallback() {
    var text = this.childNodes[0],
      container = this.container,
      element = this,
      editor;
    if (this.editor) {
      editor = this.editor;
    } else {
      container.textContent = this.value;
      ace.config.set(
        "basePath",
        "../../code-editor/lib/ace-builds/src-min-noconflict"
      );
      editor = ace.edit(container);
      this.dispatchEvent(
        new CustomEvent("editor-ready", {
          bubbles: !0,
          composed: !0,
          detail: editor
        })
      );
      this.editor = editor;
      this.injectTheme("#ace_editor\\.css");
      this.injectTheme("#ace-tm");
      this.injectTheme("#ace_searchbox");
      editor.getSession().on("change", function(event) {
        element.dispatchEvent(
          new CustomEvent("change", {
            bubbles: !0,
            composed: !0,
            detail: event
          })
        );
      });
    }
    editor.renderer.addEventListener(
      "themeLoaded",
      this.onThemeLoaded.bind(this)
    );
    editor.setTheme(this.getAttribute("theme"));
    editor.setFontSize(parseInt(this.getAttribute("fontsize")) || 12);
    editor.setReadOnly(this.hasAttribute("readonly"));
    var session = editor.getSession();
    session.setMode(this.getAttribute("mode"));
    session.setUseSoftTabs(this.getAttribute("softtabs"));
    this.getAttribute("tabsize") &&
      session.setTabSize(this.getAttribute("tabsize"));
    session.setUseWrapMode(this.hasAttribute("wrapmode"));
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if ("characterData" == mutation.type) {
          element.value = text.data;
        }
      });
    });
    text && observer.observe(text, { characterData: !0 });
    this._attached = !0;
  }
  disconnectedCallback() {
    this._attached = !1;
  }
  attributeChangedCallback(attr, oldVal, newVal) {
    if (!this._attached) {
      return !1;
    }
    switch (attr) {
      case "theme":
        this.editor.setTheme(newVal);
        break;
      case "mode":
        this.editor.getSession().setMode(newVal);
        break;
      case "fontsize":
        this.editor.setFontSize(newVal);
        break;
      case "softtabs":
        this.editor.getSession().setUseSoftTabs(newVal);
        break;
      case "tabsize":
        this.editor.getSession().setTabSize(newVal);
        break;
      case "readonly":
        this.editor.setReadOnly("" === newVal || newVal);
        break;
      case "wrapmode":
        this.editor.getSession().setUseWrapMode(null !== newVal);
        break;
    }
  }
  onThemeLoaded(e) {
    var themeId = "#" + e.theme.cssClass;
    this.injectTheme(themeId);
    this.container.style.display = "none";
    this.container.offsetHeight;
    this.container.style.display = "";
  }
  injectTheme(themeId) {
    var n = document.querySelector(themeId);
    this.shadowRoot.appendChild(cloneStyle(n));
  }
}
function cloneStyle(style) {
  var s = document.createElement("style");
  s.id = style.id;
  s.textContent = style.textContent;
  return s;
}
window.customElements.define("juicy-ace-editor", LRNAceEditor);
