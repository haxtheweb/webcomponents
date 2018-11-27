define([
  "../node_modules/@polymer/polymer/polymer-legacy.js",
  "../node_modules/@polymer/paper-dialog/paper-dialog.js",
  "../node_modules/@polymer/iron-icons/iron-icons.js",
  "../node_modules/@polymer/paper-dialog-scrollable/paper-dialog-scrollable.js",
  "../node_modules/@polymer/paper-icon-button/paper-icon-button.js"
], function(
  _polymerLegacy,
  _paperDialog,
  _ironIcons,
  _paperDialogScrollable,
  _paperIconButton
) {
  "use strict";
  function _templateObject_67f65890f1e611e88f5abf4ce1825c15() {
    var data = babelHelpers.taggedTemplateLiteral([
      '\n        <style>\n          :host {\n            display: block;\n            position: relative;\n          }\n          paper-dialog {\n            display: block;\n            margin: auto;\n            width: 80%;\n            height: auto;\n            z-index: 1000;\n          }\n          .top {\n            display: flex;\n            margin-top: 0;\n            justify-content: space-between;\n            background-color: #20427b;\n            color: #fff;\n            padding: 8px 16px;\n          }\n          .top h2 {\n            margin: 8px;\n            font-size: 40px;\n          }\n          .top paper-icon-button {\n            margin: 8px;\n            padding: 2px;\n          }\n        </style>\n        <paper-dialog id="dialog" with-backdrop opened="{{opened}}">\n          <div class="top">\n            <h2>[[term]]</h2>\n            <paper-icon-button icon="cancel" dialog-dismiss=""></paper-icon-button>\n          </div>\n          <paper-dialog-scrollable>\n            <slot></slot>\n          </paper-dialog-scrollable>\n        </paper-dialog>\n'
    ]);
    _templateObject_67f65890f1e611e88f5abf4ce1825c15 = function _templateObject_67f65890f1e611e88f5abf4ce1825c15() {
      return data;
    };
    return data;
  }
  (0, _polymerLegacy.Polymer)({
    _template: (0, _polymerLegacy.html)(
      _templateObject_67f65890f1e611e88f5abf4ce1825c15()
    ),
    is: "lrn-vocab-dialog",
    listeners: {
      "iron-overlay-closed": "_modalClosed",
      "iron-overlay-opened": "_resizeContent",
      "iron-overlay-canceled": "_changeOpen"
    },
    properties: {
      opened: { type: Boolean, value: !1, notify: !0 },
      term: { type: String }
    },
    _modalClosed: function _modalClosed(e) {
      this._changeOpen(e);
      this.fire("lrn-vocab-dialog-closed", this);
    },
    _resizeContent: function _resizeContent(e) {
      var evt = document.createEvent("UIEvents");
      evt.initUIEvent("resize", !0, !1, window, 0);
      window.dispatchEvent(evt);
      this._changeOpen(e);
    },
    _changeOpen: function _changeOpen(e) {
      e.stopPropagation();
      if (e.srcElement === this.$.dialog) {
        this.opened = "iron-overlay-opened" === e.type;
        this.fire("lrn-vocab-dialog-changed", this);
      }
    }
  });
});
