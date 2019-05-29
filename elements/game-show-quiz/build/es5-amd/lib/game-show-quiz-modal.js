define([
  "exports",
  "require",
  "../node_modules/lit-element/lit-element.js"
], function(_exports, _require, _litElement) {
  "use strict";
  Object.defineProperty(_exports, "__esModule", { value: !0 });
  _exports.GameShowQuizModal = void 0;
  _require = babelHelpers.interopRequireWildcard(_require);
  function _templateObject2_74399f5081c311e9b46a1fef3c9e046f() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n      <paper-dialog modal>\n        <h2>",
      '</h2>\n        <div class="content"><slot name="content"></slot></div>\n        <div class="buttons"><slot name="buttons"></slot></div>\n      </paper-dialog>\n    '
    ]);
    _templateObject2_74399f5081c311e9b46a1fef3c9e046f = function _templateObject2_74399f5081c311e9b46a1fef3c9e046f() {
      return data;
    };
    return data;
  }
  function _templateObject_74399f5081c311e9b46a1fef3c9e046f() {
    var data = babelHelpers.taggedTemplateLiteral([
      "\n        :host {\n          display: block;\n        }\n        paper-dialog:not(:defined) {\n          display: none;\n        }\n        paper-dialog {\n          min-width: 60%;\n          top: 2%;\n          bottom: 2%;\n          margin: 0;\n          padding: 0;\n          left: 8%;\n          right: 8%;\n          position: fixed;\n          overflow: hidden;\n        }\n        .content {\n          font-size: 16px;\n          overflow: scroll;\n          min-height: 60vh;\n          height: 80vh;\n          margin: 0;\n          padding: 0;\n        }\n        h2 {\n          font-size: 24px;\n          background-color: var(--game-show-bg-color);\n          color: var(--game-show-text-color);\n          margin: 0;\n          padding: 8px;\n          text-align: center;\n        }\n        .buttons {\n          font-size: 20px;\n          font-weight: bold;\n          background-color: var(--game-show-bg-color);\n          bottom: 0;\n          position: absolute;\n          left: 0;\n          right: 0;\n        }\n        .buttons ::slotted(*) {\n          width: 50%;\n          margin: 0 auto;\n          color: var(--game-show-bg-color);\n          background-color: var(--game-show-text-color);\n        }\n        .buttons ::slotted(*[disabled]) {\n          background: #eaeaea;\n          color: #a8a8a8;\n        }\n        .buttons ::slotted(#continue) {\n          color: var(--simple-colors-default-theme-blue-11);\n          background-color: var(--simple-colors-default-theme-blue-1);\n        }\n        @media screen and (max-width: 600px) {\n          paper-dialog {\n            top: 0;\n            bottom: 0;\n            left: 0;\n            right: 0;\n          }\n          h2 {\n            font-size: 20px;\n          }\n          .buttons {\n            font-size: 12px;\n          }\n          .buttons ::slotted(*) {\n            width: 100%;\n          }\n          .content {\n            font-size: 12px;\n          }\n        }\n      "
    ]);
    _templateObject_74399f5081c311e9b46a1fef3c9e046f = function _templateObject_74399f5081c311e9b46a1fef3c9e046f() {
      return data;
    };
    return data;
  }
  /**
   * `game-show-quiz-modal`
   * `Modal for the quiz show`
   *  @microcopy - the mental model for this element
   *  - game show - a display board in the style of Jeopardy
   */ var GameShowQuizModal = /*#__PURE__*/ (function(_LitElement) {
    babelHelpers.inherits(GameShowQuizModal, _LitElement);
    babelHelpers.createClass(GameShowQuizModal, null, [
      {
        key: "styles",
        get: function get() {
          return [
            (0, _litElement.css)(
              _templateObject_74399f5081c311e9b46a1fef3c9e046f()
            )
          ];
        }
      },
      {
        key: "tag",
        get: function get() {
          return "game-show-quiz-modal";
        }
      },
      {
        key: "properties",
        get: function get() {
          return { title: { type: String } };
        }
      }
    ]);
    function GameShowQuizModal() {
      var _this;
      babelHelpers.classCallCheck(this, GameShowQuizModal);
      _this = babelHelpers.possibleConstructorReturn(
        this,
        babelHelpers.getPrototypeOf(GameShowQuizModal).call(this)
      );
      new Promise(function(res, rej) {
        return _require.default(
          ["../node_modules/@polymer/paper-dialog/paper-dialog.js"],
          res,
          rej
        );
      });
      return _this;
    }
    babelHelpers.createClass(GameShowQuizModal, [
      {
        key: "render",
        value: function render() {
          return (0, _litElement.html)(
            _templateObject2_74399f5081c311e9b46a1fef3c9e046f(),
            this.title
          );
        }
        /**
         * Basic bridge to the toggle function in paper-dialog
         */
      },
      {
        key: "toggle",
        value: function toggle() {
          this.shadowRoot.querySelector("paper-dialog").toggle();
          setTimeout(function() {
            var evt = document.createEvent("UIEvents");
            evt.initUIEvent("resize", !0, !1, window, 0);
            window.dispatchEvent(evt);
          }, 100);
        }
      }
    ]);
    return GameShowQuizModal;
  })(_litElement.LitElement);
  _exports.GameShowQuizModal = GameShowQuizModal;
  window.customElements.define(GameShowQuizModal.tag, GameShowQuizModal);
});
