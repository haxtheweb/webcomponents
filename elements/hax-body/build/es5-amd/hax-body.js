define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.HaxBody = void 0;
  function _templateObject_a2918120d6f011e890d11162942b590f() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_a2918120d6f011e890d11162942b590f = function() {
      return data;
    };
    return data;
  }
  var HaxBody = (function(_PolymerElement) {
    babelHelpers.inherits(HaxBody, _PolymerElement);
    function HaxBody() {
      babelHelpers.classCallCheck(this, HaxBody);
      return babelHelpers.possibleConstructorReturn(
        this,
        (HaxBody.__proto__ || Object.getPrototypeOf(HaxBody)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      HaxBody,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                HaxBody.prototype.__proto__ ||
                  Object.getPrototypeOf(HaxBody.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              HaxBody.haxProperties,
              HaxBody.tag,
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
              _templateObject_a2918120d6f011e890d11162942b590f()
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
                title: "Hax body",
                description: "Automated conversion of hax-body/",
                icon: "icons:android",
                color: "green",
                groups: ["Body"],
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
            return "hax-body";
          }
        }
      ]
    );
    return HaxBody;
  })(_polymerElement.PolymerElement);
  _exports.HaxBody = HaxBody;
  window.customElements.define(HaxBody.tag, HaxBody);
});
