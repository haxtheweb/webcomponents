define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js",
  "../node_modules/@polymer/paper-dialog/paper-dialog.js",
  "../node_modules/@polymer/paper-button/paper-button.js"
], function(
  _polymerLegacy,
  _paperDialogScrollable,
  _paperDialog,
  _paperButton
) {
  "use strict";
  function _templateObject_051f0050f1e611e8ae4b3d44d5c2f1a4() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n    <style>\n      :host {\n        display: block;\n      }\n      #dialog {\n        min-width: 60%;\n        top: 5%;\n        bottom: 5%;\n        margin: 0;\n        padding: 0;\n        left: 15%;\n        right: 15%;\n        position: fixed;\n        overflow: hidden;\n      }\n      .content {\n        font-size: 16px;\n        overflow: scroll;\n        min-height: 60vh;\n        height: 80vh;\n        margin: 0;\n        padding: 0;\n      }\n      h2 {\n        font-size: 32px;\n        background-color: var(--game-show-bg-color);\n        color: var(--game-show-text-color);\n        margin: 0;\n        padding: 16px;\n        text-align: center;\n      }\n      .buttons {\n        font-size: 20px;\n        font-weight: bold;\n        background-color: var(--game-show-bg-color);\n        bottom: 0;\n        position: absolute;\n        left: 0;\n        right: 0;\n      }\n      .buttons ::slotted(*) {\n        width: 50%;\n        margin: 0 auto;\n        color: var(--game-show-bg-color);\n        background-color: var(--game-show-text-color);\n      }\n      .buttons ::slotted(*[disabled]) {\n        background: #eaeaea;\n        color: #a8a8a8;\n      }\n      .buttons ::slotted(#continue) {\n        color: #004400;\n        background-color: #EEFFEE;\n      }\n      @media screen and (max-width: 600px) {\n        #dialog {\n          top: 0;\n          bottom: 0;\n          left: 0;\n          right: 0;\n        }\n        h2 {\n          font-size: 20px;\n        }\n        .buttons {\n          font-size: 12px;\n        }\n        .buttons ::slotted(*) {\n          width: 100%;\n        }\n        .content {\n          font-size: 12px;\n        }\n      }\n    </style>\n    <paper-dialog id="dialog" modal="">\n      <h2>[[title]]</h2>\n      <div class="content">\n        <slot name="content"></slot>\n      </div>\n      <div class="buttons">\n        <slot name="buttons"></slot>\n      </div>\n    </paper-dialog>\n'
    ]);
    _templateObject_051f0050f1e611e8ae4b3d44d5c2f1a4 = function _templateObject_051f0050f1e611e8ae4b3d44d5c2f1a4() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_051f0050f1e611e8ae4b3d44d5c2f1a4()
    ),
    is: "game-show-quiz-modal",
    properties: { title: { type: String } },
    toggle: function toggle() {
      this.$.dialog.toggle();
    }
  });
});
