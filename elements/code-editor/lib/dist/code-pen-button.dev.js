"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.CodePenButton = void 0;

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
    "\n        :host {\n          display: block;\n        }\n      ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n      <form action="',
    '" method="POST" target="_blank">\n        <input type="hidden" name="data" value="',
    '" />\n        <input\n          type="image"\n          src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/t-1/cp-arrow-right.svg"\n          width="40"\n          height="40"\n          value="Open code pen in a new window"\n          class="codepen-mover-button"\n          part="button"\n        />\n      </form>\n    ',
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
 * `code-pen-button`
 * `Post data to codepen to form a new pen`
 * @demo demo/index.html
 * @element code-pen-button
 */
var CodePenButton =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(CodePenButton, _LitElement);

    _createClass(
      CodePenButton,
      [
        {
          key: "render",
          value: function render() {
            return (0, _litElement.html)(
              _templateObject(),
              this.endPoint,
              this.dataString
            );
          },
        },
        {
          key: "firstUpdated",
          value: function firstUpdated() {
            this.setAttribute("title", this.checkItOut);
          },
        },
      ],
      [
        {
          key: "styles",

          /**
           * LitElement constructable styles enhancement
           */
          get: function get() {
            return [(0, _litElement.css)(_templateObject2())];
          },
        },
        {
          key: "tag",
          get: function get() {
            return "code-pen-button";
          },
        },
      ]
    );

    function CodePenButton() {
      var _this;

      _classCallCheck(this, CodePenButton);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(CodePenButton).call(this)
      );
      _this.checkItOut = "Check it out on codepen";
      _this.endPoint = "https://codepen.io/pen/define";
      _this.data = {};
      return _this;
    }

    _createClass(
      CodePenButton,
      [
        {
          key: "updated",
          value: function updated(changedProperties) {
            var _this2 = this;

            changedProperties.forEach(function (oldValue, propName) {
              if (propName == "data" && _this2[propName]) {
                _this2.dataString = _this2._getDataString(_this2[propName]);
              }
            });
          },
        },
        {
          key: "_getDataString",

          /**
           * Return string from data object so it can be posted correctly.
           */
          value: function _getDataString(data) {
            return JSON.stringify(data)
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&apos;");
          },
        },
      ],
      [
        {
          key: "properties",
          get: function get() {
            return {
              checkItOut: {
                type: String,
                attribute: "check-it-out",
              },

              /**
               * End point for posting should it change in the future.
               */
              endPoint: {
                type: String,
                attribute: "end-point",
              },

              /**
               * Data object as a JSON string for the POST data in page.
               */
              dataString: {
                type: String,
                attribute: "data-string",
              },

              /**
               * Data object to post to code pen
               */
              data: {
                type: Object,
              },
            };
          },
        },
      ]
    );

    return CodePenButton;
  })(_litElement.LitElement);

exports.CodePenButton = CodePenButton;
window.customElements.define(CodePenButton.tag, CodePenButton);
