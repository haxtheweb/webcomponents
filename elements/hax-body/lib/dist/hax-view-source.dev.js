"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxViewSource = void 0;

var _litElement = require("lit-element/lit-element.js");

var _dlBehavior = require("@lrnwebcomponents/dl-behavior/dl-behavior.js");

var _utils = require("@lrnwebcomponents/utils/utils.js");

var _haxStore = require("./hax-store.js");

require("./hax-toolbar.js");

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
    "\n        :host,\n        :host * {\n          margin: 0;\n          padding: 0;\n        }\n        :host {\n          position: relative;\n        }\n        #textarea {\n          width: 100%;\n          height: calc(var(--simple-modal-height, 75vh) - 88px);\n          overflow: auto;\n          background-color: transparent;\n        }\n        #textarea::part(code) {\n          height: calc(var(--simple-modal-height, 75vh) - 88px);\n        }\n        hax-toolbar {\n          width: 100%;\n          position: sticky;\n          bottom: 0;\n          display: flex;\n          --simple-toolbar-button-padding: 0 var(--hax-tray-margin, 4px);\n        }\n        hax-toolbar::part(buttons){\n          justify-content: space-between;\n          flex: 0 1 auto;\n          margin: 0 auto;\n        }\n      ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();
  _getRequireWildcardCache = function _getRequireWildcardCache() {
    return cache;
  };
  return cache;
}

function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }
  if (
    obj === null ||
    (_typeof(obj) !== "object" && typeof obj !== "function")
  ) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache();
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj["default"] = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n      <div id="spacer"></div>\n      <div id="wrapper">\n        <textarea id="hiddentextarea" hidden></textarea>\n        <code-editor\n          id="textarea"\n          title=""\n          theme="vs"\n          language="html"\n          font-size="12"\n          word-wrap\n        ></code-editor>\n      </div>\n      <hax-toolbar always-expanded>\n        <hax-tray-button\n          label="Update Page"\n          icon="editor:insert-drive-file"\n          @click="',
    '"\n          show-text-label\n          icon-position="top"\n        >\n        </hax-tray-button>\n        <hax-tray-button\n          @click="',
    '"\n          icon="editor:format-clear"\n          label="Clean Formatting"\n          tooltip="Word / Google Document Clean Up"\n          show-text-label\n          icon-position="top"\n        >\n        </hax-tray-button>\n        <hax-tray-button\n          @click="',
    '"\n          icon="icons:content-copy"\n          label="Copy HTML"\n          show-text-label\n          icon-position="top"\n        >\n        </hax-tray-button>\n        <hax-tray-button\n          label="Download HTML"\n          icon="icons:file-download"\n          @click="',
    '"\n          show-text-label\n          icon-position="top"\n        >\n        </hax-tray-button>\n        <hax-tray-button\n          @click="',
    '"\n          label="HAXSchema"\n          icon="hax:code-json"\n          show-text-label\n          icon-position="top"\n        >\n        </hax-tray-button>\n      </hax-toolbar>\n    ',
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

/**
 * `hax-eview-source`
 * @element hax-eview-source
 * `Export dialog with all export options and settings provided.`
 */
var HaxViewSource =
  /*#__PURE__*/
  (function (_MtzFileDownloadBehav) {
    _inherits(HaxViewSource, _MtzFileDownloadBehav);

    _createClass(
      HaxViewSource,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              this.importContent.bind(this),
              this.scrubContent.bind(this),
              this.selectBody.bind(this),
              this.download.bind(this),
              this.htmlToHaxElements.bind(this)
            );
          },
        },
        {
          key: "download",

          /**
           * Download file.
           */
          value: function download(e) {
            var data = this.contentToFile(false);
            this.downloadFromData(data, "html", "my-new-code");

            _haxStore.HAXStore.toast("HTML content downloaded"); //this.close();
          },
          /**
           * Download file.
           */
        },
        {
          key: "downloadfull",
          value: function downloadfull(e) {
            var data = this.contentToFile(true);
            this.downloadFromData(data, "html", "my-new-webpage");

            _haxStore.HAXStore.toast("Working offline copy downloaded"); //this.close();
          },
          /**
           * Import content into body area.
           */
        },
        {
          key: "importContent",
          value: function importContent(e) {
            // import contents of this text area into the activeHaxBody
            var htmlBody = this.shadowRoot.querySelector("#textarea").value;

            _haxStore.HAXStore.toast("Content updated");

            _haxStore.HAXStore.activeHaxBody.importContent(htmlBody); //this.close();
          },
          /**
           * Scrub and then import content as if pasted from Word / GDocs
           */
        },
        {
          key: "scrubContent",
          value: function scrubContent(e) {
            // import contents of this text area into the activeHaxBody
            var htmlBody = this.shadowRoot.querySelector("#textarea").value;

            _haxStore.HAXStore.toast("Scrubbed, Content updated");

            _haxStore.HAXStore.activeHaxBody.importContent(
              (0, _utils.stripMSWord)(htmlBody)
            ); //this.close();
          },
        },
        {
          key: "close",
          value: function close() {
            window.dispatchEvent(
              new CustomEvent("simple-modal-hide", {
                bubbles: true,
                cancelable: true,
                detail: {},
              })
            );
          },
          /**
           * update content of the editor area
           */
        },
        {
          key: "openSource",
          value: function openSource() {
            // import at this time so we can delay as long as possible
            // from needing to pull in monaco
            Promise.resolve().then(function () {
              return _interopRequireWildcard(
                require("@lrnwebcomponents/code-editor/code-editor.js")
              );
            });
          },
          /**
           * selectBody
           */
        },
        {
          key: "selectBody",
          value: function selectBody(e) {
            var hiddenarea = this.shadowRoot.querySelector("#hiddentextarea");
            hiddenarea.value = this.shadowRoot.querySelector("#textarea").value;
            hiddenarea.removeAttribute("hidden");
            hiddenarea.focus();
            hiddenarea.select();
            document.execCommand("copy");
            hiddenarea.setAttribute("hidden", "hidden");

            _haxStore.HAXStore.toast("Copied HTML content"); //this.close();
          },
          /**
           * HTML to HAX Elements
           */
        },
        {
          key: "htmlToHaxElements",
          value: function htmlToHaxElements(e) {
            var elements = _haxStore.HAXStore.htmlToHaxElements(
              this.shadowRoot.querySelector("#textarea").value
            );

            var str = JSON.stringify(elements, null, 2);
            var val = this.shadowRoot.querySelector("#textarea").value;
            var hiddenarea = this.shadowRoot.querySelector("#hiddentextarea");
            hiddenarea.removeAttribute("hidden");
            hiddenarea.value = str;
            hiddenarea.focus();
            hiddenarea.select();
            document.execCommand("copy");
            hiddenarea.value = val;
            hiddenarea.setAttribute("hidden", "hidden");

            _haxStore.HAXStore.toast("Copied hax elements to clipboard");
          },
        },
        {
          key: "firstUpdated",
          value: function firstUpdated(changedProperties) {
            if (
              _get(
                _getPrototypeOf(HaxViewSource.prototype),
                "firstUpdated",
                this
              )
            ) {
              _get(
                _getPrototypeOf(HaxViewSource.prototype),
                "firstUpdated",
                this
              ).call(this, changedProperties);
            }

            if (_haxStore.HAXStore.activeHaxBody) {
              this.shadowRoot.querySelector("#textarea").editorValue = (0,
              _utils.formatHTML)(
                _haxStore.HAXStore.activeHaxBody.haxToContent()
              );
            }
          },
          /**
           * Output entire thing as a file.
           */
        },
        {
          key: "contentToFile",
          value: function contentToFile(full) {
            var body = _haxStore.HAXStore.activeHaxBody.haxToContent();

            var content = body; // if you want full HTML headers or not

            if (full) {
              content = '\n        <!DOCTYPE html>\n        <html lang="en">\n          <head>\n            <meta charset="utf-8" />\n            <meta\n              name="viewport"\n              content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes"\n            />\n            <title>hax-body demo</title>\n            <script>window.WCGlobalCDNPath="https://cdn.webcomponents.psu.edu/cdn/"; </script> <script src="https://cdn.webcomponents.psu.edu/cdn/build.js"></script> \n            <style>\n              body {\n                padding: 32px;\n              }\n            </style>\n          </head>\n          <body>\n          '.concat(
                body,
                "\n          </body>\n        </html>\n      "
              );
            }

            return content;
          },
        },
      ],
      [
        {
          key: "styles",
          get: function get() {
            return [(0, _litElement.css)(_templateObject2())];
          },
        },
        {
          key: "tag",
          get: function get() {
            return "hax-view-source";
          },
        },
      ]
    );

    function HaxViewSource() {
      var _this;

      _classCallCheck(this, HaxViewSource);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxViewSource).call(this)
      );
      _this.fileTypes = {
        CSV: "text/csv",
        JSON: "text/json",
        PDF: "application/pdf",
        TXT: "text/plain",
        HTML: "text/html",
      };
      return _this;
    }

    return HaxViewSource;
  })((0, _dlBehavior.MtzFileDownloadBehaviors)(_litElement.LitElement));

exports.HaxViewSource = HaxViewSource;
window.customElements.define(HaxViewSource.tag, HaxViewSource);
