define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrnsysComment = void 0;
  function _templateObject_1df888d0d6fc11e8a6bbd939728f360a() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_1df888d0d6fc11e8a6bbd939728f360a = function() {
      return data;
    };
    return data;
  }
  var LrnsysComment = (function(_PolymerElement) {
    babelHelpers.inherits(LrnsysComment, _PolymerElement);
    function LrnsysComment() {
      babelHelpers.classCallCheck(this, LrnsysComment);
      return babelHelpers.possibleConstructorReturn(
        this,
        (LrnsysComment.__proto__ || Object.getPrototypeOf(LrnsysComment)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      LrnsysComment,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrnsysComment.prototype.__proto__ ||
                  Object.getPrototypeOf(LrnsysComment.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrnsysComment.haxProperties,
              LrnsysComment.tag,
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
              _templateObject_1df888d0d6fc11e8a6bbd939728f360a()
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
                title: "Lrnsys comment",
                description: "Automated conversion of lrnsys-comment/",
                icon: "icons:android",
                color: "green",
                groups: ["Comment"],
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
            return "lrnsys-comment";
          }
        }
      ]
    );
    return LrnsysComment;
  })(_polymerElement.PolymerElement);
  _exports.LrnsysComment = LrnsysComment;
  window.customElements.define(LrnsysComment.tag, LrnsysComment);
});
