define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.PostageStamp = void 0;
  function _templateObject_b4b2f1a0d70311e8a57651f4048a3806() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_b4b2f1a0d70311e8a57651f4048a3806 = function() {
      return data;
    };
    return data;
  }
  var PostageStamp = (function(_PolymerElement) {
    babelHelpers.inherits(PostageStamp, _PolymerElement);
    function PostageStamp() {
      babelHelpers.classCallCheck(this, PostageStamp);
      return babelHelpers.possibleConstructorReturn(
        this,
        (PostageStamp.__proto__ || Object.getPrototypeOf(PostageStamp)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      PostageStamp,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                PostageStamp.prototype.__proto__ ||
                  Object.getPrototypeOf(PostageStamp.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              PostageStamp.haxProperties,
              PostageStamp.tag,
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
              _templateObject_b4b2f1a0d70311e8a57651f4048a3806()
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
                title: "Postage stamp",
                description: "Automated conversion of postage-stamp/",
                icon: "icons:android",
                color: "green",
                groups: ["Stamp"],
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
            return "postage-stamp";
          }
        }
      ]
    );
    return PostageStamp;
  })(_polymerElement.PolymerElement);
  _exports.PostageStamp = PostageStamp;
  window.customElements.define(PostageStamp.tag, PostageStamp);
});
