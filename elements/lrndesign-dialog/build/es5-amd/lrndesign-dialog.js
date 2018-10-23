define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrndesignDialog = void 0;
  function _templateObject_61c27ed0d6f811e8895a3147af030f46() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_61c27ed0d6f811e8895a3147af030f46 = function() {
      return data;
    };
    return data;
  }
  var LrndesignDialog = (function(_PolymerElement) {
    babelHelpers.inherits(LrndesignDialog, _PolymerElement);
    function LrndesignDialog() {
      babelHelpers.classCallCheck(this, LrndesignDialog);
      return babelHelpers.possibleConstructorReturn(
        this,
        (
          LrndesignDialog.__proto__ || Object.getPrototypeOf(LrndesignDialog)
        ).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      LrndesignDialog,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrndesignDialog.prototype.__proto__ ||
                  Object.getPrototypeOf(LrndesignDialog.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrndesignDialog.haxProperties,
              LrndesignDialog.tag,
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
              _templateObject_61c27ed0d6f811e8895a3147af030f46()
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
                title: "Lrndesign dialog",
                description: "Automated conversion of lrndesign-dialog/",
                icon: "icons:android",
                color: "green",
                groups: ["Dialog"],
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
            return "lrndesign-dialog";
          }
        }
      ]
    );
    return LrndesignDialog;
  })(_polymerElement.PolymerElement);
  _exports.LrndesignDialog = LrndesignDialog;
  window.customElements.define(LrndesignDialog.tag, LrndesignDialog);
});
