"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxExportDialog = void 0;

var _litElement = require("lit-element/lit-element.js");

require("@lrnwebcomponents/simple-modal/lib/simple-modal-template.js");

require("./hax-view-source.js");

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
    "\n        :host {\n          display: none;\n        }\n        simple-modal-template {\n          display: none;\n          --simple-modal-resize: horizontal;\n          --simple-modal-z-index: 100000001;\n          --simple-modal-width: 95vw;\n          --simple-modal-height: 75vh;\n          --simple-modal-min-width: 200px;\n          --simple-modal-min-height: auto;\n          --simple-modal-titlebar-color: var(--hax-tray-text-color, black);\n          --simple-modal-titlebar-background: var(\n            --hax-titlebar-background-color,\n            #f0f4f8\n          );\n          --simple-modal-titlebar-padding: var(--hax-tray-spacing-sm);\n          --simple-modal-titlebar-height: calc(\n            20px + 2 * var(--hax-tray-spacing-sm)\n          );\n          --simple-modal-content-container-color: var(\n            --hax-tray-text-color,\n            black\n          );\n          --simple-modal-content-container-background: var(\n            --hax-tray-background-color,\n            #fff\n          );\n          --simple-modal-content-padding: calc(2 * var(--hax-tray-spacing-sm))\n            0px 0px;\n          --simple-modal-buttons-background: var(\n            --hax-tray-background-color,\n            #fff\n          );\n        }\n      ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n      <simple-modal-template\n        modal-id="hax-export"\n        id="dialog"\n        .title="',
    '"\n      >\n        <hax-view-source slot="content"></hax-view-source>\n      </simple-modal-template>\n    ',
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
 * `hax-export-dialog`
 * @element hax-export-dialog
 * `Export dialog with all export options and settings provided.`
 */
var HaxExportDialog =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(HaxExportDialog, _LitElement);

    _createClass(
      HaxExportDialog,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            _get(
              _getPrototypeOf(HaxExportDialog.prototype),
              "connectedCallback",
              this
            ).call(this);

            window.addEventListener(
              "simple-modal-show",
              this.modalToggle.bind(this)
            );
          },
        },
        {
          key: "disconnectedCallback",
          value: function disconnectedCallback() {
            window.removeEventListener(
              "simple-modal-show",
              this.modalToggle.bind(this)
            );

            _get(
              _getPrototypeOf(HaxExportDialog.prototype),
              "disconnectedCallback",
              this
            ).call(this);
          },
          /**
           * a bit hacky but gets around the cloning element and events issue
           */
        },
        {
          key: "modalToggle",
          value: function modalToggle(e) {
            if (e.detail.id == "hax-export") {
              e.detail.elements.content.children[0].openSource();
            }
          },
        },
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(_templateObject(), this.title);
          },
        },
        {
          key: "firstUpdated",

          /**
           * Attached to the DOM, now fire that we exist.
           */
          value: function firstUpdated() {
            // fire an event that this is a core piece of the system
            this.dispatchEvent(
              new CustomEvent("hax-register-core-piece", {
                bubbles: true,
                cancelable: true,
                composed: true,
                detail: {
                  piece: "haxExport",
                  object: this,
                },
              })
            );
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
            return "hax-export-dialog";
          },
        },
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * Title
               */
              title: {
                type: String,
              },
            };
          },
        },
      ]
    );

    function HaxExportDialog() {
      var _this;

      _classCallCheck(this, HaxExportDialog);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxExportDialog).call(this)
      );
      _this.title = "View Page Source";
      return _this;
    }

    return HaxExportDialog;
  })(_litElement.LitElement);

exports.HaxExportDialog = HaxExportDialog;
window.customElements.define(HaxExportDialog.tag, HaxExportDialog);
