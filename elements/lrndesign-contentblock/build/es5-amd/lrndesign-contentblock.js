define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrndesignContentblock = void 0;
  function _templateObject_f43636e0d6f711e8888777caf245b570() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_f43636e0d6f711e8888777caf245b570 = function() {
      return data;
    };
    return data;
  }
  var LrndesignContentblock = (function(_PolymerElement) {
    babelHelpers.inherits(LrndesignContentblock, _PolymerElement);
    function LrndesignContentblock() {
      babelHelpers.classCallCheck(this, LrndesignContentblock);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          LrndesignContentblock.__proto__ ||
          Object.getPrototypeOf(LrndesignContentblock)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      LrndesignContentblock,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrndesignContentblock.prototype.__proto__ ||
                  Object.getPrototypeOf(LrndesignContentblock.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrndesignContentblock.haxProperties,
              LrndesignContentblock.tag,
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
              _templateObject_f43636e0d6f711e8888777caf245b570()
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
                title: "Lrndesign contentblock",
                description: "Automated conversion of lrndesign-contentblock/",
                icon: "icons:android",
                color: "green",
                groups: ["Contentblock"],
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
            return "lrndesign-contentblock";
          }
        }
      ]
    );
    return LrndesignContentblock;
  })(_polymerElement.PolymerElement);
  _exports.LrndesignContentblock = LrndesignContentblock;
  window.customElements.define(
    LrndesignContentblock.tag,
    LrndesignContentblock
  );
});
