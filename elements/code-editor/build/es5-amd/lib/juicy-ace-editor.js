define([
  "meta",
  "./ace-builds/src-noconflict/ace.js",
  "./ace-builds/src-noconflict/ext-searchbox.js",
  "../node_modules/@polymer/polymer/lib/utils/resolve-url.js"
], function(meta, _ace, _extSearchbox, _resolveUrl) {
  "use strict";
  meta = babelHelpers.interopRequireWildcard(meta);
  var LRNAceEditor = (function(_HTMLElement) {
    babelHelpers.inherits(LRNAceEditor, _HTMLElement);
    babelHelpers.createClass(
      LRNAceEditor,
      [
        {
          key: "value",
          get: function get() {
            return (this.editor && this.editor.getValue()) || this.textContent;
          },
          set: function set(val) {
            if (this.editor) {
              this.editor.setValue(val, 1);
            } else {
              this.textContent = val;
            }
          }
        }
      ],
      [
        {
          key: "observedAttributes",
          get: function get() {
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
        }
      ]
    );
    function LRNAceEditor(self) {
      var _this;
      babelHelpers.classCallCheck(this, LRNAceEditor);
      self = _this = babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers.getPrototypeOf(LRNAceEditor).call(this, self)
      );
      var shadowRoot;
      if (self.attachShadow && self.getRootNode) {
        shadowRoot = self.attachShadow({ mode: "open" });
      } else {
        shadowRoot = self.createShadowRoot();
      }
      shadowRoot.innerHTML =
        '\n            <style>\n                :host{\n                    display: flex;\n                    min-height: 16px;\n                    flex-direction: column;\n                }\n                #juicy-ace-editor-container{\n                    flex: 1;\n                    height: 100%;\n                }\n            </style>\n            <div id="juicy-ace-editor-container"></div>\n        ';
      self.container = shadowRoot.querySelector("#juicy-ace-editor-container");
      return babelHelpers.possibleConstructorReturn(_this, self);
    }
    babelHelpers.createClass(LRNAceEditor, [
      {
        key: "connectedCallback",
        value: function connectedCallback() {
          var text = this.childNodes[0],
            container = this.container,
            element = this,
            editor;
          if (this.editor) {
            editor = this.editor;
          } else {
            container.textContent = this.value;
            var basePath = (0, _resolveUrl.pathFromUrl)(meta.url);
            ace.config.set(
              "basePath",
              "".concat(basePath, "ace-builds/src-min-noconflict")
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
      },
      {
        key: "disconnectedCallback",
        value: function disconnectedCallback() {
          this._attached = !1;
        }
      },
      {
        key: "attributeChangedCallback",
        value: function attributeChangedCallback(attr, oldVal, newVal) {
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
      },
      {
        key: "onThemeLoaded",
        value: function onThemeLoaded(e) {
          var themeId = "#" + e.theme.cssClass;
          this.injectTheme(themeId);
          this.container.style.display = "none";
          this.container.offsetHeight;
          this.container.style.display = "";
        }
      },
      {
        key: "injectTheme",
        value: function injectTheme(themeId) {
          var n = document.querySelector(themeId);
          this.shadowRoot.appendChild(cloneStyle(n));
        }
      }
    ]);
    return LRNAceEditor;
  })(babelHelpers.wrapNativeSuper(HTMLElement));
  function cloneStyle(style) {
    var s = document.createElement("style");
    s.id = style.id;
    s.textContent = style.textContent;
    return s;
  }
  window.customElements.define("juicy-ace-editor", LRNAceEditor);
});
