define([
  "exports",
  "meta",
  "./node_modules/@polymer/polymer/polymer-legacy.js",
  "./node_modules/@polymer/polymer/lib/utils/resolve-url.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js",
  "./node_modules/@lrnwebcomponents/es-global-bridge/es-global-bridge.js"
], function(_exports, meta, _polymerLegacy, _resolveUrl) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.QRCodeElement = void 0;
  meta = babelHelpers.interopRequireWildcard(meta);
  function _templateObject_53b662f0ecf311e881f0712b243aa944() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n      #link {\n        visibility: hidden;\n        opacity: 0;\n      }\n    </style>\n    <qr-code id="qr" data$="[[data]]" modulesize$="[[modulesize]]" margin$="[[margin]]" format$="[[format]]"></qr-code>\n    <a href$="[[data]]" id="link">[[title]]</a>\n'
    ]);
    _templateObject_53b662f0ecf311e881f0712b243aa944 = function() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_53b662f0ecf311e881f0712b243aa944()
    ),
    is: "q-r",
    behaviors: [HAXBehaviors.PropertiesBehaviors],
    properties: {
      data: { type: String },
      title: { type: String },
      modulesize: { type: Number, value: 4 },
      margin: { type: Number, value: 2 },
      format: { type: String, value: "png" }
    },
    attached: function attached() {
      this.setHaxProperties({
        canScale: !0,
        canPosition: !0,
        canEditSource: !1,
        gizmo: {
          title: "QR Code",
          description: "A code to scan from a smartphone.",
          icon: "hardware:developer-board",
          color: "grey",
          groups: ["QR"],
          handles: [
            { type: "video", source: "data", title: "title" },
            { type: "image", source: "data", title: "title" },
            { type: "link", source: "data", title: "title" }
          ],
          meta: { author: "LRNWebComponents" }
        },
        settings: {
          quick: [
            {
              property: "data",
              title: "QR data",
              description: "Source of the data for the QR code.",
              inputMethod: "textfield",
              icon: "hardware:developer-board"
            },
            {
              property: "title",
              title: "Alternate title",
              description:
                "An alternate title to go to the source of the QR code.",
              inputMethod: "textfield",
              icon: "editor:title"
            },
            {
              property: "modulesize",
              title: "Size",
              description: "Size of the QR code",
              inputMethod: "textfield",
              icon: "image:photo-size-select-small"
            },
            {
              property: "margin",
              title: "Margin",
              description: "Wrapper to the code.",
              inputMethod: "textfield",
              icon: "icons:settings-overscan"
            },
            {
              property: "format",
              title: "Output format",
              description: "Format to put it out.",
              inputMethod: "select",
              options: { png: "PNG", html: "HTML", svg: "SVG" },
              icon: "editor:bubble-chart"
            }
          ],
          configure: [
            {
              property: "data",
              title: "QR data",
              description: "Source of the data for the QR code.",
              inputMethod: "textfield",
              icon: "hardware:developer-board"
            },
            {
              property: "title",
              title: "Alternate title",
              description:
                "An alternate title to go to the source of the QR code.",
              inputMethod: "textfield",
              icon: "editor:title"
            },
            {
              property: "modulesize",
              title: "Size",
              description: "Size of the QR code",
              inputMethod: "number",
              icon: "image:photo-size-select-small"
            },
            {
              property: "margin",
              title: "Margin",
              description: "Wrapper to the code.",
              inputMethod: "number",
              icon: "icons:settings-overscan"
            },
            {
              property: "format",
              title: "Output format",
              description: "Format to put it out.",
              inputMethod: "select",
              options: { png: "PNG", html: "HTML", svg: "SVG" },
              icon: "editor:bubble-chart"
            }
          ],
          advanced: []
        }
      });
    }
  });
  var QRCodeElement = (function(_HTMLElement) {
    babelHelpers.inherits(QRCodeElement, _HTMLElement);
    function QRCodeElement() {
      var _this;
      babelHelpers.classCallCheck(this, QRCodeElement);
      _this = babelHelpers.possibleConstructorReturn(
        this,
        (QRCodeElement.__proto__ || Object.getPrototypeOf(QRCodeElement)).call(
          this
        )
      );
      _this._defineProperty = _this._defineProperty.bind(
        babelHelpers.assertThisInitialized(_this)
      );
      _this.attachShadow({ mode: "open" });
      Object.keys(QRCodeElement.defaultAttributes).map(_this._defineProperty);
      var name = "qr",
        basePath = (0, _resolveUrl.pathFromUrl)(meta.url),
        location = "".concat(basePath, "lib/qr.js");
      window.addEventListener(
        "es-bridge-".concat(name, "-loaded"),
        _this._qrLoaded.bind(babelHelpers.assertThisInitialized(_this))
      );
      window.ESGlobalBridge.requestAvailability();
      window.ESGlobalBridge.instance.load(name, location);
      return _this;
    }
    babelHelpers.createClass(
      QRCodeElement,
      [
        {
          key: "_qrLoaded",
          value: function _qrLoaded() {
            this.generate();
          }
        },
        {
          key: "attributeChangedCallback",
          value: function attributeChangedCallback(
            attributeName,
            oldValue,
            newValue
          ) {
            var fn = this[attributeName + "Changed"];
            if (fn && "function" === typeof fn) {
              fn.call(this, oldValue, newValue);
            }
            if (window.ESGlobalBridge.imports.qr) {
              this.generate();
            }
          }
        },
        {
          key: "_defineProperty",
          value: function _defineProperty(attributeName) {
            var _this2 = this;
            Object.defineProperty(this, attributeName, {
              get: function get() {
                var value = _this2.getAttribute(attributeName);
                return null === value
                  ? QRCodeElement.defaultAttributes[attributeName]
                  : value;
              },
              set: function set(value) {
                _this2.setAttribute(attributeName, value);
              }
            });
          }
        },
        {
          key: "getOptions",
          value: function getOptions() {
            var modulesize = this.modulesize,
              margin = this.margin;
            return {
              modulesize:
                null !== modulesize ? parseInt(modulesize) : modulesize,
              margin: null !== margin ? parseInt(margin) : margin
            };
          }
        },
        {
          key: "generate",
          value: function generate() {
            if (null !== this.data) {
              if ("png" === this.format) {
                this.generatePNG();
              } else if ("html" === this.format) {
                this.generateHTML();
              } else if ("svg" === this.format) {
                this.generateSVG();
              } else {
                this.shadowRoot.innerHTML =
                  "<div>qr-code: " + this.format + " not supported!</div>";
              }
            } else {
              this.shadowRoot.innerHTML = "<div>qr-code: no data!</div>";
            }
          }
        },
        {
          key: "generatePNG",
          value: function generatePNG() {
            try {
              var img = document.createElement("img");
              img.src = window.QRCode.generatePNG(this.data, this.getOptions());
              this.clear();
              this.shadowRoot.appendChild(img);
            } catch (e) {
              this.shadowRoot.innerHTML =
                "<div>qr-code: no canvas support!</div>";
            }
          }
        },
        {
          key: "generateHTML",
          value: function generateHTML() {
            var div = window.QRCode.generateHTML(this.data, this.getOptions());
            this.clear();
            this.shadowRoot.appendChild(div);
          }
        },
        {
          key: "generateSVG",
          value: function generateSVG() {
            var div = window.QRCode.generateSVG(this.data, this.getOptions());
            this.clear();
            this.shadowRoot.appendChild(div);
          }
        },
        {
          key: "clear",
          value: function clear() {
            while (this.shadowRoot.lastChild) {
              this.shadowRoot.removeChild(this.shadowRoot.lastChild);
            }
          }
        }
      ],
      [
        {
          key: "defaultAttributes",
          get: function get() {
            return { data: null, format: "png", modulesize: 5, margin: 4 };
          }
        },
        {
          key: "observedAttributes",
          get: function get() {
            return Object.keys(QRCodeElement.defaultAttributes);
          }
        }
      ]
    );
    return QRCodeElement;
  })(HTMLElement);
  _exports.QRCodeElement = QRCodeElement;
  window.customElements.define("qr-code", QRCodeElement);
});
