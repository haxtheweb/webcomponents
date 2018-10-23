define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.LrnappBook = void 0;
  function _templateObject_4a21a290d6f511e8864719e236417448() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_4a21a290d6f511e8864719e236417448 = function() {
      return data;
    };
    return data;
  }
  var LrnappBook = (function(_PolymerElement) {
    babelHelpers.inherits(LrnappBook, _PolymerElement);
    function LrnappBook() {
      babelHelpers.classCallCheck(this, LrnappBook);
      return babelHelpers.possibleConstructorReturn(
        this,
        (LrnappBook.__proto__ || Object.getPrototypeOf(LrnappBook)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      LrnappBook,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                LrnappBook.prototype.__proto__ ||
                  Object.getPrototypeOf(LrnappBook.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              LrnappBook.haxProperties,
              LrnappBook.tag,
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
              _templateObject_4a21a290d6f511e8864719e236417448()
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
                title: "Lrnapp book",
                description: "Automated conversion of lrnapp-book/",
                icon: "icons:android",
                color: "green",
                groups: ["Book"],
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
            return "lrnapp-book";
          }
        }
      ]
    );
    return LrnappBook;
  })(_polymerElement.PolymerElement);
  _exports.LrnappBook = LrnappBook;
  window.customElements.define(LrnappBook.tag, LrnappBook);
});
