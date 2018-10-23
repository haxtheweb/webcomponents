define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrndesignSidecomments = void 0;
  function _templateObject_449f51a0d6fa11e8b8773b8c7f5b013d() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_449f51a0d6fa11e8b8773b8c7f5b013d = function() {
      return data;
    };
    return data;
  }
  var LrndesignSidecomments = (function(_PolymerElement) {
    babelHelpers.inherits(LrndesignSidecomments, _PolymerElement);
    function LrndesignSidecomments() {
      babelHelpers.classCallCheck(this, LrndesignSidecomments);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          LrndesignSidecomments.__proto__ ||
          Object.getPrototypeOf(LrndesignSidecomments)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      LrndesignSidecomments,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrndesignSidecomments.prototype.__proto__ ||
                  Object.getPrototypeOf(LrndesignSidecomments.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrndesignSidecomments.haxProperties,
              LrndesignSidecomments.tag,
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
              _templateObject_449f51a0d6fa11e8b8773b8c7f5b013d()
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
                title: "Lrndesign sidecomments",
                description: "Automated conversion of lrndesign-sidecomments/",
                icon: "icons:android",
                color: "green",
                groups: ["Sidecomments"],
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
            return "lrndesign-sidecomments";
          }
        }
      ]
    );
    return LrndesignSidecomments;
  })(_polymerElement.PolymerElement);
  _exports.LrndesignSidecomments = LrndesignSidecomments;
  window.customElements.define(
    LrndesignSidecomments.tag,
    LrndesignSidecomments
  );
});
