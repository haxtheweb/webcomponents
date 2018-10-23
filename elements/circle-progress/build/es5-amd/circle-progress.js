define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.CircleProgress = void 0;
  function _templateObject_8a4a2bb0d6ed11e8bcb155fa6e0a3021() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_8a4a2bb0d6ed11e8bcb155fa6e0a3021 = function() {
      return data;
    };
    return data;
  }
  var CircleProgress = (function(_PolymerElement) {
    babelHelpers.inherits(CircleProgress, _PolymerElement);
    function CircleProgress() {
      babelHelpers.classCallCheck(this, CircleProgress);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          CircleProgress.__proto__ || Object.getPrototypeOf(CircleProgress)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      CircleProgress,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                CircleProgress.prototype.__proto__ ||
                  Object.getPrototypeOf(CircleProgress.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              CircleProgress.haxProperties,
              CircleProgress.tag,
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
              _templateObject_8a4a2bb0d6ed11e8bcb155fa6e0a3021()
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
                title: "Circle progress",
                description: "Automated conversion of circle-progress/",
                icon: "icons:android",
                color: "green",
                groups: ["Progress"],
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
            return "circle-progress";
          }
        }
      ]
    );
    return CircleProgress;
  })(_polymerElement.PolymerElement);
  _exports.CircleProgress = CircleProgress;
  window.customElements.define(CircleProgress.tag, CircleProgress);
});
