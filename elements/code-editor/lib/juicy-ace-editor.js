import "ace-builds/src-noconflict/ace.js";
import "ace-builds/src-noconflict/ext-searchbox.js";

// Creates an object based in the HTML Element prototype
class LRNAceEditor extends HTMLElement {
  // getter/setter for value property
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
  // list of observable attributes
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

  // Fires when an instance of the element is created
  constructor(self) {
    // Polyfill ceveat we need to fetch the right context;
    // https://github.com/WebReflection/document-register-element/tree/master#v1-caveat
    self = super(self);
    // Creates the shadow root
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
    // getElementById may not be polyfilled yet
    self.container = shadowRoot.querySelector("#juicy-ace-editor-container");
    return self;
  }
  connectedCallback() {
    var text = this.childNodes[0];
    var container = this.container;
    var element = this;
    var editor;

    if (this.editor) {
      editor = this.editor;
    } else {
      // container.appendChild(text);
      container.textContent = this.value;
      editor = ace.edit(container);
      this.dispatchEvent(
        new CustomEvent("editor-ready", {
          bubbles: true,
          composed: true,
          detail: editor
        })
      );
      this.editor = editor;

      // inject base editor styles
      this.injectTheme("#ace_editor\\.css");
      this.injectTheme("#ace-tm");
      this.injectTheme("#ace_searchbox");

      editor.getSession().on("change", function(event) {
        element.dispatchEvent(
          new CustomEvent("change", {
            bubbles: true,
            composed: true,
            detail: event
          })
        );
      });
    }

    // handle theme changes
    editor.renderer.addEventListener(
      "themeLoaded",
      this.onThemeLoaded.bind(this)
    );

    // initial attributes
    editor.setTheme(this.getAttribute("theme"));
    editor.setFontSize(parseInt(this.getAttribute("fontsize")) || 12);
    editor.setReadOnly(this.hasAttribute("readonly"));
    var session = editor.getSession();
    session.setMode(this.getAttribute("mode"));
    session.setUseSoftTabs(this.getAttribute("softtabs"));
    this.getAttribute("tabsize") &&
      session.setTabSize(this.getAttribute("tabsize"));
    session.setUseWrapMode(this.hasAttribute("wrapmode"));

    // Observe input textNode changes
    // Could be buggy as editor was also added to Light DOM;
    var observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        // console.log("observation", mutation.type, arguments, mutations, editor, text);
        if (mutation.type == "characterData") {
          element.value = text.data;
        }
      });
    });
    text && observer.observe(text, { characterData: true });
    // container.appendChild(text);
    this._attached = true;
  }
  disconnectedCallback() {
    this._attached = false;
  }
  attributeChangedCallback(attr, oldVal, newVal) {
    if (!this._attached) {
      return false;
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
        this.editor.setReadOnly(newVal === "" || newVal);
        break;
      case "wrapmode":
        this.editor.getSession().setUseWrapMode(newVal !== null);
        break;
    }
  }
  onThemeLoaded(e) {
    var themeId = "#" + e.theme.cssClass;
    this.injectTheme(themeId);
    // Workaround Chrome stable bug, force repaint
    this.container.style.display = "none";
    this.container.offsetHeight;
    this.container.style.display = "";
  }
  injectTheme(themeId) {
    var n = document.querySelector(themeId);
    this.shadowRoot.appendChild(cloneStyle(n));
  }
}

//helper function to clone a style
function cloneStyle(style) {
  var s = document.createElement("style");
  s.id = style.id;
  s.textContent = style.textContent;
  return s;
}

window.customElements.define("juicy-ace-editor", LRNAceEditor);
