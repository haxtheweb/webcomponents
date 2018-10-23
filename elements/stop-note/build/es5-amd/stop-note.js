define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.StopNote = void 0;
  function _templateObject_01b7b970d70b11e886286f8bb61bc828() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_01b7b970d70b11e886286f8bb61bc828 = function() {
      return data;
    };
    return data;
  }
  var StopNote = (function(_PolymerElement) {
    babelHelpers.inherits(StopNote, _PolymerElement);
    function StopNote() {
      babelHelpers.classCallCheck(this, StopNote);
      return babelHelpers.possibleConstructorReturn(
        this,
        (StopNote.__proto__ || Object.getPrototypeOf(StopNote)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      StopNote,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                StopNote.prototype.__proto__ ||
                  Object.getPrototypeOf(StopNote.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              StopNote.haxProperties,
              StopNote.tag,
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
              _templateObject_01b7b970d70b11e886286f8bb61bc828()
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
                title: "Stop note",
                description: "Automated conversion of stop-note/",
                icon: "icons:android",
                color: "green",
                groups: ["Note"],
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
            return "stop-note";
          }
        }
      ]
    );
    return StopNote;
  })(_polymerElement.PolymerElement);
  _exports.StopNote = StopNote;
  window.customElements.define(StopNote.tag, StopNote);
});
