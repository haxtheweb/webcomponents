"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.HaxMap = void 0;

var _litElement = require("lit-element/lit-element.js");

require("@lrnwebcomponents/simple-icon/lib/simple-icon-lite.js");

require("@lrnwebcomponents/hax-body/lib/hax-toolbar-item.js");

require("@lrnwebcomponents/hax-iconset/lib/simple-hax-iconset.js");

var _haxStore = require("@lrnwebcomponents/hax-body/lib/hax-store.js");

var _utils = require("@lrnwebcomponents/utils/utils.js");

var _haxUiStyles = require("@lrnwebcomponents/hax-body/lib/hax-ui-styles.js");

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

function _templateObject3() {
  var data = _taggedTemplateLiteral([
    '\n              <li>\n                <hax-toolbar-item\n                  align-horizontal="left"\n                  @click="',
    '"\n                  data-index="',
    '"\n                  icon="',
    '"\n                  label="',
    '"\n                  show-text-label\n                >\n                </hax-toolbar-item>\n              </li>\n            ',
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    '\n      <div class="container">\n        <table>\n          <caption>\n            Content Statistics\n          </caption>\n          <thead>\n            <tr>\n              <th scope="col">Words</th>\n              <th scope="col">Headings</th>\n              <th scope="col">Paragraphs</th>\n              <th scope="col">Widgets</th>\n              <th scope="col">Characters</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td>',
    "</td>\n              <td>",
    "</td>\n              <td>",
    "</td>\n              <td>",
    "</td>\n              <td>",
    "</td>\n            </tr>\n          </tbody>\n        </table>\n        <h5>List View</h5>\n        <ul>\n          ",
    "\n        </ul>\n      </div>\n    ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    "\n        :host {\n          display: block;\n        }\n        .container {\n          text-align: left;\n        }\n        table {\n          font-size: var(--hax-tray-font-size-sm);\n          border-collapse: collapse;\n          width: calc(100% - 2px);\n          max-width: calc(100% - 2px);\n        }\n        table,\n        th,\n        td {\n          text-align: center;\n          border: 1px solid var(--hax-tray-border-color);\n        }\n        th {\n          font-weight: normal;\n          font-size: var(--hax-tray-font-size-xs);\n        }\n        td {\n          font-weight: bold;\n          font-size: 150%;\n        }\n        ul {\n          list-style: none;\n          padding: 0;\n          margin: 0;\n        }\n        ul li {\n          margin: 0;\n          padding: 0;\n        }\n        li > hax-toolbar-item {\n          width: 100%;\n        }\n        li > hax-toolbar-item::part(button) {\n          width: 100%;\n          border: none;\n        }\n      ",
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

function _toConsumableArray(arr) {
  return (
    _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
  );
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _iterableToArray(iter) {
  if (
    Symbol.iterator in Object(iter) ||
    Object.prototype.toString.call(iter) === "[object Arguments]"
  )
    return Array.from(iter);
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
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
 * `hax-map`
 * @element hax-map
 * `Export dialog with all export options and settings provided.`
 */
var HaxMap =
  /*#__PURE__*/
  (function (_LitElement) {
    _inherits(HaxMap, _LitElement);

    _createClass(HaxMap, null, [
      {
        key: "styles",

        /**
         * LitElement constructable styles enhancement
         */
        get: function get() {
          return [].concat(
            _toConsumableArray(_haxUiStyles.HaxTrayDetailHeadings),
            [(0, _litElement.css)(_templateObject())]
          );
        },
      },
    ]);

    function HaxMap() {
      var _this;

      _classCallCheck(this, HaxMap);

      _this = _possibleConstructorReturn(
        this,
        _getPrototypeOf(HaxMap).call(this)
      );
      _this.elementList = [];
      _this.title = "Content map";
      return _this;
    }

    _createClass(
      HaxMap,
      [
        {
          key: "updateHAXMap",
          value: function updateHAXMap() {
            var list = _haxStore.HAXStore.htmlToHaxElements(
              _haxStore.HAXStore.activeHaxBody.haxToContent()
            );

            this.calcStats(list);
            var elements = [];

            for (var i = 0; i < list.length; i++) {
              var def = _haxStore.HAXStore.haxSchemaFromTag(list[i].tag);

              if (def.gizmo) {
                elements.push({
                  icon: def.gizmo.icon,
                  name: def.gizmo.title,
                });
              } else {
                if (list[i].tag && list[i].tag.includes("-")) {
                  elements.push({
                    icon: "hax:templates",
                    name: "Widget",
                  });
                } else {
                  elements.push({
                    icon: "hax:paragraph",
                    name: "HTML block",
                  });
                }
              }
            }

            this.elementList = [].concat(elements);
          },
          /**
           * Calculate statistics from the array of hax elements
           */
        },
        {
          key: "calcStats",
          value: function calcStats(elements) {
            if (elements && _haxStore.HAXStore.activeHaxBody.innerText) {
              var counts = {
                c: _haxStore.HAXStore.activeHaxBody.innerText.length,
                w: parseInt(
                  _haxStore.HAXStore.activeHaxBody.innerText.split(/\s+/g)
                    .length - 1
                ),
                h: 0,
                p: 0,
                e: 0,
              };
              elements.forEach(function (el) {
                switch (el.tag) {
                  case "blockquote":
                  case "div":
                  case "span":
                  case "p":
                    counts.p++;
                    break;

                  case "h1":
                  case "h2":
                  case "h3":
                  case "h4":
                  case "h5":
                  case "h6":
                  case "relative-heading":
                    // special support for our own heading tag
                    counts.h++;
                    break;

                  default:
                    counts.e++;
                    break;
                }
              });

              for (var i in counts) {
                this["".concat(i, "Count")] = counts[i];
              }
            }
          },
        },
        {
          key: "render",
          value: function render() {
            var _this2 = this;

            return (0, _litElement.html)(
              _templateObject2(),
              this.wCount,
              this.hCount,
              this.pCount,
              this.eCount,
              this.cCount,
              this.elementList.map(function (element, index) {
                return (0, _litElement.html)(
                  _templateObject3(),
                  function (e) {
                    return _this2.goToItem(index);
                  },
                  index,
                  element.icon,
                  element.name
                );
              })
            );
          },
        },
        {
          key: "goToItem",
          value: function goToItem(index) {
            if (index) {
              var activeChild =
                _haxStore.HAXStore.activeHaxBody.children[parseInt(index)];

              activeChild.classList.add("blinkfocus");

              if (typeof activeChild.scrollIntoViewIfNeeded === "function") {
                activeChild.scrollIntoViewIfNeeded(true);
              } else {
                activeChild.scrollIntoView({
                  behavior: "smooth",
                  inline: "center",
                });
              }

              setTimeout(function () {
                activeChild.classList.remove("blinkfocus");
              }, 500);
            }
          },
        },
        {
          key: "scrollInMap",
          value: function scrollInMap() {
            var target = (0, _utils.normalizeEventPath)(e)[0];
            this.goToItem(target.getAttribute("data-index"));
          },
        },
      ],
      [
        {
          key: "tag",
          get: function get() {
            return "hax-map";
          },
        },
        {
          key: "properties",
          get: function get() {
            return {
              /**
               * Title when open.
               */
              title: {
                type: String,
              },
              opened: {
                type: Boolean,
              },
              elementList: {
                type: Array,
              },
              cCount: {
                type: String,
              },
              wCount: {
                type: String,
              },
              hCount: {
                type: String,
              },
              pCount: {
                type: String,
              },
              eCount: {
                type: String,
              },
            };
          },
        },
      ]
    );

    return HaxMap;
  })(_litElement.LitElement);

exports.HaxMap = HaxMap;
window.customElements.define(HaxMap.tag, HaxMap);
