define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.NikkiTest = void 0;
  function _templateObject_223a8ce0dd1e11e8a5a0873232d5f65e() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>\n<div>[[title]]</div>\n<div>[[number]]</div>"
    ]);
    _templateObject_223a8ce0dd1e11e8a5a0873232d5f65e = function() {
      return data;
    };
    return data;
  }
  var NikkiTest = (function(_PolymerElement) {
    babelHelpers.inherits(NikkiTest, _PolymerElement);
    function NikkiTest() {
      babelHelpers.classCallCheck(this, NikkiTest);
      return babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers.getPrototypeOf(NikkiTest).apply(this, arguments)
      );
    }
    babelHelpers.createClass(
      NikkiTest,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                babelHelpers.getPrototypeOf(NikkiTest.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              NikkiTest.haxProperties,
              NikkiTest.tag,
              this
            );
          }
        },
        {
          key: "_titleChanged",
          value: function _titleChanged(newValue) {
            if (babelHelpers.typeof(newValue) !== "undefined") {
              console.log(newValue);
            }
          }
        }
      ],
      [
        {
          key: "template",
          get: function get() {
            return (0, _polymerElement.html)(
              _templateObject_223a8ce0dd1e11e8a5a0873232d5f65e()
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
                title: "Nikki test",
                description: "testing 123",
                icon: "icons:android",
                color: "green",
                groups: ["Test"],
                handles: [{ type: "todo:read-the-docs-for-usage" }],
                meta: {
                  author: "nikkimk",
                  owner: "The Pennsylvania State University"
                }
              },
              settings: {
                quick: [],
                configure: [
                  {
                    property: "title",
                    description: "",
                    inputMethod: "textfield",
                    required: !1,
                    icon: "icons:android"
                  },
                  {
                    property: "number",
                    description: "",
                    inputMethod: "textfield",
                    required: !1,
                    icon: "icons:android"
                  }
                ],
                advanced: []
              }
            };
          }
        },
        {
          key: "properties",
          get: function get() {
            return {
              title: {
                name: "title",
                type: "String",
                value: "null",
                reflectToAttribute: !0,
                observer: "_titleChanged"
              },
              number: {
                name: "number",
                type: "Number",
                value: "0",
                reflectToAttribute: !0,
                observer: !1
              }
            };
          }
        },
        {
          key: "tag",
          get: function get() {
            return "nikki-test";
          }
        }
      ]
    );
    return NikkiTest;
  })(_polymerElement.PolymerElement);
  _exports.NikkiTest = NikkiTest;
  window.customElements.define(NikkiTest.tag, NikkiTest);
});
