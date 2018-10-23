define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrndesignImagemap = void 0;
  function _templateObject_7e443480d6f911e8b4d883e634aafd4e() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_7e443480d6f911e8b4d883e634aafd4e = function() {
      return data;
    };
    return data;
  }
  var LrndesignImagemap = (function(_PolymerElement) {
    babelHelpers.inherits(LrndesignImagemap, _PolymerElement);
    function LrndesignImagemap() {
      babelHelpers.classCallCheck(this, LrndesignImagemap);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          LrndesignImagemap.__proto__ ||
          Object.getPrototypeOf(LrndesignImagemap)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      LrndesignImagemap,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrndesignImagemap.prototype.__proto__ ||
                  Object.getPrototypeOf(LrndesignImagemap.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrndesignImagemap.haxProperties,
              LrndesignImagemap.tag,
              this
            );
          }
        }
      ],
      [
        {
          key: "template",
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject_7e443480d6f911e8b4d883e634aafd4e()
            );
          }
        },
        {
          key: "haxProperties",
          get: function get() {
            return {
              canScale: !0,
              canPosition: !0,
              canEditSource: !1,
              gizmo: {
                title: "Lrndesign imagemap",
                description: "Automated conversion of lrndesign-imagemap/",
                icon: "icons:android",
                color: "green",
                groups: ["Imagemap"],
                handles: [{ type: "todo:read-the-docs-for-usage" }],
                meta: {
                  author: "btopro",
                  owner: "The Pennsylvania State University"
                }
              },
              settings: { quick: [], configure: [], advanced: [] }
            };
          }
        },
        {
          key: "properties",
          get: function get() {
            return {};
          }
        },
        {
          key: "tag",
          get: function get() {
            return "lrndesign-imagemap";
          }
        }
      ]
    );
    return LrndesignImagemap;
  })(_polymerElement.PolymerElement);
  _exports.LrndesignImagemap = LrndesignImagemap;
  window.customElements.define(LrndesignImagemap.tag, LrndesignImagemap);
});
