define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.Lrndeveloper = void 0;
  function _templateObject_beea4680d6fb11e8b8915b9e2bd70804() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_beea4680d6fb11e8b8915b9e2bd70804 = function() {
      return data;
    };
    return data;
  }
  var Lrndeveloper = (function(_PolymerElement) {
    babelHelpers.inherits(Lrndeveloper, _PolymerElement);
    function Lrndeveloper() {
      babelHelpers.classCallCheck(this, Lrndeveloper);
      return babelHelpers.possibleConstructorReturn(
        this,
        (Lrndeveloper.__proto__ || Object.getPrototypeOf(Lrndeveloper)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      Lrndeveloper,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                Lrndeveloper.prototype.__proto__ ||
                  Object.getPrototypeOf(Lrndeveloper.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              Lrndeveloper.haxProperties,
              Lrndeveloper.tag,
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
              _templateObject_beea4680d6fb11e8b8915b9e2bd70804()
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
                title: "Lrndeveloper",
                description: "Automated conversion of lrndeveloper/",
                icon: "icons:android",
                color: "green",
                groups: [""],
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
            return "lrndeveloper";
          }
        }
      ]
    );
    return Lrndeveloper;
  })(_polymerElement.PolymerElement);
  _exports.Lrndeveloper = Lrndeveloper;
  window.customElements.define(Lrndeveloper.tag, Lrndeveloper);
});
