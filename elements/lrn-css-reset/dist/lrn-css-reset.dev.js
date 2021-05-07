"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.LrnCssReset = exports.LrnCssResetStyles = void 0;

var _litElement = require("lit-element/lit-element.js");

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
  var data = _taggedTemplateLiteral(["<slot></slot>"]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
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

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n    @import "../../modern-css-reset/dist/reset.min.css";\n    @import url("https://fonts.googleapis.com/css?family=Lato:400,700,900|Source+Code+Pro:400,700|Lora:400,400i,700,700i|Playfair+Display:700i,900");\n    \n    html,\n    body {\n      margin: 0;\n      width: 100%;\n      font-family: "Lora";\n      font-size: 18px;\n      letter-spacing: -0.03px;\n      line-height: 1.58;\n    }\n\n    h1,\n    h2,\n    p,\n    i,\n    a,\n    .first-letter,\n    .authorName a {\n      color: rgba(0, 0, 0, 0.84);\n      text-rendering: optimizeLegibility;\n    }\n\n    h1 {\n      font-family: "Playfair Display", serif;\n      font-size: 48px;\n      text-align: left;\n      margin-bottom: 8px;\n      letter-spacing: unset;\n      line-height: unset;\n    }\n\n    h2 {\n      font-family: "Lato", sans-serif;\n      font-size: 30px;\n      font-weight: 900;\n      padding: 0;\n      margin: 56px 0 -13px -1.883px;\n      text-align: left;\n      line-height: 34.5px;\n      letter-spacing: -0.45px;\n    }\n\n    h3 {\n      font-family: "Lato", sans-serif;\n      font-size: 26px;\n      font-weight: 700;\n      color: #555;\n    }\n\n    h4 {\n      font-family: "Lato", sans-serif;\n      font-size: 22px;\n      font-weight: 700;\n      color: #777;\n    }\n\n    h5 {\n      font-family: "Lato", sans-serif;\n      font-size: 20px;\n      font-weight: 700;\n      color: #333;\n    }\n\n    h6 {\n      font-family: "Lato", sans-serif;\n      font-size: 18px;\n      font-weight: 700;\n      color: #777;\n    }\n\n    p,\n    i,\n    a {\n      margin-top: 21px;\n    }\n    a {\n      text-decoration: underline;\n    }\n\n    blockquote {\n      font-family: "Playfair Display", serif;\n      font-size: 30px;\n      font-style: italic;\n      letter-spacing: -0.36px;\n      line-height: 44.4px;\n      overflow-wrap: break-word;\n      margin: 55px 0 33px 0;\n      /* text-align: center; */\n      color: rgba(0, 0, 0, 0.68);\n      padding: 0 0 0 50px;\n    }\n\n    figcaption {\n      font-family: "Lato", sans-serif;\n      font-size: 16px;\n      font-weight: 400;\n      color: #666;\n    }\n\n    label {\n      font-family: "Lato", sans-serif;\n      font-size: 16px;\n      font-weight: 700;\n      color: #333;\n    }\n    input, textarea, select {\n      border-radius:6px;\n      border-style:solid;\n      border-width: 2px;\n      padding:6px;\n      border-color:#333;\n    }\n    select option {\n      border-radius:6px;\n      border-style:solid;\n      border-width: 2px;\n      padding:6px;\n      border-color:#333;\n    }\n\n\n\n    input[type=range] {\n      -webkit-appearance: none;\n      margin: 18px 0;\n    }\n    input[type=range]:focus {\n      outline: none;\n    }\n    input[type=range]::-webkit-slider-runnable-track {\n      width: 100%;\n      height: 8px;\n      cursor: pointer;\n      animate: 0.2s;\n      border-radius: 3px;\n    }\n    input[type=range]::-webkit-slider-thumb {\n      border: 2px solid #333333;\n      height: 36px;\n      width: 16px;\n      border-radius: 3px;\n      background: #ffffff;\n      cursor: pointer;\n      -webkit-appearance: none;\n      margin-top: -14px;\n    }\n    input[type=range]:focus::-webkit-slider-runnable-track {\n      background: #ccc;\n    }\n    input[type=range]::-moz-range-track {\n      width: 100%;\n      height: 8.4px;\n      cursor: pointer;\n      animate: 0.2s;\n      background: #ccc;\n      border: 2px solid #333;\n    }\n    input[type=range]::-moz-range-thumb {\n      border: 1px solid #333;\n      height: 36px;\n      width: 16px;\n      border-radius: 3px;\n      background: #ffffff;\n      cursor: pointer;\n    }\n    input[type=range]::-ms-track {\n      width: 100%;\n      height: 8.4px;\n      cursor: pointer;\n      animate: 0.2s;\n      background: transparent;\n      border-color: transparent;\n      border-width: 16px 0;\n      color: transparent;\n    }\n    input[type=range]::-ms-fill-lower {\n      background: #ccc;\n      border: 2px solid #333;\n    }\n    input[type=range]::-ms-fill-upper {\n      background: #ccc;\n      border-radius: 2px;\n    }\n    input[type=range]::-ms-thumb {\n      border: 1px solid #333;\n      height: 36px;\n      width: 16px;\n      border-radius: 3px;\n      background: #ffffff;\n      cursor: pointer;\n    }\n    input[type=range]:focus::-ms-fill-lower {\n      background: #ccc;\n    }\n    input[type=range]:focus::-ms-fill-upper {\n      background: #ccc;\n        }\n\n\n\n\n    ol ol {\n      list-style-type: lower-alpha;\n      font-size: 16px;\n      color: #444;\n    }\n    ol ol ol {\n      list-style-type: lower-roman;\n      font-size: 14px;\n    }\n\n    code {\n      font-size: 18px;\n      background: rgba(0, 0, 0, 0.05);\n      border-radius: 2px;\n      padding: 3px 5px;\n      font-family: \'Source Code Pro\', monospace;\n    }\n    pre {\n      font-family: \'Source Code Pro\', monospace;\n    }\n    kbd {\n      font-family: \'Source Code Pro\', monospace;\n      font-weight:700;\n    }\n    samp {\n      font-family: \'Source Code Pro\', monospace;\n    }\n\n    .highlighted {\n      background: #7DFFB3;\n    }\n\n    .first-letter {\n      overflow-wrap: break-word;\n      font-family: "Playfair Display", serif;\n      font-size: 60px;\n      line-height: 60px;\n      display: block;\n      position: relative;\n      float: left;\n      margin: 0px 7px 0 -5px;\n    }\n\n    .subtitle {\n      font-family: "Lato", sans-serif;\n      color: rgba(0, 0, 0, 0.54);\n      margin: 0 0 24px 0;\n    }\n\n    /* ##################################################################################\n    ########################################  LAYOUT  ###################################\n    ##################################################################################### */\n\n    .container {\n      display: -ms-grid;\n      display: grid;\n      -ms-grid-columns: auto 166px 740px 166px auto;\n      grid-template-columns: auto 166px 740px 166px auto;\n      -ms-grid-rows: 450px auto 150px;\n      grid-template-rows: 450px auto 150px;\n      grid-template-areas:\n        ". img img img ."\n        ". . article . ."\n        ". . footer . .";\n    }\n\n    .meta {\n      -ms-grid-row: 1;\n      -ms-grid-column: 2;\n      -ms-grid-column-span: 3;\n      grid-area: img;\n      margin: 10px;\n\n      display: -ms-grid;\n\n      display: grid;\n      -ms-grid-rows: auto;\n      grid-template-rows: auto;\n      -ms-grid-columns: 1fr 1fr;\n      grid-template-columns: 1fr 1fr;\n      grid-template-areas: "info image";\n    }\n\n    .image {\n      -ms-grid-row: 1;\n      -ms-grid-column: 2;\n      grid-area: image;\n      background: url("https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ec073341402b36bb155e3bcb77eea9cd&dpr=1&auto=format&fit=crop&w=1000&q=80&cs=tinysrgb");\n      background-size: cover;\n      background-repeat: no-repeat;\n    }\n\n    .info {\n      -ms-grid-row: 1;\n      -ms-grid-column: 1;\n      grid-area: info;\n      padding: 60px 60px 0 0;\n      margin-bottom: 30px;\n    }\n\n    .author {\n      display: -ms-grid;\n      display: grid;\n      -ms-grid-columns: 60px auto;\n      grid-template-columns: 60px auto;\n      -ms-grid-rows: 60px;\n      grid-template-rows: 60px;\n      grid-template-areas: "authorImage authorInfo";\n      margin-bottom: 10px;\n    }\n\n    .authorImage {\n      -ms-grid-row: 1;\n      -ms-grid-column: 1;\n      grid-area: authorImage;\n      border: 2px solid #7DFFB3;\n      border-radius: 50%;\n      background: url("https://s3-us-west-2.amazonaws.com/s.cdpn.io/1307985/profile/profile-512.jpg?1520076483");\n      background-size: cover;\n    }\n\n    .authorInfo {\n      -ms-grid-row: 1;\n      -ms-grid-column: 2;\n      grid-area: authorInfo;\n      padding-left: 10px;\n    }\n\n    .authorName,\n    .authorSub {\n      font-family: "Lato", sans-serif;\n      font-size: 16px;\n      font-weight: 400;\n      margin-top: 6px;\n    }\n\n    .authorName a {\n      font-size: inherit;\n      font-family: inherit;\n      text-decoration: none;\n    }\n\n    .authorName a:hover {\n      text-decoration: underline;\n    }\n\n    .authorSub {\n      color: rgba(0, 0, 0, 0.54);\n    }\n\n    .median-divider {\n      padding: 0 6px;\n    }\n\n    .lineLength {\n      border: 2px dashed rgba(0, 0, 0, 0.54);\n    }\n\n    .article {\n      -ms-grid-row: 2;\n      -ms-grid-column: 3;\n      grid-area: article;\n      margin: 40px 10px;\n    }\n\n    .footer {\n      -ms-grid-row: 3;\n      -ms-grid-column: 3;\n      grid-area: footer;\n      background: #333333;\n    }\n\n    @media screen and (max-width: 1072px) {\n      .container {\n        -ms-grid-columns: auto 740px auto;\n        grid-template-columns: auto 740px auto;\n        grid-template-areas:\n          ". img ."\n          ". article ."\n          ". footer  .";\n      }\n      .meta {\n        -ms-grid-row: 1;\n        -ms-grid-column: 2;\n        -ms-grid-column-span: 1;\n      }\n      .article {\n        -ms-grid-row: 2;\n        -ms-grid-column: 2;\n      }\n      .footer {\n        -ms-grid-row: 3;\n        -ms-grid-column: 2;\n      }\n    }\n\n    @media screen and (max-width: 740px) {\n      .container {\n        -ms-grid-rows: auto auto 150px;\n        grid-template-rows: auto auto 150px;\n        -ms-grid-columns: auto;\n        grid-template-columns: auto;\n        grid-template-areas:\n          "img"\n          "article"\n          "footer";\n      }\n\n      .meta {\n        -ms-grid-rows: 1fr 1fr;\n        grid-template-rows: 1fr 1fr;\n        -ms-grid-columns: 1fr;\n        grid-template-columns: 1fr;\n        grid-template-areas:\n          "info"\n          "image";\n      }\n      .info {\n        padding-top: 0;\n      }\n      .meta {\n        -ms-grid-row: 1;\n        -ms-grid-column: 1;\n        -ms-grid-column-span: 1;\n      }\n\n      .image {\n        -ms-grid-row: 2;\n        -ms-grid-column: 1;\n      }\n\n      .info {\n        -ms-grid-row: 1;\n        -ms-grid-column: 1;\n      }\n      .article {\n        -ms-grid-row: 2;\n        -ms-grid-column: 1;\n      }\n      .footer {\n        -ms-grid-row: 3;\n        -ms-grid-column: 1;\n      }\n    }\n  ',
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

/**
 * CSS reset and additional base styles for lrnwebcomponents and apps
 */
var LrnCssResetStyles = [(0, _litElement.css)(_templateObject())];
/**
 * `lrn-css-reset`
 * `an element that applies CSS reset and additional base styles
 * @microcopy - language worth noting:
 *  -
 *
 * @class LrnCssReset
 * @extends {LitElement}
 * @demo demo/index.html
 * @element lrn-css-reset
 */

exports.LrnCssResetStyles = LrnCssResetStyles;

var LrnCssReset =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(LrnCssReset, _LitElement);

    _createClass(LrnCssReset, null, [
      {
        key: "tag",

        /**
         * Store the tag name to make it easier to obtain directly.
         * @notice function name must be here for tooling to operate correctly
         */
        get: function get() {
          return "lrn-css-reset";
        },
      },
      {
        key: "styles",
        get: function get() {
          return LrnBaseStyles;
        },
        /**
         * HTMLElement
         */
      },
    ]);

    function LrnCssReset() {
      var _this;

      _classCallCheck(this, LrnCssReset);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(LrnCssReset).call(this)
      );

      if (!window.LrnCssResetStyles) {
        window.LrnCssResetStyles = document.createElement("div");

        var s = document.createElement("style"),
          _css = LrnCssResetStyles.map(function (st) {
            return st.cssText;
          }).join("");

        s.setAttribute("data-hax", true);
        s.setAttribute("type", "text/css");

        if (s.styleSheet) {
          // IE
          s.styleSheet.cssText = _css;
        } else {
          // the world
          s.appendChild(document.createTextNode(_css));
        }

        document.getElementsByTagName("head")[0].appendChild(s);
      }

      return _this;
    }

    _createClass(LrnCssReset, [
      {
        key: "render",
        value: function render() {
          return (0, _litElement.html)(_templateObject2());
        },
      },
    ]);

    return LrnCssReset;
  })(_litElement.LitElement);

exports.LrnCssReset = LrnCssReset;
customElements.define(LrnCssReset.tag, LrnCssReset);
