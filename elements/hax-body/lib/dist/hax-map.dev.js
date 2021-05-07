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

var _I18NMixin2 = require("@lrnwebcomponents/i18n-manager/lib/I18NMixin.js");

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
    '\n            <li>\n              <hax-toolbar-item\n                align-horizontal="left"\n                class="heading-level-',
    '"\n                @click="',
    '"\n                data-index="',
    '"\n                icon="',
    '"\n                label="',
    '"\n                show-text-label\n              >\n              </hax-toolbar-item>\n            </li>\n          ',
  ]);

  _templateObject3 = function _templateObject3() {
    return data;
  };

  return data;
}

function _templateObject2() {
  var data = _taggedTemplateLiteral([
    "\n      <h5>",
    '</h5>\n      <div class="stats">\n        <div class="stat">\n          <span>',
    "</span>\n          <span>",
    '</span>\n        </div>\n        <div class="stat">\n          <span>',
    "</span>\n          <span>",
    '</span>\n        </div>\n        <div class="stat">\n          <span>',
    "</span>\n          <span>",
    '</span>\n        </div>\n        <div class="stat">\n          <span>',
    "</span>\n          <span>",
    "</span>\n        </div>\n      </div>\n      <h5>",
    "</h5>\n      <ul>\n        ",
    "\n      </ul>\n    ",
  ]);

  _templateObject2 = function _templateObject2() {
    return data;
  };

  return data;
}

function _templateObject() {
  var data = _taggedTemplateLiteral([
    '\n        :host {\n          display: block;\n        }\n        .container {\n          text-align: left;\n        }\n        .stats {\n          display: flex;\n          align-items: stretch;\n          flex-wrap: wrap;\n        }\n        .stat {\n          flex: 1 1 auto;\n          text-align: center;\n          border: 1px solid var(--hax-ui-border-color);\n          font-weight: normal;\n          font-size: var(--hax-ui-font-size-xs);\n          line-height: 140%;\n          padding: var(--hax-ui-spacing-sm);\n        }\n        .stat > * {\n          display: block;\n        }\n        .stat *:first-child {\n          font-weight: bold;\n          font-size: 150%;\n        }\n        ul {\n          list-style: none;\n          padding: 0;\n          margin: 0;\n        }\n        ul li {\n          margin: 0;\n          padding: 0;\n        }\n        li > hax-toolbar-item {\n          width: 100%;\n        }\n        li > hax-toolbar-item::part(button),\n        li > hax-toolbar-item[icon="hax:h2"].heading-level-h2::part(button) {\n          width: 100%;\n          margin-left: 0px;\n        }\n        li > hax-toolbar-item.heading-level-h2::part(button),\n        li > hax-toolbar-item[icon="hax:h3"].heading-level-h3::part(button) {\n          width: calc(100% - 26px);\n          margin-left: 26px;\n        }\n        li > hax-toolbar-item.heading-level-h3::part(button),\n        li > hax-toolbar-item[icon="hax:h4"].heading-level-h4::part(button) {\n          width: calc(100% - calc(2 * 26px));\n          margin-left: calc(2 * 26px);\n        }\n        li > hax-toolbar-item.heading-level-h4::part(button),\n        li > hax-toolbar-item[icon="hax:h5"].heading-level-h5::part(button) {\n          width: calc(100% - calc(3 * 26px));\n          margin-left: calc(3 * 26px);\n        }\n        li > hax-toolbar-item.heading-level-h5::part(button),\n        li > hax-toolbar-item[icon="hax:h6"].heading-level-h6::part(button) {\n          width: calc(100% - calc(4 * 26px));\n          margin-left: calc(4 * 26px);\n        }\n        li > hax-toolbar-item.heading-level-h6::part(button) {\n          width: calc(100% - calc(5 * 26px));\n          margin-left: calc(5 * 26px);\n        }\n      ',
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

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf
    ? Object.getPrototypeOf
    : function _getPrototypeOf(o) {
        return o.__proto__ || Object.getPrototypeOf(o);
      };
  return _getPrototypeOf(o);
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

/**
 * `hax-map`
 * @element hax-map
 * `Export dialog with all export options and settings provided.`
 */
var HaxMap =
  /*#__PURE__*/
  (function (_I18NMixin) {
    _inherits(HaxMap, _I18NMixin);

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
      _this.t = {
        contentStatistics: "Content Statistics",
        words: "Words",
        headings: "Headings",
        paragraphs: "Paragraphs",
        widgets: "Widgets",
        characters: "Characters",
        listView: "List view",
      };

      _this.registerLocalization({
        context: _assertThisInitialized(_this),
        namespace: "hax",
      });

      return _this;
    }

    _createClass(
      HaxMap,
      [
        {
          key: "updateHAXMap",
          value: function updateHAXMap(e) {
            var list, elements, i, def;
            return regeneratorRuntime.async(
              function updateHAXMap$(_context) {
                while (1) {
                  switch ((_context.prev = _context.next)) {
                    case 0:
                      _context.t0 = regeneratorRuntime;
                      _context.t1 = _haxStore.HAXStore;
                      _context.next = 4;
                      return regeneratorRuntime.awrap(
                        _haxStore.HAXStore.activeHaxBody.haxToContent()
                      );

                    case 4:
                      _context.t2 = _context.sent;
                      _context.t3 = _context.t1.htmlToHaxElements.call(
                        _context.t1,
                        _context.t2
                      );
                      _context.next = 8;
                      return _context.t0.awrap.call(_context.t0, _context.t3);

                    case 8:
                      list = _context.sent;
                      this.calcStats(list);
                      elements = [];

                      for (i = 0; i < list.length; i++) {
                        def = _haxStore.HAXStore.haxSchemaFromTag(list[i].tag);

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

                    case 13:
                    case "end":
                      return _context.stop();
                  }
                }
              },
              null,
              this
            );
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
              this.t.contentStatistics,
              this.wCount,
              this.t.words,
              this.pCount,
              this.t.paragraphs,
              this.eCount,
              this.t.widgets,
              this.cCount,
              this.t.characters,
              this.t.listView,
              this.indentedElements.map(function (element, index) {
                return (0, _litElement.html)(
                  _templateObject3(),
                  element.parent || "h1",
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
        {
          key: "indentedElements",
          get: function get() {
            var prev = "h1";
            return this.elementList.map(function (element) {
              var el = element;
              el.parent = prev;

              if (el.name == "Heading") {
                var h = el.icon.replace("hax:", "").trim();
                el.parent = h;
                prev = h;
              }

              return el;
            });
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
  })((0, _I18NMixin2.I18NMixin)(_litElement.LitElement));

exports.HaxMap = HaxMap;
window.customElements.define(HaxMap.tag, HaxMap);
