define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.PaperInput = void 0;
  function _templateObject_d841f320d70111e8a28145153ccfa840() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_d841f320d70111e8a28145153ccfa840 = function() {
      return data;
    };
    return data;
  }
  var PaperInput = (function(_PolymerElement) {
    babelHelpers.inherits(PaperInput, _PolymerElement);
    function PaperInput() {
      babelHelpers.classCallCheck(this, PaperInput);
      return babelHelpers.possibleConstructorReturn(
        this,
        (PaperInput.__proto__ || Object.getPrototypeOf(PaperInput)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      PaperInput,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                PaperInput.prototype.__proto__ ||
                  Object.getPrototypeOf(PaperInput.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              PaperInput.haxProperties,
              PaperInput.tag,
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
              _templateObject_d841f320d70111e8a28145153ccfa840()
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
                title: "Paper input",
                description: "Automated conversion of paper-input/",
                icon: "icons:android",
                color: "green",
                groups: ["Input"],
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
            return "paper-input";
          }
        }
      ]
    );
    return PaperInput;
  })(_polymerElement.PolymerElement);
  _exports.PaperInput = PaperInput;
  window.customElements.define(PaperInput.tag, PaperInput);
});
