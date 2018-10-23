define([
  "exports",
  "./node_modules/@polymer/polymer/polymer-element.js",
  "./node_modules/@lrnwebcomponents/hax-body-behaviors/lib/HAXWiring.js"
], function(_exports, _polymerElement, _HAXWiring) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.GameShowQuiz = void 0;
  function _templateObject_59af0410d6ef11e88d7e59e09ff0e6fb() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n<style>:host {\n  display: block;\n}\n\n:host([hidden]) {\n  display: none;\n}\n</style>\n<slot></slot>"
    ]);
    _templateObject_59af0410d6ef11e88d7e59e09ff0e6fb = function() {
      return data;
    };
    return data;
  }
  var GameShowQuiz = (function(_PolymerElement) {
    babelHelpers.inherits(GameShowQuiz, _PolymerElement);
    function GameShowQuiz() {
      babelHelpers.classCallCheck(this, GameShowQuiz);
      return babelHelpers.possibleConstructorReturn(
        this,
        (GameShowQuiz.__proto__ || Object.getPrototypeOf(GameShowQuiz)).apply(
          this,
          arguments
        )
      );
    }
    babelHelpers.createClass(
      GameShowQuiz,
      [
        {
          key: "connectedCallback",
          value: function connectedCallback() {
            babelHelpers
              .get(
                GameShowQuiz.prototype.__proto__ ||
                  Object.getPrototypeOf(GameShowQuiz.prototype),
                "connectedCallback",
                this
              )
              .call(this);
            this.HAXWiring = new _HAXWiring.HAXWiring();
            this.HAXWiring.setHaxProperties(
              GameShowQuiz.haxProperties,
              GameShowQuiz.tag,
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
              _templateObject_59af0410d6ef11e88d7e59e09ff0e6fb()
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
                title: "Game show-quiz",
                description: "Automated conversion of game-show-quiz/",
                icon: "icons:android",
                color: "green",
                groups: ["Show"],
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
            return "game-show-quiz";
          }
        }
      ]
    );
    return GameShowQuiz;
  })(_polymerElement.PolymerElement);
  _exports.GameShowQuiz = GameShowQuiz;
  window.customElements.define(GameShowQuiz.tag, GameShowQuiz);
});
