define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.TabList = void 0;
  function _templateObject_3c103f70d70b11e8ad63570f9b33346b() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_3c103f70d70b11e8ad63570f9b33346b = function() {
      return data;
    };
    return data;
  }
  var TabList = (function(_PolymerElement) {
    babelHelpers.inherits(TabList, _PolymerElement);
    function TabList() {
      babelHelpers.classCallCheck(this, TabList);
      return babelHelpers.possibleConstructorReturn(
        this,
        (TabList.__proto__ || Object.getPrototypeOf(TabList)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      TabList,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                TabList.prototype.__proto__ ||
                  Object.getPrototypeOf(TabList.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              TabList.haxProperties,
              TabList.tag,
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
              _templateObject_3c103f70d70b11e8ad63570f9b33346b()
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
                title: "Tab list",
                description: "Automated conversion of tab-list/",
                icon: "icons:android",
                color: "green",
                groups: ["List"],
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
            return "tab-list";
          }
        }
      ]
    );
    return TabList;
  })(_polymerElement.PolymerElement);
  _exports.TabList = TabList;
  window.customElements.define(TabList.tag, TabList);
});
