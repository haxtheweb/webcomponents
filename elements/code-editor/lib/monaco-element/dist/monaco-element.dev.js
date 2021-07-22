"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.MonacoElement = void 0;

var _litElement = require("lit");

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    _typeof = function _typeof(obj) {
      return obj &&
        typeof Symbol === "function" &&
        obj.constructor === Symbol &&
        obj !== Symbol.prototype
        ? "symbol"
        : typeof obj;
    };
  }
  return _typeof(obj);
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    ' <iframe id="iframe" frameborder="0"></iframe>',
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n        :host {\n          display: block;\n        }\n        iframe {\n          border: none;\n          width: 100%;\n          height: 100%;\n          padding: 0;\n          margin: 0;\n          resize: vertical;\n        }\n      ",
  ]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) {
  if (!raw) {
    raw = strings.slice(0);
  }
  return Object.freeze(
    Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })
  );
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError(
      "this hasn't been initialised - super() hasn't been called"
    );
  }
  return self;
}

function _get(target, property, receiver) {
  if (typeof Reflect !== "undefined" && Reflect.get) {
    _get = Reflect.get;
  } else {
    _get = function _get(target, property, receiver) {
      var base = _superPropBase(target, property);
      if (!base) return;
      var desc = Object.getOwnPropertyDescriptor(base, property);
      if (desc.get) {
        return desc.get.call(receiver);
      }
      return desc.value;
    };
  }
  return _get(target, property, receiver || target);
}

function _superPropBase(object, property) {
  while (!Object.prototype.hasOwnProperty.call(object, property)) {
    object = _getPrototypeOf(object);
    if (object === null) break;
  }
  return object;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, writable: true, configurable: true },
  });
  if (superClass) _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf =
    Object.setPrototypeOf ||
    function _setPrototypeOf(o, p) {
      o.__proto__ = p;
      return o;
    };
  return _setPrototypeOf(o, p);
}

/**
 * `monaco-element`
 * Webcomponent wrapper for the monaco editor.
 *
 * Sets value, language and theme.
 * Offers a value-changed event.
 *
 * Partly influenced by https://github.com/PolymerVis/monaco-editor
 *
 * @element monaco-element
 */
var MonacoElement =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(MonacoElement, _LitElement);

    _createClass(MonacoElement, null, [
      {
        key: "styles",

        /**
         * LitElement constructable styles enhancement
         */
        get: function get() {
          return [(0, _litElement.css)(_templateObject())];
        },
      },
    ]);

    function MonacoElement() {
      var _this;

      _classCallCheck(this, MonacoElement);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(MonacoElement).call(this)
      );
      _this.iframe = null;
      _this.value = "";
      _this.fontSize = 16;
      _this.wordWrap = false;
      _this.tabSize = 2;
      _this.readOnly = false;
      _this.eventTypes = {
        ready: "ready",
        focus: "focus",
        blur: "blur",
        valueChanged: "valueChanged",
        languageChanged: "languageChanged",
        themeChanged: "themeChanged",
      };
      _this.language = "javascript";
      _this.theme = "vs-dark";
      _this.libPath = "node_modules/monaco-editor/min/vs";
      _this.autofocus = false;
      _this.hideLineNumbers = false;
      _this.editorReference = _this.generateUUID();
      return _this;
    }
    /**
     * LitElement
     */

    _createClass(
      MonacoElement,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(_templateObject2());
          },
          /**
           * LitElement / popular convention
           */
        },
        {
          key: "generateUUID",

          /**
           * Generate a UUID
           */
          value: function generateUUID() {
            return "ss-s-s-s-sss".replace(/s/g, this._uuidPart);
          },
        },
        {
          key: "_uuidPart",
          value: function _uuidPart() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          },
        },
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this2 = this;

            changedProperties.forEach(function (oldValue, propName) {
              if (propName == "value") {
                _this2.monacoValueChanged(_this2[propName]);
              }

              if (propName == "language") {
                _this2.monacoLanguageChanged(_this2[propName]);
              }

              if (propName == "theme") {
                _this2.monacoThemeChanged(_this2[propName]);
              }
            });
          },
        },
        {
          key: "firstUpdated",
          value: function firstUpdated(changedProperties) {
            var _this3 = this;

            _get(
              _getPrototypeOf(MonacoElement.prototype),
              "firstUpdated",
              this
            ).call(this, changedProperties);

            if (!this.__init) {
              setTimeout(function () {
                _this3.initIFrame();
              }, 500);
            }
          },
        },
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            var _this4 = this;

            _get(
              _getPrototypeOf(MonacoElement.prototype),
              "connectedCallback",
              this
            ).call(this);

            window.addEventListener("message", function (message) {
              _this4.handleMessage(message);
            });
          },
        },
        {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            var _this5 = this;

            window.removeEventListener("message", function (message) {
              _this5.handleMessage(message);
            });
            this.__init = false;

            _get(
              _getPrototypeOf(MonacoElement.prototype),
              "disconnectedCallback",
              this
            ).call(this);
          },
        },
        {
          key: "initIFrame",
          value: function initIFrame() {
            var _this6 = this;

            this.iframe = this.shadowRoot.querySelector("#iframe");

            if (this.document && !this.__init) {
              this.__init = true;
              var div = document.createElement("div");
              div.id = "container";
              this.document.body.appendChild(div);
              var iframeScript = "\n  var eventTypes = {\n    ready: 'ready',\n    focus: 'focus',\n    blur: \"blur\",\n    valueChanged: 'valueChanged',\n    languageChanged: 'languageChanged',\n    themeChanged: 'themeChanged',\n  };\n\n  class MonacoEditor {\n    constructor(editorReference) {\n      this._editorReference_ = editorReference;\n      this.language = 'javascript';\n      this.value = '';\n      this.editor = null;\n      this.setupEventListener('message', this.handleMessage.bind(this));\n      this.setupEditor();\n    }\n\n    setupEditor() {\n      require.config({ paths: { vs: '"
                .concat(
                  this.libPath,
                  "' } });\n      require(['vs/editor/editor.main'], () => {\n        this.editor = monaco.editor.create(document.getElementById('container'), {\n          value: this.value,\n          language: '"
                )
                .concat(
                  this.language,
                  "',\n          scrollBeyondLastLine: false,\n          automaticLayout: true,\n          "
                )
                .concat(
                  this.hideLineNumbers ? "lineNumbers: 'false'," : "",
                  "\n          fontSize: "
                )
                .concat(this.fontSize, ",\n          wordWrap: ")
                .concat(this.wordWrap, ",\n          readOnly: ")
                .concat(
                  this.readOnly,
                  ",\n          automaticLayout: true,\n          minimap: {\n            enabled: true\n          },\n          tabSize: "
                )
                .concat(
                  this.tabSize,
                  ",\n          autoIndent: true,\n        });\n        const model = this.editor.getModel();\n        model.onDidChangeContent(() => {\n          const value = model.getValue();\n          this.onValueChanged(value);\n        });\n        this.ready();\n      });\n    }\n\n    ready() {\n      setTimeout(root => {\n        this.postMessage(eventTypes.ready, null);\n        if("
                )
                .concat(
                  this.autofocus,
                  ') this.editor.focus();\n        this.setupEventListener(\n          eventTypes.valueChanged,\n          this.onValueChanged.bind(this)\n        );\n        this.editor.onDidFocusEditorText(e=>{\n          this.postMessage(eventTypes.focus, null);\n        });\n        this.editor.onDidBlurEditorText(e=>{\n          this.postMessage(eventTypes.blur, null);\n        });\n        this.editor.onDidFocusEditorWidget(e=>{\n          this.postMessage(eventTypes.focus, null);\n        });\n        this.editor.onDidBlurEditorWidget(e=>{\n          this.postMessage(eventTypes.blur, null);\n        });\n      }, 100);\n    }\n\n    _handleMessage(data) {\n      switch (data.event) {\n        case eventTypes.valueChanged:\n          this.onInputValueChanged(data.payload);\n          break;\n        case eventTypes.languageChanged:\n          this.onLanguageChanged(data.payload);\n          break;\n        case eventTypes.themeChanged:\n          this.onThemeChanged(data.payload);\n          break;\n        default:\n          break;\n      }\n    }\n\n    handleMessage(message) {\n      try {\n        const data = JSON.parse(message.data);\n        this._handleMessage(data);\n      } catch (error) {\n        console.warn(error);\n        return;\n      }\n    }\n\n    postMessage(event, payload) {\n      var msg = {\n        event: event,\n        payload: payload,\n        editorReference: this._editorReference_\n      }\n      window.parent.postMessage(msg, window.parent.location.href);\n    }\n\n    setupEventListener(type, callback) {\n      window.addEventListener(type, data => {\n        callback(data);\n      });\n    }\n\n    onInputValueChanged(newValue) {\n      if (newValue !== this.value) {\n        this.value = newValue;\n        this.editor.getModel().setValue(newValue);\n        this.postMessage(eventTypes.valueChanged, newValue);\n      }\n    } \n\n    onValueChanged(newValue) {\n      if (newValue !== this.value) {\n        this.value = newValue;\n        this.postMessage(eventTypes.valueChanged, newValue);\n      }\n    }\n\n    onLanguageChanged(newLang) {\n      monaco.editor.setModelLanguage(this.editor.getModel(), newLang);\n    }\n\n    onThemeChanged(newValue) {\n      monaco.editor.setTheme(newValue);\n    }\n  }\n\n  new MonacoEditor("'
                )
                .concat(this.editorReference, '");');
              this.insertScriptElement({
                src: "".concat(this.libPath, "/loader.js"),
                onload: function onload() {
                  _this6.insertScriptElement({
                    text: iframeScript,
                  });

                  _this6.insertStyle();
                },
              });
            }

            if (this.autofocus) this.iframe.focus();
          },
        },
        {
          key: "handleMessage",
          value: function handleMessage(message) {
            try {
              var data = message.data;

              if (typeof message.data === "string") {
                data = JSON.parse(message.data);
              }

              this._handleMessage(data);
            } catch (error) {
              console.warn(
                "[monaco-element] Error while parsing message:",
                error
              );
              return;
            }
          },
        },
        {
          key: "_handleMessage",
          value: function _handleMessage(data) {
            // bail if we don't have a valid editor reference
            if (data.editorReference !== this.editorReference) return;

            if (data.event === this.eventTypes.valueChanged) {
              var evt = new CustomEvent("value-changed", {
                bubbles: true,
                cancelable: true,
                detail: data.payload,
              });
              this.dispatchEvent(evt);
            } else if (data.event === this.eventTypes.ready) {
              this.onIFrameReady();
            } else if (data.event === this.eventTypes.focus) {
              this.onIFrameFocus();
            } else if (data.event === this.eventTypes.blur) {
              this.onIFrameBlur();
            }
          },
        },
        {
          key: "onIFrameFocus",
          value: function onIFrameFocus() {
            this.dispatchEvent(
              new CustomEvent("code-editor-focus", {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: true,
              })
            );
          },
        },
        {
          key: "onIFrameBlur",
          value: function onIFrameBlur() {
            this.dispatchEvent(
              new CustomEvent("code-editor-blur", {
                bubbles: true,
                composed: true,
                cancelable: true,
                detail: true,
              })
            );
          },
        },
        {
          key: "onIFrameReady",
          value: function onIFrameReady() {
            var _this7 = this;

            this.monacoValueChanged(this.value);
            this.monacoLanguageChanged(this.language);
            this.monacoThemeChanged(this.theme); // fire when we're ready

            setTimeout(function () {
              _this7.dispatchEvent(
                new CustomEvent("monaco-element-ready", {
                  bubbles: true,
                  composed: true,
                  cancelable: true,
                  detail: true,
                })
              );
            }, 10);
          },
        },
        {
          key: "monacoValueChanged",
          value: function monacoValueChanged(value) {
            this.postMessage(this.eventTypes.valueChanged, value);
          },
        },
        {
          key: "monacoLanguageChanged",
          value: function monacoLanguageChanged(value) {
            this.postMessage(this.eventTypes.languageChanged, value);
          },
        },
        {
          key: "monacoThemeChanged",
          value: function monacoThemeChanged(value) {
            this.postMessage(this.eventTypes.themeChanged, value);
          },
        },
        {
          key: "postMessage",
          value: function postMessage(event, payload) {
            if (!this.iframe) {
              return;
            }

            if (this.iframe.contentWindow != null) {
              this.iframe.contentWindow.postMessage(
                JSON.stringify({
                  event: event,
                  payload: payload,
                }),
                window.location.href
              );
            }
          },
        },
        {
          key: "insertScriptElement",
          value: function insertScriptElement(_ref) {
            var src = _ref.src,
              text = _ref.text,
              onload = _ref.onload;
            var ele = this.document.createElement("script");
            if (src) ele.src = src;
            if (text) ele.text = text;
            if (onload) ele.onload = onload;
            this.document.head.appendChild(ele);
          },
        },
        {
          key: "insertStyle",
          value: function insertStyle() {
            var css =
              "\n    body {\n      height: 100vh;\n      overflow: hidden;\n      margin: 0;\n    }    \n    #container {\n      width: 100%;\n      height: 100%;\n    }\n    .debug-red {\n      background : red;\n    }\n    .debug-green {\n      background : green;\n    }\n    html,body {\n      margin : 0px;\n    }";
            var head = this.document.head;
            var style = this.document.createElement("style");
            style.type = "text/css";

            if (style.styleSheet) {
              style.styleSheet.cssText = css;
            } else {
              style.appendChild(this.document.createTextNode(css));
            }

            head.appendChild(style);
          },
        },
        {
          key: "document",
          get: function get() {
            if (this.iframe.contentWindow) {
              return this.iframe.contentWindow.document;
            }
          },
        },
      ],
      [
        {
          key: "properties",
          get: function get() {
            return {
              value: {
                type: String,
              },
              fontSize: {
                type: Number,
                attribute: "font-size",
              },
              wordWrap: {
                type: Boolean,
                attribute: "word-wrap",
              },
              readOnly: {
                type: Boolean,
                attribute: "read-only",
              },

              /**
               * THIS MAKES MULTIPLES EDITORS WORK BECAUSE OF EVENTS
               * DO NOT MESS WITH THIS AND IT HAS TO BE SET
               */
              uniqueKey: {
                type: String,
                attribute: "unique-key",
              },
              eventTypes: {
                type: Object,
              },
              language: {
                type: String,
              },
              theme: {
                type: String,
              },
              libPath: {
                type: String,
                attribute: "lib-path",
              },
              editorReference: {
                type: String,
                reflect: true,
                attribute: "editor-reference",
              },

              /**
               * automatically set focus on the iframe
               */
              autofocus: {
                type: Boolean,
                reflect: true,
              },

              /**
               * hide line numbers
               */
              hideLineNumbers: {
                type: Boolean,
                attribute: "hide-line-numbers",
              },
              tabSize: {
                type: Number,
                attribute: "tab-size",
              },
            };
          },
        },
      ]
    );

    return MonacoElement;
  })(_litElement.LitElement);

exports.MonacoElement = MonacoElement;
window.customElements.define("monaco-element", MonacoElement);
window.MonacoData = window.MonacoData || {};
