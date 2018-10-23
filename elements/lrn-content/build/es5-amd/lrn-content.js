define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrnContent = void 0;
  function _templateObject_b3847700d6f311e894afc18ad4565c18() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_b3847700d6f311e894afc18ad4565c18 = function() {
      return data;
    };
    return data;
  }
  var LrnContent = (function(_PolymerElement) {
    babelHelpers.inherits(LrnContent, _PolymerElement);
    function LrnContent() {
      babelHelpers.classCallCheck(this, LrnContent);
      return babelHelpers.possibleConstructorReturn(
        this,
        (LrnContent.__proto__ || Object.getPrototypeOf(LrnContent)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      LrnContent,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrnContent.prototype.__proto__ ||
                  Object.getPrototypeOf(LrnContent.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrnContent.haxProperties,
              LrnContent.tag,
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
              _templateObject_b3847700d6f311e894afc18ad4565c18()
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
                title: "Lrn content",
                description: "Automated conversion of lrn-content/",
                icon: "icons:android",
                color: "green",
                groups: ["Content"],
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
            return "lrn-content";
          }
        }
      ]
    );
    return LrnContent;
  })(_polymerElement.PolymerElement);
  _exports.LrnContent = LrnContent;
  window.customElements.define(LrnContent.tag, LrnContent);
});
