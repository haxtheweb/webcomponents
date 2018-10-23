define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrnappStudio = void 0;
  function _templateObject_19ffbf10d6f611e8a34103f4d16c5be5() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_19ffbf10d6f611e8a34103f4d16c5be5 = function() {
      return data;
    };
    return data;
  }
  var LrnappStudio = (function(_PolymerElement) {
    babelHelpers.inherits(LrnappStudio, _PolymerElement);
    function LrnappStudio() {
      babelHelpers.classCallCheck(this, LrnappStudio);
      return babelHelpers.possibleConstructorReturn(
        this,
        (LrnappStudio.__proto__ || Object.getPrototypeOf(LrnappStudio)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      LrnappStudio,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrnappStudio.prototype.__proto__ ||
                  Object.getPrototypeOf(LrnappStudio.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrnappStudio.haxProperties,
              LrnappStudio.tag,
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
              _templateObject_19ffbf10d6f611e8a34103f4d16c5be5()
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
                title: "Lrnapp studio",
                description: "Automated conversion of lrnapp-studio/",
                icon: "icons:android",
                color: "green",
                groups: ["Studio"],
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
            return "lrnapp-studio";
          }
        }
      ]
    );
    return LrnappStudio;
  })(_polymerElement.PolymerElement);
  _exports.LrnappStudio = LrnappStudio;
  window.customElements.define(LrnappStudio.tag, LrnappStudio);
});
