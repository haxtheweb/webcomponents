define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.PaperAvatar = void 0;
  function _templateObject_076e7a20d70111e882dbc3fa3939062f() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_076e7a20d70111e882dbc3fa3939062f = function() {
      return data;
    };
    return data;
  }
  var PaperAvatar = (function(_PolymerElement) {
    babelHelpers.inherits(PaperAvatar, _PolymerElement);
    function PaperAvatar() {
      babelHelpers.classCallCheck(this, PaperAvatar);
      return babelHelpers.possibleConstructorReturn(
        this,
        (PaperAvatar.__proto__ || Object.getPrototypeOf(PaperAvatar)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      PaperAvatar,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                PaperAvatar.prototype.__proto__ ||
                  Object.getPrototypeOf(PaperAvatar.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              PaperAvatar.haxProperties,
              PaperAvatar.tag,
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
              _templateObject_076e7a20d70111e882dbc3fa3939062f()
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
                title: "Paper avatar",
                description: "Automated conversion of paper-avatar/",
                icon: "icons:android",
                color: "green",
                groups: ["Avatar"],
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
            return "paper-avatar";
          }
        }
      ]
    );
    return PaperAvatar;
  })(_polymerElement.PolymerElement);
  _exports.PaperAvatar = PaperAvatar;
  window.customElements.define(PaperAvatar.tag, PaperAvatar);
});
